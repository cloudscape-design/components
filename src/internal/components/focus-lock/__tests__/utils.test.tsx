// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import {
  getFirstFocusable,
  getLastFocusable,
  isFocusable,
} from '../../../../../lib/components/internal/components/focus-lock/utils';

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

describe('getFirstFocusable', () => {
  it('returns the first tabbable element', () => {
    const { container } = render(
      <div>
        <div tabIndex={-1}>Not tabbable, just focusable</div>
        <button id="first">First</button>
        <input id="second" />
        <button id="third">Third</button>
      </div>
    );
    const firstFocusable = getFirstFocusable(container);
    expect(firstFocusable?.id).toBe('first');
  });

  it('returns null when no tabbable elements exist', () => {
    const { container } = render(
      <div>
        <div>Not focusable</div>
        <div tabIndex={-1}>Not tabbable</div>
      </div>
    );
    expect(getFirstFocusable(container)).toBe(null);
  });

  it('skips hidden elements', () => {
    const { container } = render(
      <div>
        <button id="hidden" style={{ display: 'none' }}>
          Hidden
        </button>
        <button id="visible">Visible</button>
      </div>
    );
    // Mock checkVisibility for the hidden element
    (container.querySelector('#hidden') as any).checkVisibility = () => false;
    (container.querySelector('#visible') as any).checkVisibility = () => true;

    const firstFocusable = getFirstFocusable(container);
    expect(firstFocusable?.id).toBe('visible');
  });

  it('skips disabled elements', () => {
    const { container } = render(
      <div>
        <button id="disabled" disabled={true}>
          Disabled
        </button>
        <button id="enabled">Enabled</button>
      </div>
    );
    const firstFocusable = getFirstFocusable(container);
    expect(firstFocusable?.id).toBe('enabled');
  });

  it('returns elements with tabIndex 0', () => {
    const { container } = render(
      <div>
        <div id="tabbable" tabIndex={0}>
          Tabbable div
        </div>
        <button id="button">Button</button>
      </div>
    );
    const firstFocusable = getFirstFocusable(container);
    expect(firstFocusable?.id).toBe('tabbable');
  });
});

describe('getLastFocusable', () => {
  it('returns the last tabbable element', () => {
    const { container } = render(
      <div>
        <button id="first">First</button>
        <input id="second" />
        <button id="last">Last</button>
        <div tabIndex={-1}>Not tabbable</div>
      </div>
    );
    const lastFocusable = getLastFocusable(container);
    expect(lastFocusable?.id).toBe('last');
  });

  it('returns null when no tabbable elements exist', () => {
    const { container } = render(
      <div>
        <div>Not focusable</div>
        <div tabIndex={-1}>Not tabbable</div>
      </div>
    );
    expect(getLastFocusable(container)).toBe(null);
  });

  it('skips hidden elements', () => {
    const { container } = render(
      <div>
        <button id="visible">Visible</button>
        <button id="hidden" style={{ display: 'none' }}>
          Hidden
        </button>
      </div>
    );
    // Mock checkVisibility for the hidden element
    (container.querySelector('#hidden') as any).checkVisibility = () => false;
    (container.querySelector('#visible') as any).checkVisibility = () => true;

    const lastFocusable = getLastFocusable(container);
    expect(lastFocusable?.id).toBe('visible');
  });

  it('skips disabled elements', () => {
    const { container } = render(
      <div>
        <button id="enabled">Enabled</button>
        <button id="disabled" disabled={true}>
          Disabled
        </button>
      </div>
    );
    const lastFocusable = getLastFocusable(container);
    expect(lastFocusable?.id).toBe('enabled');
  });

  it('returns the same element when only one tabbable element exists', () => {
    const { container } = render(
      <div>
        <div tabIndex={-1}>Not tabbable</div>
        <button id="only">Only button</button>
        <div>Not focusable</div>
      </div>
    );
    const lastFocusable = getLastFocusable(container);
    expect(lastFocusable?.id).toBe('only');
  });

  it('excludes elements with negative tabIndex', () => {
    const { container } = render(
      <div>
        <button id="tabbable">Tabbable</button>
        <div id="programmatic" tabIndex={-1}>
          Programmatically focusable
        </div>
      </div>
    );
    const lastFocusable = getLastFocusable(container);
    expect(lastFocusable?.id).toBe('tabbable');
  });
});
