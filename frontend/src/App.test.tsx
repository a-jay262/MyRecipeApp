import React from 'react';
import { mount } from '@cypress/react';
import App from './App';

describe('App Component', () => {
  it('renders learn react link', () => {
    mount(<App />);
    cy.get('a').contains('learn react').should('be.visible');
  });
});
