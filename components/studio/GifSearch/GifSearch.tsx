import { FC, useEffect, useMemo, useRef, useState } from 'react'
import cn from 'classnames'
import s from './GifSearch.module.css'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useOnScreen } from '@lib/hooks/useOnScreen'
import { useSWRInfinite } from 'swr'
import { fetcher } from '@lib/fetcher'
import { GifItem } from '@components/studio/GifSearch/GifItem'

const PAGE_SIZE = 30

const getKey = (
  pageIndex: number,
  previousPageData: undefined | { cursor: string; gfycats: object },
  pageSize: number,
  search?: string
) => {
  if (previousPageData && !previousPageData.cursor) return null

  if (search) {
    if (!previousPageData)
      return `https://api.gfycat.com/v1/gfycats/search?search_text=${search}&count=${pageSize}`
    return `https://api.gfycat.com/v1/gfycats/search?search_text=${search}&count=${pageSize}&cursor=${previousPageData?.cursor}`
  }

  //if no search provided return trending
  if (!previousPageData)
    return `https://api.gfycat.com/v1/gfycats/trending?count=${pageSize}`
  return `https://api.gfycat.com/v1/gfycats/trending?count=${pageSize}&cursor=${previousPageData?.cursor}`
}

interface Props {
  className?: string
  id?: string
  onSelectGif: () => void
}

const GifSearch: FC<Props> = ({
  className,
  id = 'gif-search',
  onSelectGif,
}) => {
  const { t } = useTranslation('common')

  //TODO add debounce
  const [value, setValue] = useState('')

  const ref = useRef()
  const isVisible = useOnScreen(ref)

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (...args) => getKey(...args, PAGE_SIZE, value),
    fetcher
  )

  const gifs = data ? [].concat(...data.map((i) => i.gfycats)) : []
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = size === PAGE_SIZE
  const isRefreshing = isValidating && data && data.length === size

  useEffect(() => {
    if (isVisible && !isReachingEnd && !isRefreshing) {
      setSize(size + 1)
    }
  }, [isVisible, isRefreshing])

  return useMemo(
    () => (
      <>
        <div
          className={cn(
            'relative text-sm bg-accents-1 text-base w-full transition-colors duration-150 rounded-2xl',
            className
          )}
        >
          <label className="hidden" htmlFor={id}>
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
            id={id}
            className={s.input}
            placeholder={t('search-for-products')}
            onInput={(e) => setValue(e.currentTarget.value)}
          />
        </div>
        {isEmpty ? (
          <p>Yay, no GIFs found.</p>
        ) : value ? (
          <p>Showing results for: {value}</p>
        ) : (
          <p>Showing trending</p>
        )}
        <div className={s.masonry}>
          {gifs.map((gif) => (
            <GifItem
              key={gif.gfyId}
              data={gif}
              onClick={() => onSelectGif(gif)}
            />
          ))}
        </div>
        <div ref={ref}>
          {isLoadingMore ? (
            <svg
              className="animate-spin mx-auto h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : isReachingEnd ? (
            'No more GIFs'
          ) : null}
        </div>
      </>
    ),
    [t, gifs]
  )
}

export default GifSearch
