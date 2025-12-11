// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

let reduxState

Cypress.Commands.add('saveReduxState', () => {
  cy.window().then((win) => {
    reduxState = win.store.getState() // Adjust `win.store` to match how your Redux store is exposed
  })
})

Cypress.Commands.add('restoreReduxState', () => {
  cy.window().then((win) => {
    win.store.dispatch({ type: 'LOAD_STATE', payload: reduxState }) // Dispatch an action to load the saved state
  })
})
