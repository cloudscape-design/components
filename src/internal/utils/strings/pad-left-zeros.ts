// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Prefixes given text with zeros until it reaches the target length.
 */
export function padLeftZeros(text: string, length: number): string {
  while (text.length < length) {
    text = `0${text}`;
  }
  return text;
}
