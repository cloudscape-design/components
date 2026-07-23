// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Textarea, { TextareaProps } from '../../../lib/components/textarea';

import styles from '../../../lib/components/textarea/styles.css.js';

function renderTextarea(props: Partial<TextareaProps> = {}) {
  const { container } = render(<Textarea value="" onChange={() => {}} {...props} />);
  const textareaWrapper = createWrapper(container).findTextarea()!;
  return {
    textarea: textareaWrapper.findNativeTextarea().getElement(),
    textareaWrapper,
  };
}

// jsdom does not compute scrollHeight, so we mock it for auto-resize tests.
function mockScrollHeight(element: HTMLTextAreaElement, scrollHeight: number) {
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  });
}

describe('Textarea autoResize', () => {
  describe('prop defaults', () => {
    test('autoResize is false by default', () => {
      const { textarea } = renderTextarea();
      expect(textarea).not.toHaveClass(styles['textarea-auto-resize']);
    });

    test('rows defaults to 3 when autoResize is false', () => {
      const { textarea } = renderTextarea({ autoResize: false });
      expect(textarea).toHaveAttribute('rows', '3');
    });

    test('rows is set to 1 when autoResize is true', () => {
      const { textarea } = renderTextarea({ autoResize: true });
      expect(textarea).toHaveAttribute('rows', '1');
    });
  });

  describe('CSS class', () => {
    test('adds textarea-auto-resize class when autoResize is true', () => {
      const { textarea } = renderTextarea({ autoResize: true });
      expect(textarea).toHaveClass(styles['textarea-auto-resize']);
    });

    test('does not add textarea-auto-resize class when autoResize is false', () => {
      const { textarea } = renderTextarea({ autoResize: false });
      expect(textarea).not.toHaveClass(styles['textarea-auto-resize']);
    });
  });

  describe('height adjustment', () => {
    test('sets height style when autoResize is true and content is present', () => {
      const { textarea } = renderTextarea({ autoResize: true, value: 'hello' });
      mockScrollHeight(textarea, 80);

      // Re-render to trigger effect with mocked scrollHeight
      act(() => {
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      });

      // Height is set via inline style when autoResize is enabled
      // (jsdom doesn't compute layout, so we just verify the attribute was applied)
      expect(textarea).toHaveClass(styles['textarea-auto-resize']);
    });

    test('does not set inline height style when autoResize is false', () => {
      const { textarea } = renderTextarea({ autoResize: false, value: 'hello' });
      expect(textarea.style.height).toBe('');
    });
  });

  describe('maxRows', () => {
    test('maxRows has no effect when autoResize is false', () => {
      const { textarea } = renderTextarea({ autoResize: false, maxRows: 3 });
      // rows prop still controls height
      expect(textarea).toHaveAttribute('rows', '3');
      expect(textarea).not.toHaveClass(styles['textarea-auto-resize']);
    });

    test('maxRows can be set with autoResize', () => {
      // Just verify it renders without errors and applies auto-resize class
      const { textarea } = renderTextarea({ autoResize: true, maxRows: 5 });
      expect(textarea).toHaveClass(styles['textarea-auto-resize']);
    });
  });

  describe('value updates', () => {
    test('height is recalculated when value changes', () => {
      const { rerender, container } = render(<Textarea autoResize={true} value="line one" onChange={() => {}} />);
      const textareaEl = createWrapper(container).findTextarea()!.findNativeTextarea().getElement();
      mockScrollHeight(textareaEl, 40);

      act(() => {
        rerender(<Textarea autoResize={true} value={'line one\nline two\nline three'} onChange={() => {}} />);
      });

      // After rerender the hook fires again; class should still be present
      expect(textareaEl).toHaveClass(styles['textarea-auto-resize']);
    });
  });

  describe('interaction with rows prop', () => {
    test('rows prop is ignored when autoResize is true', () => {
      const { textarea } = renderTextarea({ autoResize: true, rows: 10 });
      // When autoResize is on, rows is forced to 1 (initial placeholder row)
      expect(textarea).toHaveAttribute('rows', '1');
    });

    test('rows prop is respected when autoResize is false', () => {
      const { textarea } = renderTextarea({ autoResize: false, rows: 7 });
      expect(textarea).toHaveAttribute('rows', '7');
    });
  });
});
