// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import FormField from '../../../../../lib/components/form-field';
import Input from '../../../../../lib/components/input';
import ControlGroup from '../../../../../lib/components/internal/components/control-group';
import { ResetGroupedControlContext } from '../../../../../lib/components/internal/context/control-group-context';
import customCssProps from '../../../../../lib/components/internal/generated/custom-css-properties';
import {
  colorTextStatusError,
  colorTextStatusWarning,
} from '../../../../../lib/components/internal/generated/styles/tokens';
import ControlGroupWrapper from '../../../../../lib/components/test-utils/dom/internal/control-group';
import { DirectionProbe, FormFieldValidationProbe, GroupedValidationProbe, PositionProbe } from './common';

import inputStyles from '../../../../../lib/components/input/styles.selectors.js';
import controlGroupStyles from '../../../../../lib/components/internal/components/control-group/styles.selectors.js';
import controlGroupTestStyles from '../../../../../lib/components/internal/components/control-group/test-classes/styles.selectors.js';

const borderColorProp = customCssProps.groupedControlBorderColor;

function findControlGroup(container: HTMLElement) {
  const element = container.querySelector<HTMLElement>(`.${ControlGroupWrapper.rootSelector}`);
  return element && new ControlGroupWrapper(element);
}

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
    expect(findControlGroup(container)?.findInlineLabel()).toBeNull();
  });

  describe('validation', () => {
    const invalidClass = controlGroupStyles['controls-invalid'];
    const warningClass = controlGroupStyles['controls-warning'];

    test('applies the error class to the group when the surrounding form field is in an error state', () => {
      const { getByRole } = render(
        <FormField errorText="Required">
          <ControlGroup>
            <input data-testid="alpha" />
            <input data-testid="beta" />
          </ControlGroup>
        </FormField>
      );

      const group = getByRole('group');
      expect(group).toHaveClass(invalidClass);
      expect(group).toHaveClass(controlGroupTestStyles['controls-invalid']);
      expect(group).not.toHaveClass(warningClass);
    });

    test('publishes the error color through the grouped-control border custom property', () => {
      // The group sets the custom property inline on `.controls`; every grouped
      // control then reads it on exactly its outward-facing border edges.
      const { getByRole } = render(
        <FormField errorText="Required">
          <ControlGroup>
            <input data-testid="alpha" />
            <input data-testid="beta" />
          </ControlGroup>
        </FormField>
      );

      const group = getByRole('group');
      expect(group.style.getPropertyValue(borderColorProp)).toBe(colorTextStatusError);
    });

    test('applies the warning class to the group when the surrounding form field is in a warning state', () => {
      const { getByRole } = render(
        <FormField warningText="Careful">
          <ControlGroup>
            <input data-testid="alpha" />
            <input data-testid="beta" />
          </ControlGroup>
        </FormField>
      );

      const group = getByRole('group');
      expect(group).toHaveClass(warningClass);
      expect(group).toHaveClass(controlGroupTestStyles['controls-warning']);
      expect(group).not.toHaveClass(invalidClass);
    });

    test('publishes the warning color through the grouped-control border custom property', () => {
      const { getByRole } = render(
        <FormField warningText="Careful">
          <ControlGroup>
            <input data-testid="alpha" />
            <input data-testid="beta" />
          </ControlGroup>
        </FormField>
      );

      const group = getByRole('group');
      expect(group.style.getPropertyValue(borderColorProp)).toBe(colorTextStatusWarning);
    });

    test('applies no validation class when the surrounding form field is neutral', () => {
      const { getByRole } = render(
        <FormField label="Field">
          <ControlGroup>
            <input data-testid="alpha" />
          </ControlGroup>
        </FormField>
      );

      const group = getByRole('group');
      expect(group).not.toHaveClass(invalidClass);
      expect(group).not.toHaveClass(warningClass);
    });

    test('does not set the border custom property when the surrounding form field is neutral', () => {
      // With the property unset, each grouped control's `var()` falls back to its
      // own neutral border color, so the group looks unchanged.
      const { getByRole } = render(
        <FormField label="Field">
          <ControlGroup>
            <input data-testid="alpha" />
          </ControlGroup>
        </FormField>
      );

      const group = getByRole('group');
      expect(group.style.getPropertyValue(borderColorProp)).toBe('');
    });

    test('error takes precedence over warning when the form field has both', () => {
      const { getByRole } = render(
        <FormField errorText="Required" warningText="Careful">
          <ControlGroup>
            <input data-testid="alpha" />
          </ControlGroup>
        </FormField>
      );

      const group = getByRole('group');
      expect(group).toHaveClass(invalidClass);
      expect(group).not.toHaveClass(warningClass);
      // Precedence also holds for the published color.
      expect(group.style.getPropertyValue(borderColorProp)).toBe(colorTextStatusError);
    });

    test('does not apply the group validation class to the action button element', () => {
      const { container, getByRole } = render(
        <FormField errorText="Required">
          <ControlGroup inlineLabelText="Threshold" actionButton={{ iconName: 'remove', ariaLabel: 'Remove' }}>
            <input data-testid="alpha" />
          </ControlGroup>
        </FormField>
      );

      // The group (`.controls`) carries the state and the custom property. The
      // button carries neither validation markers nor the border custom property.
      const group = getByRole('group');
      expect(group).toHaveClass(invalidClass);
      expect(group.style.getPropertyValue(borderColorProp)).toBe(colorTextStatusError);

      const actionButton = findControlGroup(container)!.findActionButton()!.getElement();
      expect(actionButton).not.toHaveClass(invalidClass);
      expect(actionButton).not.toHaveClass(warningClass);
      expect(actionButton).not.toHaveClass(controlGroupTestStyles['controls-invalid']);
      expect(actionButton).not.toHaveClass(controlGroupTestStyles['controls-warning']);
      expect(actionButton.style.getPropertyValue(borderColorProp)).toBe('');
    });

    // The last/only control facing the action button draws the seam: it carries
    // the `grouped-validation` class, which the shared mixin uses to apply the
    // thick inline-end border. jsdom cannot compute the SCSS pixel width or the
    // `:hover` persistence, so the testable surface is this gating class; the
    // actual width and hover persistence are covered by the visual test.
    const seamClass = inputStyles['grouped-validation'];

    function renderGroupedInput(validation: 'error' | 'warning' | 'neutral', withAction: boolean) {
      const field =
        validation === 'error'
          ? { errorText: 'Required' }
          : validation === 'warning'
            ? { warningText: 'Careful' }
            : { label: 'Field' };
      return render(
        <FormField {...field}>
          <ControlGroup
            inlineLabelText="Threshold"
            actionButton={withAction ? { iconName: 'remove', ariaLabel: 'Remove' } : undefined}
          >
            <Input value="" readOnly={true} onChange={() => {}} />
          </ControlGroup>
        </FormField>
      );
    }

    test('draws the seam on the control facing the action button in an error state', () => {
      const { getByRole } = renderGroupedInput('error', true);
      expect(getByRole('textbox')).toHaveClass(seamClass);
    });

    test('draws the seam on the control facing the action button in a warning state', () => {
      const { getByRole } = renderGroupedInput('warning', true);
      expect(getByRole('textbox')).toHaveClass(seamClass);
    });

    test('does not draw the seam on the control when the form field is neutral', () => {
      const { getByRole } = renderGroupedInput('neutral', true);
      expect(getByRole('textbox')).not.toHaveClass(seamClass);
    });

    test('does not draw the seam on the control when a validation state has no action button', () => {
      const { getByRole } = renderGroupedInput('error', false);
      expect(getByRole('textbox')).not.toHaveClass(seamClass);
    });

    test('keeps the seam class off the group element so only the control carries it', () => {
      const { getByRole } = renderGroupedInput('error', true);
      expect(getByRole('group')).not.toHaveClass(seamClass);
    });

    test('masks the validation state for inner controls so seams stay neutral (error)', () => {
      const { getByTestId } = render(
        <FormField errorText="Required">
          <ControlGroup>
            <FormFieldValidationProbe />
          </ControlGroup>
        </FormField>
      );

      // The child reads neutral validation flags: it will not paint its own
      // border or inner seams.
      expect(getByTestId('form-field-probe')).toHaveTextContent('invalid:false warning:false');
    });

    test('masks the validation state for inner controls so seams stay neutral (warning)', () => {
      const { getByTestId } = render(
        <FormField warningText="Careful">
          <ControlGroup>
            <FormFieldValidationProbe />
          </ControlGroup>
        </FormField>
      );

      expect(getByTestId('form-field-probe')).toHaveTextContent('invalid:false warning:false');
    });

    test('exposes the resolved validation state through the grouped-control context', () => {
      const { getByTestId } = render(
        <FormField errorText="Required">
          <ControlGroup>
            <GroupedValidationProbe />
          </ControlGroup>
        </FormField>
      );

      expect(getByTestId('grouped-probe')).toHaveTextContent('invalid:true warning:false');
    });
  });
});
