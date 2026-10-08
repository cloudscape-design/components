// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { useReducedMotion } from '@cloudscape-design/component-toolkit/internal';

import { Transition } from '..';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  useReducedMotion: jest.fn().mockReturnValue(false),
}));

afterEach(() => {
  (useReducedMotion as jest.Mock).mockReturnValue(false);
});

function renderTransition({ disabled = false }: { disabled?: boolean } = {}) {
  const { getByTestId } = render(
    <Transition<HTMLDivElement> in={true} disabled={disabled}>
      {(state, ref, motionDisabled) => (
        <div ref={ref} data-testid="subject" data-state={state} data-motion-disabled={motionDisabled} />
      )}
    </Transition>
  );
  return getByTestId('subject');
}

describe('Transition', () => {
  test('reports motion as enabled by default', () => {
    expect(renderTransition()).toHaveAttribute('data-motion-disabled', 'false');
  });

  test('reports motion as disabled through the disabled prop', () => {
    expect(renderTransition({ disabled: true })).toHaveAttribute('data-motion-disabled', 'true');
  });

  test('reports motion as disabled through reduced-motion detection', () => {
    (useReducedMotion as jest.Mock).mockReturnValue(true);
    expect(renderTransition()).toHaveAttribute('data-motion-disabled', 'true');
  });
});
