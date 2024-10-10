// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import CollapsibleFlashbar from './collapsible-flashbar';
import { FlashbarProps } from './interfaces';
import { sendRenderMetric } from './internal/analytics';
import NonCollapsibleFlashbar from './non-collapsible-flashbar';

export { FlashbarProps };

export default function Flashbar(props: FlashbarProps) {
  useEffect(() => {
    if (props.items.length > 0) {
      sendRenderMetric(props.items);
    }
  }, [props.items]);

  const { __internalRootRef } = useBaseComponent('Flashbar', {
    props: { stackItems: props.stackItems },
  });

  if (props.items.length === 0) {
    return <></>;
  }

  if (props.stackItems) {
    return <CollapsibleFlashbar __internalRootRef={__internalRootRef} {...props} />;
  } else {
    return <NonCollapsibleFlashbar __internalRootRef={__internalRootRef} {...props} />;
  }
}

applyDisplayName(Flashbar, 'Flashbar');
