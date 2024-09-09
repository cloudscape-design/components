// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { GeneratedAnalyticsMetadataAutosuggestComponent } from './analytics-metadata/interfaces';
import { AutosuggestProps } from './interfaces';
import InternalAutosuggest from './internal';

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
