// cypress/support/index.js

after(() => {
  cy.log('Performing global after-all-tests action.')
})
