// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import CodeEditor, { CodeEditorProps } from '../../../lib/components/code-editor';
import createWrapper from '../../../lib/components/test-utils/dom';
import { i18nStrings } from './common';

export let annotationCallback: (event?: any) => void;

const textInput = { setAttribute: jest.fn() };

export const editorMock = {
  getValue: jest.fn(),
  setValue: jest.fn(),
  setTheme: jest.fn(),
  container: { focus: jest.fn() },
  textInput: {
    getElement: jest.fn(() => textInput),
  },
  renderer: {
    textarea: document.createElement('textarea'),
  },
  focus: jest.fn(),
  session: {
    setMode: jest.fn(),
    setUseWrapMode: jest.fn(),
    selection: {
      on: jest.fn(),
      fromJSON: jest.fn(),
      toJSON: jest.fn(),
    },
    on: jest.fn((name: string, _callback: (event?: any) => void) => {
      switch (name) {
        case 'changeAnnotation':
          annotationCallback = _callback;
          break;
      }
    }),
    getAnnotations: jest.fn(),
    setAnnotations: jest.fn(),
    clearAnnotations: jest.fn(),
  },
  getOption: jest.fn(),
  setOption: jest.fn(),
  setOptions: jest.fn(),
  setAutoScrollEditorIntoView: jest.fn(),
  setHighlightActiveLine: jest.fn(),
  commands: {
    addCommand: jest.fn(),
    removeCommand: jest.fn(),
  },
  on: jest.fn(),
  off: jest.fn(),
  gotoLine: jest.fn(),
  removeAllListeners: jest.fn(),
  destroy: jest.fn(),
  resize: jest.fn(),
};

export const aceMock = {
  get version() {
    return '1.0.0';
  },
  edit: jest.fn(() => editorMock),
  config: {
    loadModule: jest.fn(),
  },
};

export const defaultProps: CodeEditorProps = {
  ace: aceMock,
  value: 'const pi = 3.14;',
  language: 'javascript',
  onChange: jest.fn(),
  onValidate: jest.fn(),
  onPreferencesChange: jest.fn(),
  onRecoveryClick: jest.fn(),
  preferences: undefined,
  loading: false,
  i18nStrings,
};

export function renderCodeEditor(props: Partial<CodeEditorProps> = {}, ref?: React.Ref<CodeEditorProps.Ref>) {
  const renderProps = { ...defaultProps, ...props };
  const { container, rerender, unmount } = render(<CodeEditor ref={ref} {...renderProps} />);
  return {
    wrapper: createWrapper(container).findCodeEditor()!,
    rerender,
    unmount,
  };
}
