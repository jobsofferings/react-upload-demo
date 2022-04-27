import { useLocation } from 'react-router-dom'

export function useURLSearchParams() {
  return new URLSearchParams(useLocation().search)
}
