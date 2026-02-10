// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import { render, waitFor } from '@testing-library/react';

import { I18nProvider } from '../../../../lib/components/i18n';
import { FormatFunction, InternalI18nContext } from '../../../../lib/components/i18n/context';
import RemoteI18nProvider from '../../../../lib/components/i18n/providers/remote-provider';

afterEach(() => {
  jest.restoreAllMocks();
  document.documentElement.lang = '';
});

const createMockFormatter = () => {
  const format: FormatFunction = (_ns: string, _component: string, _key: string, provided: any) => {
    if (provided !== undefined) {
      return provided;
    }
    return 'mocked string';
  };

  return { format };
};

function TestConsumer() {
  const context = useContext(InternalI18nContext);
  return <div data-testid="locale">{context?.locale || 'no-context'}</div>;
}

describe('RemoteI18nProvider', () => {
  it('loads the formatter and provides the context to the children', async () => {
    document.documentElement.lang = 'es';

    const loadFormatter = jest.fn().mockResolvedValue(createMockFormatter());

    const { getByTestId } = render(
      <RemoteI18nProvider loadFormatter={loadFormatter}>
        <TestConsumer />
      </RemoteI18nProvider>
    );

    await waitFor(() => {
      expect(getByTestId('locale')).toHaveTextContent('es');
    });
    expect(loadFormatter).toHaveBeenCalledWith({ locale: 'es' });
  });

  it('falls back to "en" if a lang isn\'t set on the <html>', async () => {
    const loadFormatter = jest.fn().mockResolvedValue(createMockFormatter());

    const { getByTestId } = render(
      <RemoteI18nProvider loadFormatter={loadFormatter}>
        <TestConsumer />
      </RemoteI18nProvider>
    );

    await waitFor(() => {
      expect(getByTestId('locale')).toHaveTextContent('en');
    });
    expect(loadFormatter).toHaveBeenCalledWith({ locale: 'en' });
  });

  it('does nothing when formatter returns null', async () => {
    const loadFormatter = jest.fn().mockResolvedValue(null);

    const { getByTestId } = render(
      <RemoteI18nProvider loadFormatter={loadFormatter}>
        <TestConsumer />
      </RemoteI18nProvider>
    );

    await waitFor(() => {
      expect(loadFormatter).toHaveBeenCalled();
    });
    expect(getByTestId('locale')).toHaveTextContent('no-context');
  });

  it('handles formatter loading errors gracefully', async () => {
    const loadFormatter = jest.fn().mockRejectedValue(new Error('Network error'));

    const { getByTestId } = render(
      <RemoteI18nProvider loadFormatter={loadFormatter}>
        <TestConsumer />
      </RemoteI18nProvider>
    );

    await waitFor(() => {
      expect(loadFormatter).toHaveBeenCalled();
    });
    expect(getByTestId('locale')).toHaveTextContent('no-context');
  });

  it('does not load formatter when wrapped by LocalI18nProvider', () => {
    const loadFormatter = jest.fn().mockResolvedValue(createMockFormatter());

    const { getByTestId } = render(
      <I18nProvider messages={[]} locale="en">
        <RemoteI18nProvider loadFormatter={loadFormatter}>
          <TestConsumer />
        </RemoteI18nProvider>
      </I18nProvider>
    );

    expect(getByTestId('locale')).toHaveTextContent('en');
    expect(loadFormatter).not.toHaveBeenCalled();
  });
});
