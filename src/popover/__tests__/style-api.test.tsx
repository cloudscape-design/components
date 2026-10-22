// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Popover from '../../../lib/components/popover';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/popover/styles.css.js';

function renderOpenPopover(props: Record<string, unknown>) {
  const { container } = render(<Popover content="Content" header="Header" {...props} />);
  const wrapper = createWrapper(container).findPopover()!;
  wrapper.findTrigger().click();
  return wrapper;
}

describe('Popover Style API v2', () => {
  test('applies styleClassNames to the container and arrow slots', () => {
    const wrapper = renderOpenPopover({ styleClassNames: { container: 'a', arrow: 'b', unknown: 'c' } });
    expect(wrapper.findByClassName(styles['container-body'])!.getElement()).toHaveClass('a');
    expect(wrapper.findByClassName(styles.arrow)!.getElement()).toHaveClass('b');
    expect(wrapper.find('.c')).toBeNull();
  });

  test('forwards the dismissButton slot to the dismiss button', () => {
    const wrapper = renderOpenPopover({ styleClassNames: { dismissButton: 'a' } });
    expect(wrapper.findDismissButton()!.getElement()).toHaveClass('a');
  });

  test('applies styleClassNames to the popover container when rendered in a portal', () => {
    const wrapper = renderOpenPopover({ renderWithPortal: true, styleClassNames: { container: 'a' } });
    expect(wrapper.findContent({ renderWithPortal: true })).not.toBeNull();
    expect(document.body.querySelector(`.${styles['container-body']}`)).toHaveClass('a');
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    renderOpenPopover({ renderWithPortal: true, styleClassNames: { container: 'a' } });
    expect(document.body.querySelector('[styleClassNames]')).toBeNull();
  });
});
