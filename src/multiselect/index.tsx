// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { MultiselectProps } from './interfaces';
import InternalMultiselect from './internal';

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
    const baseComponentProps = useBaseComponent('Multiselect');

    // Private API for inline tokens
    const inlineTokens = Boolean((restProps as any).inlineTokens);

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
      />
    );
  }
);

applyDisplayName(Multiselect, 'Multiselect');
export default Multiselect;
