// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Ace } from 'ace-builds';
import { supportsKeyboardAccessibility } from './util';

export function setupEditor(ace: any, editor: Ace.Editor) {
  ace.config.loadModule('ace/ext/language_tools', function () {
    editor.setOptions({ displayIndentGuides: false, enableSnippets: true });
  });

  editor.setAutoScrollEditorIntoView(true);
  editor.setReadOnly(true);

  if (!supportsKeyboardAccessibility(ace)) {
    editor.commands.addCommand({
      name: 'exitCodeEditor',
      bindKey: 'Esc',
      exec: () => {
        editor.container.focus();
      },
    });
  }

  editor.on('focus', () => {
    (editor as any).textInput.getElement().setAttribute('tabindex', 0);
  });

  editor.on('blur', () => {
    (editor as any).textInput.getElement().setAttribute('tabindex', -1);
  });

  // prevent users to step into editor directly by keyboard
  (editor as any).textInput.getElement().setAttribute('tabindex', -1);

  editor.commands.removeCommand('showSettingsMenu', false);

  // Prevent default behavior on error/warning icon click
  editor.on('guttermousedown' as any, (e: any) => {
    e.stop();
  });

  // HACK: Wrapped lines are highlighted individually. This is seriously the recommended fix.
  // See: https://github.com/ajaxorg/ace/issues/3067
  editor.setHighlightActiveLine(false);
  (editor as any).$updateHighlightActiveLine = function () {
    const session = this.getSession();

    let highlight;
    if (this.$highlightActiveLine) {
      if (this.$selectionStyle !== 'line' || !this.selection.isMultiLine()) {
        highlight = this.getCursorPosition();
      }
      if (this.renderer.$maxLines && this.session.getLength() === 1 && !(this.renderer.$minLines > 1)) {
        highlight = false;
      }
    }

    if (session.$highlightLineMarker && !highlight) {
      session.removeMarker(session.$highlightLineMarker.id);
      session.$highlightLineMarker = null;
    } else if (!session.$highlightLineMarker && highlight) {
      const range = new ace.Range(highlight.row, 0, highlight.row, Infinity);
      (range as any).id = session.addMarker(range, 'ace_active-line', 'fullLine');
      session.$highlightLineMarker = range;
    } else if (highlight) {
      session.$highlightLineMarker.start.row = highlight.row;
      session.$highlightLineMarker.end.row = highlight.row;
      session.$highlightLineMarker.start.column = 0;
      session._signal('changeBackMarker');
    }
  };

  editor.setHighlightActiveLine(true);

  // HACK: "disable" error tooltips by hiding them as soon as they appear.
  // See https://github.com/ajaxorg/ace/issues/4004
  editor.on('showGutterTooltip' as any, (tooltip: any) => {
    tooltip.hide();
  });
}
