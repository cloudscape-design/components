// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { ButtonGroupProps } from './interfaces';
import InternalButtonGroup from './internal';

export { ButtonGroupProps };

const ButtonGroup = React.forwardRef(
  ({ variant, dropdownExpandToViewport, ...rest }: ButtonGroupProps, ref: React.Ref<ButtonGroupProps.Ref>) => {
    const baseProps = getBaseProps(rest);
    const itemCounts = getItemCounts(rest.items);
    const baseComponentProps = useBaseComponent('ButtonGroup', {
      props: {
        variant,
        dropdownExpandToViewport,
      },
      metadata: {
        iconButtonsCount: itemCounts['icon-button'],
        iconToggleButtonsCount: itemCounts['icon-toggle-button'],
        iconFileInputsCount: itemCounts['icon-file-input'],
        menuDropdownsCount: itemCounts['menu-dropdown'],
        groupsCount: itemCounts.group,
      },
    });

    const externalProps = getExternalProps(rest);
    return (
      <InternalButtonGroup
        {...baseProps}
        {...baseComponentProps}
        {...externalProps}
        ref={ref}
        variant={variant}
        dropdownExpandToViewport={dropdownExpandToViewport}
      />
    );
  }
);

function getItemCounts(allItems: readonly ButtonGroupProps.ItemOrGroup[]) {
  const counters = { 'icon-button': 0, 'icon-toggle-button': 0, 'icon-file-input': 0, 'menu-dropdown': 0, group: 0 };

  function count(items: readonly ButtonGroupProps.ItemOrGroup[]) {
    for (const item of items) {
      counters[item.type] += 1;

      if (item.type === 'group') {
        count(item.items);
      }
    }
  }
  count(allItems);

  return counters;
}

applyDisplayName(ButtonGroup, 'ButtonGroup');
export default ButtonGroup;
