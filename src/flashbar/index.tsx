// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FlashbarProps, CollapsibleFlashbarProps } from './interfaces';
import CollapsibleFlashbar from './collapsible-flashbar';
import NonCollapsibleFlashbar from './non-collapsible-flashbar';

import { sendRenderMetric } from './internal/analytics';

export { FlashbarProps };

export default function Flashbar(props: FlashbarProps | CollapsibleFlashbarProps) {
  useEffect(() => {
    if (props.items.length > 0) {
      sendRenderMetric(props.items);
    }
  }, [props.items]);

  if (isStackedFlashbar(props)) {
    return <CollapsibleFlashbar {...props} />;
  } else {
    return <NonCollapsibleFlashbar {...props} />;
  }
}

function isStackedFlashbar(props: any): props is CollapsibleFlashbarProps {
  return 'collapsible' in props && props.collapsible;
}

applyDisplayName(Flashbar, 'Flashbar');
