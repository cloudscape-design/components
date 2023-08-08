// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

export function useCompactMode() {
  const isCompactMode = typeof document !== 'undefined' && !!document.querySelector('.awsui-compact-mode');
  const [compactMode, setCompactMode] = useState(isCompactMode);

  useEffect(() => {
    setCompactMode(isCompactMode);
  }, [isCompactMode]);

  return compactMode;
}
