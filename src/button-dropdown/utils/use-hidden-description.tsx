// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useUniqueId } from '../../internal/hooks/use-unique-id';

export default function useHiddenDescription(description?: string) {
  const id = useUniqueId();
  return {
    targetProps: {
      'aria-describedby': description ? id : undefined,
    },
    descriptionEl: description ? (
      <span id={id} hidden={true}>
        {description}
      </span>
    ) : null,
  };
}
