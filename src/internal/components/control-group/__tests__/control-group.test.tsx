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

    const { container, rerender } = render(<ControlGroup>{[alpha, beta]}</ControlGroup>);

    // findControls() returns only the real control slots (never the measurement ghost's copies),
    // so indexing by position is unambiguous.
    const alphaInput = findControlGroup(container)!.findControls()[0].find('input')!.getElement();
    alphaInput.focus();
    expect(document.activeElement).toBe(alphaInput);

    // Move the focused control from first to last position.
    rerender(<ControlGroup>{[beta, alpha]}</ControlGroup>);

    // The same DOM node is still focused; it was moved (now last), not remounted.
    expect(findControlGroup(container)!.findControls()[1].find('input')!.getElement()).toBe(alphaInput);
    expect(document.activeElement).toBe(alphaInput);
  });

  describe('position', () => {
    test('exposes the "only" position to a single child control', () => {
      const { container } = render(
        <ControlGroup>
          <PositionProbe />
        </ControlGroup>
      );

      expect(findControlGroup(container)!.findControls()[0].getElement()).toHaveTextContent('only');
    });

    test('exposes first / middle / last positions to each child in order', () => {
      const { container } = render(
        <ControlGroup>
          <PositionProbe />
          <PositionProbe />
          <PositionProbe />
        </ControlGroup>
      );

      const controls = findControlGroup(container)!.findControls();
      expect(controls[0].getElement()).toHaveTextContent('first');
      expect(controls[1].getElement()).toHaveTextContent('middle');
      expect(controls[2].getElement()).toHaveTextContent('last');
    });

    test('resets the grouped position for content wrapped in ResetGroupedControlContext', () => {
      // Mirrors a nested control rendered inside a control's custom slot (e.g.
      // Autosuggest `empty`): it must not inherit the surrounding group position.
      const { container } = render(
        <ControlGroup>
          <ResetGroupedControlContext>
            <PositionProbe />
          </ResetGroupedControlContext>
        </ControlGroup>
      );

      expect(findControlGroup(container)!.findControls()[0].getElement()).toHaveTextContent('none');
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
      const { container } = render(
        <ControlGroup>
          <DirectionProbe />
          <DirectionProbe />
        </ControlGroup>
      );

      const controls = findControlGroup(container)!.findControls();
      expect(controls[0].getElement()).toHaveTextContent('horizontal');
      expect(controls[1].getElement()).toHaveTextContent('horizontal');
    });

    test('exposes direction="vertical" to each child when the group is vertical', () => {
      const { container } = render(
        <ControlGroup direction="vertical">
          <DirectionProbe />
          <DirectionProbe />
          <DirectionProbe />
        </ControlGroup>
      );

      const controls = findControlGroup(container)!.findControls();
      expect(controls[0].getElement()).toHaveTextContent('vertical');
      expect(controls[1].getElement()).toHaveTextContent('vertical');
      expect(controls[2].getElement()).toHaveTextContent('vertical');
    });

    test('ResetGroupedControlContext preserves the group direction', () => {
      const { container } = render(
        <ControlGroup direction="vertical">
          <ResetGroupedControlContext>
            <DirectionProbe />
          </ResetGroupedControlContext>
        </ControlGroup>
      );

      expect(findControlGroup(container)!.findControls()[0].getElement()).toHaveTextContent('vertical');
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
