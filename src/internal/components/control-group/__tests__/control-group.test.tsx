// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ControlGroup from '../../../../../lib/components/internal/components/control-group';
import { ResetGroupedControlContext } from '../../../../../lib/components/internal/context/control-group-context';
import ControlGroupWrapper from '../../../../../lib/components/test-utils/dom/internal/control-group';
import { DirectionProbe, PositionProbe } from './common';

function findControlGroup(container: HTMLElement) {
  const element = container.querySelector<HTMLElement>(`.${ControlGroupWrapper.rootSelector}`);
  return element && new ControlGroupWrapper(element);
}

describe('Control group', () => {
  test('keeps focus on a control when the children are reordered', () => {
    const alpha = <input key="alpha" data-testid="alpha" />;
    const beta = <input key="beta" data-testid="beta" />;

    const { getAllByTestId, rerender } = render(<ControlGroup>{[alpha, beta]}</ControlGroup>);

    // The measurement ghost matches the test id too; the first match is the real control.
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
    test('exposes the "only" position to a single child control', () => {
      const { getAllByTestId } = render(
        <ControlGroup>
          <PositionProbe />
        </ControlGroup>
      );

      // The measurement ghost matches the test id too; the first match is the real control.
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

      // The measurement ghost matches the test id too; the first match is the real control.
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

      // The measurement ghost matches the test id too; the first match is the real control.
      expect(getAllByTestId('probe')[0]).toHaveTextContent('none');
    });
  });

  describe('actionButton', () => {
    test('renders a button inside an action-slot element when actionButton is provided', () => {
      const { container } = render(
        <ControlGroup inlineLabelText="Threshold" actionButton={{ iconName: 'remove', ariaLabel: 'Remove' }}>
          <input data-testid="control" />
        </ControlGroup>
      );

      const actionButton = findControlGroup(container)!.findActionButton();
      expect(actionButton).not.toBeNull();
      expect(actionButton!.getElement()).toHaveAccessibleName('Remove');
    });

    test('renders no action-slot element when actionButton is absent', () => {
      const { container } = render(
        <ControlGroup inlineLabelText="Threshold">
          <input data-testid="control" />
        </ControlGroup>
      );

      expect(findControlGroup(container)!.findActionButton()).toBeNull();
    });

    test('calls onClick when the action button is clicked', () => {
      const onClick = jest.fn();
      const { container } = render(
        <ControlGroup inlineLabelText="Threshold" actionButton={{ iconName: 'remove', ariaLabel: 'Remove', onClick }}>
          <input data-testid="control" />
        </ControlGroup>
      );

      const actionButton = findControlGroup(container)!.findActionButton()!;
      actionButton.click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('direction', () => {
    // In jsdom there's no layout, so auto never stacks and defaults to horizontal.
    test('defaults the direction to "horizontal" and exposes it to each child', () => {
      const { getAllByTestId } = render(
        <ControlGroup>
          <DirectionProbe testId="a" />
          <DirectionProbe testId="b" />
        </ControlGroup>
      );

      // The measurement ghost matches the test id too; the first match is the real control.
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

      // The measurement ghost matches the test id too; the first match is the real control.
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

      // The measurement ghost matches the test id too; the first match is the real control.
      expect(getAllByTestId('direction')[0]).toHaveTextContent('vertical');
    });
  });

  test('renders the inline label and wires it to the group via aria-labelledby', () => {
    const { container, getByRole } = render(
      <ControlGroup inlineLabelText="Threshold">
        <input data-testid="alpha" />
        <input data-testid="beta" />
      </ControlGroup>
    );

    const group = getByRole('group');
    const label = findControlGroup(container)!.findInlineLabel()!.getElement();
    expect(label).toHaveTextContent('Threshold');
    expect(label.id).toBeTruthy();
    expect(group.getAttribute('aria-labelledby')).toBe(label.id);
  });

  test('omits the inline label and aria-labelledby when inlineLabelText is not set', () => {
    const { container, getByRole } = render(
      <ControlGroup>
        <input data-testid="alpha" />
        <input data-testid="beta" />
      </ControlGroup>
    );

    expect(getByRole('group').getAttribute('aria-labelledby')).toBeNull();
    expect(findControlGroup(container)!.findInlineLabel()).toBeNull();
  });
});
