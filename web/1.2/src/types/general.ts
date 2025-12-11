import { Dispatch } from '@reduxjs/toolkit'

export type FieldType = 'text' | 'date' | 'number' | 'boolean' | 'select' | 'image' | 'action'
export type Size = 'sm' | 'md' | 'lg' | 'xl'
export type NavigatePlacement =
  | 'window' // opens a new tab
  | 'first' // removes all and put in column 0
  | 'next' // remove all widgets after, put it in next column
  | 'insert' // removes nothing, put it in next column
  | 'end' // removes nothing, put in as last column
  | 'replace' // just replaces the current column
  | 'close' // removed widgets starting current column
  | 'first-row' // put it in first row
  | 'next-row' // put it in next row
  | 'prev-row' // put it in previous row

export type FieldSchema = {
  name: string
  title?: string
  icon?: string
  comment?: string
  placeholder?: string

  /*
   * For images, it is the file url, for the text based fields, it makes it a link. e.g. '/tasks/{{task.id}}'
   */
  url?: string

  // just for text fields
  multiline?: boolean

  // for SELECT type, it should be a TaskOption object
  defaultValue?: number | boolean | string

  // Just for table view
  sortable?: boolean

  /* 
   !Formatting the numbers
   use number formats: http://numeraljs.com/
   e.g.  format: "0,0" > 1,000 , format: "0.00" 100000.12

   !Formatting the dates
   https://date-fns.org/v2.24.0/docs/format
   e.g.  yyyy-MM-dd HH:mm

   */
  format?: string
  type: FieldType
  options?: SelectOption[]
  required?: boolean

  visibleOn?: FieldsQuery

  /** * State on View mode. Default is 'visible' */ viewState?: 'visible' | 'hidden'
  /** * State on Edit mode. Default is 'visible' */ editState?: 'visible' | 'hidden' | 'readonly'
  /** * State on Insert mode. Default is editState */ insertState?: 'visible' | 'hidden' | 'readonly'
  /** * State on Action. Default is enabled */ actionState?: 'enabled' | 'disable'
}

export type FieldsQuery = {
  field: string
  value?: unknown

  /* eg - equal to. nn - not null nl - null neq - Not equal to. gt - Greater than. gte - Greater than or equal to. lt - Less than. lte - Less than or equal to. in - Included in an array of specified values. nin - Not included in an array of specified values. like - Matching a pattern (similar to SQL LIKE). nlike - Not matching a pattern. between - Between two values (often inclusive). nbetween - Not between two values. */
  operator:
    | 'eq'
    | 'nn'
    | 'nl'
    | 'neq'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'nin'
    | 'like'
    | 'nlike'
    | 'between'
    | 'nbetween'
}

export type SelectOption = {
  id: ID
  title: string
  key?: string // i18n key
}

export type Entity = {
  [key: string]: unknown
} & {
  id: ID
  title: string
}

export type EntityListState<ITEM extends Entity = Entity> = { list: ITEM[] }
export type EntityViewState<ENTITY extends Entity = Entity> = { view: { [id: ID]: ENTITY }; newEntity?: ENTITY }

export type ID = string | number

export type ListItem<T = unknown> = {
  title?: string
  subtitle?: string
  id: ID
  icon?: string
  iconCss?: string
  image?: string
  section?: string

  /**
   * Used to pass additional data to the list (like Message, Topic, ...)
   */
  state?: T
  href?: string
  handler?: (cn: AppContext) => Promise<void> | void
  attrs?: Record<string, string | boolean | number>
  disabled?: boolean
  itemTags?: ListItemTag[]
  actions?: string[]
}

export type ListItemTag = {
  label: string
  key?: string
  icon?: string
}

// export type Theme = 'dark' | 'light' | 'system'

export type FieldChangeEvent = {
  value: FileList | number | string | boolean
  field: FieldSchema
}

export enum ActionStatus {
  Default = 0,
  InProgress = 1,
  Success = 2,
  Failure = 3,
}

export enum DateFormat {
  BriefDateTime,
  FullDateTime,
}

export type WidgetMenuItem = {
  name?: string
  label?: string
  href?: string
  icon?: string
  css?: string
  handler?: (cn: AppContext, state?: unknown) => Promise<void>
}

export type GetTokenResponse = {
  token: string
  backUrl: string
}

export type LogoutResponse = {
  redirectUrl: string
}

export class UserError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserError'
  }
}

export type AppContext = {
  dispatch: Dispatch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getState: () => any
  href: string
  pathname: string
  query: Record<string, string>
  widgetName: string
}
