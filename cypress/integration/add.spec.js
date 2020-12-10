import moment from 'moment';

describe('Add page', () => {
  const name = 'Name';
  const location = 'Rome';
  let start = moment();
  const end = start.add(10, 'days').format('yyyy-MM-DD');
  start = start.format('yyyy-MM-DD')

  it('adds new trip', () => {
    cy.intercept({
      url: 'http://localhost:3000/trip-info',
      query: {
        name,
        location,
        start,
        end
      }
    }).as('addTrip');

    cy.visit('http://localhost:8080');

    cy.contains('Add trip').click();

    cy.get('#add-page-main > .column > trip-form').shadow().find('#name').type(name);
    cy.get('#add-page-main > .column > trip-form').shadow().find('#location').type(location);
    cy.get('#add-page-main > .column > trip-form').shadow().find('#start-date').type(start);
    cy.get('#add-page-main > .column > trip-form').shadow().find('#end-date').type(end);
    cy.get('#add-page-main > .column > trip-form').shadow().find('#submit').click();

    cy.wait('@addTrip');

    cy.contains('Trip created').should('exist');

    cy.get('#detail-card').should('exist');
    cy.get('#detail-card').shadow().contains(name);

    cy.get('#weather-list').should('exist');
  });
});
