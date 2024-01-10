// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import RadioGroup, { RadioGroupProps } from '../../../lib/components/radio-group';
import RadioButtonWrapper from '../../../lib/components/test-utils/dom/radio-group/radio-button';
import '../../__a11y__/to-validate-a11y';
import { renderWithSingleTabStopNavigation } from '../../internal/context/__tests__/utils';

const defaultItems: RadioGroupProps.RadioButtonDefinition[] = [
  { value: 'val1', label: 'Option one' },
  { value: 'val2', label: 'Option two' },
];

function renderRadioGroup(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  return { rerender, wrapper: createWrapper(container.parentElement!).findRadioGroup()! };
}

test('hides the decorative icon from assistive technology', function () {
  const { wrapper } = renderRadioGroup(<RadioGroup name="test" value={null} items={defaultItems} />);
  const svgs = wrapper.findAll('svg');
  expect(svgs).toHaveLength(2);
  for (const svg of svgs) {
    expect(svg.getElement()).toHaveAttribute('focusable', 'false');
    expect(svg.getElement()).toHaveAttribute('aria-hidden', 'true');
  }
});

test('renders attributes for assistive technology when set', function () {
  const ariaLabelledby = 'something';
  const ariaDescribedby = 'something else';
  const ariaLabel = 'the last one';
  const ariaControls = 'some-id-being-controlled';

  const { wrapper } = renderRadioGroup(
    <RadioGroup
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      ariaLabel={ariaLabel}
      ariaControls={ariaControls}
      value={null}
      items={defaultItems}
    />
  );
  const rootElement = wrapper.getElement();
  expect(rootElement).toHaveAttribute('aria-labelledby', ariaLabelledby);
  expect(rootElement).toHaveAttribute('aria-describedby', ariaDescribedby);
  expect(rootElement).toHaveAttribute('aria-label', ariaLabel);
  expect(rootElement).toHaveAttribute('aria-controls', ariaControls);
});

test('does not render attributes for assistive technology when not set', function () {
  const { wrapper } = renderRadioGroup(<RadioGroup value={null} items={defaultItems} />);
  const rootElement = wrapper.getElement();
  expect(rootElement).not.toHaveAttribute('aria-labelledby');
  expect(rootElement).not.toHaveAttribute('aria-describedby');
  expect(rootElement).not.toHaveAttribute('aria-label');
  expect(rootElement).not.toHaveAttribute('aria-controls');
});

describe('name', () => {
  test('propagates its name onto the child inputs', () => {
    const { wrapper } = renderRadioGroup(<RadioGroup name="test" value={null} items={defaultItems} />);
    const inputs = wrapper.findAll('input[name="test"]');
    expect(inputs.length).toBe(2);
  });

  test('generates a random name if not provided', () => {
    const { wrapper, rerender } = renderRadioGroup(<RadioGroup value="val1" name="test" items={defaultItems} />);

    expect(wrapper.findInputByValue('val1')!.getElement().name).toEqual('test');
    expect(wrapper.findInputByValue('val2')!.getElement().name).toEqual('test');

    rerender(<RadioGroup value="val1" items={defaultItems} />);
    expect(wrapper.findInputByValue('val1')!.getElement().name).toMatch(/awsui-radio-\d+/);
    expect(wrapper.findInputByValue('val2')!.getElement().name).toMatch(/awsui-radio-\d+/);
  });
});

describe('items', () => {
  test('renders items', () => {
    const { wrapper } = renderRadioGroup(<RadioGroup value={null} items={defaultItems} />);
    expect(wrapper.findButtons()).toHaveLength(2);
  });

  test('can be disabled', () => {
    const onChange = jest.fn();
    const { wrapper, rerender } = renderRadioGroup(
      <RadioGroup value={null} items={[defaultItems[0], { ...defaultItems[1], disabled: true }]} onChange={onChange} />
    );
    const items = wrapper.findButtons();
    expect(items[0].findNativeInput().getElement()).toBeEnabled();
    expect(items[1].findNativeInput().getElement()).toBeDisabled();

    rerender(<RadioGroup value={null} items={defaultItems} onChange={onChange} />);

    expect(items[0].findNativeInput().getElement()).toBeEnabled();
    expect(items[1].findNativeInput().getElement()).toBeEnabled();
  });

  test('does not trigger change handler if disabled', () => {
    const onChange = jest.fn();
    const { wrapper } = renderRadioGroup(
      <RadioGroup value={null} items={[defaultItems[0], { ...defaultItems[1], disabled: true }]} onChange={onChange} />
    );

    act(() => wrapper.findButtons()[1].findLabel().click());
    expect(onChange).not.toHaveBeenCalled();
  });

  test('displays the proper label', () => {
    const { wrapper } = renderRadioGroup(<RadioGroup value={null} items={[{ value: '1', label: 'Please select' }]} />);

    expect(wrapper.findButtons()[0].findLabel().getElement()).toHaveTextContent('Please select');
  });

  test('displays no label text when label is empty', () => {
    const { wrapper } = renderRadioGroup(<RadioGroup value={null} items={[{ value: '1', label: '' }]} />);
    expect(wrapper.findButtons()[0].findLabel().getElement()).toHaveTextContent('');
  });

  test('displays the description', () => {
    const { wrapper } = renderRadioGroup(
      <RadioGroup
        value={null}
        items={[{ value: '1', label: 'Please select', description: 'Radio description test' }]}
      />
    );
    expect(wrapper.findButtons()[0].findDescription()!.getElement()).toHaveTextContent('Radio description test');
  });

  test('does not display description when it is not defined', () => {
    const { wrapper } = renderRadioGroup(<RadioGroup value={null} items={[{ value: '1', label: 'Please select' }]} />);
    expect(wrapper.findButtons()[0].findDescription()).toBeNull();
  });
});

