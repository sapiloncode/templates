import Quill, { Range } from 'quill'
import 'quill/dist/quill.snow.css'
import { forwardRef, RefObject, useEffect, useLayoutEffect, useRef } from 'react'
import { FileBlot } from './blots/file-blot'
import { ImageBlot } from './blots/image-blot'
import { StrikeBlot } from './blots/strike-blot'

Quill.register(ImageBlot, true)
Quill.register(StrikeBlot, true)
Quill.register(FileBlot, true)

interface QuillEditorProps {
  readOnly?: boolean
  defaultValue?: string
  onTextChange?: (...args: unknown[]) => void
  onKeyDown?: (ev: KeyboardEvent) => void
  onSelectionChange?: (range: Range) => void
  placeholder?: string
  onFocus?: () => void // Add onFocus handler
  onBlur?: () => void // Add onBlur handler
}

export const QuillEditor = forwardRef<Quill | null, QuillEditorProps>(
  (
    { readOnly = false, defaultValue, onTextChange, onSelectionChange, placeholder, onKeyDown, onFocus, onBlur },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const defaultValueRef = useRef(defaultValue)
    const onTextChangeRef = useRef(onTextChange)
    const placeholderRef = useRef(placeholder)
    const onKeyDownRef = useRef(onKeyDown)
    const onSelectionChangeRef = useRef(onSelectionChange)
    const onFocusRef = useRef(onFocus)
    const onBlurRef = useRef(onBlur)

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange
      onSelectionChangeRef.current = onSelectionChange
      onFocusRef.current = onFocus
      onBlurRef.current = onBlur
    })

    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.enable(!readOnly)
      }
    }, [ref, readOnly])

    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const editorContainer = container.appendChild(container.ownerDocument.createElement('div'))
      const quill = new Quill(editorContainer, {
        theme: 'snow',
        debug: 'warn',
        placeholder: placeholderRef?.current,
        modules: {
          toolbar: '#ql-toolbar',
        },
        formats: [
          'header',
          'bold',
          'strike',
          'code',
          'list',
          'indent',
          'blockquote',
          'code-block',
          'link',
          'image',
          'file',
        ],
      })

      if (typeof ref === 'function') {
        ref(quill)
      } else if (ref) {
        ;(ref as RefObject<Quill | null>).current = quill
      }

      if (defaultValueRef.current) {
        const delta = quill.clipboard.convert({ html: defaultValueRef.current })
        quill.updateContents(delta, 'silent')
      } else {
        // Auto-focus the editor if it is empty
        quill.focus()
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args)
      })

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(args[0] as Range)
      })

      quill.root.addEventListener('keydown', onKeyDownRef.current)

      // Focus and blur events
      quill.on('editor-change', (eventName: string) => {
        if (eventName === 'selection-change') {
          const range = quill.getSelection()
          if (range) {
            onFocusRef.current?.() // Call onFocus when selection is present

            // fix the issue on iOS, first a quick scroll to the selection
            setTimeout(() => {
              quill.scrollSelectionIntoView()
            }, 200)

            setTimeout(() => {
              quill.scrollSelectionIntoView()
            }, 500) // wait to iOS keyboard appears
          } else {
            onBlurRef.current?.() // Call onBlur when selection is null
          }
        }
      })

      return () => {
        if (ref && 'current' in ref) {
          ;(ref as RefObject<Quill | null>).current = null
        }
        container.innerHTML = ''
      }
    }, [ref])

    return <div ref={containerRef}></div>
  }
)

QuillEditor.displayName = 'QuillEditor'
