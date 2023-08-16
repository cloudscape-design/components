// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { AceModes } from '../code-editor/ace-modes';
import { DarkThemes, LightThemes } from '../code-editor/ace-themes';
import { FormFieldControlProps } from '../internal/context/form-field-context';

export interface CodeSnippetProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The ace object.
   */
  ace: any;

  /**
   * Specifies the content that's displayed in the code snippet.
   */
  value: string;

  /**
   * Specifies the programming language. You can use any of the programming languages supported by the `ace` object that you provide.
   * Alternatively, this can be used to set a language that is not supported by the default `language` list. Make sure you've added the highlighting support for this language to the Ace instance.
   * For more info on custom languages, see the [Code snippet API](/components/code-snippet?tabId=api) page.
   */
  language: CodeSnippetProps.Language;

  /**
   * Specifies the component preferences.
   *
   * If set to `undefined`, the component uses the following default value:
   *
   * ```
   * {
   *   showGutter: false,
   *   wrapLines: true,
   *   theme: 'dawn'
   * }
   * ```
   *
   * You can use any theme provided by Ace.
   */
  preferences?: Partial<CodeSnippetProps.Preferences>;

  /**
   * Renders the code snippet in a loading state.
   */
  loading?: boolean;

  /**
   * Called when the user clicks the recovery button in the error state.
   * Use this to retry loading the code snippet or to provide another option for the user to recover from the error.
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
   * @i18n
   */
  i18nStrings?: CodeSnippetProps.I18nStrings;

  /**
   * Adds `aria-label` to the code snippet's textarea element.
   */
  ariaLabel?: string;
}

// Prevents typescript from collapsing a string union type into a string type while still allowing any string.
// This leads to more helpful editor suggestions for known values.
// See: https://github.com/microsoft/TypeScript/issues/29729
type LiteralUnion<LiteralType, BaseType extends string> = LiteralType | (BaseType & { _?: never });

type BuiltInLanguage = typeof AceModes[number]['value'];

export namespace CodeSnippetProps {
  export type Language = LiteralUnion<BuiltInLanguage, string>;
  export type Theme = typeof LightThemes[number]['value'] | typeof DarkThemes[number]['value'];

  export interface AvailableThemes {
    light: ReadonlyArray<string>;
    dark: ReadonlyArray<string>;
  }

  export interface Preferences {
    showGutter: boolean;
    wrapLines: boolean;
    theme: Theme;
  }

  export interface I18nStrings {
    loadingState: string;
    errorState: string;
    errorStateRecovery: string;
    editorGroupAriaLabel: string;
  }

  export interface Ref {
    /**
     * Sets input focus onto the code editor control.
     */
    focus(): void;
  }
}
