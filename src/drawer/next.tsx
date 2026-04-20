// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @cloudscape-design/build-tools/react-server-components-directive
'use client';
import React, { forwardRef, useImperativeHandle } from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import useBaseComponent from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { NextDrawerProps } from './interfaces';
import { InternalDrawer } from './internal';

export { NextDrawerProps };

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
    zIndex,
    closeAction,
    hideCloseAction = false,
    open,
    defaultOpen,
    onClose,
    ...props
  }: NextDrawerProps,
  ref: React.Ref<NextDrawerProps.Ref>
) {
  if (open !== undefined && defaultOpen !== undefined) {
    warnOnce('Drawer', 'You provided both `open` and `defaultOpen`. `defaultOpen` will be ignored in controlled mode.');
  }

  const [isOpen, setIsOpen] = useControllable(open, onClose, defaultOpen ?? true, {
    componentName: 'Drawer',
    controlledProp: 'open',
    changeHandler: 'onClose',
  });

  useImperativeHandle(
    ref,
    () => ({
      open() {
        if (open === undefined) {
          setIsOpen(true);
        }
      },
      close() {
        if (open === undefined) {
          setIsOpen(false);
        }
      },
      toggle() {
        if (open === undefined) {
          setIsOpen(current => !current);
        }
      },
    }),
    [open, setIsOpen]
  );

  const baseComponentProps = useBaseComponent('Drawer', {
    props: {
      disableContentPaddings,
      loading,
      placement,
      position,
      zIndex,
      hideCloseAction,
    },
    metadata: {
      hasHeader: !!header,
      hasHeaderActions: !!headerActions,
      hasFooter: !!footer,
      hasOffset: !!offset,
      hasStickyOffset: !!stickyOffset,
      hasCloseAction: !!closeAction,
    },
  });

  if (!isOpen) {
    return null;
  }

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
      closeAction={closeAction}
      hideCloseAction={hideCloseAction}
      onClose={onClose}
    />
  );
});

export default Drawer;

applyDisplayName(Drawer, 'Drawer');
