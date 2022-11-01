// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Ace } from 'ace-builds';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { AceModes } from './ace-modes';
import { DarkThemes, LightThemes } from './ace-themes';
import { FormFieldControlProps } from '../internal/context/form-field-context';

export interface CodeEditorProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The ace object.
   */
  ace: any;

  /**
   * Specifies the content that's displayed in the code editor.
   */
  value: string;

  /**
   * Specifies the programming language. You can use any of the programming languages supported by the `ace` object that you provide.
   */
  language: CodeEditorProps.Language;

  /**
   * An event handler called when the value changes.
   * The event `detail` contains the current value of the code editor content.
   * **Deprecated**, replaced by `onDelayedChange`.
   */
  onChange?: NonCancelableEventHandler<CodeEditorProps.ChangeDetail>;

  /**
   * An event handler called when the value changes.
   * The event `detail` contains the current value of the code editor content.
   * A user interaction can cause multiple change events to be emitted by the Ace editor. They are batched together into a single `onDelayedChange` event to avoid bugs when controlling the `value` field.
   */
  onDelayedChange?: NonCancelableEventHandler<CodeEditorProps.ChangeDetail>;

  /**
   * Annotations returned from Ace syntax checker after code validation.
   */
  onValidate?: NonCancelableEventHandler<CodeEditorProps.ValidateDetail>;

  /**
   * Specifies the component preferences.
   *
   * If set to `undefined`, the component uses the following default value:
   *
   * ```
   * {
   *   wrapLines: true,
   *   theme: 'dawn'
   * }
   * ```
   *
   * You can use any theme provided by Ace.
   */
  preferences?: Partial<CodeEditorProps.Preferences>;

  /**
   * List of Ace themes available for selection in preferences dialog. Make sure you include at least one light and at
   * least one dark theme. If not set explicitly, it will render all Ace themes available for selection.
   */
  themes?: CodeEditorProps.AvailableThemes;

  /**
   * Called when any of the preferences change.
   * The event `detail` contains the value of all the preferences as submitted by the user.
   *
   */
  onPreferencesChange: NonCancelableEventHandler<CodeEditorProps.Preferences>;

  /**
   * Renders the code editor in a loading state.
   */
  loading?: boolean;

  /**
   * Called when the user clicks the recovery button in the error state.
   * Use this to retry loading the code editor or to provide another option for the user to recover from the error.
   */
  onRecoveryClick?: NonCancelableEventHandler<void>;

  /**
   * An object containing all the necessary localized strings required by the component.
   * The object should contain, among others:
   *
   * * `loadingState` - Specifies the text to display while the component is loading.
   * * `errorState` - Specifies the text to display if there is an error loading Ace.
   * * `errorStateRecovery`: Specifies the text for the recovery button that's displayed next to the error text.
   *    Use the `recoveryClick` event to do a recovery action (for example, retrying the request).
   */
  i18nStrings: CodeEditorProps.I18nStrings;

  /**
   * Specifies the height of the code editor document.
   */
  editorContentHeight?: number;

  /**
   * Called when the user resizes the editor by dragging the resize icon.
   * The event `detail` contains the new height of the editor in pixels.
   */
  onEditorContentResize?: NonCancelableEventHandler<CodeEditorProps.ResizeDetail>;
}

export namespace CodeEditorProps {
  export type Language = typeof AceModes[number]['value'];
  export type Theme = typeof LightThemes[number]['value'] | typeof DarkThemes[number]['value'];

  export interface AvailableThemes {
    light: ReadonlyArray<string>;
    dark: ReadonlyArray<string>;
  }

  export interface Preferences {
    wrapLines: boolean;
    theme: Theme;
  }

  export interface I18nStrings {
    loadingState: string;
    errorState: string;
    errorStateRecovery: string;

    editorGroupAriaLabel: string;
    statusBarGroupAriaLabel: string;

    cursorPosition: (row: number, column: number) => string;
    errorsTab: string;
    warningsTab: string;
    preferencesButtonAriaLabel: string;
    paneCloseButtonAriaLabel: string;

    preferencesModalHeader: string;
    preferencesModalCancel: string;
    preferencesModalConfirm: string;
    preferencesModalWrapLines: string;
    preferencesModalTheme: string;
    preferencesModalLightThemes: string;
    preferencesModalDarkThemes: string;
  }
  export interface ResizeDetail {
    height: number;
  }
  export interface ChangeDetail {
    value: string;
  }

  export interface ValidateDetail {
    annotations: Ace.Annotation[];
  }
}
