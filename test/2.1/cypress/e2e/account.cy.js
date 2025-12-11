describe('todo', () => {
  beforeEach(() => {
    cy.viewport(1024, 768)
    cy.session('login', () => {
      // Login once and cache session data
      cy.login()
    })
  })

  it('account list', () => {
    cy.visit('/account')
    cy.get('div.header-element_title').should('exist')
  })
})
