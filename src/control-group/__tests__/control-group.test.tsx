// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import ControlGroup, { ControlGroupProps } from '../../../lib/components/control-group';
import FormField from '../../../lib/components/form-field';
import Input from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockClear();
});

function renderControlGroup(props: Partial<ControlGroupProps> & { ariaLabel: string }) {
  const { container } = render(
    <ControlGroup {...props}>
      {props.children ?? (
        <>
          <Input value="a" onChange={() => {}} />
          <Input value="b" onChange={() => {}} />
        </>
      )}
    </ControlGroup>
  );
  return createWrapper(container).findControlGroup()!;
}

describe('ControlGroup', () => {
  test('renders a group element with role="group" and the provided aria-label', () => {
    const wrapper = renderControlGroup({ ariaLabel: 'Label matcher' });
    const group = wrapper.find('[role="group"]')!.getElement();

    expect(group).toHaveAttribute('role', 'group');
    expect(group).toHaveAttribute('aria-label', 'Label matcher');
  });

  test('renders each child in a control slot in DOM order', () => {
    const wrapper = renderControlGroup({
      ariaLabel: 'Label matcher',
      children: (
        <>
          <button id="first" />
          <button id="second" />
          <button id="third" />
        </>
      ),
    });

    const controls = wrapper.findControls();
    expect(controls).toHaveLength(3);
    expect(controls[0].find('button')!.getElement()).toHaveAttribute('id', 'first');
    expect(controls[1].find('button')!.getElement()).toHaveAttribute('id', 'second');
    expect(controls[2].find('button')!.getElement()).toHaveAttribute('id', 'third');
  });

  test('flattens fragments and arrays into individual control slots', () => {
    const wrapper = renderControlGroup({
      ariaLabel: 'Label matcher',
      children: (
        <>
          {[<button key="a" id="a" />, <button key="b" id="b" />]}
          <button id="c" />
        </>
      ),
    });

    expect(wrapper.findControls()).toHaveLength(3);
  });

  describe('validation and description', () => {
    test('renders the error text and associates it with the group via aria-describedby', () => {
      const wrapper = renderControlGroup({ ariaLabel: 'Label matcher', errorText: 'Something is wrong' });

      const error = wrapper.findError()!;
      expect(error.getElement()).toHaveTextContent('Something is wrong');

      const group = wrapper.find('[role="group"]')!.getElement();
      const describedBy = group.getAttribute('aria-describedby');
      expect(describedBy).toContain(error.getElement().parentElement!.id);
    });

    test('renders the warning text and associates it with the group via aria-describedby', () => {
      const wrapper = renderControlGroup({ ariaLabel: 'Label matcher', warningText: 'Careful now' });

      const warning = wrapper.findWarning()!;
      expect(warning.getElement()).toHaveTextContent('Careful now');

      const group = wrapper.find('[role="group"]')!.getElement();
      expect(group.getAttribute('aria-describedby')).toContain(warning.getElement().parentElement!.id);
    });

    test('renders the description and associates it with the group via aria-describedby', () => {
      const wrapper = renderControlGroup({ ariaLabel: 'Label matcher', description: 'Pick a value' });

      const description = wrapper.findDescription()!;
      expect(description.getElement()).toHaveTextContent('Pick a value');

      const group = wrapper.find('[role="group"]')!.getElement();
      expect(group.getAttribute('aria-describedby')).toContain(description.getElement().id);
    });

    test('error takes precedence over warning', () => {
      const wrapper = renderControlGroup({
        ariaLabel: 'Label matcher',
        errorText: 'Error wins',
        warningText: 'Hidden warning',
      });

      expect(wrapper.findError()!.getElement()).toHaveTextContent('Error wins');
      expect(wrapper.findWarning()).toBeNull();
    });

    test('renders no hints region when there is no error, warning, or description', () => {
      const wrapper = renderControlGroup({ ariaLabel: 'Label matcher' });

      expect(wrapper.findError()).toBeNull();
      expect(wrapper.findWarning()).toBeNull();
      expect(wrapper.findDescription()).toBeNull();
      expect(wrapper.find('[role="group"]')!.getElement()).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('form field context propagation', () => {
    test('marks child controls as invalid when errorText is set', () => {
      const wrapper = renderControlGroup({
        ariaLabel: 'Label matcher',
        errorText: 'Invalid',
        children: <Input value="a" onChange={() => {}} />,
      });

      const input = wrapper.findControls()[0].find('input')!.getElement();
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('passes the group aria-describedby down to child controls', () => {
      const wrapper = renderControlGroup({
        ariaLabel: 'Label matcher',
        errorText: 'Invalid',
        children: <Input value="a" onChange={() => {}} />,
      });

      const group = wrapper.find('[role="group"]')!.getElement();
      const input = wrapper.findControls()[0].find('input')!.getElement();
      expect(input.getAttribute('aria-describedby')).toEqual(group.getAttribute('aria-describedby'));
    });
  });

  describe('dismissible', () => {
    test('does not render a remove button by default', () => {
      const wrapper = renderControlGroup({ ariaLabel: 'Label matcher' });
      expect(wrapper.findDismissButton()).toBeNull();
    });

    test('renders a remove button as the last control when dismissible is set', () => {
      const wrapper = renderControlGroup({
        ariaLabel: 'Label matcher',
        dismissible: true,
        i18nStrings: { dismissAriaLabel: 'Remove' },
        children: (
          <>
            <Input value="a" onChange={() => {}} />
            <Input value="b" onChange={() => {}} />
          </>
        ),
      });

      const dismissButton = wrapper.findDismissButton();
      expect(dismissButton).not.toBeNull();
      expect(dismissButton!.getElement()).toHaveAttribute('aria-label', 'Remove');

      // It is rendered in its own control slot as the last one.
      const controls = wrapper.findControls();
      expect(controls[controls.length - 1].findButton()).not.toBeNull();
    });

    test('calls onDismiss when the remove button is clicked', () => {
      const onDismiss = jest.fn();
      const { container } = render(
        <ControlGroup ariaLabel="Label matcher" dismissible={true} onDismiss={onDismiss}>
          <Input value="a" onChange={() => {}} />
        </ControlGroup>
      );
      const wrapper = createWrapper(container).findControlGroup()!;

      wrapper.findDismissButton()!.click();
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    test('supports ariaLabelledby instead of ariaLabel', () => {
      const { container } = render(
        <>
          <span id="group-heading">Label matcher</span>
          <ControlGroup ariaLabelledby="group-heading">
            <Input value="a" onChange={() => {}} />
          </ControlGroup>
        </>
      );
      const group = createWrapper(container).findControlGroup()!.find('[role="group"]')!.getElement();
      expect(group).toHaveAttribute('aria-labelledby', 'group-heading');
      expect(group).not.toHaveAttribute('aria-label');
    });

    test('merges the group aria-describedby with a describedby inherited from an enclosing FormField', () => {
      const { container } = render(
        <FormField label="Field" description="Field description" errorText="Field error">
          <ControlGroup ariaLabel="Label matcher" errorText="Group error">
            <Input value="a" onChange={() => {}} />
          </ControlGroup>
        </FormField>
      );
      const wrapper = createWrapper(container).findControlGroup()!;
      const group = wrapper.find('[role="group"]')!.getElement();
      const input = wrapper.findControls()[0].find('input')!.getElement();

      const groupDescribedby = group.getAttribute('aria-describedby') ?? '';
      const inputDescribedby = input.getAttribute('aria-describedby') ?? '';

      // The group points only at its own messages; the child additionally inherits
      // the FormField's describedby ids.
      expect(inputDescribedby.split(' ')).toEqual(expect.arrayContaining(groupDescribedby.split(' ')));
      expect(inputDescribedby.length).toBeGreaterThan(groupDescribedby.length);
    });

    test('warns when neither ariaLabel nor ariaLabelledby is provided', () => {
      render(
        <ControlGroup>
          <Input value="a" onChange={() => {}} />
        </ControlGroup>
      );
      expect(warnOnce).toHaveBeenCalledWith('ControlGroup', expect.stringContaining('ariaLabel'));
    });

    test('warns when dismissible is set without a dismiss aria label', () => {
      render(
        <ControlGroup ariaLabel="Label matcher" dismissible={true} onDismiss={() => {}}>
          <Input value="a" onChange={() => {}} />
        </ControlGroup>
      );
      expect(warnOnce).toHaveBeenCalledWith('ControlGroup', expect.stringContaining('dismissAriaLabel'));
    });
  });

  test('applies id and className from base props to the root element', () => {
    const { container } = render(
      <ControlGroup ariaLabel="Label matcher" id="my-group" className="my-class">
        <button />
      </ControlGroup>
    );
    const root = createWrapper(container).findControlGroup()!.getElement();
    expect(root).toHaveAttribute('id', 'my-group');
    expect(root).toHaveClass('my-class');
  });
});
