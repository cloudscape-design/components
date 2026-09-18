// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';
import { FormFieldValidationControlProps } from '../types/form-field';

export interface RichTextEditorProps extends BaseComponentProps, FormFieldValidationControlProps {
  /**
   * The current value of the editor, as an HTML string.
   *
   * The component is controlled: pass the value returned by the latest `onChange`
   * event back into this property to keep the editor in sync.
   *
   * Note (WIP v0): the value is sanitized only for rendering by the browser's
   * `contenteditable` implementation. Consuming applications are responsible for
   * sanitizing/escaping the HTML before persisting or re-rendering it elsewhere.
   */
  value: string;

  /**
   * Called whenever the editor content changes. The event detail contains the
   * new value as an HTML string.
   */
  onChange?: NonCancelableEventHandler<RichTextEditorProps.ChangeDetail>;

  /**
   * Called when the editor loses focus.
   */
  onBlur?: NonCancelableEventHandler<null>;

  /**
   * Called when the editor receives focus.
   */
  onFocus?: NonCancelableEventHandler<null>;

  /**
   * Placeholder text rendered when the editor is empty.
   */
  placeholder?: string;

  /**
   * Determines whether the editor is disabled. A disabled editor cannot be
   * focused or edited and its toolbar controls are inactive.
   */
  disabled?: boolean;

  /**
   * Determines whether the editor is read-only. A read-only editor renders its
   * value but cannot be edited. The toolbar is hidden in read-only mode.
   */
  readOnly?: boolean;

  /**
   * Adds an `aria-label` to the editable region. Use this to provide an
   * accessible name when the component is not associated with a form field.
   */
  ariaLabel?: string;

  /**
   * Controls which formatting actions are shown in the toolbar, and in which
   * order. When omitted, all supported v0 controls are shown.
   */
  toolbarControls?: ReadonlyArray<RichTextEditorProps.ToolbarControl>;

  /**
   * An object containing all the localized strings required by the component.
   */
  i18nStrings?: RichTextEditorProps.I18nStrings;
}

export namespace RichTextEditorProps {
  export interface ChangeDetail {
    /**
     * The new value of the editor as an HTML string.
     */
    value: string;
  }

  export interface Ref {
    /**
     * Moves focus into the editable region.
     */
    focus(): void;
  }

  /**
   * The formatting actions supported by the v0 toolbar.
   *
   * - `bold`, `italic`, `underline`, `strikethrough`: inline text styles.
   * - `bulleted-list`, `numbered-list`: block list formatting.
   * - `link`: wraps the current selection in a hyperlink.
   */
  export type ToolbarControl =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strikethrough'
    | 'bulleted-list'
    | 'numbered-list'
    | 'link';

  export interface I18nStrings {
    /** Accessible label for the toolbar container. */
    toolbarAriaLabel?: string;
    /** Accessible label for the "bold" toolbar button. */
    boldButtonAriaLabel?: string;
    /** Accessible label for the "italic" toolbar button. */
    italicButtonAriaLabel?: string;
    /** Accessible label for the "underline" toolbar button. */
    underlineButtonAriaLabel?: string;
    /** Accessible label for the "strikethrough" toolbar button. */
    strikethroughButtonAriaLabel?: string;
    /** Accessible label for the "bulleted list" toolbar button. */
    bulletedListButtonAriaLabel?: string;
    /** Accessible label for the "numbered list" toolbar button. */
    numberedListButtonAriaLabel?: string;
    /** Accessible label for the "link" toolbar button. */
    linkButtonAriaLabel?: string;
    /** Prompt shown when requesting the URL for a new link. */
    linkUrlPromptText?: string;
  }
}
