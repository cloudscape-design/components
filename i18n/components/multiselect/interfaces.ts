// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MultiselectI18n {
  deselectAriaLabel: ({ optionLabel }: { optionLabel: string }) => string;
  selectedAriaLabel: string;
  i18nStrings: {
    tokenLimitShowFewer: string;
    tokenLimitShowMore: string;
  };
}
