// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import CopyToClipboard, { CopyToClipboardProps } from '../../../lib/components/copy-to-clipboard';
import createWrapper from '../../../lib/components/test-utils/dom';

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
    'applies styleClassNames (variant=%s)',
    variant => {
      const { wrapper } = renderCopyToClipboard({
        variant,
        styleClassNames: { copyButton: 'a', textToDisplay: 'b', unknown: 'c' },
      });
      const button = wrapper.findCopyButton().getElement();
      expect(button).toHaveClass('a');
      expect(button).not.toHaveClass('b');
      expect(button).not.toHaveClass('c');

      if (variant === 'inline') {
        const text = wrapper.findDisplayedText();
        expect(text!.getElement()).not.toHaveClass('a');
        expect(text!.getElement()).toHaveClass('b');
        expect(text!.getElement()).not.toHaveClass('c');
      }
    }
  );

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderCopyToClipboard({ styleClassNames: { copyButton: 'a', textToDisplay: 'b' } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
