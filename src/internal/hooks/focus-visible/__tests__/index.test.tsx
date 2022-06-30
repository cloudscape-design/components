// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import useFocusVisible from '../../../../../lib/components/internal/hooks/focus-visible';

function Fixture({ id = 'button' }) {
  const visible = useFocusVisible();
  return (
    <button {...visible} data-testid={id}>
      Test
    </button>
  );
}

test('should disable focus by default', async () => {
  const { findByTestId } = render(<Fixture />);
  expect(await findByTestId('button')).not.toHaveAttribute('data-awsui-focus-visible');
});

[
  { key: 'Shift', keyCode: 16 },
  { key: 'Alt', keyCode: 17 },
  { key: 'Control', keyCode: 18 },
  { key: 'Meta', keyCode: 91 },
].forEach(key => {
  test(`should not enable focus when ${key.key} key is pressed`, async () => {
    const { findByTestId } = render(<Fixture />);
    fireEvent.keyDown(document.body, key);
    expect(await findByTestId('button')).not.toHaveAttribute('data-awsui-focus-visible', 'true');
  });
});

test(`should enable focus when shift-tab is pressed`, async () => {
  const { findByTestId } = render(<Fixture />);
  fireEvent.keyDown(document.body, { key: 'Tab', keyCode: 65, shiftKey: true });
  expect(await findByTestId('button')).toHaveAttribute('data-awsui-focus-visible', 'true');
});

test('should enable focus when keyboard interaction happened', async () => {
  const { findByTestId } = render(<Fixture />);
  fireEvent.keyDown(document.body);
  expect(await findByTestId('button')).toHaveAttribute('data-awsui-focus-visible', 'true');
});

test('should disable focus when mouse is used after keyboard', async () => {
  const { findByTestId } = render(<Fixture />);
  fireEvent.keyDown(document.body);
  fireEvent.mouseDown(document.body);
  expect(await findByTestId('button')).not.toHaveAttribute('data-awsui-focus-visible');
});

test('should add listeners only once', async () => {
  const { findByTestId } = render(
    <>
      <Fixture id="button-1" />
      <Fixture id="button-2" />
    </>
  );
  fireEvent.keyDown(document.body);
  expect(await findByTestId('button-1')).toHaveAttribute('data-awsui-focus-visible', 'true');
  expect(await findByTestId('button-2')).toHaveAttribute('data-awsui-focus-visible', 'true');
});

test('should add listeners only once', () => {
  jest.spyOn(document, 'addEventListener');
  jest.spyOn(document, 'removeEventListener');
  const { rerender } = render(
    <>
      <Fixture id="button-1" />
      <Fixture id="button-2" />
    </>
  );
  expect(document.addEventListener).toHaveBeenCalledTimes(2);
  expect(document.removeEventListener).toHaveBeenCalledTimes(0);
  rerender(<Fixture id="button-1" />);
  expect(document.removeEventListener).toHaveBeenCalledTimes(0);
  rerender(<span />);
  expect(document.removeEventListener).toHaveBeenCalledTimes(2);
});

test('should initialize late components with updated state', async () => {
  const { rerender, findByTestId } = render(<Fixture key={1} id="button" />);
  fireEvent.keyDown(document.body);
  expect(await findByTestId('button')).toHaveAttribute('data-awsui-focus-visible', 'true');
  rerender(<Fixture key={2} id="button" />);
  expect(await findByTestId('button')).toHaveAttribute('data-awsui-focus-visible', 'true');
});
