// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import { I18nProvider, useLocale } from '../../../lib/components/i18n';

function LocaleComponent({ id = 'locale' }: { id?: string }) {
  const locale = useLocale();
  return <span id={id}>{locale === null ? 'null' : locale}</span>;
}

afterEach(() => {
  document.documentElement.lang = '';
});

it('returns null outside a provider', () => {
  const { container } = render(<LocaleComponent />);
  expect(container.querySelector('#locale')).toHaveTextContent('null');
});

it('returns the lowercased locale of the provider', () => {
  const { container } = render(
    <I18nProvider messages={[]} locale="de-DE">
      <LocaleComponent />
    </I18nProvider>
  );
  expect(container.querySelector('#locale')).toHaveTextContent('de-de');
});

it('returns the document language when the provider has no locale', () => {
  document.documentElement.lang = 'fr';
  const { container } = render(
    <I18nProvider messages={[]}>
      <LocaleComponent />
    </I18nProvider>
  );
  expect(container.querySelector('#locale')).toHaveTextContent('fr');
});

it('returns the locale of the nearest provider', () => {
  const { container } = render(
    <I18nProvider messages={[]} locale="en">
      <LocaleComponent id="outer" />
      <I18nProvider messages={[]} locale="ja">
        <LocaleComponent id="inner" />
      </I18nProvider>
    </I18nProvider>
  );
  expect(container.querySelector('#outer')).toHaveTextContent('en');
  expect(container.querySelector('#inner')).toHaveTextContent('ja');
});
