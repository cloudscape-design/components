// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../../internal/base-component';
import CheckboxIcon from '../../internal/components/checkbox-icon';
import Option from '../../internal/components/option';
import { DropdownOption, OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import SelectableItem from '../../internal/components/selectable-item';
import useHiddenDescription from '../../internal/hooks/use-hidden-description';
import { MultiselectProps } from '../../multiselect/interfaces';
import Tooltip from '../../tooltip/internal.js';
import { ItemParentProps, ItemProps } from './item';

import styles from './styles.css.js';
interface MultiselectItemProps extends ItemProps<MultiselectProps.MultiselectOptionItemRenderer> {
  indeterminate?: boolean;
  parentProps?: MultiselectItemParentProps;
}

export interface MultiselectItemParentProps extends ItemParentProps {
  indeterminate: boolean;
  highlighted: boolean;
  selected: boolean;
}
const toMultiselectOptionGroupItem = (
  props: MultiselectItemParentProps
): MultiselectProps.MultiselectOptionGroupItem => {
  return {
    type: 'group',
    index: props.virtualIndex ?? props.index,
    option: props.option.option as OptionGroup,
    indeterminate: props.indeterminate ?? false,
    selected: props.selected,
    highlighted: props.highlighted,
    disabled: props.disabled,
  };
};
const toMultiselectOptionItem = (props: {
  index: number;
  virtualIndex?: number;
  option: DropdownOption;
  disabled: boolean;
  selected: boolean;
  highlighted: boolean;
  parentProps?: MultiselectItemParentProps;
}): MultiselectProps.MultiselectOptionItem => {
  return {
    type: 'item',
    index: props.virtualIndex ?? props.index,
    option: props.option.option as OptionDefinition,
    selected: props.selected,
    highlighted: props.highlighted,
    disabled: props.disabled,
    parent: props.parentProps
      ? toMultiselectOptionGroupItem({
          index: props.parentProps?.index,
          virtualIndex: props.parentProps?.virtualIndex,
          option: props.parentProps?.option,
          disabled: props.disabled,
          highlighted: props.parentProps?.highlighted ?? false,
          indeterminate: props.parentProps?.indeterminate ?? false,
          selected: props.parentProps?.selected ?? false,
        })
      : null,
  };
};

const MultiSelectItem = (
  {
    index,
    virtualIndex,
    option,
    highlighted,
    selected,
    filteringValue,
    hasCheckbox,
    virtualPosition,
    padBottom,
    isNextSelected,
    isPreviousSelected,
    indeterminate,
    screenReaderContent,
    ariaPosinset,
    ariaSetsize,
    highlightType,
    withScrollbar,
    sticky,
    renderOption,
    parentProps,
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

  const getMultiselectItemProps = (option: DropdownOption): MultiselectProps.MultiselectItem => {
    if (option.type === 'parent') {
      return toMultiselectOptionGroupItem({
        option: option,
        index: index,
        virtualIndex: virtualIndex,
        disabled: !!disabled,
        highlighted: !!highlighted,
        selected: !!selected,
        indeterminate: indeterminate ?? false,
      });
    } else if (option.type === 'select-all') {
      return {
        type: 'select-all',
        option: option.option as OptionDefinition,
        indeterminate: indeterminate ?? false,
        selected: !!selected,
        highlighted: !!highlighted,
      };
    } else {
      return toMultiselectOptionItem({
        option: option,
        index: index,
        virtualIndex: virtualIndex,
        disabled: !!disabled,
        highlighted: !!highlighted,
        selected: !!selected,
        parentProps: parentProps,
      });
    }
  };

  const renderOptionWrapper = (option: DropdownOption) => {
    if (!renderOption) {
      return null;
    }

    return renderOption({ item: getMultiselectItemProps(option), filterText: filteringValue });
  };

  const renderResult = renderOptionWrapper(option);

  return (
    <SelectableItem
      disableContentStyling={!!renderResult}
      ariaChecked={isParent && indeterminate ? 'mixed' : Boolean(selected)}
      selected={selected}
      isNextSelected={isNextSelected}
      isPreviousSelected={isPreviousSelected}
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
        {!renderResult && hasCheckbox && (
          <div className={styles.checkbox}>
            <CheckboxIcon
              checked={selected}
              indeterminate={(isParent || isSelectAll) && indeterminate}
              disabled={disabled}
            />
          </div>
        )}
        <Option
          customContent={renderResult}
          option={{ ...wrappedOption, disabled }}
          highlightedOption={highlighted}
          selectedOption={selected}
          highlightText={filteringValue}
          isGroupOption={isParent}
        />
      </div>
      {!renderResult && isDisabledWithReason && (
        <>
          {descriptionEl}
          {highlighted && canShowTooltip && (
            <Tooltip
              className={styles['disabled-reason-tooltip']}
              getTrack={() => internalRef.current}
              content={disabledReason!}
              position="right"
              onEscape={() => setCanShowTooltip(false)}
            />
          )}
        </>
      )}
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(MultiSelectItem));
