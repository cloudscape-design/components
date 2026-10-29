// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent } from '@testing-library/react';

import TestI18nProvider from '../../../lib/components/i18n/testing';
import { renderOptionList, Stateful } from './common';

describe('OptionList i18n', () => {
  const messages = { 'option-list': { 'i18nStrings.selectedAriaLabel': 'Custom selected' } };

  test('announces the selected option with the provider message', () => {
    const { wrapper, listbox } = renderOptionList(
      <TestI18nProvider messages={messages}>
        <Stateful initialSelected={['a']} />
      </TestI18nProvider>
    );
    fireEvent.focus(listbox);
    expect(wrapper.findOptionByValue('a')!.getElement()).toHaveTextContent('Custom selected');
  });

  test('i18nStrings.selectedAriaLabel takes precedence over the provider message', () => {
    const { wrapper, listbox } = renderOptionList(
      <TestI18nProvider messages={messages}>
        <Stateful initialSelected={['a']} i18nStrings={{ selectedAriaLabel: 'Picked' }} />
      </TestI18nProvider>
    );
    fireEvent.focus(listbox);
    const option = wrapper.findOptionByValue('a')!.getElement();
    expect(option).toHaveTextContent('Picked');
    expect(option).not.toHaveTextContent('Custom selected');
  });
});
