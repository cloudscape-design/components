// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../../internal/base-component';
import CheckboxIcon from '../../internal/components/checkbox-icon';
import Option from '../../internal/components/option';
import { OptionDefinition } from '../../internal/components/option/interfaces';
import SelectableItem from '../../internal/components/selectable-item';
import Tooltip from '../../internal/components/tooltip';
import useHiddenDescription from '../../internal/hooks/use-hidden-description';
import { ItemProps } from './item';

import styles from './styles.css.js';
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
    virtualPosition,
    padBottom,
    isNextSelected,
    indeterminate,
    screenReaderContent,
    ariaPosinset,
    ariaSetsize,
    highlightType,
    withScrollbar,
    sticky,
    ...restProps
  }: MultiselectItemProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const baseProps = getBaseProps(restProps);

  const isParent = option.type === 'parent';
  const isChild = option.type === 'child';
  const isSelectAll = option.type === 'select-all';
  const wrappedOption: OptionDefinition = option.option;
  const disabled = option.disabled || wrappedOption.disabled;
  const disabledReason =
    disabled && (option.disabledReason || wrappedOption.disabledReason)
      ? option.disabledReason || wrappedOption.disabledReason
      : '';
  const isDisabledWithReason = !!disabledReason;
  const internalRef = useRef<HTMLDivElement>(null);
  const className = styles.item;

  const { descriptionId, descriptionEl } = useHiddenDescription(disabledReason);

  const [canShowTooltip, setCanShowTooltip] = useState(true);
  useEffect(() => setCanShowTooltip(true), [highlighted]);
  return (
    <SelectableItem
      ariaChecked={isParent && indeterminate ? 'mixed' : Boolean(selected)}
      selected={selected}
      isNextSelected={isNextSelected}
      highlighted={highlighted}
      disabled={disabled}
      isParent={isParent}
      isChild={isChild}
      isSelectAll={isSelectAll}
      highlightType={highlightType}
      ref={useMergeRefs(ref, internalRef)}
      virtualPosition={virtualPosition}
      padBottom={padBottom}
      useInteractiveGroups={true}
      screenReaderContent={screenReaderContent}
      ariaPosinset={ariaPosinset}
      ariaSetsize={ariaSetsize}
      ariaDescribedby={isDisabledWithReason ? descriptionId : ''}
      value={option.option.value}
      afterHeader={option.afterHeader}
      withScrollbar={withScrollbar}
      sticky={sticky}
      {...baseProps}
    >
      <div className={className}>
        {hasCheckbox && (
          <div className={styles.checkbox}>
            <CheckboxIcon
              checked={selected}
              indeterminate={(isParent || isSelectAll) && indeterminate}
              disabled={disabled}
            />
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
      {isDisabledWithReason && (
        <>
          {descriptionEl}
          {highlighted && canShowTooltip && (
            <Tooltip
              className={styles['disabled-reason-tooltip']}
              trackRef={internalRef}
              value={disabledReason!}
              position="right"
              hideOnOverscroll={true}
              onDismiss={() => setCanShowTooltip(false)}
            />
          )}
        </>
      )}
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(MultiSelectItem));
