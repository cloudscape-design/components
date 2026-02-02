// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { DropdownProps } from './interfaces';
import InternalDropdown from './internal';

export { DropdownProps } from './interfaces';

const Dropdown = ({
  content,
  trigger,
  open,
  onClose,
  header,
  footer,
  minWidth = 'trigger',
  maxWidth,
  alignment = 'start',
  expandToViewport = false,
  loopFocus,
  onFocusIn,
  onFocusOut,
  contentKey,
  role,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ...props
}: DropdownProps) => {
  const baseComponentProps = useBaseComponent('Dropdown', {
    props: {
      expandToViewport,
      minWidth,
      maxWidth,
      alignment,
    },
  });

  // Generate a unique ID for ariaLabel if provided
  const generatedLabelId = useUniqueId('dropdown-label-');
  const effectiveAriaLabelledby = ariaLabel ? generatedLabelId : ariaLabelledby;

  // Translate minWidth constraint to internal props
  const internalMinWidthProps =
    minWidth === 'trigger'
      ? { stretchToTriggerWidth: true, minWidth: undefined }
      : typeof minWidth === 'number'
        ? { stretchToTriggerWidth: false, minWidth: minWidth }
        : { stretchToTriggerWidth: true, minWidth: undefined };

  // Translate maxWidth constraint to internal props
  const internalMaxWidthProps =
    maxWidth === 'trigger'
      ? { stretchBeyondTriggerWidth: false, stretchWidth: true }
      : typeof maxWidth === 'number'
        ? { stretchBeyondTriggerWidth: false, stretchWidth: false }
        : typeof minWidth === 'number'
          ? { stretchBeyondTriggerWidth: true, stretchWidth: true }
          : { stretchBeyondTriggerWidth: true, stretchWidth: false };

  // Translate alignment to internal preferCenter prop
  const preferCenter = alignment === 'center';

  // Set default loopFocus based on expandToViewport if not explicitly provided
  const effectiveLoopFocus = loopFocus ?? expandToViewport;

  // Wrap content with width constraints
  const hasNumericMinWidth = typeof minWidth === 'number';
  const hasNumericMaxWidth = typeof maxWidth === 'number';
  const constrainedContent =
    hasNumericMinWidth || hasNumericMaxWidth ? (
      <div
        style={{
          width: '100%',
          ...(hasNumericMinWidth && { minWidth: `${minWidth}px` }),
          ...(hasNumericMaxWidth && { maxWidth: `${maxWidth}px` }),
        }}
      >
        {content}
      </div>
    ) : (
      content
    );

  return (
    <>
      {/* Hidden label element for ariaLabel */}
      {ariaLabel && (
        <span id={generatedLabelId} style={{ display: 'none' }}>
          {ariaLabel}
        </span>
      )}

      <InternalDropdown
        {...props}
        {...baseComponentProps}
        trigger={trigger}
        open={open}
        onDropdownClose={onClose}
        header={header}
        footer={footer}
        stretchTriggerHeight={false}
        stretchHeight={false}
        {...internalMinWidthProps}
        {...internalMaxWidthProps}
        expandToViewport={expandToViewport}
        preferCenter={preferCenter}
        scrollable={true}
        loopFocus={effectiveLoopFocus}
        onFocus={onFocusIn}
        onBlur={onFocusOut}
        contentKey={contentKey}
        dropdownContentRole={role}
        ariaLabelledby={effectiveAriaLabelledby}
        ariaDescribedby={ariaDescribedby}
      >
        {constrainedContent}
      </InternalDropdown>
    </>
  );
};

applyDisplayName(Dropdown, 'Dropdown');

/**
 * @awsuiSystem core
 */
export default Dropdown;
