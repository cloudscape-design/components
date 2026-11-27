// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, render } from '@testing-library/react';

import { clearMessageCache, setGlobalFlag } from '@cloudscape-design/component-toolkit/internal/testing';

import Alert from '../../../lib/components/alert';
import { I18nProvider, I18nProviderProps, useCustomI18n } from '../../../lib/components/i18n';
import RemoteI18nProvider from '../../../lib/components/i18n/providers/remote-provider';
import Modal from '../../../lib/components/modal';

const NAMESPACE = 'third-party-library';
const COMPONENT = 'test-component';

const MESSAGES: I18nProviderProps.Messages = {
  [NAMESPACE]: { en: { [COMPONENT]: { label: 'Provider label' } } },
};

function ThirdPartyComponent({ label }: { label?: string }) {
  const i18n = useCustomI18n(NAMESPACE, COMPONENT);
  return <span data-testid="label">{i18n('label', label)}</span>;
}

const warningFor = (component: string) =>
  expect.stringMatching(new RegExp(`^\\[AwsUi\\] \\[${component}\\] Some built-in strings are missing`));

let consoleWarn: jest.SpyInstance;
const originalNodeEnv = process.env.NODE_ENV;

beforeEach(() => {
  process.env.NODE_ENV = 'development';
  consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  clearMessageCache();
  jest.restoreAllMocks();
  setGlobalFlag('appLayoutWidget', undefined);
});

describe('missing built-in strings warning', () => {
  it('warns when neither a provider nor a property supplies the string', () => {
    render(<ThirdPartyComponent />);
    expect(consoleWarn).toHaveBeenCalledTimes(1);
    expect(consoleWarn).toHaveBeenCalledWith(warningFor(COMPONENT));
  });

  it('warns when the provider has no message for the locale', () => {
    render(
      <I18nProvider messages={[MESSAGES]} locale="pt-PT">
        <ThirdPartyComponent />
      </I18nProvider>
    );
    expect(consoleWarn).toHaveBeenCalledWith(warningFor(COMPONENT));
  });

  it('does not warn when the provider supplies the string', () => {
    const { getByTestId } = render(
      <I18nProvider messages={[MESSAGES]} locale="en">
        <ThirdPartyComponent />
      </I18nProvider>
    );
    expect(getByTestId('label')).toHaveTextContent('Provider label');
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('does not warn when the property supplies the string', () => {
    render(<ThirdPartyComponent label="Custom label" />);
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('treats an empty string as a supplied value', () => {
    render(<ThirdPartyComponent label="" />);
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('warns once per component, not per string or instance', () => {
    render(
      <>
        <Alert type="info" dismissible={true}>
          First
        </Alert>
        <Alert type="error" dismissible={true}>
          Second
        </Alert>
        <Modal visible={true} header="Header">
          Content
        </Modal>
      </>
    );
    expect(consoleWarn).toHaveBeenCalledTimes(2);
    expect(consoleWarn).toHaveBeenCalledWith(warningFor('alert'));
    expect(consoleWarn).toHaveBeenCalledWith(warningFor('modal'));
  });

  it('does not warn in a test environment', () => {
    process.env.NODE_ENV = 'test';
    render(<ThirdPartyComponent />);
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('does not warn while the remote provider is loading, and warns once it is unavailable', async () => {
    setGlobalFlag('appLayoutWidget', true);
    let resolveFormatter: (value: null) => void = () => {};
    const loadFormatter = () => new Promise<null>(resolve => (resolveFormatter = resolve));

    render(
      <RemoteI18nProvider loadFormatter={loadFormatter}>
        <ThirdPartyComponent />
      </RemoteI18nProvider>
    );
    expect(consoleWarn).not.toHaveBeenCalled();

    await act(() => {
      resolveFormatter(null);
    });
    expect(consoleWarn).toHaveBeenCalledWith(warningFor(COMPONENT));
  });
});
