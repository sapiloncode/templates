import { PATH_ACCOUNT_PROFILE } from '@src/constants'
import { $t } from '@src/i18n'
import { closeWidget } from '@src/modules'
import { EntityEditWidget, EntityEditWidgetSchema } from '@src/modules/general/components'
import { saveAccount } from './save-account'
import './style.css'
import { useWidget } from './use-widget'

export default {
  title: $t.PROFILE,
  width: 'sm',
  onSave: saveAccount,
  name: PATH_ACCOUNT_PROFILE,
  widgetHook: useWidget,
  widgetType: EntityEditWidget,

  header: [],

  onAbort(cn) {
    closeWidget(cn)
  },
  fields: [
    {
      name: 'photo',
      title: '',
      type: 'image',
    },
    {
      name: 'firstName',
      title: $t.FIRST_NAME,
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      title: $t.LAST_NAME,
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      title: $t.EMAIL,
      type: 'text',
      editState: 'readonly',
    },
    {
      name: 'birthDate',
      title: $t.BIRTH_DATE,
      type: 'date',
    },
    // {
    //   name: 'language',
    //   title: $t.LANGUAGE,
    //   type: 'select',
    //   options: config.languages,
    // },
  ],
} satisfies EntityEditWidgetSchema
