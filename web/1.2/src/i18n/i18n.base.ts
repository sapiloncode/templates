import accountTexts from '@src/modules/account/texts'
import generalTexts from '@src/modules/general/texts'

export default {
  // Module texts
  ...generalTexts,
  ...accountTexts,

  // General
  ADDRESS_NOT_FOUND: 'The page you are looking for cannot be found.',
  TODAY: 'Today',
  DELETE: 'Delete',
  EDIT: 'Edit',
  CANCEL: 'Cancel',

  NETWORK_ERROR_TITLE: 'Network Error',
  NETWORK_ERROR: 'Oops! error connecting to the server!',
  GENERAL_ERROR: 'Oops! Something went wrong!',
  GO_BACK_HOME: 'Go Back to Home',
  NOT_FOUND: 'Not Found',

  PROFILE: 'Profile',
  SETTINGS: 'Settings',

  // Signin Form
  PASSWORD: 'Password',
  PHONE: 'Phone',
  SHOW_MORE: 'More',
  SHOW_LESS: 'Less',

  MY_ACCOUNT_TITLE: 'My',
  UNKNOWN_ACCOUNT_TITLE: 'Unknown',

  // General
  OK: 'Ok',
  SEND: 'Send',
  SAVE: 'Save',
  CONTINUE: 'Continue',
  CREATE: 'Create',
  BACK: 'Back',
  CLOSE: 'Close',
  UPDATING_FAILED: 'Updating data failed',
  UNTITLED: 'Untitled',
  ACCOUNT: 'Account',

  // Settings
  THEME: 'Theme',
  LANGUAGE: 'Language',

  // Error messages
  SELECT_SIDEBAR_ITEM_FAILURE: `You can not select this item due to an internal error. Check the Console for more details.`,
  SERVER_ERROR_RETRY: 'Server error, Please try again!',
  PORTRAIT_WARNING_MESSAGE: `Please rotate your device to portrait mode for the best experience!`,
  GLOBAL_ERROR:
    'Something went wrong! We apologize for the inconvenience. Please report this error and refresh the page to continue.',

  // MISC
  REFRESH_TO_SEE_THE_RESULT: 'Please refresh the page to see the result!',

  RELOAD: 'Reload',
  EDIT_PROFILE: 'Edit Profile',
  IMAGE: 'Image',
  FILE: 'File',
  FILES: 'Files',
  COPY: 'Copy',
  COPYRIGHT: 'Copyright 2025. All rights reserved.',
}
