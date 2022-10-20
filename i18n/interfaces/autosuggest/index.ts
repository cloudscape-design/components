// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface AutosuggestI18n {
  enteredTextLabel: ({ value }: { value: string }) => string;
  selectedAriaLabel: string;
}
