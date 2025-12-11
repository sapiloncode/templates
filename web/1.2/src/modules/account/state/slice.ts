import { createSlice } from '@reduxjs/toolkit'
import { createReduxHelpers } from '@src/utils'
import { AccountState, initialState } from './state'

const { set, update: merge } = createReduxHelpers<AccountState>()

const slice = createSlice({
  name: 'account',
  initialState,

  reducers: {
    loadingStatusSet: set('loadingStatus'),

    accountSet: set('account'),

    accountUpdated: merge('account'),
  },
})

export const accountReducer = slice.reducer

export const { accountSet, accountUpdated, loadingStatusSet } = slice.actions
