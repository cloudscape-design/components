// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const generatePlaceholder = (monthOnly: boolean, isIso: boolean) => {
  const separator = isIso ? '-' : '/';
  return `YYYY${separator}${monthOnly ? 'MM' : 'MM' + separator + 'DD'}`;
};
