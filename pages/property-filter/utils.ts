// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function encode<T>(queryObject: T): string {
  return encodeURIComponent(JSON.stringify(queryObject));
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
