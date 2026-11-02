// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ProgressBar, { ProgressBarProps } from '../../../lib/components/progress-bar';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderProgressBar(props: Partial<ProgressBarProps> & Record<string, unknown> = {}) {
  const { container } = render(<ProgressBar value={40} label="Label" {...props} />);
  return { container, wrapper: createWrapper(container).findProgressBar()! };
}

describe('ProgressBar Style API v2', () => {
  test.each<ProgressBarProps.Variant>(['standalone', 'flash', 'key-value'])(
    'applies styleClassNames (variant=%s)',
    variant => {
      const { wrapper } = renderProgressBar({
        variant,
        styleClassNames: { root: 'a', percentage: 'b', unknown: 'c' },
      });
      expect(wrapper.getElement()).toHaveClass('a');
      expect(wrapper.getElement()).not.toHaveClass('c');

      const percentage = wrapper.findPercentageText()!.getElement();
      expect(percentage).not.toHaveClass('a');
      expect(percentage).toHaveClass('b');
      expect(percentage).not.toHaveClass('c');
    }
  );

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderProgressBar({ styleClassNames: { root: 'a', percentage: 'b' } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
