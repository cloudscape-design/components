// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import FormField from '../../../../../lib/components/form-field';
import ControlGroup from '../../../../../lib/components/internal/components/control-group';
import { ResetGroupedControlContext } from '../../../../../lib/components/internal/context/control-group-context';
import Select from '../../../../../lib/components/select';
import createWrapper from '../../../../../lib/components/test-utils/dom';
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

    const alphaInput = findControlGroup(container)!.findControls()[0].find('input')!.getElement();
    alphaInput.focus();
    expect(document.activeElement).toBe(alphaInput);

    // Move the focused control from first to last position.
    rerender(<ControlGroup>{[beta, alpha]}</ControlGroup>);

    // The same DOM node is still focused; it was moved, not remounted.
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

  describe('FormField validation association', () => {
    const option = { value: '=', label: '=' };
    const renderGroupInFormField = (formFieldProps: {
      label?: string;
      errorText?: string;
      warningText?: string;
      inlineLabelText?: string;
    }) => {
      const { label, errorText, warningText, inlineLabelText } = formFieldProps;
      return render(
        <FormField label={label} errorText={errorText} warningText={warningText}>
          <ControlGroup inlineLabelText={inlineLabelText}>
            <Select ariaLabel="Value" selectedOption={option} options={[option]} onChange={() => {}} />
            <Select ariaLabel="Operator" selectedOption={option} options={[option]} onChange={() => {}} />
          </ControlGroup>
        </FormField>
      );
    };

    test('associates the FormField error with the group as a unit', () => {
      const { container, getByRole } = renderGroupInFormField({ errorText: 'This value is required' });
      const group = getByRole('group');

      expect(group.getAttribute('aria-invalid')).toBe('true');
      const describedby = group.getAttribute('aria-describedby');
      expect(describedby).toBeTruthy();
      // The described-by id resolves to the FormField's error text.
      const describedElement = container.ownerDocument.getElementById(describedby!.split(' ')[0]);
      expect(describedElement).toHaveTextContent('This value is required');
    });

    test('associates the FormField warning with the group without marking it invalid', () => {
      const { container, getByRole } = renderGroupInFormField({ warningText: 'Double-check this value' });
      const group = getByRole('group');

      expect(group.getAttribute('aria-invalid')).toBeNull();
      const describedby = group.getAttribute('aria-describedby');
      expect(describedby).toBeTruthy();
      const describedElement = container.ownerDocument.getElementById(describedby!.split(' ')[0]);
      expect(describedElement).toHaveTextContent('Double-check this value');
    });

    test('leaves the group without validation associations when there is no FormField', () => {
      const { getByRole } = render(
        <ControlGroup>
          <input data-testid="alpha" />
          <input data-testid="beta" />
        </ControlGroup>
      );
      const group = getByRole('group');

      expect(group.getAttribute('aria-describedby')).toBeNull();
      expect(group.getAttribute('aria-invalid')).toBeNull();
    });

    test('merges the FormField label with the inline label on the group', () => {
      const { container, getByRole } = renderGroupInFormField({
        label: 'Metric filter',
        errorText: 'This value is required',
        inlineLabelText: 'Threshold',
      });
      const group = getByRole('group');
      const inlineLabelId = findControlGroup(container)!.findInlineLabel()!.getElement().id;

      const labelledby = group.getAttribute('aria-labelledby')!.split(' ');
      expect(labelledby).toContain(inlineLabelId);
      // Besides the inline label, the FormField's own label id is also referenced.
      expect(labelledby.length).toBeGreaterThan(1);
      // The validation associations remain on the same group element.
      expect(group.getAttribute('aria-invalid')).toBe('true');
      expect(group.getAttribute('aria-describedby')).toBeTruthy();
    });

    test('does not duplicate the validation association onto the inner controls', () => {
      const { container, getByRole } = renderGroupInFormField({ errorText: 'This value is required' });
      const groupDescribedby = getByRole('group').getAttribute('aria-describedby');

      for (const select of createWrapper(container).findAllSelects()) {
        const trigger = select.findTrigger().getElement();
        expect(trigger.getAttribute('aria-describedby')).not.toBe(groupDescribedby);
        expect(trigger.getAttribute('aria-invalid')).toBeNull();
      }
    });
  });

  test('gives each inner control a distinct id when wrapped in a FormField', () => {
    const option = { value: '=', label: '=' };
    const { container } = render(
      <FormField errorText="This value is required">
        <ControlGroup>
          <Select ariaLabel="Value" selectedOption={option} options={[option]} onChange={() => {}} />
          <Select ariaLabel="Operator" selectedOption={option} options={[option]} onChange={() => {}} />
        </ControlGroup>
      </FormField>
    );

    const [first, second] = createWrapper(container).findAllSelects();
    const firstId = first.findTrigger().getElement().id;
    const secondId = second.findTrigger().getElement().id;

    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
  });
});
