// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef } from 'react';
import { fireEvent, render } from '@testing-library/react';

import RichTextEditor, { RichTextEditorProps } from '../../../lib/components/rich-text-editor';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderEditor(props: Partial<RichTextEditorProps> & React.RefAttributes<RichTextEditorProps.Ref> = {}) {
  const { container } = render(<RichTextEditor value="" onChange={() => {}} {...props} />);
  const wrapper = createWrapper(container).findRichTextEditor()!;
  return { wrapper, container };
}

describe('RichTextEditor', () => {
  test('renders the editable contenteditable region', () => {
    const { wrapper } = renderEditor();
    const content = wrapper.findContent().getElement();
    expect(content).toHaveAttribute('contenteditable', 'true');
    expect(content).toHaveAttribute('role', 'textbox');
  });

  test('renders the provided HTML value', () => {
    const { wrapper } = renderEditor({ value: '<p>hello <b>world</b></p>' });
    expect(wrapper.getValue()).toBe('<p>hello <b>world</b></p>');
  });

  test('applies the aria-label to the editable region', () => {
    const { wrapper } = renderEditor({ ariaLabel: 'My editor' });
    expect(wrapper.findContent().getElement()).toHaveAttribute('aria-label', 'My editor');
  });

  test('shows the placeholder only when the value is empty', () => {
    const { wrapper } = renderEditor({ placeholder: 'Type here' });
    expect(wrapper.getElement().textContent).toContain('Type here');

    const { wrapper: filled } = renderEditor({ value: '<p>x</p>', placeholder: 'Type here' });
    expect(filled.getElement().textContent).not.toContain('Type here');
  });

  describe('toolbar', () => {
    test('renders the default set of toolbar buttons', () => {
      const { wrapper } = renderEditor();
      expect(wrapper.findToolbar()).not.toBeNull();
      expect(wrapper.findToolbarButtons()).toHaveLength(7);
    });

    test('renders only the requested toolbar controls', () => {
      const { wrapper } = renderEditor({ toolbarControls: ['bold', 'italic', 'link'] });
      expect(wrapper.findToolbarButtons()).toHaveLength(3);
      expect(wrapper.findToolbarButton('bold')).not.toBeNull();
      expect(wrapper.findToolbarButton('numbered-list')).toBeNull();
    });

    test('exposes an accessible label per toolbar button', () => {
      const { wrapper } = renderEditor();
      expect(wrapper.findToolbarButton('bold')!.getElement()).toHaveAttribute('aria-label', 'Bold');
    });

    test('applies i18nStrings labels', () => {
      const { wrapper } = renderEditor({ i18nStrings: { boldButtonAriaLabel: 'Gras' } });
      expect(wrapper.findToolbarButton('bold')!.getElement()).toHaveAttribute('aria-label', 'Gras');
    });

    test('is hidden in read-only mode', () => {
      const { wrapper } = renderEditor({ readOnly: true });
      expect(wrapper.findToolbar()).toBeNull();
    });

    test('clicking a toolbar button does not throw and fires onChange', () => {
      const onChange = jest.fn();
      const { wrapper } = renderEditor({ onChange });
      fireEvent.click(wrapper.findToolbarButton('bold')!.getElement());
      expect(onChange).toHaveBeenCalled();
    });
  });

  test('fires onChange with the current HTML on input', () => {
    const onChange = jest.fn();
    const { wrapper } = renderEditor({ onChange });
    const content = wrapper.findContent().getElement();
    content.innerHTML = '<p>updated</p>';
    fireEvent.input(content);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '<p>updated</p>' } }));
  });

  test('fires onFocus and onBlur', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { wrapper } = renderEditor({ onFocus, onBlur });
    const content = wrapper.findContent().getElement();
    fireEvent.focus(content);
    fireEvent.blur(content);
    expect(onFocus).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  test('disabled editor is not editable and toolbar buttons are disabled', () => {
    const { wrapper } = renderEditor({ disabled: true });
    expect(wrapper.findContent().getElement()).toHaveAttribute('contenteditable', 'false');
    expect(wrapper.findToolbarButton('bold')!.getElement()).toBeDisabled();
  });

  test('exposes an imperative focus() handle', () => {
    const ref = createRef<RichTextEditorProps.Ref>();
    const { wrapper } = renderEditor({ ref });
    ref.current!.focus();
    expect(wrapper.findContent().getElement()).toHaveFocus();
  });
});
