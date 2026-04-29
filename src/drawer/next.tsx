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

// Matches App Layout drawers z-index.
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
    backdrop = false,
    onClose,
    focusBehavior,
    role,
    ...props
  }: NextDrawerProps,
  ref: React.Ref<NextDrawerProps.Ref>
) {
  if (backdrop && position !== 'fixed' && position !== 'absolute') {
    warnOnce('Drawer', `\`backdrop\` is not supported with position="${position}" and will be ignored.`);
  }
  if (open !== undefined && !onClose) {
    warnOnce(
      'Drawer',
      'You provided `open` without an `onClose` handler. The drawer will not respond to close actions.'
    );
  }

  const baseComponentProps = useBaseComponent('Drawer', {
    props: { disableContentPaddings, loading, placement, position, zIndex, hideCloseAction, backdrop, role },
    metadata: {
      hasHeader: !!header,
      hasHeaderActions: !!headerActions,
      hasFooter: !!footer,
      hasOffset: !!offset,
      hasStickyOffset: !!stickyOffset,
      hasCloseAction: !!closeAction,
      autoFocus: !!focusBehavior?.autoFocus,
      trapFocus: !!focusBehavior?.trapFocus,
      returnFocus: !!focusBehavior?.returnFocus,
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
      backdrop={backdrop}
      onClose={onClose}
      focusBehavior={focusBehavior}
      role={role}
    />
  );
});

export default Drawer;

applyDisplayName(Drawer, 'Drawer');
