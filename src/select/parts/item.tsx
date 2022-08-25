// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';
import Option from '../../internal/components/option';
import SelectableItem from '../../internal/components/selectable-item';
import { getBaseProps } from '../../internal/base-component';
import { DropdownOption, OptionDefinition } from '../../internal/components/option/interfaces';
import CheckboxIcon from '../../internal/components/checkbox-icon';
import InternalIcon from '../../icon/internal.js';

export interface ItemProps {
  option: DropdownOption;
  highlighted?: boolean;
  selected?: boolean;
  filteringValue?: string;
  hasCheckbox?: boolean;
  virtualPosition?: number;
  padBottom?: boolean;
  isNextSelected?: boolean;
  screenReaderContent?: string;
  ariaPosinset?: number;
  ariaSetsize?: number;
  highlightedType?: 'mouse' | 'keyboard';
}

const Item = (
  {
    option,
    highlighted,
    selected,
    filteringValue,
    hasCheckbox,
    virtualPosition,
    padBottom,
    isNextSelected,
    screenReaderContent,
    ariaPosinset,
    ariaSetsize,
    highlightedType,
    ...restProps
  }: ItemProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const baseProps = getBaseProps(restProps);

  const isParent = option.type === 'parent';
  const isChild = option.type === 'child';
  const wrappedOption: OptionDefinition = option.option;
  const disabled = option.disabled || wrappedOption.disabled;

  return (
    <SelectableItem
      ariaSelected={selected}
      selected={selected}
      isNextSelected={isNextSelected}
      highlighted={highlighted}
      disabled={option.disabled}
      isParent={isParent}
      isChild={isChild}
      ref={ref}
      virtualPosition={virtualPosition}
      padBottom={padBottom}
      screenReaderContent={screenReaderContent}
      ariaPosinset={ariaPosinset}
      ariaSetsize={ariaSetsize}
      highlightedType={highlightedType}
      {...baseProps}
    >
      <div className={styles.item}>
        {hasCheckbox && !isParent && (
          <div className={styles.checkbox}>
            <CheckboxIcon checked={selected || false} disabled={option.disabled} />
          </div>
        )}
        {isParent ? (
          wrappedOption.label || wrappedOption.value
        ) : (
          <Option option={{ ...wrappedOption, disabled }} highlightText={filteringValue} />
        )}
        {!hasCheckbox && !isParent && selected && (
          <div className={styles['selected-icon']}>
            <InternalIcon name="check" />
          </div>
        )}
      </div>
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(Item));
