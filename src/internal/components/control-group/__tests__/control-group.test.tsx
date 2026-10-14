// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import FormField from '../../../../../lib/components/form-field';
import Input from '../../../../../lib/components/input';
import ControlGroup from '../../../../../lib/components/internal/components/control-group';
import { ResetGroupedControlContext } from '../../../../../lib/components/internal/context/control-group-context';
import ControlGroupWrapper from '../../../../../lib/components/test-utils/dom/internal/control-group';
import { DirectionProbe, FormFieldValidationProbe, GroupedValidationProbe, PositionProbe } from './common';

import buttonStyles from '../../../../../lib/components/button/styles.selectors.js';
import inputStyles from '../../../../../lib/components/input/styles.selectors.js';
import controlGroupStyles from '../../../../../lib/components/internal/components/control-group/styles.selectors.js';
import controlGroupTestStyles from '../../../../../lib/components/internal/components/control-group/test-classes/styles.selectors.js';

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

    // jsdom cannot compute the resolved border color/width or the focus ring;
    // those are covered by the visual test. Here we assert the state class that
    // drives the SCSS token selection is applied to each grouped control.
    const controlErrorClass = inputStyles['grouped-in-error'];
    const controlWarningClass = inputStyles['grouped-in-warning'];

    test('marks each grouped control with the error state class in an error state', () => {
      const { getAllByRole } = render(
        <FormField errorText="Required">
          <ControlGroup>
            <Input value="" readOnly={true} onChange={() => {}} />
            <Input value="" readOnly={true} onChange={() => {}} />
          </ControlGroup>
        </FormField>
      );

      for (const control of getAllByRole('textbox')) {
        expect(control).toHaveClass(controlErrorClass);
        expect(control).not.toHaveClass(controlWarningClass);
      }
    });

    test('marks a non-leading control with the error state class but not the thick seam class', () => {
      const { getAllByRole } = render(
        <FormField errorText="Required">
          <ControlGroup>
            <Input value="" readOnly={true} onChange={() => {}} />
            <Input value="" readOnly={true} onChange={() => {}} />
          </ControlGroup>
        </FormField>
      );

      const [, last] = getAllByRole('textbox');
      expect(last).toHaveClass(controlErrorClass);
      expect(last).not.toHaveClass(inputStyles['grouped-validation']);
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

    test('marks each grouped control with the warning state class in a warning state', () => {
      const { getAllByRole } = render(
        <FormField warningText="Careful">
          <ControlGroup>
            <Input value="" readOnly={true} onChange={() => {}} />
            <Input value="" readOnly={true} onChange={() => {}} />
          </ControlGroup>
        </FormField>
      );

      for (const control of getAllByRole('textbox')) {
        expect(control).toHaveClass(controlWarningClass);
        expect(control).not.toHaveClass(controlErrorClass);
      }
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

    test('applies no validation state class to a control when the form field is neutral', () => {
      // Without a state class, each grouped control keeps its own neutral border
      // color, so the group looks unchanged.
      const { getByRole } = render(
        <FormField label="Field">
          <ControlGroup>
            <Input value="" readOnly={true} onChange={() => {}} />
          </ControlGroup>
        </FormField>
      );

      const control = getByRole('textbox');
      expect(control).not.toHaveClass(controlErrorClass);
      expect(control).not.toHaveClass(controlWarningClass);
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
    });

    test('error takes precedence over warning on the control state class', () => {
      const { getByRole } = render(
        <FormField errorText="Required" warningText="Careful">
          <ControlGroup>
            <Input value="" readOnly={true} onChange={() => {}} />
          </ControlGroup>
        </FormField>
      );

      const control = getByRole('textbox');
      expect(control).toHaveClass(inputStyles['grouped-in-error']);
      expect(control).not.toHaveClass(inputStyles['grouped-in-warning']);
    });

    test('applies the matching action-button validation class only in a validation state', () => {
      const errorActionClass = buttonStyles['variant-control-group-action-error'];
      const warningActionClass = buttonStyles['variant-control-group-action-warning'];

      function renderActionButton(field: Record<string, string>) {
        const { container } = render(
          <FormField {...field}>
            <ControlGroup inlineLabelText="Threshold" actionButton={{ iconName: 'remove', ariaLabel: 'Remove' }}>
              <input data-testid="alpha" />
            </ControlGroup>
          </FormField>
        );
        return findControlGroup(container)!.findActionButton()!.getElement();
      }

      // Error: button gets the error variant class only.
      const errorButton = renderActionButton({ errorText: 'Required' });
      expect(errorButton).toHaveClass(errorActionClass);
      expect(errorButton).not.toHaveClass(warningActionClass);

      // Warning: button gets the warning variant class only.
      const warningButton = renderActionButton({ warningText: 'Careful' });
      expect(warningButton).toHaveClass(warningActionClass);
      expect(warningButton).not.toHaveClass(errorActionClass);

      // Error precedence: both texts -> error variant class, not warning.
      const bothButton = renderActionButton({ errorText: 'Required', warningText: 'Careful' });
      expect(bothButton).toHaveClass(errorActionClass);
      expect(bothButton).not.toHaveClass(warningActionClass);

      // Neutral: button carries no state variant class, nor the group's classes.
      const neutralButton = renderActionButton({ label: 'Field' });
      expect(neutralButton).not.toHaveClass(errorActionClass);
      expect(neutralButton).not.toHaveClass(warningActionClass);
      expect(neutralButton).not.toHaveClass(invalidClass);
      expect(neutralButton).not.toHaveClass(warningClass);
      expect(neutralButton).not.toHaveClass(controlGroupTestStyles['controls-invalid']);
      expect(neutralButton).not.toHaveClass(controlGroupTestStyles['controls-warning']);
    });

    // The first/only control on the group's leading edge draws the seam via the
    // `grouped-validation` class. jsdom cannot compute pixel width or `:hover`;
    // those are covered by the visual test.
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

    function renderGroupedInputs(validation: 'error' | 'warning' | 'neutral') {
      const field = validation === 'error' ? { errorText: 'Required' } : { warningText: 'Careful' };
      return render(
        <FormField {...field}>
          <ControlGroup inlineLabelText="Threshold" actionButton={{ iconName: 'remove', ariaLabel: 'Remove' }}>
            <Input value="" readOnly={true} onChange={() => {}} />
            <Input value="" readOnly={true} onChange={() => {}} />
          </ControlGroup>
        </FormField>
      );
    }

    test('draws the seam on the leading control in an error state', () => {
      const { getByRole } = renderGroupedInput('error', true);
      expect(getByRole('textbox')).toHaveClass(seamClass);
    });

    test('draws the seam on the leading control in a warning state', () => {
      const { getByRole } = renderGroupedInput('warning', true);
      expect(getByRole('textbox')).toHaveClass(seamClass);
    });

    test('does not draw the seam on the control when the form field is neutral', () => {
      const { getByRole } = renderGroupedInput('neutral', true);
      expect(getByRole('textbox')).not.toHaveClass(seamClass);
    });

    test('draws the seam on the leading control even without an action button', () => {
      const { getByRole } = renderGroupedInput('error', false);
      expect(getByRole('textbox')).toHaveClass(seamClass);
    });

    test('draws the seam only on the first control, not the last, in a horizontal group', () => {
      const { getAllByRole } = renderGroupedInputs('error');
      const [first, last] = getAllByRole('textbox');
      expect(first).toHaveClass(seamClass);
      expect(last).not.toHaveClass(seamClass);
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