describe('ref', () => {
  test('when unselected, focuses the first radio button when .focus() is called', () => {
    let radioGroupRef: RadioGroupProps.Ref | null = null;
    const { wrapper } = renderRadioGroup(
      <RadioGroup value={null} items={defaultItems} ref={ref => (radioGroupRef = ref)} />
    );
    radioGroupRef!.focus();
    expect(wrapper.findInputByValue('val1')!.getElement()).toHaveFocus();
  });

  test('when selected, focuses the checked radio button', () => {
    let radioGroupRef: RadioGroupProps.Ref | null = null;
    const { wrapper } = renderRadioGroup(
      <RadioGroup value="val2" items={defaultItems} ref={ref => (radioGroupRef = ref)} />
    );
    radioGroupRef!.focus();
    expect(wrapper.findInputByValue('val2')!.getElement()).toHaveFocus();
  });
});

describe('value', () => {
  test('selects the right button when value changes', () => {
    const { wrapper, rerender } = renderRadioGroup(<RadioGroup value={null} items={defaultItems} />);
    const input1 = wrapper.findInputByValue('val1')!;
    const input2 = wrapper.findInputByValue('val2')!;
    expect(input1.getElement()).not.toBeChecked();
    expect(input2.getElement()).not.toBeChecked();

    rerender(<RadioGroup value="val1" items={defaultItems} />);

    expect(input1.getElement()).toBeChecked();
    expect(input2.getElement()).not.toBeChecked();

    rerender(<RadioGroup value="val2" items={defaultItems} />);
    expect(input1.getElement()).not.toBeChecked();
    expect(input2.getElement()).toBeChecked();
  });

  test('fires change event when a button is selected', () => {
    const onChange = jest.fn();
    const { wrapper } = renderRadioGroup(<RadioGroup value={null} items={defaultItems} onChange={onChange} />);

    wrapper.findInputByValue('val1')!.click();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: 'val1' } }));
  });

  test('does not fire a change event when value changed programmatically', () => {
    const onChange = jest.fn();
    const { rerender } = renderRadioGroup(<RadioGroup value={null} items={defaultItems} onChange={onChange} />);

    rerender(<RadioGroup value="val2" items={defaultItems} onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not update the value without onChange handler (controlled component)', () => {
    const { wrapper } = renderRadioGroup(<RadioGroup value={null} items={defaultItems} />);
    wrapper.findInputByValue('val1')!.click();
    expect(wrapper.findInputByValue('val1')!.getElement()).not.toBeChecked();
  });

  test('updates value via onChange handler (controlled component)', () => {
    function ComponentWrapper() {
      const [value, setValue] = useState<RadioGroupProps['value']>(null);
      return <RadioGroup value={value} items={defaultItems} onChange={event => setValue(event.detail.value)} />;
    }
    const { wrapper } = renderRadioGroup(<ComponentWrapper />);
    wrapper.findInputByValue('val1')!.click();
    expect(wrapper.findInputByValue('val1')!.getElement()).toBeChecked();
  });

  test('deselects all buttons when reset to an empty value', () => {
    const { wrapper, rerender } = renderRadioGroup(<RadioGroup value="val1" items={defaultItems} />);
    const input1 = wrapper.findInputByValue('val1')!;
    const input2 = wrapper.findInputByValue('val2')!;

    expect(input1.getElement()).toBeChecked();

    rerender(<RadioGroup value={null} items={defaultItems} />);
    expect(input1.getElement()).not.toBeChecked();
    expect(input2.getElement()).not.toBeChecked();
  });

  test('Keeps selected item when rerendering', () => {
    const { wrapper, rerender } = renderRadioGroup(<RadioGroup value="val2" items={defaultItems} />);

    expect(wrapper.findInputByValue('val2')!.getElement()).toBeChecked();

    rerender(<RadioGroup value="val2" items={[defaultItems[0], { ...defaultItems[1], label: 'New label...' }]} />);

    expect(wrapper.findButtons()[1].findLabel().getElement()).toHaveTextContent('New label...');
    expect(wrapper.findInputByValue('val2')!.getElement()).toBeChecked();
  });

  describe('radiobutton controlId', () => {
    function check(radioButton: RadioButtonWrapper, controlId: string) {
      expect(radioButton.findNativeInput().getElement()).toHaveAttribute('id', controlId);
      expect(radioButton.findNativeInput().getElement()).toHaveAttribute('aria-labelledby', `${controlId}-label`);
    }

    test('uses controlId for setting up label relations when set', () => {
      const { wrapper } = renderRadioGroup(
        <RadioGroup
          value="val2"
          items={[
            { value: 'val1', label: 'Option one', controlId: 'control-id-1' },
            { value: 'val2', label: 'Option two', controlId: 'control-id-2' },
          ]}
        />
      );

      check(wrapper.findButtons()[0], 'control-id-1');
      check(wrapper.findButtons()[1], 'control-id-2');
    });

    test('generates a own unique ids for setting up label relations when controlId is not set', () => {
      const { wrapper } = renderRadioGroup(<RadioGroup value="val2" items={defaultItems} />);

      const button1 = wrapper.findButtons()[0];
      const id1 = button1.findNativeInput().getElement().id;

      const button2 = wrapper.findButtons()[1];
      const id2 = button2.findNativeInput().getElement().id;

      check(button1, id1);
      check(button2, id2);
      expect(id1).not.toBe(id2);
    });

    test('generates a own unique ids for setting up label relations when controlId is not set', () => {
      const id1 = 'control-id-1';

      const { wrapper } = renderRadioGroup(
        <RadioGroup
          value="val2"
          items={[
            { value: 'val1', label: 'Option one', controlId: id1 },
            { value: 'val2', label: 'Option two' },
          ]}
        />
      );

      const button2 = wrapper.findButtons()[1];
      const id2 = button2.findNativeInput().getElement().id;

      check(wrapper.findButtons()[0], id1);
      check(button2, id2);
      expect(id1).not.toBe(id2);
    });
  });

  describe('aria-required', () => {
    test(`is set for value=true`, () => {
      const { wrapper } = renderRadioGroup(<RadioGroup ariaRequired={true} value={null} items={defaultItems} />);
      expect(wrapper.getElement()).toHaveAttribute('aria-required', 'true');
    });

    test(`is not set for value=true`, () => {
      const { wrapper } = renderRadioGroup(<RadioGroup ariaRequired={false} value={null} items={defaultItems} />);
      expect(wrapper.getElement()).toHaveAttribute('aria-required', 'false');
    });

    test(`is not set for undefined value`, () => {
      const { wrapper } = renderRadioGroup(<RadioGroup value={null} items={defaultItems} />);
      expect(wrapper.getElement()).not.toHaveAttribute('aria-required');
    });

    test('check a11y', async () => {
      const { wrapper } = renderRadioGroup(<RadioGroup ariaRequired={false} value={null} items={defaultItems} />);
      await expect(wrapper.getElement()).toValidateA11y();
    });
  });
});

describe('table grid navigation support', () => {
  function getRadioInput(selector: string) {
    return createWrapper().findRadioGroup(selector)!.findButtons()[0].findNativeInput().getElement();
  }

  test('does not override tab index when keyboard navigation is not active', () => {
    renderWithSingleTabStopNavigation(<RadioGroup id="radio" value={null} items={[{ value: '1', label: 'One' }]} />);
    expect(getRadioInput('#radio')).not.toHaveAttribute('tabIndex');
  });

  test('overrides tab index when keyboard navigation is active', () => {
    const { setCurrentTarget } = renderWithSingleTabStopNavigation(
      <div>
        <RadioGroup id="radio1" value={null} items={[{ value: '1', label: 'One' }]} />
        <RadioGroup id="radio2" value={null} items={[{ value: '2', label: 'Two' }]} />
      </div>
    );
    setCurrentTarget(getRadioInput('#radio1'));
    expect(getRadioInput('#radio1')).toHaveAttribute('tabIndex', '0');
    expect(getRadioInput('#radio2')).toHaveAttribute('tabIndex', '-1');
  });
});
