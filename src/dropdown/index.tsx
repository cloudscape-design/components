// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { DropdownProps } from './interfaces';
import InternalDropdown from './internal';

export { DropdownProps };

const Dropdown = ({
  children,
  trigger,
  open,
  onDropdownClose,
  header,
  footer,
  dropdownId,
  stretchTriggerHeight = false,
  stretchWidth = true,
  stretchHeight = false,
  stretchToTriggerWidth = true,
  stretchBeyondTriggerWidth = false,
  expandToViewport = false,
  preferCenter = false,
  interior = false,
  minWidth,
  scrollable = true,
  loopFocus,
  onFocus,
  onBlur,
  contentKey,
  dropdownContentId,
  dropdownContentRole,
  ariaLabelledby,
  ariaDescribedby,
  ...props
}: DropdownProps) => {
  const baseComponentProps = useBaseComponent('Dropdown', {
    props: {
      expandToViewport,
      interior,
      preferCenter,
      stretchBeyondTriggerWidth,
      stretchHeight,
      stretchToTriggerWidth,
      stretchTriggerHeight,
      stretchWidth,
    },
  });

  return (
    <InternalDropdown
      {...props}
      {...baseComponentProps}
      trigger={trigger}
      open={open}
      onDropdownClose={onDropdownClose}
      header={header}
      footer={footer}
      dropdownId={dropdownId}
      stretchTriggerHeight={stretchTriggerHeight}
      stretchWidth={stretchWidth}
      stretchHeight={stretchHeight}
      stretchToTriggerWidth={stretchToTriggerWidth}
      stretchBeyondTriggerWidth={stretchBeyondTriggerWidth}
      expandToViewport={expandToViewport}
      preferCenter={preferCenter}
      interior={interior}
      minWidth={minWidth}
      scrollable={scrollable}
      loopFocus={loopFocus}
      onFocus={onFocus}
      onBlur={onBlur}
      contentKey={contentKey}
      dropdownContentId={dropdownContentId}
      dropdownContentRole={dropdownContentRole}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
    >
      {children}
    </InternalDropdown>
  );
};

applyDisplayName(Dropdown, 'Dropdown');

/**
 * @awsuiSystem core
 */
export default Dropdown;
