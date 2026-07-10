// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Prefixes given text with zeros until it reaches the target length.
 */
export function padLeftZeros(text: string, length: number): string {
  return text.padStart(length, '0');
}
