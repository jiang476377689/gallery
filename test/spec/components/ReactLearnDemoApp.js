'use strict';

describe('ReactLearnDemoApp', () => {
  let React = require('react/addons');
  let ReactLearnDemoApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    ReactLearnDemoApp = require('components/ReactLearnDemoApp.js');
    component = React.createElement(ReactLearnDemoApp);
  });

  it('should create a new instance of ReactLearnDemoApp', () => {
    expect(component).toBeDefined();
  });
});
