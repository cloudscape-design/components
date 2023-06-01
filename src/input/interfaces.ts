// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { BaseKeyDetail, CancelableEventHandler, NonCancelableEventHandler } from '../internal/events';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';

export interface BaseInputProps {
  /**
   * Specifies the text entered into the form element.
   */
  value: string;

  /**
   * Specifies the name of the control used in HTML forms.
   */
  name?: string;

  /**
   * Specifies the placeholder text rendered when the value is an empty string.
   */
  placeholder?: string;

  /**
   * Specifies if the control is disabled, which prevents the
   * user from modifying the value and prevents the value from
   * being included in a form submission. A disabled control can't
   * receive focus.
   */
  disabled?: boolean;

  /**
   * Specifies if the control is read only, which prevents the
   * user from modifying the value but includes it in a form
   * submission. A read-only control can receive focus.
   *
   * Don't use read-only inputs outside a form.
   */
  readOnly?: boolean;

  /**
   * Indicates whether the control should be focused as
   * soon as the page loads, which enables the user to
   * start typing without having to manually focus the control. Don't
   * use this option on pages where the control may be
   * scrolled out of the viewport.
   */
  autoFocus?: boolean;

  /**
   * Adds an `aria-label` to the native control.
   *
   * Use this if you don't have a visible label for this control.
   */
  ariaLabel?: string;

  /**
   * Specifies whether to add `aria-required` to the native control.
   */
  ariaRequired?: boolean;

  /**
   * Called when input focus is removed from the UI control.
   */
  onBlur?: NonCancelableEventHandler<null>;

  /**
   * Called when input focus is moved to the UI control.
   */
  onFocus?: NonCancelableEventHandler<null>;

  /**
   * Called whenever a user changes the input value (by typing or pasting).
   * The event `detail` contains the current value of the field.
   */
  onChange?: NonCancelableEventHandler<InputProps.ChangeDetail>;
}

export interface InputAutoCorrect {
  /**
   * Specifies whether to disable browser autocorrect and related features.
   * If you set this to `true`, it disables any native browser capabilities
   * that automatically correct user input, such as `autocorrect` and
   * `autocapitalize`. If you don't set it, the behavior follows the default behavior
   * of the user's browser.
   */
  disableBrowserAutocorrect?: boolean;
}

export interface InputAutoComplete {
  /**
   * Specifies whether to enable a browser's autocomplete functionality for this input.
   * In some cases it might be appropriate to disable autocomplete (for example, for security-sensitive fields).
   * To use it correctly, set the `name` property.
   *
   * You can either provide a boolean value to set the property to "on" or "off", or specify a string value
   * for the [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) attribute.
   */
  autoComplete?: boolean | string;
}

export interface InputSpellcheck {
  /**
   * Specifies the value of the `spellcheck` attribute on the native control.
   * This value controls the native browser capability to check for spelling/grammar errors.
   * If not set, the browser default behavior is to perform spellchecking.
   * For more details, check the [spellcheck MDN article](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck).
   *
   * Enhanced spellchecking features of your browser and/or operating system may send input values to external parties.
   * Make sure it’s deactivated for fields with sensitive information to prevent
   * inadvertently sending data (such as user passwords) to third parties.
   */
  spellcheck?: boolean;
}

export interface InputKeyEvents {
  /**
   * Called when the underlying native textarea emits a `keydown` event.
   * The event `detail` contains the `keyCode` and information
   * about modifiers (that is, CTRL, ALT, SHIFT, META, etc.).
   */
  onKeyDown?: CancelableEventHandler<InputProps.KeyDetail>;

  /**
   * Called when the underlying native textarea emits a `keyup` event.
   * The event `detail` contains the `keyCode` and information
   * about modifiers (that is, CTRL, ALT, SHIFT, META, etc.).
   */
  onKeyUp?: CancelableEventHandler<InputProps.KeyDetail>;
}

export interface InputClearLabel {
  /**
   * Adds an `aria-label` to the clear button inside the search input.
   * @i18n
   */
  clearAriaLabel?: string;
}

export interface InputProps
  extends BaseComponentProps,
    BaseInputProps,
    InputKeyEvents,
    InputAutoCorrect,
    InputAutoComplete,
    InputSpellcheck,
    InputClearLabel,
    FormFieldValidationControlProps {
  /**
   * Specifies the type of control to render.
   * Inputs with a `number` type use the native element behavior, which might
   * be slightly different across browsers.
   */
  type?: InputProps.Type;

  /**
   * Adds a hint to the browser about the type of data a user may enter into this field.
   * Some devices may render a different virtual keyboard depending on this value.
   * This value may not be supported by all browsers or devices.
   */
  inputMode?: InputProps.InputMode;

  /**
   * The step attribute is a number that specifies the granularity that the value
   * must adhere to or the keyword "any". It is valid for the numeric input types,
   * including the date, month, week, time, datetime-local, number and range types.
   */
  step?: InputProps.Step;
}

export namespace InputProps {
  export type Type = 'text' | 'password' | 'search' | 'number' | 'email' | 'url';
  export type InputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  export type Step = number | 'any';

  export type ChangeDetail = BaseChangeDetail;
  export type KeyDetail = BaseKeyDetail;

  export interface Ref {
    /**
     * Sets input focus onto the UI control.
     */
    focus(): void;

    /**
     * Selects all text in the input control.
     */
    select(): void;
  }
}
export interface BaseChangeDetail {
  value: string;
}
