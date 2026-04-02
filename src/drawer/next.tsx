// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @cloudscape-design/build-tools/react-server-components-directive
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { NextDrawerProps } from './interfaces';
import { InternalDrawer } from './internal';

export { NextDrawerProps };

const Drawer = function Drawer({
  header,
  headerActions,
  footer,
  disableContentPaddings = false,
  loading = false,
  position = 'static',
  placement = 'end',
  offset,
  stickyOffset,
  zIndex,
  ...props
}: NextDrawerProps) {
  const baseComponentProps = useBaseComponent('Drawer', {
    props: {
      disableContentPaddings,
      loading,
      placement,
      position,
      zIndex,
    },
    metadata: {
      hasHeader: !!header,
      hasHeaderActions: !!headerActions,
      hasFooter: !!footer,
      hasOffset: !!offset,
      hasStickyOffset: !!stickyOffset,
    },
  });
  return (
    <InternalDrawer
      {...getExternalProps(props)}
      {...baseComponentProps}
      header={header}
      headerActions={headerActions}
      footer={footer}
      disableContentPaddings={disableContentPaddings}
      loading={loading}
      placement={placement}
      position={position}
      offset={offset}
      stickyOffset={stickyOffset}
      zIndex={zIndex}
    />
  );
};

export default Drawer;

applyDisplayName(Drawer, 'Drawer');
