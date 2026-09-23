// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Dropdown from '../../../lib/components/dropdown';

import styles from '../../../lib/components/dropdown/styles.css.js';

const panelSelector = `.${styles['dropdown-content-wrapper']}`;

function renderDropdown(props: Record<string, unknown> = {}) {
  return render(<Dropdown trigger={<button>Trigger</button>} open={true} content={<div>Content</div>} {...props} />);
}

describe('Dropdown Style API v2', () => {
  test('applies styleClassNames to the panel', () => {
    const { container } = renderDropdown({ styleClassNames: { dropdown: 'a', unknown: 'b' } });
    const panel = container.querySelector(panelSelector)!;
    expect(panel).toHaveClass('a');
    expect(container.querySelector('.b')).toBeFalsy();
  });

  test('applies styleClassNames to the panel when rendered in a portal', () => {
    renderDropdown({ expandToViewport: true, styleClassNames: { dropdown: 'a' } });
    const panel = document.body.querySelector(panelSelector)!;
    expect(panel).toHaveClass('a');
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    renderDropdown({ expandToViewport: true, styleClassNames: { dropdown: 'a' } });
    expect(document.body.querySelector('[styleClassNames]')).toBeNull();
  });
});
