declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in to the application.
     * @example cy.login()
     */
    login(): Chainable<void>
  }
}
