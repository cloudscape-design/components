// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import PopoverContainer from '../../../lib/components/popover/container';
import * as usePopoverPosition from '../../../lib/components/popover/use-popover-position';
import * as usePositionObserver from '../../../lib/components/popover/use-position-observer';

const usePopoverPositionSpy = jest.spyOn(usePopoverPosition, 'default');
const usePositionObserverSpy = jest.spyOn(usePositionObserver, 'default');

const defaultProps = { position: 'bottom', arrow: () => null, size: 'small', fixedWidth: false } as const;

afterEach(() => {
  usePopoverPositionSpy.mockClear();
  usePositionObserverSpy.mockClear();
});

test('throws when neither trackRef nor getTrack is provided', () => {
  expect(() => render(<PopoverContainer {...defaultProps}>content</PopoverContainer>)).toThrow(
    'Invariant violation: must provide either trackRef or getTrack.'
  );
});

test.each([null, document.createElement('div')])('accepts track element with trackRef, track = %s', track => {
  render(
    <PopoverContainer {...defaultProps} trackRef={{ current: track }}>
      content
    </PopoverContainer>
  );

  const getTrack = usePopoverPositionSpy.mock.calls[0][0].getTrack;
  expect(getTrack()).toBe(track);
});

test.each([null, document.createElement('div')])('accepts track element with getTrack, track = %s', track => {
  render(
    <PopoverContainer {...defaultProps} getTrack={() => track}>
      content
    </PopoverContainer>
  );

  const getTrack = usePopoverPositionSpy.mock.calls[0][0].getTrack;
  expect(getTrack()).toBe(track);
});

test('passes trackKey to usePositionObserver', () => {
  const trackRef = { current: document.createElement('div') };
  const trackKey = 'test-key';

  render(
    <PopoverContainer {...defaultProps} trackRef={trackRef} trackKey={trackKey}>
      content
    </PopoverContainer>
  );

  // Verify that usePositionObserver was called with the correct trackKey
  expect(usePositionObserverSpy).toHaveBeenCalledWith(trackRef, trackKey, expect.any(Function));
});

test('passes undefined trackKey to usePositionObserver when not provided', () => {
  const trackRef = { current: document.createElement('div') };

  render(
    <PopoverContainer {...defaultProps} trackRef={trackRef}>
      content
    </PopoverContainer>
  );

  // Verify that usePositionObserver was called with undefined trackKey
  expect(usePositionObserverSpy).toHaveBeenCalledWith(trackRef, undefined, expect.any(Function));
});

test('updates position when trackKey changes', () => {
  const trackRef = { current: document.createElement('div') };
  const initialTrackKey = 'initial-key';

  const { rerender } = render(
    <PopoverContainer {...defaultProps} trackRef={trackRef} trackKey={initialTrackKey}>
      content
    </PopoverContainer>
  );

  // Clear the initial call
  usePositionObserverSpy.mockClear();

  // Rerender with a different trackKey
  const newTrackKey = 'new-key';
  rerender(
    <PopoverContainer {...defaultProps} trackRef={trackRef} trackKey={newTrackKey}>
      content
    </PopoverContainer>
  );

  // Verify that usePositionObserver was called again with the new trackKey
  expect(usePositionObserverSpy).toHaveBeenCalledWith(trackRef, newTrackKey, expect.any(Function));
});

test('passes trackRef to usePositionObserver', () => {
  const trackRef = { current: document.createElement('div') };

  render(
    <PopoverContainer {...defaultProps} trackRef={trackRef}>
      content
    </PopoverContainer>
  );

  // Verify that usePositionObserver was called with the correct trackRef
  expect(usePositionObserverSpy).toHaveBeenCalledWith(trackRef, undefined, expect.any(Function));
});

test('updates position when trackRef changes', () => {
  const initialTrackRef = { current: document.createElement('div') };

  const { rerender } = render(
    <PopoverContainer {...defaultProps} trackRef={initialTrackRef}>
      content
    </PopoverContainer>
  );

  // Clear the initial call
  usePositionObserverSpy.mockClear();

  // Rerender with a different trackRef
  const newTrackRef = { current: document.createElement('div') };
  rerender(
    <PopoverContainer {...defaultProps} trackRef={newTrackRef}>
      content
    </PopoverContainer>
  );

  // Verify that usePositionObserver was called again with the new trackRef
  expect(usePositionObserverSpy).toHaveBeenCalledWith(newTrackRef, undefined, expect.any(Function));
});

test('passes both trackRef and trackKey to usePositionObserver', () => {
  const trackRef = { current: document.createElement('div') };
  const trackKey = 'test-key';

  render(
    <PopoverContainer {...defaultProps} trackRef={trackRef} trackKey={trackKey}>
      content
    </PopoverContainer>
  );

  // Verify that usePositionObserver was called with both trackRef and trackKey
  expect(usePositionObserverSpy).toHaveBeenCalledWith(trackRef, trackKey, expect.any(Function));
});

test('updates position when both trackRef and trackKey change', () => {
  const initialTrackRef = { current: document.createElement('div') };
  const initialTrackKey = 'initial-key';

  const { rerender } = render(
    <PopoverContainer {...defaultProps} trackRef={initialTrackRef} trackKey={initialTrackKey}>
      content
    </PopoverContainer>
  );

  // Clear the initial call
  usePositionObserverSpy.mockClear();

  // Rerender with different trackRef and trackKey
  const newTrackRef = { current: document.createElement('div') };
  const newTrackKey = 'new-key';
  rerender(
    <PopoverContainer {...defaultProps} trackRef={newTrackRef} trackKey={newTrackKey}>
      content
    </PopoverContainer>
  );

  // Verify that usePositionObserver was called again with the new trackRef and trackKey
  expect(usePositionObserverSpy).toHaveBeenCalledWith(newTrackRef, newTrackKey, expect.any(Function));
});
