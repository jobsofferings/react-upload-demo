import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import OPUtils from 'src/typings/utils'

export type useSitevarItemProps = string | useSitevarItemProps[]

export type useSitevarProps = useSitevarItemProps[]

const useSearchParams = (...props: useSitevarProps) => {
  const keys: string[] = props.flat(Infinity)

  const { search } = useLocation()

  const urlSearchParams = useMemo(() => new URLSearchParams(search), [search])

  if (keys.length === 0) {
    return {}
  } else if (keys.length === 1) {
    return { [keys?.[0]]: urlSearchParams.get(keys[0]) }
  } else {
    const res: OPUtils.Record = {}
    keys.forEach((key) => {
      res[key] = urlSearchParams.get(key)
    })
    return res
  }
}

export default useSearchParams
