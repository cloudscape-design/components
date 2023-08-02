// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import { render } from '@testing-library/react';
import { useResizeObserver } from '../use-resize-observer';
import { ResizeObserver } from '@juggle/resize-observer';
import { ContainerQueryEntry } from '@cloudscape-design/component-toolkit';

function TestComponent({ mapFn = () => '' }: { mapFn?: (entry: ContainerQueryEntry) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  useResizeObserver(ref, entry => setValue(mapFn(entry)));
  return (
    <div
      ref={ref}
      data-testid="test"
      data-value={value}
      style={{
        width: 10,
        height: 20,
      }}
    />
  );
}

test('should create a resize observer and observe the attached element', () => {
  const component = render(<TestComponent />);
  expect(ResizeObserver.prototype.observe).toHaveBeenCalledWith(component.getByTestId('test'));
});

test('should call the map function with the content box when the resize observer is triggered', () => {
  const mapFn = jest.fn(() => '');
  const component = render(<TestComponent mapFn={mapFn} />);
  expect(mapFn).toHaveBeenCalledWith({
    target: component.getByTestId('test'),
    contentBoxWidth: 10,
    contentBoxHeight: 20,
    borderBoxWidth: 10,
    borderBoxHeight: 20,
  });
});

test('should disconnect the resize observer from the old elements when the ref is unmounted', () => {
  const component = render(<TestComponent />);
  component.unmount();
  expect(ResizeObserver.prototype.disconnect).toHaveBeenCalled();
});

test('should return the value provided by the map function', () => {
  const component = render(<TestComponent mapFn={entry => entry.contentBoxWidth.toString()} />);
  expect(component.getByTestId('test')).toHaveAttribute('data-value', '10');
});
