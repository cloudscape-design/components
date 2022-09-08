// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { padLeftZeros } from '../strings';

/**
 * Transforms Date's object time part to a string.
 */
export const formatTime = (value: Date): string => {
  const hours = padLeftZeros(`${value.getHours()}`, 2);
  const minutes = padLeftZeros(`${value.getMinutes()}`, 2);
  const seconds = padLeftZeros(`${value.getSeconds()}`, 2);
  return `${hours}:${minutes}:${seconds}`;
};
