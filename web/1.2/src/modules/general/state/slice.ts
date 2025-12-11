import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createReduxHelpers } from '@src/utils'
import { GeneralState, initialState, type GeneralStateSettings } from './state'

export type SmartMessage = { content: string; timestamp: number; type: 'info' | 'error' }

const { set } = createReduxHelpers<GeneralState>()

const slice = createSlice({
  name: 'general',
  initialState,

  reducers: {
    notificationsSet(state, action: PayloadAction<{ pathname: string; notifications: number }>) {
      state.notifications[action.payload.pathname] = action.payload.notifications
    },

    isMobileSet(state, action: PayloadAction<boolean>) {
      state.isMobile = action.payload
    },

    isNavHiddenSet(state, action: PayloadAction<boolean>) {
      state.isNavHidden = action.payload
    },

    settingsSet(state, action: PayloadAction<GeneralStateSettings>) {
      state.settings = action.payload
    },

    isDarkSet(state, action: PayloadAction<boolean>) {
      state.isDark = action.payload
    },

    isDirtySet(state, action: PayloadAction<boolean>) {
      state.isDirty = action.payload
    },

    apiVersionSet(state, action: PayloadAction<string>) {
      state.apiVersion = action.payload
    },

    displayingHiddenTopicsSet(state, action: PayloadAction<boolean>) {
      state.calendar.displayingHiddenTopics = action.payload
    },

    hasHiddenTopicsSet(state, action: PayloadAction<boolean>) {
      state.calendar.hasHiddenTopics = action.payload
    },

    smartPanelMessageAdded(state, action: PayloadAction<SmartMessage>) {
      state.smartPanel.messages.push(action.payload)
    },

    smartPanelMessagesCleared(state) {
      state.smartPanel.messages = []
    },

    widgetsSet: set('columns'),

    defaultWidgetPathSet: set('defaultWidgetPath'),

    widgetStateSet(state, action: PayloadAction<{ href: string; props: unknown }>) {
      const widgetState = state.widgetState.find((state) => state.href === action.payload.href)
      if (!widgetState) {
        state.widgetState.push({ href: action.payload.href, state: action.payload.props })
      } else if (!widgetState.state) {
        widgetState.state = action.payload.props
      } else {
        Object.assign(widgetState.state, action.payload.props)
      }
    },
  },
})

export const generalReducer = slice.reducer

export const {
  displayingHiddenTopicsSet,
  hasHiddenTopicsSet,
  notificationsSet,
  isMobileSet,
  settingsSet,
  isDarkSet,
  isNavHiddenSet,
  isDirtySet,
  apiVersionSet,
  smartPanelMessageAdded,
  smartPanelMessagesCleared,
  widgetsSet,
  widgetStateSet,
  defaultWidgetPathSet,
} = slice.actions

export type GenericState = ReturnType<typeof generalReducer>
