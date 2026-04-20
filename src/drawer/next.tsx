// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @cloudscape-design/build-tools/react-server-components-directive
'use client';
import React, { forwardRef } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { NextDrawerProps } from './interfaces';
import { InternalDrawer } from './internal';

export { NextDrawerProps };

const DEFAULT_Z_INDEX = 830;

const Drawer = forwardRef(function Drawer(
  {
    header,
    headerActions,
    footer,
    disableContentPaddings = false,
    loading = false,
    position = 'static',
    placement = 'end',
    offset,
    stickyOffset,
    zIndex = DEFAULT_Z_INDEX,
    closeAction,
    hideCloseAction = false,
    open,
    defaultOpen,
    backdrop = false,
    onClose,
    ...props
  }: NextDrawerProps,
  ref: React.Ref<NextDrawerProps.Ref>
) {
  if (open !== undefined && defaultOpen !== undefined) {
    warnOnce('Drawer', 'You provided both `open` and `defaultOpen`. `defaultOpen` will be ignored in controlled mode.');
  }
  if (backdrop && position !== 'fixed' && position !== 'absolute') {
    warnOnce('Drawer', `\`backdrop\` is not supported with position="${position}" and will be ignored.`);
  }

  const baseComponentProps = useBaseComponent('Drawer', {
    props: { disableContentPaddings, loading, placement, position, zIndex, hideCloseAction, backdrop },
    metadata: {
      hasHeader: !!header,
      hasHeaderActions: !!headerActions,
      hasFooter: !!footer,
      hasOffset: !!offset,
      hasStickyOffset: !!stickyOffset,
      hasCloseAction: !!closeAction,
    },
  });

  return (
    <InternalDrawer
      {...getExternalProps(props)}
      {...baseComponentProps}
      __ref={ref}
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
      closeAction={closeAction}
      hideCloseAction={hideCloseAction}
      open={open}
      defaultOpen={defaultOpen}
      backdrop={backdrop}
      onClose={onClose}
    />
  );
});

export default Drawer;

applyDisplayName(Drawer, 'Drawer');
