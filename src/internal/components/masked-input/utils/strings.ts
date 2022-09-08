// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const insertAt = (text: string, toInsert: string, start: number, end: number = start): string =>
  text.slice(0, start) + toInsert + text.slice(end);
