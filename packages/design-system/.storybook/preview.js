import React from 'react';
import '../src/tokens/index.css';
import './preview.css';

export const globalTypes = {
  palette: {
    description: 'Semantic design-system palette',
    toolbar: {
      title: 'Palette',
      icon: 'paintbrush',
      items: [
        { value: 'crux', title: 'Crux' },
        { value: 'summit', title: 'Summit' },
      ],
      dynamicTitle: true,
    },
  },
};

export const initialGlobals = { palette: 'crux' };

export const decorators = [
  (Story, context) => {
    document.documentElement.dataset.palette = context.globals.palette || 'crux';
    return React.createElement('div', { className: 'storybook-canvas' }, React.createElement(Story));
  },
];

export const parameters = {
  controls: { expanded: true },
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: { disable: true },
};
