// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InternalInputProps } from '../../../input/internal';

export interface DateInputProps extends InternalInputProps {
  /**
   * Disable value autocompletion when input is blurred
   */
  disableAutocompleteOnBlur?: boolean;
}

export namespace DateInputProps {
  export interface Ref {
    /**
     * Sets input focus onto the UI control.
     */
    focus(): void;
  }
}
