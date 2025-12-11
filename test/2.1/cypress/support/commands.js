//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args)
})

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args)
})

Cypress.Commands.add('login', () => {
  cy.visit('/')
  cy.origin(Cypress.env('loginUrl'), () => {
    const user = Cypress.env('user')
    cy.get('input#signInFormUsername').eq(1).type(user)
    cy.get('input#signInFormPassword').eq(1).type(Cypress.env('pass'), { log: false })
    cy.get('input[name="signInSubmitButton"]').eq(1).click()
  })
})

Cypress.Commands.add('widgetIsVisible', (args) => {
  if (args.name) {
    cy.get(`.widget[data-name=${args.name}]`).should('exist')
  }
  if (args.title) {
    cy.get(`.widget${args.name ? `[data-name=${args.name}]` : ''}  .widget-header .header-element_title`)
      .should('exist')
      .and('contain.text', args.title)
  }
})
