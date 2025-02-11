// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { fireEvent } from '@testing-library/react';

import { KeyCode } from '../../internal/keycode.js';
import { editorMock, renderCodeEditor } from './util.js';

describe('Keyboard navigation', () => {
  it('focuses editor', () => {
    const { wrapper } = renderCodeEditor();

    const element = wrapper.findEditor()!.getElement();

    editorMock.container = element as any; // to pass `e.target === editor.container` check

    fireEvent.keyDown(element, { keyCode: KeyCode.enter });

    expect(editorMock.focus).toHaveBeenCalled();
  });
});
