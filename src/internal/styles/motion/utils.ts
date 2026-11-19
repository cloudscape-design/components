// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';

export const spinWhenOpen = (styles: Record<string, string>, className: string, open: boolean) =>
  clsx(styles[className], open && styles[`${className}-open`]);
