// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// useId polyfill for React 16 (React 18 has it natively)
import React from 'react';

let counter = 0;

// Use React 18's useId if available, otherwise fall back to a counter
export const useId: () => string =
  (React as any).useId ??
  function useId() {
    const [id] = React.useState(() => `:r${counter++}:`);
    return id;
  };
