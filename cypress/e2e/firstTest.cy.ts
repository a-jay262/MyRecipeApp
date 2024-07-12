// cypress/integration/recipes.spec.js

describe('Recipe App Tests', () => {
  beforeEach(() => {
    // Start at the homepage
    cy.visit('/');
  });

  it('Should add a new recipe', () => {
    // Navigate through the login page
    cy.contains('Get Started').click();
    cy.contains('Login').click(); // Adjust based on your actual UI

    // Navigate to the menu page

    // Navigate to the add recipe page
    cy.contains('More Recipe Add').click(); // Adjust based on your actual UI

    // Fill out the form to add a new recipe
    cy.get('#name').type('Test Recipe Name');

    cy.get('#ing').type('Sugar'); // Ingredient name
    cy.get('#quan').type('30'); // Ingredient quantity
    cy.get('#unit').type('g');
    

    // Add ingredients dynamically
    // Ingredient unit

     // Fill out step details
     cy.get('#step').type('Step 1'); // Step description
     cy.get('#des').type('Description for Step 1'); 

    // Add steps dynamically
    // Step details

    // Submit the form
    cy.get('.recipe-button').contains('Add Recipe').click(); // Click "Add Recipe" button


    cy.contains('Recipe List').click();
    cy.contains('Cook Today').click();


  });
});
