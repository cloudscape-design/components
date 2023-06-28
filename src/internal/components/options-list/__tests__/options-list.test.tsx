// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import OptionsList from '../../../../../lib/components/internal/components/options-list';

function renderList(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return container;
}

test('calls onMouseMove handler with item index', () => {
  const onMouseMove = jest.fn();
  const container = renderList(
    <OptionsList open={true} statusType="pending" onMouseMove={onMouseMove}>
      <div data-testid="not-target">Not a target</div>
      <div data-mouse-target="1">One</div>
      <div data-mouse-target="2">Two</div>
    </OptionsList>
  );
  fireEvent.mouseMove(container.querySelector('[data-testid="not-target"]')!);
  expect(onMouseMove).toHaveBeenCalledWith(-1);
  onMouseMove.mockReset();
  fireEvent.mouseMove(container.querySelector('[data-mouse-target="1"]')!);
  expect(onMouseMove).toHaveBeenCalledWith(1);
  onMouseMove.mockReset();
  fireEvent.mouseMove(container.querySelector('[data-mouse-target="2"]')!);
  expect(onMouseMove).toHaveBeenCalledWith(2);
});

test('calls onMouseUp handler with item index', () => {
  const onMouseUp = jest.fn();
  const container = renderList(
    <OptionsList open={true} statusType="pending" onMouseUp={onMouseUp}>
      <div data-testid="not-target">Not a target</div>
      <div data-mouse-target="1">One</div>
      <div data-mouse-target="2">Two</div>
    </OptionsList>
  );
  fireEvent.mouseUp(container.querySelector('[data-testid="not-target"]')!);
  expect(onMouseUp).toHaveBeenCalledWith(-1);
  onMouseUp.mockReset();
  fireEvent.mouseUp(container.querySelector('[data-mouse-target="1"]')!);
  expect(onMouseUp).toHaveBeenCalledWith(1);
  onMouseUp.mockReset();
  fireEvent.mouseUp(container.querySelector('[data-mouse-target="2"]')!);
  expect(onMouseUp).toHaveBeenCalledWith(2);
});

test('supports ariaLabelledby', () => {
  const container = renderList(
    <OptionsList open={true} statusType="pending" ariaLabelledby="someid">
      <div>Option</div>
    </OptionsList>
  );
  expect(container.querySelector('ul')).toHaveAttribute('aria-labelledby', 'someid');
});

test('onLoadMore fires when dropdown opens and its bottom is on the screen', () => {
  const onLoadMore = jest.fn();
  const { rerender } = render(
    <OptionsList open={false} statusType="pending" onLoadMore={onLoadMore}>
      <div>Option</div>
    </OptionsList>
  );

  expect(onLoadMore).not.toHaveBeenCalled();

  rerender(
    <OptionsList open={true} statusType="pending" onLoadMore={onLoadMore}>
      <div>Option</div>
    </OptionsList>
  );

  expect(onLoadMore).toHaveBeenCalledTimes(1);

  rerender(
    <OptionsList open={true} statusType="pending" onLoadMore={onLoadMore}>
      <div>Option</div>
    </OptionsList>
  );

  expect(onLoadMore).toHaveBeenCalledTimes(1);
});

test('onLoadMore is called when dropdown is open and status type changes to "pending"', () => {
  const onLoadMore = jest.fn();
  const { rerender } = render(
    <OptionsList open={true} statusType="pending" onLoadMore={onLoadMore}>
      <div>Option</div>
    </OptionsList>
  );

  expect(onLoadMore).toHaveBeenCalledTimes(1);

  rerender(
    <OptionsList open={true} statusType="loading" onLoadMore={onLoadMore}>
      <div>Option</div>
    </OptionsList>
  );

  expect(onLoadMore).toHaveBeenCalledTimes(1);

  rerender(
    <OptionsList open={true} statusType="pending" onLoadMore={onLoadMore}>
      <div>Option</div>
    </OptionsList>
  );

  expect(onLoadMore).toHaveBeenCalledTimes(2);
});
