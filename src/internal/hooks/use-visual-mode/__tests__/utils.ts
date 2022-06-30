// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act } from '@testing-library/react';

export function mutate(mutation: () => void) {
  return act(() => {
    mutation();
    // mutation observers are triggered asynchronously
    // https://github.com/jsdom/jsdom/blob/04f6c13f4a4d387c7fc979b8f62c6f68d8a0c639/lib/jsdom/living/helpers/mutation-observers.js#L125
    return Promise.resolve();
  });
}
