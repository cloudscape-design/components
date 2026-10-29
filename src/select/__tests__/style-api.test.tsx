// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';

import dropdownStyles from '../../../lib/components/dropdown/styles.css.js';

const options: SelectProps.Options = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
];

function renderSelect(props: Partial<SelectProps> & { styleClassNames?: Record<string, unknown> } = {}) {
  const { container } = render(
    <Select ariaLabel="Select" options={options} selectedOption={options[0]} onChange={() => {}} {...props} />
  );
  return { container, wrapper: createWrapper(container).findSelect()! };
}

describe('Select Style API v2', () => {
  test('applies the trigger class to the trigger button in the label and option trigger variants', () => {
    for (const triggerVariant of ['label', 'option'] as const) {
      const { wrapper } = renderSelect({ triggerVariant, styleClassNames: { trigger: 'a' } });
      expect(wrapper.findTrigger().getElement()).toHaveClass('a');
      wrapper.openDropdown();
      expect(wrapper.findTrigger().getElement()).toHaveClass('a');
    }
  });

  test('applies the inline label class only when an inline label is rendered and ignores unknown keys', () => {
    const { container, wrapper } = renderSelect({
      inlineLabelText: 'Label',
      styleClassNames: { inlineLabel: 'a', unknown: 'b' },
    });
    expect(wrapper.findInlineLabel()!.getElement()).toHaveClass('a');
    expect(wrapper.findTrigger().getElement()).not.toHaveClass('a');
    expect(container.querySelector('.b')).toBeNull();

    const { container: withoutInlineLabel } = renderSelect({ styleClassNames: { inlineLabel: 'a' } });
    expect(withoutInlineLabel.querySelector('.a')).toBeNull();
  });

  test('forwards the filter classes to the filtering input and the dropdown class to the dropdown container', () => {
    for (const expandToViewport of [false, true]) {
      const { wrapper } = renderSelect({
        filteringType: 'auto',
        expandToViewport,
        styleClassNames: { filter: { root: 'a', input: 'b' }, dropdown: { container: 'c' } },
      });
      wrapper.openDropdown();
      const nativeInput = wrapper.findFilteringInput({ expandToViewport })!.findNativeInput().getElement();
      expect(nativeInput.parentElement).toHaveClass('a');
      expect(nativeInput).toHaveClass('b');
      const panel = wrapper
        .findDropdown({ expandToViewport })
        .findByClassName(dropdownStyles['dropdown-content-wrapper']);
      expect(panel!.getElement()).toHaveClass('c');
    }
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderSelect({ styleClassNames: { trigger: 'a' } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
