// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ControlGroup, { ControlGroupProps } from '../../../lib/components/control-group';
import Input from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';

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
