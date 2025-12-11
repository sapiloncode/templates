import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit'
import { accountReducer } from '@src/modules/account/state'
import { generalReducer } from '@src/modules/general/state'

const appReducer = combineReducers({
  general: generalReducer,
  account: accountReducer,
})

const E2E_TEST_LOAD_STATE_ACTION = 'LOAD_STATE'

const rootReducer = (state: ReturnType<typeof appReducer>, action: AnyAction): ReturnType<typeof appReducer> => {
  if (action.type === E2E_TEST_LOAD_STATE_ACTION) {
    return {
      ...state,
      ...action.payload, // Merge payload into current state
    }
  }
  return appReducer(state, action) // Delegate to other reducers
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

if (window.Cypress) {
  window.store = store
  window.getAppState = store.getState
}

export type RootState = ReturnType<typeof rootReducer>
export const getAppState = store.getState
