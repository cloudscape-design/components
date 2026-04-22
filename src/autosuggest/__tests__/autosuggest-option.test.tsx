// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import AutosuggestOption from '../../../lib/components/autosuggest/autosuggest-option';
import createWrapper from '../../../lib/components/test-utils/dom';

describe('AutosuggestOption nativeAttributes', () => {
  const optionProps = {
    index: 0,
    highlightText: '',
    highlighted: false,
    highlightType: { type: 'keyboard' as const, moveFocus: false },
    current: false,
    option: { value: '1', label: 'One', type: 'child' as const, option: { value: '1', label: 'One' } },
  };

  test('sets aria-label when provided in nativeAttributes', () => {
    const { container } = render(
      <AutosuggestOption {...optionProps} nativeAttributes={{ 'aria-label': 'Selected' }} />
    );
    expect(createWrapper(container).find('[aria-label="Selected"]')).not.toBeNull();
  });

  test('sets aria-label when renderOption is provided', () => {
    const { container } = render(
      <AutosuggestOption
        {...optionProps}
        nativeAttributes={{ 'aria-label': 'Selected' }}
        renderOption={() => <div>Custom</div>}
      />
    );
    expect(createWrapper(container).find('[aria-label="Selected"]')).not.toBeNull();
  });

  test('does not set aria-label when not in nativeAttributes', () => {
    const { container } = render(<AutosuggestOption {...optionProps} />);
    expect(createWrapper(container).find('[aria-label]')).toBeNull();
  });
});
