// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/autosuggest/styles.css.js';

const defaultOptions: AutosuggestProps.Options = [
  { value: '1', label: 'One' },
  { value: '2', lang: 'Two' },
];
const defaultProps: AutosuggestProps = {
  ariaLabel: 'search',
  enteredTextLabel: text => `Use value: ${text}`,
  value: '',
  onChange: () => {},
  options: defaultOptions,
  empty: 'No options',
  loadingText: 'loading...',
  finishedText: 'finished!',
  errorText: 'error!',
  errorIconAriaLabel: 'error icon',
  clearAriaLabel: 'clear input',
};

function renderAutosuggest(props: Partial<AutosuggestProps>) {
  const { container } = render(<Autosuggest {...defaultProps} {...props} />);
  const wrapper = createWrapper(container).findAutosuggest()!;
  return { container, wrapper };
}

function focusInput() {
  createWrapper().findAutosuggest()!.focus();
}

function expectDropdown() {
  const wrapper = createWrapper().findAutosuggest()!;
  expect(wrapper.findDropdown().findOpenDropdown()).not.toBe(null);
  expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-expanded', 'true');
}

function expectNoFooter() {
  expect(createWrapper().findAutosuggest()!.findDropdown().findFooterRegion()).toBe(null);
}

function expectFooterSticky(isSticky: boolean) {
  const dropdown = createWrapper().findAutosuggest()!.findDropdown()!.findOpenDropdown()!;
  expect(Boolean(dropdown.findByClassName(styles['list-bottom']))).toBe(!isSticky);
}

function expectFooterContent(expectedText: string) {
  const wrapper = createWrapper().findAutosuggest()!;
  expect(wrapper.findDropdown().findFooterRegion()!).not.toBe(null);
  expect(wrapper.findDropdown().findFooterRegion()!.getElement()).toHaveTextContent(expectedText);
  expect(wrapper.findDropdown().find('ul')!.getElement()).toHaveAccessibleDescription(expectedText);
}

function expectFooterImage(expectedText: string) {
  const footer = createWrapper().findAutosuggest()!.findDropdown().findFooterRegion()!;
  expect(footer).not.toBe(null);
  expect(footer.find('[role="img"]')!.getElement()).toHaveAccessibleName(expectedText);
}

async function expectA11y() {
  const wrapper = createWrapper().findAutosuggest()!;
  await expect(wrapper.getElement()).toValidateA11y();
}

describe('footer types', () => {
  test('empty', async () => {
    renderAutosuggest({ options: [] });
    focusInput();
    expectDropdown();
    expectFooterSticky(true);
    expectFooterContent('No options');
    await expectA11y();
  });

  test('pending', async () => {
    renderAutosuggest({ statusType: 'pending' });
    focusInput();
    expectDropdown();
    expectNoFooter();
    await expectA11y();
  });

  test('loading', async () => {
    renderAutosuggest({ statusType: 'loading' });
    focusInput();
    expectDropdown();
    expectFooterSticky(true);
    expectFooterContent('loading...');
    await expectA11y();
  });

  test('error', async () => {
    renderAutosuggest({ statusType: 'error' });
    focusInput();
    expectDropdown();
    expectFooterSticky(true);
    expectFooterContent('error!');
    expectFooterImage('error icon');
    await expectA11y();
  });

  test('finished', async () => {
    renderAutosuggest({ statusType: 'finished' });
    focusInput();
    expectDropdown();
    expectFooterSticky(false);
    expectFooterContent('finished!');
    await expectA11y();
  });

  test('results', async () => {
    renderAutosuggest({ value: 'x', filteringResultsText: () => '3 items' });
    focusInput();
    expectDropdown();
    expectFooterSticky(true);
    expectFooterContent('3 items');
    await expectA11y();
  });
});

describe('filtering results', () => {
  describe('with empty state', () => {
    test('displays empty state footer when value is empty', () => {
      renderAutosuggest({ options: [], filteringResultsText: () => '0 items' });
      focusInput();
      expectFooterContent('No options');
    });

    test('displays results footer when value is not empty', () => {
      renderAutosuggest({ value: ' ', options: [], filteringResultsText: () => '0 items' });
      focusInput();
      expectFooterContent('0 items');
    });
  });

  describe('with pending state', () => {
    test('displays no footer when value is empty', () => {
      renderAutosuggest({ statusType: 'pending', filteringResultsText: () => '3 items' });
      focusInput();
      expectNoFooter();
    });

    test('displays results footer when value is not empty', () => {
      renderAutosuggest({ value: ' ', statusType: 'pending', filteringResultsText: () => '3 items' });
      focusInput();
      expectFooterContent('3 items');
    });
  });

  describe('with loading state', () => {
    test('displays loading footer when value is empty', () => {
      renderAutosuggest({ statusType: 'loading', filteringResultsText: () => '3 items' });
      focusInput();
      expectFooterContent('loading...');
    });

    test('displays loading footer when value is not empty', () => {
      renderAutosuggest({ value: ' ', statusType: 'loading', filteringResultsText: () => '3 items' });
      focusInput();
      expectFooterContent('loading...');
    });
  });

  describe('with error state', () => {
    test('displays error footer when value is empty', () => {
      renderAutosuggest({ statusType: 'error', filteringResultsText: () => '3 items' });
      focusInput();
      expectFooterContent('error!');
    });

    test('displays error footer when value is not empty', () => {
      renderAutosuggest({ value: ' ', statusType: 'error', filteringResultsText: () => '3 items' });
      focusInput();
      expectFooterContent('error!');
    });
  });

  describe('with finished state', () => {
    test('displays no footer when finished w/o finished text and value is empty', () => {
      renderAutosuggest({ finishedText: undefined, filteringResultsText: () => '3 items' });
      focusInput();
      expectNoFooter();
    });

    test('displays finished footer when finished w/ finished text and value is empty', () => {
      renderAutosuggest({ filteringResultsText: () => '3 items' });
      focusInput();
      expectFooterContent('finished!');
    });

    test('displays results footer when finished w/o finished text and value is not empty', () => {
      renderAutosuggest({ value: ' ', finishedText: undefined, filteringResultsText: () => '3 items' });
      focusInput();
      expectFooterContent('3 items');
    });

    test('displays results footer when finished w/ finished text and value is not empty', () => {
      renderAutosuggest({ value: ' ', filteringResultsText: () => '3 items' });
      focusInput();
      expectFooterContent('3 items');
    });
  });
});
