// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { fireEvent } from '@testing-library/react';

import { registerTooltip } from '../registry';

describe('registerTooltip', () => {
  test('calls previous callbacks when registering new callback', () => {
    const callbackOne = jest.fn();
    const callbackTwo = jest.fn();
    const callbackThree = jest.fn();
    registerTooltip(callbackOne);
    registerTooltip(callbackTwo);
    registerTooltip(callbackThree);
    expect(callbackThree).toBeCalledTimes(0);
    expect(callbackTwo).toBeCalledTimes(1);
    expect(callbackOne).toBeCalledTimes(2);
  });
  test('does not call deregistered callbacks', () => {
    const callbackOne = jest.fn();
    const callbackTwo = jest.fn();
    const deregisterOne = registerTooltip(callbackOne);
    deregisterOne();
    registerTooltip(callbackTwo);
    expect(callbackTwo).toBeCalledTimes(0);
    expect(callbackOne).toBeCalledTimes(0);
  });
  test('calls callbacks upon clicking on ESC', () => {
    const callbackOne = jest.fn();
    const deregisterOne = registerTooltip(callbackOne);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(callbackOne).toBeCalledTimes(1);
    deregisterOne();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(callbackOne).toBeCalledTimes(1);
  });
});
