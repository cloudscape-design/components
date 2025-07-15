// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import PopoverContainer from '../../../lib/components/popover/container';
import * as usePopoverPosition from '../../../lib/components/popover/use-popover-position';

const usePopoverPositionSpy = jest.spyOn(usePopoverPosition, 'default');

const defaultProps = { position: 'bottom', arrow: () => null, size: 'small', fixedWidth: false } as const;

afterEach(() => {
  usePopoverPositionSpy.mockClear();
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
