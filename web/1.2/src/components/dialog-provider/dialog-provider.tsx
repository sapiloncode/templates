import { Button } from '@src/components'
import type { WidgetAction } from '@src/modules'
import { markdown2Html } from '@src/utils'
import { Dialog } from 'radix-ui'
import { createContext, FC, useCallback, useEffect, useState } from 'react'
import { registerModal, ShowDialogMessageParams } from './dialog-manager'

const ModalContext = createContext(null)

export const DialogProvider: FC<React.PropsWithChildren> = ({ children }) => {
  const [params, setParams] = useState<ShowDialogMessageParams | null>(null)

  const show = useCallback((modalContent: ShowDialogMessageParams) => setParams(modalContent), [])

  useEffect(() => {
    registerModal(show)
  }, [show])

  const hide = () => setParams(null)

  function handleAction(action: WidgetAction) {
    hide()
    action.handler?.(params?.cn)
  }

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}
      <Dialog.Root open={!!params} onOpenChange={(open) => !open && hide()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="DialogTitle">{params?.title}</Dialog.Title>
            <Dialog.Description asChild>
              <div dangerouslySetInnerHTML={{ __html: markdown2Html(params?.description) }}></div>
            </Dialog.Description>
            <div className="dialog p-4" data-name={params?.name}>
              <div className="flex justify-end gap-2 pt-4">
                {params?.actions?.map((action, index) => (
                  <Button
                    size="sm"
                    className={`min-w-[75px] ${'btn-secondary btn-solid'}`}
                    data-name={action.name}
                    key={index}
                    onClick={() => handleAction(action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ModalContext.Provider>
  )
}
