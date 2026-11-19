// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import { I18nProvider, I18nProviderProps, useCustomI18n } from '../../../lib/components/i18n';
import { MESSAGES, TestComponent } from './test-component';

const THIRD_PARTY_NAMESPACE = 'third-party-library';
const OTHER_NAMESPACE = 'other-library';
const COMPONENT = 'test-component';

interface ThirdPartyFormatArgTypes {
  'test-component': {
    label: never;
    itemCount: { count: number };
  };
}

interface OtherFormatArgTypes {
  'test-component': {
    label: never;
  };
}

const THIRD_PARTY_MESSAGES: I18nProviderProps.Messages = {
  [THIRD_PARTY_NAMESPACE]: {
    en: {
      [COMPONENT]: {
        label: 'Provider label',
        itemCount: '{count, plural, one {# item} other {# items}}',
      },
    },
  },
};

const OTHER_MESSAGES: I18nProviderProps.Messages = {
  [OTHER_NAMESPACE]: {
    en: {
      [COMPONENT]: {
        label: 'Other namespace label',
      },
    },
  },
};

function ThirdPartyComponent({ id = 'third-party-result' }: { id?: string }) {
  const i18n = useCustomI18n<ThirdPartyFormatArgTypes, typeof COMPONENT>(THIRD_PARTY_NAMESPACE, COMPONENT);

  return (
    <>
      <span id={id}>{i18n('label', undefined)}</span>
      <span id={`${id}-count`}>{i18n('itemCount', undefined, format => format({ count: 2 }))}</span>
    </>
  );
}

function MultiNamespaceComponent() {
  const thirdPartyI18n = useCustomI18n<ThirdPartyFormatArgTypes, typeof COMPONENT>(THIRD_PARTY_NAMESPACE, COMPONENT);
  const otherI18n = useCustomI18n<OtherFormatArgTypes, typeof COMPONENT>(OTHER_NAMESPACE, COMPONENT);

  return (
    <>
      <span id="third-party">{thirdPartyI18n('label', undefined)}</span>
      <span id="third-party-count">{thirdPartyI18n('itemCount', undefined, format => format({ count: 2 }))}</span>
      <span id="other">{otherI18n('label', undefined)}</span>
    </>
  );
}

it('resolves messages independently across multiple namespaces', () => {
  const { container } = render(
    <I18nProvider messages={[THIRD_PARTY_MESSAGES, OTHER_MESSAGES]} locale="en">
      <MultiNamespaceComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#third-party')).toHaveTextContent('Provider label');
  expect(container.querySelector('#third-party-count')).toHaveTextContent('2 items');
  expect(container.querySelector('#other')).toHaveTextContent('Other namespace label');
});

it('merges messages from nested providers across namespaces', () => {
  const { container } = render(
    <I18nProvider messages={[THIRD_PARTY_MESSAGES]} locale="en">
      <I18nProvider messages={[OTHER_MESSAGES]} locale="en">
        <MultiNamespaceComponent />
      </I18nProvider>
    </I18nProvider>
  );

  expect(container.querySelector('#third-party')).toHaveTextContent('Provider label');
  expect(container.querySelector('#other')).toHaveTextContent('Other namespace label');
});

it('allows Cloudscape and third-party components to share one provider', () => {
  const { container } = render(
    <I18nProvider messages={[MESSAGES, THIRD_PARTY_MESSAGES]} locale="en">
      <TestComponent />
      <ThirdPartyComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-string')).toHaveTextContent('top level string');
  expect(container.querySelector('#third-party-result')).toHaveTextContent('Provider label');
  expect(container.querySelector('#third-party-result-count')).toHaveTextContent('2 items');
});
