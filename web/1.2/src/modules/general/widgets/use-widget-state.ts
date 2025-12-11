import { useAppSelector } from '@src/hooks'
import type { AppContext } from '@src/types'
import { useEffect } from 'react'
import { widgetStateSet } from '../state'

/**
 * State is shared between widgets within a column
 * @param cn
 * @param defaultState
 * @returns
 */
export function useWidgetState<STATE>(cn: AppContext, defaultState = {} as STATE): STATE {
  const state = useAppSelector((state) => state.general.widgetState.find(({ href }) => href === cn.href))

  //! todo: is it needed to set the default
  useEffect(() => {
    if (!state) {
      cn.dispatch(widgetStateSet({ href: cn.href, props: defaultState }))
    }
  }, [cn, state, defaultState])

  return (state?.state as STATE) ?? defaultState
}
