// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { render } from '@testing-library/react';
import React from 'react';
import {
  DropdownStatusPropsExtended,
  useDropdownStatus,
} from '../../../../../lib/components/internal/components/dropdown-status';
import createWrapper from '../../../../../lib/components/test-utils/dom';
import statusIconStyles from '../../../../../lib/components/status-indicator/styles.selectors.js';
function StatusRender(props: DropdownStatusPropsExtended) {
  const { isSticky, content } = useDropdownStatus(props);
  return (
    <>
      <span data-testid="sticky-state">{`${isSticky}`}</span>
      <div data-testid="content">{content}</div>
    </>
  );
}

function renderComponent(props: DropdownStatusPropsExtended) {
  const { getByTestId, container } = render(<StatusRender {...props} />);
  const wrapper = createWrapper(container!);
  return {
    getStickyState: () => getByTestId('sticky-state').textContent,
    getContent: () => getByTestId('content').textContent?.trim(),
    getIcon: () => wrapper.findStatusIndicator()!.findByClassName(statusIconStyles.icon)!.getElement(),
  };
}

describe('useDropdownStatus', () => {
  test('renders loading indicator', () => {
    const { getContent, getStickyState } = renderComponent({
      statusType: 'loading',
      loadingText: 'hello world',
    });
    expect(getStickyState()).toBe('true');
    expect(getContent()).toBe('hello world');
  });

  test('renders error text', () => {
    const { getContent, getStickyState } = renderComponent({
      statusType: 'error',
      errorText: 'we got a problem',
      recoveryText: 'do not worry',
    });

    expect(getStickyState()).toBe('true');
    expect(getContent()).toBe('we got a problem');
  });

  test('renders error text with recovery button if has recovery callback', () => {
    const { getContent, getStickyState } = renderComponent({
      statusType: 'error',
      errorText: 'we got a problem',
      recoveryText: 'do not worry',
      hasRecoveryCallback: true,
    });

    expect(getStickyState()).toBe('true');
    expect(getContent()).toBe('we got a problem do not worry');
  });

  test('renders empty element when defined', () => {
    const { getContent, getStickyState } = renderComponent({
      isEmpty: true,
      empty: 'I am empty',
    });

    expect(getStickyState()).toBe('true');
    expect(getContent()).toBe('I am empty');
  });

  test('renders null when empty but no element defined', () => {
    const { getContent, getStickyState } = renderComponent({ isEmpty: true });

    expect(getStickyState()).toBe('true');
    expect(getContent()).toBe('');
  });

  test('renders no-match element when defined', () => {
    const { getContent, getStickyState } = renderComponent({
      isNoMatch: true,
      noMatch: 'No match',
    });

    expect(getStickyState()).toBe('true');
    expect(getContent()).toBe('No match');
  });

  test('renders null when no-match but no element defined', () => {
    const { getContent, getStickyState } = renderComponent({ isNoMatch: true });

    expect(getStickyState()).toBe('true');
    expect(getContent()).toBe('');
  });

  test('renders finished element when defined', () => {
    const { getContent, getStickyState } = renderComponent({
      statusType: 'finished',
      finishedText: 'Finished',
    });

    expect(getStickyState()).toBe('false');
    expect(getContent()).toBe('Finished');
  });

  test('renders null when finished but no element defined', () => {
    const { getContent, getStickyState } = renderComponent({ statusType: 'finished' });

    expect(getStickyState()).toBe('true');
    expect(getContent()).toBe('');
  });

  test('renders error icon with ariaLabel when provided', () => {
    const { getContent, getIcon } = renderComponent({
      statusType: 'error',
      errorText: 'we got a problem',
      recoveryText: 'do not worry',
      errorIconAriaLabel: 'error-icon',
      hasRecoveryCallback: true,
    });

    expect(getContent()).toBe('we got a problem do not worry');
    expect(getIcon()).toHaveAttribute('aria-label', 'error-icon');
    expect(getIcon()).toHaveAttribute('role', 'img');
  });

  test('renders filtering text when filtered', () => {
    const { getContent } = renderComponent({
      statusType: 'pending',
      filteringResultsText: '2 matches',
      isFiltered: true,
    });
    expect(getContent()).toBe('2 matches');
  });

  test('does not render filtering text while loading', () => {
    const { getContent } = renderComponent({
      statusType: 'loading',
      filteringResultsText: '2 matches',
      isFiltered: true,
      loadingText: 'Loading',
    });
    expect(getContent()).toBe('Loading');
  });

  test('does not render filtering text when error occurred', () => {
    const { getContent } = renderComponent({
      statusType: 'error',
      filteringResultsText: '2 matches',
      isFiltered: true,
      errorText: 'We got a problem',
      recoveryText: 'do not worry',
      hasRecoveryCallback: true,
    });
    expect(getContent()).toBe('We got a problem do not worry');
  });

  test('render finished text when finished and not filtered', () => {
    const { getContent } = renderComponent({
      statusType: 'finished',
      filteringResultsText: '10 out of 10 items',
      isFiltered: false,
      finishedText: 'End of results',
    });
    expect(getContent()).toBe('End of results');
  });

  test('render filtering text when finished and filtered', () => {
    const { getContent } = renderComponent({
      statusType: 'finished',
      filteringResultsText: '10 out of 10 items',
      isFiltered: true,
      finishedText: 'End of results',
    });
    expect(getContent()).toBe('10 out of 10 items');
  });
});
