// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ControlGroup from '../../../../../lib/components/internal/components/control-group';
import { ResetGroupedControlContext } from '../../../../../lib/components/internal/context/control-group-context';
import { DirectionProbe, PositionProbe } from './common';

describe('Control group', () => {
  test('keeps focus on a control when the children are reordered', () => {
    const alpha = <input key="alpha" data-testid="alpha" />;
    const beta = <input key="beta" data-testid="beta" />;

    const { getAllByTestId, rerender } = render(<ControlGroup>{[alpha, beta]}</ControlGroup>);

    // In auto mode the group renders a hidden measurement duplicate of its children, so a
    // test id can match more than once; the first match is the real (focusable) control.
    const alphaInput = getAllByTestId('alpha')[0];
    alphaInput.focus();
    expect(document.activeElement).toBe(alphaInput);

    // Move the focused control from first to last position.
    rerender(<ControlGroup>{[beta, alpha]}</ControlGroup>);

    // The same DOM node is still focused; it was moved, not remounted.
    expect(getAllByTestId('alpha')[0]).toBe(alphaInput);
    expect(document.activeElement).toBe(alphaInput);
  });

  describe('position', () => {
    // In auto mode each child is duplicated for measurement, so every probe matches twice;
    // the first match is the real control.
    test('exposes the "only" position to a single child control', () => {
      const { getAllByTestId } = render(
        <ControlGroup>
          <PositionProbe />
        </ControlGroup>
      );

      expect(getAllByTestId('probe')[0]).toHaveTextContent('only');
    });

    test('exposes first / middle / last positions to each child in order', () => {
      const { getAllByTestId } = render(
        <ControlGroup>
          <PositionProbe testId="a" />
          <PositionProbe testId="b" />
          <PositionProbe testId="c" />
        </ControlGroup>
      );

      expect(getAllByTestId('a')[0]).toHaveTextContent('first');
      expect(getAllByTestId('b')[0]).toHaveTextContent('middle');
      expect(getAllByTestId('c')[0]).toHaveTextContent('last');
    });

    test('resets the grouped position for content wrapped in ResetGroupedControlContext', () => {
      // Mirrors a nested control rendered inside a control's custom slot (e.g.
      // Autosuggest `empty`): it must not inherit the surrounding group position.
      const { getAllByTestId } = render(
        <ControlGroup>
          <ResetGroupedControlContext>
            <PositionProbe />
          </ResetGroupedControlContext>
        </ControlGroup>
      );

      expect(getAllByTestId('probe')[0]).toHaveTextContent('none');
    });
  });

  describe('direction', () => {
    // Without layout (jsdom), auto measurement never stacks, so the default resolves to
    // horizontal.
    test('defaults the direction to "horizontal" and exposes it to each child', () => {
      const { getAllByTestId } = render(
        <ControlGroup>
          <DirectionProbe testId="a" />
          <DirectionProbe testId="b" />
        </ControlGroup>
      );

      expect(getAllByTestId('a')[0]).toHaveTextContent('horizontal');
      expect(getAllByTestId('b')[0]).toHaveTextContent('horizontal');
    });

    test('exposes direction="vertical" to each child when the group is vertical', () => {
      const { getAllByTestId } = render(
        <ControlGroup direction="vertical">
          <DirectionProbe testId="a" />
          <DirectionProbe testId="b" />
          <DirectionProbe testId="c" />
        </ControlGroup>
      );

      expect(getAllByTestId('a')[0]).toHaveTextContent('vertical');
      expect(getAllByTestId('b')[0]).toHaveTextContent('vertical');
      expect(getAllByTestId('c')[0]).toHaveTextContent('vertical');
    });

    test('ResetGroupedControlContext preserves the group direction', () => {
      const { getAllByTestId } = render(
        <ControlGroup direction="vertical">
          <ResetGroupedControlContext>
            <DirectionProbe testId="direction" />
          </ResetGroupedControlContext>
        </ControlGroup>
      );

      expect(getAllByTestId('direction')[0]).toHaveTextContent('vertical');
    });
  });
});
