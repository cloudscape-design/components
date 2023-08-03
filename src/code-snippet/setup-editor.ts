// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Ace } from 'ace-builds';
import { setEditorDefaults } from '../code-editor/setup-editor';

export function setupEditor(
  ace: any,
  editor: Ace.Editor,
  { showGutter, lines }: { showGutter: boolean; lines: number }
) {
  ace.config.loadModule('ace/ext/language_tools', function () {
    editor.setOptions({ displayIndentGuides: false, enableSnippets: true, showGutter });
  });

  editor.renderer.setOption('minLines', lines);
  editor.renderer.setOption('maxLines', lines);

  editor.setAutoScrollEditorIntoView(true);
  editor.setReadOnly(true);

  setEditorDefaults(ace, editor);
}
