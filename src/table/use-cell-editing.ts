// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

export function useCellEditing() {
  const [currentEditCell, setCurrentEditCell] = useState<[number, number] | null>(null);
  const [lastSuccessfulEditCell, setLastSuccessfulEditCell] = useState<[number, number] | null>(null);
  const [currentEditLoading, setCurrentEditLoading] = useState(false);

  return {
    currentEditCell,
    setCurrentEditCell,
    lastSuccessfulEditCell,
    setLastSuccessfulEditCell,
    currentEditLoading,
    setCurrentEditLoading,
  };
}
