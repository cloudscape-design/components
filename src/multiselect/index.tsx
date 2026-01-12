// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataMultiselectComponent } from './analytics-metadata/interfaces';
import { MultiselectProps } from './interfaces';
import InternalMultiselect from './internal';

import buttonTriggerAnalyticsSelectors from '../internal/components/button-trigger/analytics-metadata/styles.css.js';

export { MultiselectProps };

const Multiselect = React.forwardRef(
  (
    {
      options = [],
      filteringType = 'none',
      statusType = 'finished',
      selectedOptions = [],
      keepOpen = true,
      hideTokens = false,
      renderOption,
      ...restProps
    }: MultiselectProps,
    ref: React.Ref<MultiselectProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Multiselect', {
      props: {
        inlineTokens: restProps.inlineTokens,
        autoFocus: restProps.autoFocus,
        expandToViewport: restProps.expandToViewport,
        filteringType,
        hideTokens,
        keepOpen,
        tokenLimit: restProps.tokenLimit,
        virtualScroll: restProps.virtualScroll,
        readOnly: restProps.readOnly,
        enableSelectAll: restProps.enableSelectAll,
      },
      metadata: {
        hasInlineLabel: Boolean(restProps.inlineLabelText),
        hasDisabledReasons: options.some(option => Boolean(option.disabledReason)),
      },
    });

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataMultiselectComponent = {
      name: 'awsui.Multiselect',
      label: `.${buttonTriggerAnalyticsSelectors['button-trigger']}`,
      properties: {
        disabled: `${!!restProps.disabled}`,
        selectedOptionsCount: `${selectedOptions.length}`,
        selectedOptionsValues: selectedOptions
          .filter(option => option.value !== undefined)
          .map(option => `${option.value}`),
        selectedOptionsLabels: selectedOptions
          .filter(option => option.value !== undefined)
          // fallback on value when label's undefined because in the dropdown if there's no label
          // the value will be shown.
          .map(option => `${option.label ?? option.value}`),
      },
    };

    return (
      <InternalMultiselect
        renderOption={renderOption}
        options={options}
        filteringType={filteringType}
        statusType={statusType}
        selectedOptions={selectedOptions}
        keepOpen={keepOpen}
        hideTokens={hideTokens}
        {...restProps}
        {...baseComponentProps}
        ref={ref}
        {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
      />
    );
  }
);

applyDisplayName(Multiselect, 'Multiselect');
export default Multiselect;
