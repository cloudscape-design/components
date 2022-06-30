// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { render } from '@testing-library/react';
import React from 'react';
import {
  DropdownStatusPropsExtended,
  useDropdownStatus,
} from '../../../../../lib/components/internal/components/dropdown-status';

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
  const { getByTestId } = render(<StatusRender {...props} />);
  return {
    getStickyState: () => getByTestId('sticky-state').textContent,
    getContent: () => getByTestId('content').textContent,
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

  test('renders error indicator', () => {
    const { getContent, getStickyState } = renderComponent({
      statusType: 'error',
      errorText: 'we got a problem',
      recoveryText: 'do not worry',
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
});
