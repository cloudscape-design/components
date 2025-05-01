// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export function validateArrayType(value: any) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' || React.isValidElement(value)) {
    return [value];
  }

  return value; // Return the original value if it's not a string, React node, or already an array
}
