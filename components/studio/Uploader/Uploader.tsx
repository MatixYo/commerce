import { FC, useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import useTranslation from 'next-translate/useTranslation'
import GifSearch from '@components/studio/GifSearch'
import s from './Uploader.module.css'
import request from 'superagent'
import cn from 'classnames'
import { afterLast } from '@lib/after-last'
import { useRouter } from 'next/router'

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

type VideoSourceType = {
  url: string
  type: string
}

type ResultType = {
  providerId: string
  originSource: string
  videoSources: [VideoSourceType]
  width: number
  height: number
  frameRate: number
  numFrames: number
  avgColor: string | null
}

async function uploadToCloudinary(
  file: File,
  onProgress: (progressVal: number) => void
): Promise<ResultType> {
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
    videoSources: body.eager.map((e: object) => ({
      url: e.secure_url,
      type: e.format,
    })),
    width: body.width,
    height: body.height,
    frameRate: body.frame_rate,
    numFrames: body.nb_frames,
    avgColor: null, //Cloudinary doesn't provide average color
  }
}

interface Props {
  className?: string
  children?: any
}

const Uploader: FC<Props> = ({}) => {
  const { t } = useTranslation('common')
  const [progressVal, setProgressVal] = useState(null)
  const router = useRouter()

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const result = await uploadToCloudinary(acceptedFiles[0], (v) =>
        setProgressVal(v)
      )
      createItem(result)
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
      createItem(result)
    } catch (err) {
      console.log(err)
    } finally {
      setProgressVal(null)
    }
  }, [])

  const onSelectGif = useCallback((data) => {
    const result = {
      providerId: data.gfyId,
      originalSource: 'TODO',
      videoSources: [
        { url: data.webmUrl, type: 'webm' },
        { url: data.mp4Url, type: 'mp4' },
      ],
      width: data.width,
      height: data.height,
      frameRate: data.frameRate,
      numFrames: data.numFrames,
      avgColor: data.avgColor,
    }
    createItem(result)
  }, [])

  const createItem = useCallback((data) => {
    router.push(
      `/studio/${data.providerId}?data=${encodeURIComponent(
        JSON.stringify(data)
      )}`
    )
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(s.dropzone, { 'scale-105': isDragActive })}
      >
        {/* FIXME */}
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
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                {...getInputProps()}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          <p>
            {t('drop-files')} {progressVal}
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
          placeholder="Wpisz adres URL"
          onPaste={onPaste}
        />
      </div>
      <div>
        Wybierz z Gfycat
        <GifSearch onSelectGif={onSelectGif} />
      </div>
    </>
  )
}

export default Uploader
