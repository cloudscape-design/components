// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CodeEditorProps } from '../../../lib/components/code-editor';
import { renderCodeEditor } from './util';

describe('Code editor language selector with LiteralUnion type', () => {
  it('accepts built-in language values', () => {
    const { wrapper } = renderCodeEditor({ language: 'javascript' });
    expect(wrapper.findStatusBar()!.getElement()).toHaveTextContent('JavaScript');
  });

  it('accepts custom language string values', () => {
    const { wrapper } = renderCodeEditor({ language: 'partiql', languageLabel: 'PartiQL' });
    expect(wrapper.findStatusBar()!.getElement()).toHaveTextContent('PartiQL');
  });

  it('handles language type as LiteralUnion without type errors', () => {
    // This test reproduces the issue where LiteralUnion<BuiltInLanguage, string>
    // was not properly recognized as a primitive string type by the documenter
    const customLanguage: CodeEditorProps.Language = 'custom-lang';
    const { wrapper } = renderCodeEditor({ language: customLanguage, languageLabel: 'Custom' });
    expect(wrapper.findStatusBar()!.getElement()).toHaveTextContent('Custom');
  });
});
