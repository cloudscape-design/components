// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';

export default function FocusTarget({ ariaLabel }: { ariaLabel?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(divRef);

  return (
    <div role="group" ref={divRef} tabIndex={tabIndex} aria-label={ariaLabel} data-awsui-tree-view-toggle-button={true}>
      {null}
    </div>
  );
}
