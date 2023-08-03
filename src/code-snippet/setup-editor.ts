// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Ace } from 'ace-builds';
import { setEditorDefaults } from '../code-editor/setup-editor';

export function setupEditor(ace: any, editor: Ace.Editor, { showGutter }: { showGutter: boolean }) {
  ace.config.loadModule('ace/ext/language_tools', function () {
    editor.setOptions({ displayIndentGuides: false, enableSnippets: true, showGutter });
  });

  editor.setAutoScrollEditorIntoView(true);
  editor.setReadOnly(true);

  setEditorDefaults(ace, editor);
}
