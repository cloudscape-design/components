// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { getBaseProps } from '../internal/base-component/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { GeneratedAnalyticsMetadataButtonDropdownComponent } from './analytics-metadata/interfaces.js';
import { ButtonDropdownProps } from './interfaces.js';
import InternalButtonDropdown from './internal.js';
import { hasCheckboxItems, hasDisabledReasonItems } from './utils/utils.js';

import analyticsSelectors from './analytics-metadata/styles.css.js';

export { ButtonDropdownProps };

const ButtonDropdown = React.forwardRef(
  (
    {
      items,
      variant = 'normal',
      loading = false,
      loadingText,
      disabled = false,
      disabledReason,
      expandableGroups = false,
      expandToViewport = false,
      ariaLabel,
      children,
      onItemClick,
      onItemFollow,
      mainAction,
      fullWidth,
      nativeMainActionAttributes,
      nativeTriggerAttributes,
      ...props
    }: ButtonDropdownProps,
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('ButtonDropdown', {
      props: { expandToViewport, expandableGroups, variant },
      metadata: {
        mainAction: !!mainAction,
        checkboxItems: hasCheckboxItems(items),
        hasDisabledReason: Boolean(disabledReason),
        hasDisabledReasons: hasDisabledReasonItems(items),
      },
    });
    const baseProps = getBaseProps(props);

    const analyticsComponentMetadata: GeneratedAnalyticsMetadataButtonDropdownComponent = {
      name: 'awsui.ButtonDropdown',
      label: `.${analyticsSelectors['trigger-label']}`,
      properties: { variant, disabled: `${disabled}` },
    };

    return (
      <InternalButtonDropdown
        {...baseProps}
        {...baseComponentProps}
        ref={ref}
        items={items}
        variant={variant}
        loading={loading}
        loadingText={loadingText}
        disabled={disabled}
        disabledReason={disabledReason}
        expandableGroups={expandableGroups}
        expandToViewport={expandToViewport}
        ariaLabel={ariaLabel}
        onItemClick={onItemClick}
        onItemFollow={onItemFollow}
        mainAction={mainAction}
        fullWidth={fullWidth}
        nativeMainActionAttributes={nativeMainActionAttributes}
        nativeTriggerAttributes={nativeTriggerAttributes}
        {...getAnalyticsMetadataAttribute({
          component: analyticsComponentMetadata,
        })}
      >
        {children}
      </InternalButtonDropdown>
    );
  }
);

applyDisplayName(ButtonDropdown, 'ButtonDropdown');
export default ButtonDropdown;
