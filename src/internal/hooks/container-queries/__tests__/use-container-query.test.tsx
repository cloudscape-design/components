// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { useContainerQuery } from '../use-container-query';
import { ResizeObserver } from '@juggle/resize-observer';
import { ContainerQueryEntry } from '..';

function TestComponent({ mapFn = () => '' }: { mapFn?: (entry: ContainerQueryEntry) => string }) {
  const [value, ref] = useContainerQuery(mapFn);
  return <div ref={ref} data-testid="test" data-value={value} />;
}

test('should create a resize observer and observe the attached element', () => {
  const component = render(<TestComponent />);
  expect(ResizeObserver.prototype.observe).toHaveBeenCalledWith(component.getByTestId('test'));
});

test('should call the map function with the content box when the resize observer is triggered', () => {
  const mapFn = jest.fn(() => '');
  const component = render(<TestComponent mapFn={mapFn} />);
  expect(mapFn).toHaveBeenCalledWith(
    {
      target: component.getByTestId('test'),
      contentBoxWidth: 0,
      contentBoxHeight: 0,
      borderBoxWidth: 0,
      borderBoxHeight: 0,
      width: 0,
      height: 0,
    },
    null
  );
});

test('should disconnect the resize observer from the old elements when the ref is unmounted', () => {
  const component = render(<TestComponent />);
  component.unmount();
  expect(ResizeObserver.prototype.disconnect).toHaveBeenCalled();
});

test('should return the value provided by the map function', () => {
  const component = render(<TestComponent mapFn={entry => entry.contentBoxHeight.toString()} />);
  expect(component.getByTestId('test')).toHaveAttribute('data-value', '0');
});
