// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect } from 'react';

import { FlashbarPropsSetter } from '../app-layout/visual-refresh-toolbar/state/runtime-notifications';
import { createWidgetizedComponent } from '../internal/widgets';
import CollapsibleFlashbar from './collapsible-flashbar';
import { FlashbarProps, InternalFlashbarProps } from './interfaces';
import NonCollapsibleFlashbar from './non-collapsible-flashbar';

function FlashbarPropagator({
  props,
  setFlashbarProps,
}: {
  props: FlashbarProps;
  setFlashbarProps: (props: FlashbarProps | null) => void;
}) {
  useEffect(() => {
    setFlashbarProps(props);
    return () => setFlashbarProps(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function FlashbarImplementation(props: InternalFlashbarProps) {
  const setFlashbarProps = useContext(FlashbarPropsSetter);
  if (setFlashbarProps) {
    return <FlashbarPropagator props={props} setFlashbarProps={setFlashbarProps} />;
  }
  if (props.stackItems) {
    return <CollapsibleFlashbar {...props} />;
  } else {
    return <NonCollapsibleFlashbar {...props} />;
  }
}

export const createWidgetizedFlashbar = createWidgetizedComponent(FlashbarImplementation);
