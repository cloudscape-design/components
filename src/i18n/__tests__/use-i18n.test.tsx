// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import { I18nProvider, I18nProviderProps, useI18n } from '../../../lib/components/i18n';
import { MESSAGES, TestComponent } from './test-component';

const THIRD_PARTY_NAMESPACE = 'third-party-library';
const OTHER_NAMESPACE = 'other-library';
const COMPONENT = 'test-component';

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

function ThirdPartyComponent({
  id = 'result',
  namespace = THIRD_PARTY_NAMESPACE,
  component = COMPONENT,
  messageKey = 'label',
  provided,
}: {
  id?: string;
  namespace?: string;
  component?: string;
  messageKey?: string;
  provided?: string;
}) {
  const i18n = useI18n(namespace, component);
  return <span id={id}>{i18n(messageKey, provided)}</span>;
}

function ThirdPartyComponentWithHandler() {
  const i18n = useI18n(THIRD_PARTY_NAMESPACE, COMPONENT);
  return <span id="result">{i18n('itemCount', undefined, format => format({ count: 2 }))}</span>;
}

function MultiNamespaceComponent() {
  const thirdPartyI18n = useI18n(THIRD_PARTY_NAMESPACE, COMPONENT);
  const otherI18n = useI18n(OTHER_NAMESPACE, COMPONENT);

  return (
    <>
      <span id="third-party">{thirdPartyI18n('label', undefined)}</span>
      <span id="other">{otherI18n('label', undefined)}</span>
    </>
  );
}

it('resolves messages from I18nProvider using a custom namespace', () => {
  const { container } = render(
    <I18nProvider messages={[THIRD_PARTY_MESSAGES]} locale="en">
      <ThirdPartyComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#result')).toHaveTextContent('Provider label');
});

it('prefers provided strings over provider messages', () => {
  const { container } = render(
    <I18nProvider messages={[THIRD_PARTY_MESSAGES]} locale="en">
      <ThirdPartyComponent provided="Provided label" />
    </I18nProvider>
  );

  expect(container.querySelector('#result')).toHaveTextContent('Provided label');
});

it('returns undefined when no provider is present and no string is provided', () => {
  let resolvedValue: string | undefined = 'initial value';
  let providedValue: string | undefined;

  function CaptureResolvedValue() {
    const i18n = useI18n(THIRD_PARTY_NAMESPACE, COMPONENT);
    resolvedValue = i18n('label', undefined);
    providedValue = i18n('label', 'Provided label');
    return null;
  }

  render(<CaptureResolvedValue />);

  expect(resolvedValue).toBeUndefined();
  expect(providedValue).toBe('Provided label');
});

it('falls back to a less specific locale for custom namespaces', () => {
  const japaneseMessages: I18nProviderProps.Messages = {
    [THIRD_PARTY_NAMESPACE]: {
      ja: {
        [COMPONENT]: {
          label: 'Japanese label',
        },
      },
    },
  };

  const { container } = render(
    <I18nProvider messages={[japaneseMessages]} locale="ja-JP">
      <ThirdPartyComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#result')).toHaveTextContent('Japanese label');
});

it('invokes customHandler with a format function', () => {
  const { container } = render(
    <I18nProvider messages={[THIRD_PARTY_MESSAGES]} locale="en">
      <ThirdPartyComponentWithHandler />
    </I18nProvider>
  );

  expect(container.querySelector('#result')).toHaveTextContent('2 items');
});

it('resolves messages independently across multiple namespaces', () => {
  const otherMessages: I18nProviderProps.Messages = {
    [OTHER_NAMESPACE]: {
      en: {
        [COMPONENT]: {
          label: 'Other namespace label',
        },
      },
    },
  };

  const { container } = render(
    <I18nProvider messages={[THIRD_PARTY_MESSAGES, otherMessages]} locale="en">
      <MultiNamespaceComponent />
    </I18nProvider>
  );

  expect(container.querySelector('#third-party')).toHaveTextContent('Provider label');
  expect(container.querySelector('#other')).toHaveTextContent('Other namespace label');
});

it('merges messages from nested providers across namespaces', () => {
  const otherMessages: I18nProviderProps.Messages = {
    [OTHER_NAMESPACE]: {
      en: {
        [COMPONENT]: {
          label: 'Nested provider label',
        },
      },
    },
  };

  const { container } = render(
    <I18nProvider messages={[THIRD_PARTY_MESSAGES]} locale="en">
      <I18nProvider messages={[otherMessages]} locale="en">
        <MultiNamespaceComponent />
      </I18nProvider>
    </I18nProvider>
  );

  expect(container.querySelector('#third-party')).toHaveTextContent('Provider label');
  expect(container.querySelector('#other')).toHaveTextContent('Nested provider label');
});

it('allows Cloudscape and third-party components to share one provider', () => {
  const { container } = render(
    <I18nProvider messages={[MESSAGES, THIRD_PARTY_MESSAGES]} locale="en">
      <TestComponent />
      <ThirdPartyComponent id="third-party-result" />
    </I18nProvider>
  );

  expect(container.querySelector('#top-level-string')).toHaveTextContent('top level string');
  expect(container.querySelector('#third-party-result')).toHaveTextContent('Provider label');
});
