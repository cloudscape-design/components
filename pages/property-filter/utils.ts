// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function encode<T>(queryObject: T): string {
  try {
    return encodeURIComponent(JSON.stringify(queryObject));
  } catch (error) {
    // Thrown if uriComponent contains a lone surrogate (like 0xD800–0xDBFF)
    return '';
  }
}

export function decode<T>(queryString: string, defaultResult: T): T;
export function decode<T>(queryString: string, defaultResult?: undefined): T | null;
export function decode<T>(queryString: string, defaultResult?: T): T | null {
  try {
    return JSON.parse(decodeURIComponent(queryString));
  } catch (error) {
    return defaultResult ?? null;
  }
}
