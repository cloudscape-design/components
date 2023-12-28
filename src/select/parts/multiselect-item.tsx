// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import Option from '../../internal/components/option';
import SelectableItem from '../../internal/components/selectable-item';
import { getBaseProps } from '../../internal/base-component';
import { OptionDefinition } from '../../internal/components/option/interfaces';
import CheckboxIcon from '../../internal/components/checkbox-icon';
import { ItemProps } from './item';
interface MultiselectItemProps extends ItemProps {
  indeterminate?: boolean;
}

const MultiSelectItem = (
  {
    option,
    highlighted,
    selected,
    filteringValue,
    hasCheckbox,
    virtualIndex,
    virtualPosition,
    padBottom,
    isNextSelected,
    indeterminate,
    screenReaderContent,
    ariaPosinset,
    ariaSetsize,
    highlightType,
    ...restProps
  }: MultiselectItemProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const baseProps = getBaseProps(restProps);

  const isParent = option.type === 'parent';
  const isChild = option.type === 'child';
  const wrappedOption: OptionDefinition = option.option;
  const disabled = option.disabled || wrappedOption.disabled;
  const className = clsx(styles.item, {
    [styles.disabled]: disabled,
  });

  return (
    <SelectableItem
      ariaChecked={isParent && indeterminate ? 'mixed' : Boolean(selected)}
      selected={selected}
      isNextSelected={isNextSelected}
      highlighted={highlighted}
      disabled={disabled}
      isParent={isParent}
      isChild={isChild}
      highlightType={highlightType}
      ref={ref}
      virtualIndex={virtualIndex}
      virtualPosition={virtualPosition}
      padBottom={padBottom}
      useInteractiveGroups={true}
      screenReaderContent={screenReaderContent}
      ariaPosinset={ariaPosinset}
      ariaSetsize={ariaSetsize}
      {...baseProps}
    >
      <div className={className}>
        {hasCheckbox && (
          <div className={styles.checkbox}>
            <CheckboxIcon checked={selected} indeterminate={isParent && indeterminate} disabled={option.disabled} />
          </div>
        )}
        <Option
          option={{ ...wrappedOption, disabled }}
          highlightedOption={highlighted}
          selectedOption={selected}
          highlightText={filteringValue}
          isGroupOption={isParent}
        />
      </div>
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(MultiSelectItem));
