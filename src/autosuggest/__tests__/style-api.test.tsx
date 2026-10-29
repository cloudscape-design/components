// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import createWrapper from '../../../lib/components/test-utils/dom';

import dropdownStyles from '../../../lib/components/dropdown/styles.css.js';

const options: AutosuggestProps.Options = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
];

function renderAutosuggest(props: Partial<AutosuggestProps> & { styleClassNames?: Record<string, unknown> } = {}) {
  const { container } = render(
    <Autosuggest
      ariaLabel="Autosuggest"
      options={options}
      value=""
      onChange={() => {}}
      enteredTextLabel={value => value}
      {...props}
    />
  );
  return { container, wrapper: createWrapper(container).findAutosuggest()! };
}

describe('Autosuggest Style API v2', () => {
  test('forwards the input classes to the Input slots and ignores unknown keys', () => {
    const { container, wrapper } = renderAutosuggest({
      styleClassNames: { input: { root: 'a', input: 'b', searchIcon: 'c', unknown: 'd' }, unknown: 'e' },
    });
    const nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput.parentElement).toHaveClass('a');
    expect(nativeInput).toHaveClass('b');
    expect(container.querySelector('.c')).toBe(nativeInput.parentElement!.previousElementSibling);
    expect(container.querySelector('.d')).toBeNull();
    expect(container.querySelector('.e')).toBeNull();
  });

  test('forwards the clear button class to the clear button', () => {
    const { wrapper } = renderAutosuggest({ value: 'One', styleClassNames: { input: { clearButton: 'a' } } });
    expect(wrapper.findClearButton()!.getElement()).toHaveClass('a');
  });

  test('forwards the dropdown class to the dropdown container when open', () => {
    for (const expandToViewport of [false, true]) {
      const { wrapper } = renderAutosuggest({ expandToViewport, styleClassNames: { dropdown: { container: 'a' } } });
      wrapper.focus();
      const panel = wrapper
        .findDropdown({ expandToViewport })
        .findByClassName(dropdownStyles['dropdown-content-wrapper']);
      expect(panel!.getElement()).toHaveClass('a');
    }
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderAutosuggest({ styleClassNames: { input: { root: 'a' } } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
