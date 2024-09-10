// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { GeneratedAnalyticsMetadataSelectComponent } from './analytics-metadata/interfaces';
import { SelectProps } from './interfaces';
import InternalSelect from './internal';

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
      },
    });
    const externalProps = getExternalProps(restProps);

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataSelectComponent = {
      name: 'awsui.Select',
      label: `.${analyticsSelectors['button-trigger']}`,
      properties: {
        disabled: `${!!externalProps.disabled}`,
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
