import React, { ChangeEvent, forwardRef, useImperativeHandle } from 'react'

type Props = {
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void
}

export type HiddenFileActions = {
  openFile: () => void
}

export const HiddenFileInput = forwardRef<HiddenFileActions, Props>(({ onChange }, ref) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  useImperativeHandle(ref, () => ({
    openFile() {
      inputRef.current.value = ''
      inputRef.current.click()
    },
  }))

  return <input type="file" className="hidden" ref={inputRef} onChange={onChange} />
})

HiddenFileInput.displayName = 'HiddenFileInput'
