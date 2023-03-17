// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import { useInternalI18n } from '../context';
import { I18nProvider, I18nProviderProps } from '../provider';

interface TestComponentProps {
  topLevelString?: string;
  topLevelFunction?: (type: 'function') => string;
  nested?: {
    nestedString?: string;
    nestedFunction?: (props: { type: 'function' }) => string;
  };
}

const MESSAGES: I18nProviderProps.Messages = {
  '@cloudscape-design/components': {
    en: {
      'test-component': {
        topLevelString: 'top level string',
        topLevelFunction: 'top level {type}',
        'nested.nestedString': 'nested string',
        'nested.nestedFunction': 'nested {type}',
      },
    },
  },
};

function TestComponent(props: TestComponentProps) {
  const format = useInternalI18n('test-component');

  return (
    <ul>
      <li id="top-level-string">{format('topLevelString', props.topLevelString)}</li>
      <li id="top-level-function">
        {format('topLevelFunction', props.topLevelFunction, format => type => format({ type }))?.('function')}
      </li>

      <li id="nested-string">{format('nested.nestedString', props.nested?.nestedString)}</li>
      <li id="nested-function">
        {format(
          'nested.nestedFunction',
          props.nested?.nestedFunction,
          format => props => format(props)
        )?.({ type: 'function' })}
      </li>
    </ul>
  );
}

it('detects locale from the html tag', () => {
  const spanishMessages: I18nProviderProps.Messages = {
    '@cloudscape-design/components': {
      es: {
        'test-component': {
          topLevelString: 'Custom Spanish string',
        },
      },
    },
  };

  try {
    document.documentElement.lang = 'es';

    const { container } = render(
      <I18nProvider messages={[MESSAGES, spanishMessages]}>
        <TestComponent />
      </I18nProvider>
    );

    expect(container.querySelector('#top-level-string')).toHaveTextContent('Custom Spanish string');
    // Shouldn't default to English for non-existent strings.
    expect(container.querySelector('#nested-string')).toHaveTextContent('');
  } finally {
    document.documentElement.lang = '';
  }
});

it('provides top-level and dot-notation values for static strings', () => {
  const { container } = render(
    <I18nProvider messages={[MESSAGES]} locale="en">
      <TestComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-string')).toHaveTextContent('top level string');
  expect(container.querySelector('#nested-string')).toHaveTextContent('nested string');
});

it('falls back to a less specific language tag if a string is not provided for a language', () => {
  const britishEnglishMessages: I18nProviderProps.Messages = {
    '@cloudscape-design/components': {
      'en-GB': {
        'test-component': {
          topLevelString: 'Custom string - colour',
        },
      },
    },
  };

  const { container } = render(
    <I18nProvider messages={[MESSAGES, britishEnglishMessages]} locale="en-GB">
      <TestComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-string')).toHaveTextContent('Custom string - colour');
  expect(container.querySelector('#nested-string')).toHaveTextContent('nested string');
});

it('provides top-level and dot-notation values for i18n functions', () => {
  const { container } = render(
    <I18nProvider messages={[MESSAGES]} locale="en">
      <TestComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-function')).toHaveTextContent('top level function');
  expect(container.querySelector('#nested-function')).toHaveTextContent('nested function');
});

it("doesn't override existing strings", () => {
  const { container } = render(
    <I18nProvider messages={[MESSAGES]} locale="en">
      <TestComponent topLevelString="My custom string" nested={{ nestedString: 'My custom string' }} />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-string')).toHaveTextContent('My custom string');
  expect(container.querySelector('#nested-string')).toHaveTextContent('My custom string');
  expect(container.querySelector('#nested-function')).toHaveTextContent('nested function');
});

it('merges provided message objects in order', () => {
  const messageOverride: I18nProviderProps.Messages = {
    '@cloudscape-design/components': {
      en: {
        'test-component': {
          topLevelString: 'My custom string',
        },
      },
    },
  };

  const { container } = render(
    <I18nProvider messages={[MESSAGES, messageOverride]} locale="en">
      <TestComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-string')).toHaveTextContent('My custom string');
});

it('allows nesting providers', () => {
  const messageOverride: I18nProviderProps.Messages = {
    '@cloudscape-design/components': {
      en: {
        'test-component': {
          topLevelString: 'My custom string',
        },
      },
    },
  };

  const { container } = render(
    <I18nProvider messages={[MESSAGES]} locale="en">
      <I18nProvider messages={[messageOverride]} locale="en">
        <TestComponent />
      </I18nProvider>
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-string')).toHaveTextContent('My custom string');
  expect(container.querySelector('#nested-string')).toHaveTextContent('nested string');
});
