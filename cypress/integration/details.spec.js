import moment from 'moment';

describe('Detail page', () => {
  it('shows trip details', () => {
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

      cy.get('#card-container > trip-card').shadow().find('#view').click();

      cy.get('#detail-card').should('exist');

      cy.get('#weather-list').should('exist');

      cy.get('#detail-card').shadow().contains(name);
      cy.get('#detail-card').shadow().contains(location);
      cy.get('#detail-card').shadow().contains(moment(start).locale());
      cy.get('#detail-card').shadow().contains(moment(end).locale());
      cy.get('#detail-card').shadow().find('#remove').click();

      cy.get('dialog-component').shadow().contains('Ok').click();

      cy.contains('Trip deleted').should('exist');

      cy.get('#card-container > trip-card').should('not.exist');

      cy.contains('Add trip').should('exist');
    });
  })
});
