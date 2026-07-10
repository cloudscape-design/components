// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataButtonDropdownComponent } from './analytics-metadata/interfaces';
import { ButtonDropdownProps } from './interfaces';
import InternalButtonDropdown from './internal';
import { hasCheckboxItems, hasDisabledReasonItems } from './utils/utils';

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
      iconName,
      iconAlt,
      iconUrl,
      iconSvg,
      children,
      onItemClick,
      onItemFollow,
      mainAction,
      fullWidth,
      nativeMainActionAttributes,
      nativeTriggerAttributes,
      renderItem,
      filteringType = 'none',
      filteringPlaceholder,
      filteringAriaLabel,
      filteringClearAriaLabel,
      filteringResultsText,
      noMatch,
      i18nStrings,
      ...props
    }: ButtonDropdownProps,
    ref: React.Ref<ButtonDropdownProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('ButtonDropdown', {
      props: { expandToViewport, expandableGroups, variant, iconName, filteringType },
      metadata: {
        mainAction: !!mainAction,
        checkboxItems: hasCheckboxItems(items),
        hasCustomIcon: Boolean(iconUrl || iconSvg || iconName),
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
        renderItem={renderItem}
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
        iconName={iconName}
        iconAlt={iconAlt}
        iconUrl={iconUrl}
        iconSvg={iconSvg}
        onItemClick={onItemClick}
        onItemFollow={onItemFollow}
        mainAction={mainAction}
        fullWidth={fullWidth}
        nativeMainActionAttributes={nativeMainActionAttributes}
        nativeTriggerAttributes={nativeTriggerAttributes}
        filteringType={filteringType}
        filteringPlaceholder={filteringPlaceholder}
        filteringAriaLabel={filteringAriaLabel}
        filteringClearAriaLabel={filteringClearAriaLabel}
        filteringResultsText={filteringResultsText}
        noMatch={noMatch}
        i18nStrings={i18nStrings}
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
