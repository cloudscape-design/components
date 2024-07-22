// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle } from 'react';
import { render } from '@testing-library/react';

import { useDebounceCallback } from '../../../../../lib/components/internal/hooks/use-debounce-callback';

interface TestComponentProps {
  callback: (arg: any) => void;
}

interface TestComponentRef {
  debounced: (arg: any) => void;
}

const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

const TestComponent = React.forwardRef(({ callback }: TestComponentProps, ref: React.Ref<TestComponentRef>) => {
  const debounced = useDebounceCallback(callback, 0);
  useImperativeHandle(ref, () => ({ debounced }));
  return null;
});

test('calls function with debounce', async () => {
  let component: TestComponentRef;
  const callback = jest.fn();
  render(<TestComponent ref={value => (component = value!)} callback={callback} />);
  component!.debounced('one');
  component!.debounced('two');
  expect(callback).toBeCalledTimes(0);
  await wait(0);
  expect(callback).toBeCalledTimes(1);
  expect(callback).toHaveBeenCalledWith('two');
});

test('calls the latest function instance', async () => {
  let component: TestComponentRef;
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  const { rerender } = render(<TestComponent ref={value => (component = value!)} callback={callback1} />);
  component!.debounced('one');
  rerender(<TestComponent ref={value => (component = value!)} callback={callback2} />);
  component!.debounced('two');
  expect(callback1).toBeCalledTimes(0);
  expect(callback2).toBeCalledTimes(0);
  await wait(0);
  expect(callback1).toBeCalledTimes(0);
  expect(callback2).toBeCalledTimes(1);
  expect(callback2).toHaveBeenCalledWith('two');
});
