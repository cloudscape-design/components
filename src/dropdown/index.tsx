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
  content,
  trigger,
  open,
  onDropdownClose,
  header,
  footer,
  dropdownId,
  sizing = 'min-trigger-width',
  height = 'fit-content',
  alignment = 'start',
  stretchTrigger = false,
  expandToViewport = false,
  loopFocus,
  onFocus,
  onBlur,
  contentKey,
  contentId,
  role,
  ariaLabelledby,
  ariaDescribedby,
  ...props
}: DropdownProps) => {
  // Map sizing strategy to internal props
  const getSizingProps = () => {
    switch (sizing) {
      case 'fit-content':
        return {
          stretchWidth: false,
          stretchToTriggerWidth: false,
          stretchBeyondTriggerWidth: false,
          minWidth: undefined,
        };
      case 'match-trigger':
        return {
          stretchWidth: true,
          stretchToTriggerWidth: true,
          stretchBeyondTriggerWidth: false,
          minWidth: undefined,
        };
      case 'min-trigger-width':
        return {
          stretchWidth: false,
          stretchToTriggerWidth: true,
          stretchBeyondTriggerWidth: true,
          minWidth: undefined,
        };
      case 'full-width':
        return {
          stretchWidth: true,
          stretchToTriggerWidth: false,
          stretchBeyondTriggerWidth: false,
          minWidth: undefined,
        };
      default:
        return {
          stretchWidth: false,
          stretchToTriggerWidth: true,
          stretchBeyondTriggerWidth: true,
          minWidth: undefined,
        };
    }
  };

  // Map height strategy to internal prop
  const stretchHeight = height === 'full-height';

  // Map alignment to internal prop
  const preferCenter = alignment === 'center';

  // Compute loopFocus default based on expandToViewport if not explicitly set
  const computedLoopFocus = loopFocus ?? expandToViewport;

  const sizingProps = getSizingProps();

  const baseComponentProps = useBaseComponent('Dropdown', {
    props: {
      expandToViewport,
      alignment,
      sizing,
      height,
      stretchTrigger,
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
      stretchTriggerHeight={stretchTrigger}
      stretchWidth={sizingProps.stretchWidth}
      stretchHeight={stretchHeight}
      stretchToTriggerWidth={sizingProps.stretchToTriggerWidth}
      stretchBeyondTriggerWidth={sizingProps.stretchBeyondTriggerWidth}
      expandToViewport={expandToViewport}
      preferCenter={preferCenter}
      interior={false}
      scrollable={true}
      loopFocus={computedLoopFocus}
      onFocus={onFocus}
      onBlur={onBlur}
      contentKey={contentKey}
      dropdownContentId={contentId}
      dropdownContentRole={role}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
    >
      {content}
    </InternalDropdown>
  );
};

applyDisplayName(Dropdown, 'Dropdown');

/**
 * @awsuiSystem core
 */
export default Dropdown;
