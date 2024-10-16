// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
      ...restProps
    }: MultiselectProps,
    ref: React.Ref<MultiselectProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Multiselect', {
      props: {
        autoFocus: restProps.autoFocus,
        expandToViewport: restProps.expandToViewport,
        filteringType,
        hideTokens,
        keepOpen,
        tokenLimit: restProps.tokenLimit,
        virtualScroll: restProps.virtualScroll,
        readOnly: restProps.readOnly,
      },
    });

    // Private API for inline tokens
    const inlineTokens = Boolean((restProps as any).inlineTokens);

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataMultiselectComponent = {
      name: 'awsui.Multiselect',
      label: `.${buttonTriggerAnalyticsSelectors['button-trigger']}`,
      properties: {
        disabled: `${!!restProps.disabled}`,
        selectedOptionsCount: `${selectedOptions.length}`,
      },
    };

    return (
      <InternalMultiselect
        options={options}
        filteringType={filteringType}
        statusType={statusType}
        selectedOptions={selectedOptions}
        keepOpen={keepOpen}
        hideTokens={hideTokens}
        inlineTokens={inlineTokens}
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
