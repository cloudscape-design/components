// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const hasRandomUuidSupport = (): boolean => {
  return !!window.crypto && !!crypto.randomUUID;
};

/**
 * Generates a random UUID (derived from https://stackoverflow.com/questions/59412625/generate-random-uuid-javascript)
 * Only used as a fallback in getUuid
 * @returns {string} UUID
 */
const uuidv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Generates a random UUID. If the global crypto property is not available, it uses the less optimal fallback function.
 * @returns {string} UUID
 */
export const getUuid = (): string => {
  if (!hasRandomUuidSupport()) {
    return uuidv4();
  }

  return crypto.randomUUID();
};
