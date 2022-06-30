// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { SelectProps } from './interfaces';
import InternalSelect from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { getExternalProps } from '../internal/utils/external-props';

export { SelectProps };

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
    const baseComponentProps = useBaseComponent('Select');
    const externalProps = getExternalProps(restProps);
    return (
      <InternalSelect
        options={options}
        filteringType={filteringType}
        statusType={statusType}
        triggerVariant={triggerVariant}
        {...externalProps}
        {...baseComponentProps}
        ref={ref}
      />
    );
  }
);

applyDisplayName(Select, 'Select');
export default Select;
