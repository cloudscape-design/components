// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import { useInternalI18n } from '../context';
import { I18nProvider } from '../provider';

interface TestComponentProps {
  topLevelString?: string;
  topLevelFunction?: (type: 'function') => string;
  nested?: {
    nestedString?: string;
    nestedFunction?: (props: { type: 'function' }) => string;
  };
}

const MESSAGES = {
  locale: 'en-US',
  messages: {
    'test-component': {
      topLevelString: 'top level string',
      topLevelFunction: 'top level {type}',
      'nested.nestedString': 'nested string',
      'nested.nestedFunction': 'nested {type}',
    },
  },
};

function TestComponent(props: TestComponentProps) {
  const format = useInternalI18n();
  return (
    <ul>
      <li id="top-level-string">{format('test-component', 'topLevelString', props.topLevelString)}</li>
      <li id="top-level-function">
        {format(
          'test-component',
          'topLevelFunction',
          props.topLevelFunction,
          format => type => format({ type })
        )?.('function')}
      </li>

      <li id="nested-string">{format('test-component', 'nested.nestedString', props.nested?.nestedString)}</li>
      <li id="nested-function">
        {format(
          'test-component',
          'nested.nestedFunction',
          props.nested?.nestedFunction,
          format => props => format(props)
        )?.({ type: 'function' })}
      </li>
    </ul>
  );
}

it('provides top-level and dot-notation values for static strings', () => {
  const { container } = render(
    <I18nProvider value={MESSAGES}>
      <TestComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-string')).toHaveTextContent('top level string');
  expect(container.querySelector('#nested-string')).toHaveTextContent('nested string');
});

it('provides top-level and dot-notation values for i18n functions', () => {
  const { container } = render(
    <I18nProvider value={MESSAGES}>
      <TestComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-function')).toHaveTextContent('top level function');
  expect(container.querySelector('#nested-function')).toHaveTextContent('nested function');
});

it("doesn't override existing strings", () => {
  const { container } = render(
    <I18nProvider value={MESSAGES}>
      <TestComponent topLevelString="My custom string" nested={{ nestedString: 'My custom string' }} />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-string')).toHaveTextContent('My custom string');
  expect(container.querySelector('#nested-string')).toHaveTextContent('My custom string');
  expect(container.querySelector('#nested-function')).toHaveTextContent('nested function');
});
