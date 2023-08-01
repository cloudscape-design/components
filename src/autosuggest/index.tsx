// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AutosuggestProps } from './interfaces';
import InternalAutosuggest from './internal';
import { getExternalProps } from '../internal/utils/external-props';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

export { AutosuggestProps };

const Autosuggest = React.forwardRef(
  (
    { filteringType = 'auto', statusType = 'finished', disableBrowserAutocorrect = false, ...props }: AutosuggestProps,
    ref: React.Ref<AutosuggestProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Autosuggest', { placeholder: props.placeholder });
    const externalProps = getExternalProps(props);
    return (
      <InternalAutosuggest
        filteringType={filteringType}
        statusType={statusType}
        disableBrowserAutocorrect={disableBrowserAutocorrect}
        {...externalProps}
        {...baseComponentProps}
        ref={ref}
      />
    );
  }
);

applyDisplayName(Autosuggest, 'Autosuggest');
export default Autosuggest;
