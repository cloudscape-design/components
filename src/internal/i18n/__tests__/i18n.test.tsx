// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import { useI18nStrings } from '../use-i18n-strings';
import { I18nProvider } from '../context';

interface TestComponentProps {
  topLevelString?: string;
  // topLevelI18nFunction?: () => string;
  nested?: {
    nestedString: string;
    // nestedI18nFunction: () => string;
  };
}

const MESSAGES = {
  'test-component': {
    topLevelString: () => 'top level string',
    // topLevelI18nFunction: () => 'top level i18n function',
    'nested.nestedString': () => 'nested string',
    // 'nested.nestedI18nFunction': () => 'nested i18n function',
  },
};

function TestComponent(_props: TestComponentProps) {
  const props = useI18nStrings('test-component', _props);
  return (
    <ul>
      <li id="top-level-string">{props.topLevelString}</li>
      {/* <li id="top-level-i18n-function">{props.topLevelI18nFunction?.()}</li> */}
      <li id="nested-string">{props.nested?.nestedString}</li>
      {/* <li id="nested-i18n-function">{props.nested?.nestedI18nFunction?.()}</li> */}
    </ul>
  );
}

it('provides top-level and dot-notation nested strings', () => {
  const { container } = render(
    <I18nProvider value={MESSAGES}>
      <TestComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-string')).toHaveTextContent(MESSAGES['test-component'].topLevelString());
  expect(container.querySelector('#nested-string')).toHaveTextContent(
    MESSAGES['test-component']['nested.nestedString']()
  );
});
