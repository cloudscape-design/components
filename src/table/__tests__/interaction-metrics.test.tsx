// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { RefObject } from 'react';
import Table from '../../../lib/components/table';
import { expectDetailInPanoramaCall, panorama } from '../../internal/utils/__tests__/panorama';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.useFakeTimers();
beforeEach(() => jest.resetAllMocks());

describe('Table interaction latency metrics', () => {
  it('reports sorting user action in interaction latency metrics', () => {
    const { container, rerender } = render(
      <Table columnDefinitions={[{ id: 'column', header: 'Column', cell() {}, sortingField: 'column' }]} items={[]} />
    );
    const wrapper = createWrapper(container).findTable()!;
    jest.runAllTimers();

    wrapper.findColumnSortingArea(1)!.click();
    rerender(<Table columnDefinitions={[]} items={[]} loading={true} />);

    expect(panorama).toHaveBeenCalledTimes(2);
    expectDetailInPanoramaCall(2).toEqual(
      expect.objectContaining({
        userAction: 'sort',
      })
    );
  });

  it('reports filtering user action in interaction latency metrics', () => {
    const divRef: RefObject<HTMLDivElement> = { current: null };
    const { rerender } = render(<Table columnDefinitions={[]} items={[]} filter={<div ref={divRef} />} />);
    jest.runAllTimers();

    divRef.current!.click();
    rerender(<Table columnDefinitions={[]} items={[]} loading={true} />);

    expect(panorama).toHaveBeenCalledTimes(2);
    expectDetailInPanoramaCall(2).toEqual(
      expect.objectContaining({
        userAction: 'filter',
      })
    );
  });

  it('reports pagination user action in interaction latency metrics', () => {
    const divRef: RefObject<HTMLDivElement> = { current: null };
    const { rerender } = render(<Table columnDefinitions={[]} items={[]} pagination={<div ref={divRef} />} />);
    jest.runAllTimers();

    divRef.current!.click();
    rerender(<Table columnDefinitions={[]} items={[]} loading={true} />);

    expect(panorama).toHaveBeenCalledTimes(2);
    expectDetailInPanoramaCall(2).toEqual(
      expect.objectContaining({
        userAction: 'paginate',
      })
    );
  });

  it('reports preferences user action in interaction latency metrics', () => {
    const divRef: RefObject<HTMLDivElement> = { current: null };
    const { rerender } = render(<Table columnDefinitions={[]} items={[]} preferences={<div ref={divRef} />} />);
    jest.runAllTimers();

    divRef.current!.click();
    rerender(<Table columnDefinitions={[]} items={[]} loading={true} />);

    expect(panorama).toHaveBeenCalledTimes(2);
    expectDetailInPanoramaCall(2).toEqual(
      expect.objectContaining({
        userAction: 'preferences',
      })
    );
  });
});
