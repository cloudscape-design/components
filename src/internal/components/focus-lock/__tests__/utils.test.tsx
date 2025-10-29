// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import { isFocusable } from '../../../../../lib/components/internal/components/focus-lock/utils';

describe('isFocusable', () => {
  it('returns true if the element is implicitly focusable', () => {
    const { container } = render(<button id="test" />);
    expect(isFocusable(container.querySelector('#test')!)).toBe(true);
  });

  it('returns true if the element is explicitly focusable', () => {
    const { container } = render(<div id="test" tabIndex={-1} />);
    expect(isFocusable(container.querySelector('#test')!)).toBe(true);
  });

  it('returns false if the element is not focusable', () => {
    const { container } = render(<div id="test" />);
    expect(isFocusable(container.querySelector('#test')!)).toBe(false);
  });

  it('returns false if the element is disabled', () => {
    const { container } = render(<input id="test" disabled={true} />);
    expect(isFocusable(container.querySelector('#test')!)).toBe(false);
  });

  it('returns false if the element is hidden', () => {
    const { container } = render(<button id="test" style={{ display: 'none' }} />);
    // jest.spyOn doesn't work here because checkVisibility isn't defined in JSDOM.
    (container.querySelector('#test') as any).checkVisibility = () => false;
    expect(isFocusable(container.querySelector('#test')!)).toBe(false);
  });
});
