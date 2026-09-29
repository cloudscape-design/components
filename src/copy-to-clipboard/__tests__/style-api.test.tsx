// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import CopyToClipboard, { CopyToClipboardProps } from '../../../lib/components/copy-to-clipboard';
import createWrapper from '../../../lib/components/test-utils/dom';

import popoverStyles from '../../../lib/components/popover/styles.css.js';

function renderCopyToClipboard(props: Partial<CopyToClipboardProps> & Record<string, unknown> = {}) {
  const { container } = render(
    <CopyToClipboard
      copyButtonText="Copy"
      copyButtonAriaLabel="Copy"
      copyErrorText="Failed to copy"
      copySuccessText="Copied"
      textToCopy="text to copy"
      {...props}
    />
  );
  return { container, wrapper: createWrapper(container).findCopyToClipboard()! };
}

describe('CopyToClipboard Style API v2', () => {
  test.each<CopyToClipboardProps.Variant>(['button', 'icon', 'inline'])(
    'applies the copyButton slot (variant=%s)',
    variant => {
      const { container, wrapper } = renderCopyToClipboard({
        variant,
        styleClassNames: { copyButton: 'a', unknown: 'b' },
      });
      expect(wrapper.findCopyButton().getElement()).toHaveClass('a');
      expect(container.querySelector('.b')).toBeNull();
    }
  );

  test('forwards the statusPopover slot to the status popover', () => {
    const { container, wrapper } = renderCopyToClipboard({ styleClassNames: { statusPopover: 'a' } });
    wrapper.findCopyButton().click();
    expect(wrapper.findStatusText()).not.toBeNull();
    expect(container.querySelector(`.${popoverStyles.container}`)).toHaveClass('a');
    expect(wrapper.findCopyButton().getElement()).not.toHaveClass('a');
  });

  test('forwards the statusPopover slot when the popover is rendered in a portal', () => {
    const { wrapper } = renderCopyToClipboard({
      popoverRenderWithPortal: true,
      styleClassNames: { statusPopover: 'a' },
    });
    wrapper.findCopyButton().click();
    expect(wrapper.findStatusText({ popoverRenderWithPortal: true })).not.toBeNull();
    expect(document.body.querySelector(`.${popoverStyles.container}`)).toHaveClass('a');
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { wrapper } = renderCopyToClipboard({
      popoverRenderWithPortal: true,
      styleClassNames: { copyButton: 'a', statusPopover: 'b' },
    });
    wrapper.findCopyButton().click();
    expect(document.body.querySelector('[styleClassNames]')).toBeNull();
  });
});
