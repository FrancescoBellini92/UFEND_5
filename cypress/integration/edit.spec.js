describe('Edit page', () => {
  it('shows trip details', () => {
    let details;

    cy.fixture('trip.json').then(trip => {
      localStorage.setItem('trips', JSON.stringify([trip]));
      details = trip.details;
    }).then(() => {
      cy.visit('http://localhost:8080');

      cy.get('#card-container > trip-card').shadow().find('#edit').click();

      cy.contains('Main').should('exist');
      cy.contains('Details').should('exist').click();

      cy.get('.column > .visible').shadow().contains('Details').should('exist');
      cy.get('.column > .visible').shadow().find('.detail__type').should('have.length', details.length);

      cy.get('.column > .visible').shadow().contains('Add').click();
      cy.get('.column > .visible').shadow().find('.detail__type').should('have.length', details.length + 1);

      cy.get('.column > .visible').shadow().contains('Save').click();
      cy.contains('Please fill empty fields and check the dates').should('exist');

      cy.get('.column > .visible').shadow().contains('Clear').click();
      cy.get('.column > .visible').shadow().find('.detail__type').should('not.exist');

      cy.contains('Changes have been saved').should('exist');
    });
  })
});
