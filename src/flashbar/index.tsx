// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FlashbarProps } from './interfaces';
import CollapsibleFlashbar from './collapsible-flashbar';
import NonCollapsibleFlashbar from './non-collapsible-flashbar';

import { sendRenderMetric } from './internal/analytics';

export { FlashbarProps };

export default function Flashbar(props: FlashbarProps) {
  useEffect(() => {
    if (props.items.length > 0) {
      sendRenderMetric(props.items);
    }
  }, [props.items]);

  if (props.stackItems) {
    return <CollapsibleFlashbar {...props} />;
  } else {
    return <NonCollapsibleFlashbar {...props} />;
  }
}

applyDisplayName(Flashbar, 'Flashbar');
