// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AutosuggestI18n {
  enteredTextLabel: ({ value }: { value: string }) => string;
  selectedAriaLabel: string;
}
