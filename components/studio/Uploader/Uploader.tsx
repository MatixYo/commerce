import { FC, useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import useTranslation from 'next-translate/useTranslation'
import GifSearch from '@components/studio/GifSearch'
import s from './Uploader.module.css'
import request from 'superagent'
import cn from 'classnames'
import { afterLast } from '@lib/after-last'
import { useRouter } from 'next/router'
import { VideoItemType } from '@components/studio/types'
import addAnimationVideo from '@framework/animations/add-animation-video'
import { useStudio } from '@components/studio/context'

const acceptedFileFormats = {
  image: ['webp', 'gif'],
  video: [
    'ogm',
    'wmv',
    'mpg',
    'webm',
    'ogv',
    'mov',
    'asx',
    'mpeg',
    'mp4',
    'm4v',
    'avi',
    'quicktime',
  ],
}

async function uploadToCloudinary(
  file: File | string,
  onProgress: (progressVal: number) => void
): Promise<VideoItemType> {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
    throw new Error('Missing param NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET')

  onProgress(0)
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
  const { body } = await request
    .post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`
    )
    .send(fd)
    .on(`progress`, (event: { loaded: number; total: number }) =>
      onProgress(event.loaded / event.total)
    )

  return {
    providerId: body.asset_id,
    createdUsing: typeof file === 'string' ? 'url' : 'uploader',
    videoSources: body.eager.map((e: any) => ({
      src: e.secure_url,
      type: `video/${e.format}`,
    })),
    width: body.width,
    height: body.height,
    frameRate: body.frame_rate,
    numFrames: body.nb_frames,
    avgColor: null, //Cloudinary doesn't provide average color
    originSource: null, //TODO may be provided by user
  }
}

const Uploader: FC = () => {
  const { t } = useTranslation('studio')
  const [progressVal, setProgressVal] = useState<null | number>(null)
  const router = useRouter()
  const { setVideoItem } = useStudio()

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const result = await uploadToCloudinary(acceptedFiles[0], (v) =>
        setProgressVal(v)
      )
      await createItem(result)
    } catch (err) {
      console.log(err)
    } finally {
      setProgressVal(null)
    }
  }, [])

  const onPaste = useCallback(async (event) => {
    const clipboardData =
      event.clipboardData || event.originalEvent.clipboardData

    let file
    if (clipboardData.files.length) {
      ;[file] = clipboardData.files
    } else {
      const url = clipboardData.getData('text')
      const ext = afterLast(url, '.')
      if (
        acceptedFileFormats.image
          .concat(acceptedFileFormats.video)
          .includes(ext)
      )
        file = url
      else {
        console.log('zły adres')
        return
      }
    }

    try {
      const result = await uploadToCloudinary(file, (v) => setProgressVal(v))
      await createItem(result)
    } catch (err) {
      console.log(err)
    } finally {
      setProgressVal(null)
    }
  }, [])

  const onSelectGif = useCallback(async (data) => {
    const result = {
      providerId: data.gfyId,
      createdUsing: 'gfycat',
      originalSource: 'TODO',
      videoSources: [
        { src: data.webmUrl, type: 'video/webm' },
        { src: data.mp4Url, type: 'video/mp4' },
      ],
      width: data.width,
      height: data.height,
      frameRate: data.frameRate,
      numFrames: data.numFrames,
      avgColor: data.avgColor,
    }
    await createItem(result)
  }, [])

  const createItem = useCallback(
    async (item) => {
      try {
        setVideoItem(item)
        const { id } = await addAnimationVideo(item)
        await router.push(`/studio/${id}`)
      } catch (err) {
        console.log(err)
      }
    },
    [setVideoItem]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  // @ts-ignore
  return (
    <>
      <div
        {...getRootProps()}
        className={cn(s.dropzone, { [s.dragged]: isDragActive })}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-accents-5">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-indigo-500 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>{t('upload-file')}</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                {...getInputProps()}
              />
            </label>
            <p className="pl-1">{t('drag-n-drop')}</p>
          </div>
          <p className="text-xs text-accents-4">
            {t('studio:formats-size-supported', {
              formats: 'PNG, JPG, GIF',
              size: 10,
              unit: 'MB',
            })}
          </p>
        </div>
      </div>
      <div className="relative text-sm bg-accents-1 text-base w-full transition-colors duration-150 rounded-2xl my-5">
        <label className="hidden" htmlFor={'url'}>
          Search
        </label>
        <div className={s.iconContainer}>
          <svg className={s.icon} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            />
          </svg>
        </div>
        <input
          id="url"
          className={s.input}
          placeholder={t('paste-url')}
          onPaste={onPaste}
        />
      </div>
      <GifSearch onSelectGif={onSelectGif} />
    </>
  )
}

export default Uploader
