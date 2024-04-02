// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import Tooltip, { TooltipProps } from '../../../../../lib/components/internal/components/tooltip';
import createWrapper, { ElementWrapper, PopoverWrapper } from '../../../../../lib/components/test-utils/dom';
import styles from '../../../../../lib/components/popover/styles.selectors.js';

class TooltipInternalWrapper extends PopoverWrapper {
  findContent(): ElementWrapper | null {
    return createWrapper().findByClassName(styles.content);
  }
  findArrow(): ElementWrapper | null {
    return createWrapper().findByClassName(styles.arrow);
  }
  findHeader(): ElementWrapper | null {
    return createWrapper().findByClassName(styles.header);
  }
}

const dummyRef = { current: null };
function renderTooltip(props: Partial<TooltipProps>) {
  const { container } = render(<Tooltip trackRef={dummyRef} value={props.value ?? ''} />);
  return new TooltipInternalWrapper(container);
}

describe('Tooltip', () => {
  it('renders text correctly', () => {
    const wrapper = renderTooltip({ value: 'Value' });

    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Value');
  });

  it('renders arrow', () => {
    const wrapper = renderTooltip({ value: 'Value' });

    expect(wrapper.findArrow()).not.toBeNull();
  });

  it('does not render a header', () => {
    const wrapper = renderTooltip({ value: 'Value' });

    expect(wrapper.findHeader()).toBeNull();
  });
});
