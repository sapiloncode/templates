import { useEffect, useRef } from 'react'

export function useTraceUpdate(props: Record<string, unknown>) {
  const prev = useRef(props)
  useEffect(() => {
    const changedProps = Object.entries(props).reduce<Record<string, [unknown, unknown]>>((acc, [key, value]) => {
      if (prev.current[key] !== value) {
        acc[key] = [prev.current[key], value]
      }
      return acc
    }, {})
    if (Object.keys(changedProps).length > 0) {
      // console.log('Changed props:', changedProps)
    }
    prev.current = props
  })
}
