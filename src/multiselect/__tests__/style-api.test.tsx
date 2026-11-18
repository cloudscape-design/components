// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Multiselect, { MultiselectProps } from '../../../lib/components/multiselect';
import createWrapper from '../../../lib/components/test-utils/dom';

import dropdownStyles from '../../../lib/components/dropdown/styles.css.js';
import tokenStyles from '../../../lib/components/token/styles.css.js';

const options: MultiselectProps.Options = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
];

function renderMultiselect(props: Partial<MultiselectProps> & { styleClassNames?: Record<string, unknown> } = {}) {
  const { container } = render(
    <Multiselect
      ariaLabel="Multiselect"
      options={options}
      selectedOptions={options}
      deselectAriaLabel={option => `Remove ${option.label}`}
      onChange={() => {}}
      {...props}
    />
  );
  return { container, wrapper: createWrapper(container).findMultiselect()! };
}

describe('Multiselect Style API v2', () => {
  test('applies the trigger class to the trigger button with tokens below and inline, and ignores unknown keys', () => {
    for (const inlineTokens of [false, true]) {
      const { container, wrapper } = renderMultiselect({
        inlineTokens,
        styleClassNames: { trigger: 'a', unknown: 'b' },
      });
      expect(wrapper.findTrigger().getElement()).toHaveClass('a');
      wrapper.openDropdown();
      expect(wrapper.findTrigger().getElement()).toHaveClass('a');
      expect(container.querySelector('.b')).toBeNull();
    }
  });

  test('applies the inline label class only when an inline label is rendered', () => {
    const { wrapper } = renderMultiselect({ inlineLabelText: 'Label', styleClassNames: { inlineLabel: 'a' } });
    expect(wrapper.findInlineLabel()!.getElement()).toHaveClass('a');
    expect(wrapper.findTrigger().getElement()).not.toHaveClass('a');

    const { container } = renderMultiselect({ styleClassNames: { inlineLabel: 'a' } });
    expect(container.querySelector('.a')).toBeNull();
  });

  test('forwards the filter classes to the filtering input and the dropdown class to the dropdown container', () => {
    for (const expandToViewport of [false, true]) {
      const { wrapper } = renderMultiselect({
        filteringType: 'auto',
        expandToViewport,
        styleClassNames: { filter: { root: 'a', input: 'b' }, dropdown: 'c' },
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

  test('forwards the token classes to every token below the trigger', () => {
    const { wrapper } = renderMultiselect({ styleClassNames: { token: { root: 'a', dismissButton: 'b' } } });
    const tokens = wrapper.findTokens();
    expect(tokens).toHaveLength(2);
    for (const token of tokens) {
      const dismissButton = token.findDismiss().getElement();
      expect(dismissButton).toHaveClass('b');
      expect(dismissButton.parentElement).toHaveClass('a');
    }
  });

  test('forwards the token root class to every inline token', () => {
    const { container, wrapper } = renderMultiselect({
      inlineTokens: true,
      styleClassNames: { token: { root: 'a', dismissButton: 'b' } },
    });
    const inlineTokens = wrapper.findInlineTokens();
    expect(inlineTokens).toHaveLength(2);
    for (const token of inlineTokens) {
      expect(token.findByClassName(tokenStyles['token-box-inline'])!.getElement()).toHaveClass('a');
    }
    expect(container.querySelector('.b')).toBeNull();
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderMultiselect({ styleClassNames: { trigger: 'a' } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
