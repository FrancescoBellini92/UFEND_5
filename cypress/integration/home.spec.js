import moment from 'moment';

describe('Home page', () => {
  it('shows saved trips', () => {
    let name;
    let location;
    let start;
    let end;

    cy.fixture('trip.json').then(trip => {
      localStorage.setItem('trips', JSON.stringify([trip]));
      name = trip.general.name;
      location = trip.general.location;
      start = trip.general.start;
      end = trip.general.end;
    }).then(() => {
      cy.visit('http://localhost:8080');

      cy.get('#card-container > trip-card').should('exist');
      cy.get('#card-container > trip-card').shadow().contains(name);
      cy.get('#card-container > trip-card').shadow().contains(location);
      cy.get('#card-container > trip-card').shadow().contains(moment(start).locale());
      cy.get('#card-container > trip-card').shadow().contains(moment(end).locale());

      cy.get('#card-container > trip-card').shadow().find('#remove').click();

      cy.get('dialog-component').shadow().contains('Ok').click();

      cy.contains('Trip deleted').should('exist');

      cy.get('#card-container > trip-card').should('not.exist');

      cy.contains('Add trip').should('exist');
    });
  })
});
