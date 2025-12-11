import { useEffect, useRef } from 'react'

export function useLogPropChanges(prop: unknown) {
  const prevProps = useRef(prop)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changes = Object.keys(prop).filter((key) => (prop as any)[key] !== (prevProps as any).current[key])
    if (changes.length > 0) {
      // console.log('Changed prop:', changes)
    }
    prevProps.current = prop
  }, [prop])
}
