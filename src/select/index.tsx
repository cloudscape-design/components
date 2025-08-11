// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { getExternalProps } from '../internal/utils/external-props.js';
import { GeneratedAnalyticsMetadataSelectComponent } from './analytics-metadata/interfaces.js';
import { SelectProps } from './interfaces.js';
import InternalSelect from './internal.js';

export { SelectProps };

import analyticsSelectors from '../internal/components/button-trigger/analytics-metadata/styles.css.js';

const Select = React.forwardRef(
  (
    {
      options = [],
      filteringType = 'none',
      statusType = 'finished',
      triggerVariant = 'label',
      ...restProps
    }: SelectProps,
    ref: React.Ref<SelectProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Select', {
      props: {
        autoFocus: restProps.autoFocus,
        expandToViewport: restProps.expandToViewport,
        filteringType,
        triggerVariant,
        virtualScroll: restProps.virtualScroll,
        readOnly: restProps.readOnly,
      },
      metadata: {
        hasInlineLabel: Boolean(restProps.inlineLabelText),
        hasDisabledReasons: options.some(option => Boolean(option.disabledReason)),
      },
    });
    const externalProps = getExternalProps(restProps);

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataSelectComponent = {
      name: 'awsui.Select',
      label: `.${analyticsSelectors['button-trigger']}`,
      properties: {
        disabled: `${!!externalProps.disabled}`,
        selectedOptionValue: `${externalProps.selectedOption && externalProps.selectedOption.value ? externalProps.selectedOption.value : null}`,
      },
    };

    return (
      <InternalSelect
        options={options}
        filteringType={filteringType}
        statusType={statusType}
        triggerVariant={triggerVariant}
        {...externalProps}
        {...baseComponentProps}
        ref={ref}
        {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
      />
    );
  }
);

applyDisplayName(Select, 'Select');
export default Select;
