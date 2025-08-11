// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { getExternalProps } from '../internal/utils/external-props.js';
import { GeneratedAnalyticsMetadataAutosuggestComponent } from './analytics-metadata/interfaces.js';
import { AutosuggestProps } from './interfaces.js';
import InternalAutosuggest from './internal.js';

export { AutosuggestProps };

const Autosuggest = React.forwardRef(
  (
    { filteringType = 'auto', statusType = 'finished', disableBrowserAutocorrect = false, ...props }: AutosuggestProps,
    ref: React.Ref<AutosuggestProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Autosuggest', {
      props: {
        autoFocus: props.autoFocus,
        disableBrowserAutocorrect,
        expandToViewport: props.expandToViewport,
        filteringType,
        readOnly: props.readOnly,
        virtualScroll: props.virtualScroll,
      },
    });

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataAutosuggestComponent = {
      name: 'awsui.Autosuggest',
      label: 'input',
      properties: {
        disabled: `${!!props.disabled}`,
        value: props.value || '',
      },
    };

    const externalProps = getExternalProps(props);
    return (
      <InternalAutosuggest
        filteringType={filteringType}
        statusType={statusType}
        disableBrowserAutocorrect={disableBrowserAutocorrect}
        {...externalProps}
        {...baseComponentProps}
        ref={ref}
        {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
      />
    );
  }
);

applyDisplayName(Autosuggest, 'Autosuggest');
export default Autosuggest;
