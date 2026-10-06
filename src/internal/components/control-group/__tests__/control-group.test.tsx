// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ControlGroup from '../../../../../lib/components/internal/components/control-group';
import { ResetGroupedControlContext } from '../../../../../lib/components/internal/context/control-group-context';
import Multiselect from '../../../../../lib/components/multiselect';
import { DirectionProbe, PositionProbe } from './common';

import styles from '../../../../../lib/components/internal/components/control-group/styles.css.js';

describe('Control group', () => {
  test('keeps focus on a control when the children are reordered', () => {
    const alpha = <input key="alpha" data-testid="alpha" />;
    const beta = <input key="beta" data-testid="beta" />;

    const { getByTestId, rerender } = render(<ControlGroup>{[alpha, beta]}</ControlGroup>);

    const alphaInput = getByTestId('alpha');
    alphaInput.focus();
    expect(document.activeElement).toBe(alphaInput);

    // Move the focused control from first to last position.
    rerender(<ControlGroup>{[beta, alpha]}</ControlGroup>);

    // The same DOM node is still focused; it was moved, not remounted.
    expect(getByTestId('alpha')).toBe(alphaInput);
    expect(document.activeElement).toBe(alphaInput);
  });

  describe('position', () => {
    test('exposes the "only" position to a single child control', () => {
      const { getByTestId } = render(
        <ControlGroup>
          <PositionProbe />
        </ControlGroup>
      );

      expect(getByTestId('probe')).toHaveTextContent('only');
    });

    test('exposes first / middle / last positions to each child in order', () => {
      const { getByTestId } = render(
        <ControlGroup>
          <PositionProbe testId="a" />
          <PositionProbe testId="b" />
          <PositionProbe testId="c" />
        </ControlGroup>
      );

      expect(getByTestId('a')).toHaveTextContent('first');
      expect(getByTestId('b')).toHaveTextContent('middle');
      expect(getByTestId('c')).toHaveTextContent('last');
    });

    test('resets the grouped position for content wrapped in ResetGroupedControlContext', () => {
      // Mirrors a nested control rendered inside a control's custom slot (e.g.
      // Autosuggest `empty`): it must not inherit the surrounding group position.
      const { getByTestId } = render(
        <ControlGroup>
          <ResetGroupedControlContext>
            <PositionProbe />
          </ResetGroupedControlContext>
        </ControlGroup>
      );

      expect(getByTestId('probe')).toHaveTextContent('none');
    });
  });

  describe('direction', () => {
    test('defaults the direction to "horizontal" and exposes it to each child', () => {
      const { getByTestId } = render(
        <ControlGroup>
          <DirectionProbe testId="a" />
          <DirectionProbe testId="b" />
        </ControlGroup>
      );

      expect(getByTestId('a')).toHaveTextContent('horizontal');
      expect(getByTestId('b')).toHaveTextContent('horizontal');
    });

    test('exposes direction="vertical" to each child when the group is vertical', () => {
      const { getByTestId } = render(
        <ControlGroup direction="vertical">
          <DirectionProbe testId="a" />
          <DirectionProbe testId="b" />
          <DirectionProbe testId="c" />
        </ControlGroup>
      );

      expect(getByTestId('a')).toHaveTextContent('vertical');
      expect(getByTestId('b')).toHaveTextContent('vertical');
      expect(getByTestId('c')).toHaveTextContent('vertical');
    });

    test('ResetGroupedControlContext preserves the group direction', () => {
      const { getByTestId } = render(
        <ControlGroup direction="vertical">
          <ResetGroupedControlContext>
            <DirectionProbe testId="direction" />
          </ResetGroupedControlContext>
        </ControlGroup>
      );

      expect(getByTestId('direction')).toHaveTextContent('vertical');
    });
  });

  test('renders the inline label and wires it to the group via aria-labelledby', () => {
    const { getByRole, getByText } = render(
      <ControlGroup inlineLabelText="Threshold">
        <input data-testid="alpha" />
        <input data-testid="beta" />
      </ControlGroup>
    );

    const group = getByRole('group');
    const label = getByText('Threshold');

    expect(label.id).toBeTruthy();
    expect(group.getAttribute('aria-labelledby')).toBe(label.id);
  });

  test('applies the inline-token clearance class on the label when a child is a Multiselect', () => {
    const { getByText } = render(
      <ControlGroup inlineLabelText="Threshold">
        <Multiselect selectedOptions={[]} options={[]} inlineTokens={true} />
        <input data-testid="beta" />
      </ControlGroup>
    );

    expect(getByText('Threshold')).toHaveClass(styles['inline-label-inline-tokens']);
  });

  test('does not apply the inline-token clearance class when no child is a Multiselect', () => {
    const { getByText } = render(
      <ControlGroup inlineLabelText="Threshold">
        <input data-testid="alpha" />
        <input data-testid="beta" />
      </ControlGroup>
    );

    expect(getByText('Threshold')).not.toHaveClass(styles['inline-label-inline-tokens']);
  });

  test('omits the inline label and aria-labelledby when inlineLabelText is not set', () => {
    const { getByRole, queryByText } = render(
      <ControlGroup>
        <input data-testid="alpha" />
        <input data-testid="beta" />
      </ControlGroup>
    );

    expect(getByRole('group').getAttribute('aria-labelledby')).toBeNull();
    expect(queryByText('Threshold')).toBeNull();
  });
});
