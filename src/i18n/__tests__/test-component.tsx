// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { I18nProviderProps } from '../../../lib/components/i18n';
import { useInternalI18n } from '../../../lib/components/i18n/context';

interface TestComponentProps {
  topLevelString?: string;
  topLevelFunction?: (type: 'function') => string;
  nested?: {
    nestedString?: string;
    nestedFunction?: (props: { type: 'function' }) => string;
  };
}

export const MESSAGES: I18nProviderProps.Messages = {
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

declare module '../../../lib/components/i18n/messages-types' {
  interface I18nFormatArgTypes {
    'test-component': {
      topLevelString: never;
      topLevelFunction: { type: string };
      'nested.nestedString': never;
      'nested.nestedFunction': { type: string };
    };
  }
}

export function TestComponent(props: TestComponentProps) {
  const i18n = useInternalI18n('test-component');

  return (
    <ul>
      <li id="top-level-string">{i18n('topLevelString', props.topLevelString)}</li>
      <li id="top-level-function">
        {i18n('topLevelFunction', props.topLevelFunction, format => type => format({ type }))?.('function')}
      </li>

      <li id="nested-string">{i18n('nested.nestedString', props.nested?.nestedString)}</li>
      <li id="nested-function">
        {i18n(
          'nested.nestedFunction',
          props.nested?.nestedFunction,
          format => props => format(props)
        )?.({ type: 'function' })}
      </li>
    </ul>
  );
}
