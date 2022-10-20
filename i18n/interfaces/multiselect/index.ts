// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface MultiselectI18n {
  deselectAriaLabel: ({ optionLabel }: { optionLabel: string }) => string;
  selectedAriaLabel: string;
  i18nStrings: {
    tokenLimitShowFewer: string;
    tokenLimitShowMore: string;
  };
}
