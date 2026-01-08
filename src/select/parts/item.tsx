// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import InternalIcon from '../../icon/internal.js';
import { getBaseProps } from '../../internal/base-component';
import CheckboxIcon from '../../internal/components/checkbox-icon';
import Option from '../../internal/components/option';
import { DropdownOption, OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option.js';
import SelectableItem from '../../internal/components/selectable-item';
import useHiddenDescription from '../../internal/hooks/use-hidden-description';
import Tooltip from '../../tooltip/internal.js';
import { SelectProps } from '../interfaces';

import styles from './styles.css.js';

export interface ItemProps<T = SelectProps.SelectOptionItemRenderer> {
  index: number;
  virtualIndex?: number;
  option: DropdownOption;
  highlighted?: boolean;
  selected?: boolean;
  filteringValue?: string;
  hasCheckbox?: boolean;
  virtualPosition?: number;
  padBottom?: boolean;
  isNextSelected?: boolean;
  isPreviousSelected?: boolean;
  screenReaderContent?: string;
  ariaPosinset?: number;
  ariaSetsize?: number;
  highlightType?: HighlightType['type'];
  withScrollbar?: boolean;
  sticky?: boolean;
  renderOption?: T;
  parentProps?: ItemParentProps;
}

export interface ItemParentProps {
  index: number;
  virtualIndex?: number;
  option: DropdownOption;
  disabled: boolean;
}
const toSelectOptionGroupItem = (props: ItemParentProps): SelectProps.SelectOptionGroupItem => {
  return {
    type: 'group',
    index: props.virtualIndex ?? props.index,
    option: props.option.option as OptionGroup,
    disabled: props.disabled,
  };
};

const toSelectOptionItem = (props: {
  index: number;
  virtualIndex?: number;
  option: DropdownOption;
  disabled: boolean;
  selected: boolean;
  highlighted: boolean;
  parentProps?: ItemParentProps;
}): SelectProps.SelectOptionItem => {
  return {
    type: 'item',
    index: props.virtualIndex ?? props.index,
    option: props.option.option as OptionDefinition,
    selected: props.selected,
    highlighted: props.highlighted,
    disabled: props.disabled,
    parent: props.parentProps
      ? toSelectOptionGroupItem({
          index: props.parentProps?.index,
          virtualIndex: props.parentProps?.virtualIndex,
          option: props.parentProps?.option,
          disabled: props.disabled,
        })
      : null,
  };
};

const Item = (
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
    screenReaderContent,
    ariaPosinset,
    ariaSetsize,
    highlightType,
    withScrollbar,
    sticky,
    renderOption,
    parentProps,
    ...restProps
  }: ItemProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const baseProps = getBaseProps(restProps);

  const isParent = option.type === 'parent';
  const isChild = option.type === 'child';
  const wrappedOption: OptionDefinition = option.option;
  const disabled = option.disabled || wrappedOption.disabled;
  const disabledReason = disabled && wrappedOption.disabledReason ? wrappedOption.disabledReason : '';
  const isDisabledWithReason = !!disabledReason;
  const internalRef = useRef<HTMLDivElement>(null);

  const { descriptionEl, descriptionId } = useHiddenDescription(disabledReason);

  const [canShowTooltip, setCanShowTooltip] = useState(true);
  useEffect(() => setCanShowTooltip(true), [highlighted]);

  const getSelectItemProps = (option: DropdownOption): SelectProps.SelectItem => {
    if (option.type === 'parent') {
      return toSelectOptionGroupItem({
        option: option,
        index: index,
        virtualIndex: virtualIndex,
        disabled: !!disabled,
      });
    } else {
      return toSelectOptionItem({
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

    return renderOption({ item: getSelectItemProps(option), filterText: filteringValue });
  };
  const renderResult = renderOptionWrapper(option);

  return (
    <SelectableItem
      disableContentStyling={!!renderResult}
      ariaSelected={Boolean(selected)}
      selected={selected}
      isNextSelected={isNextSelected}
      isPreviousSelected={isPreviousSelected}
      highlighted={highlighted}
      disabled={option.disabled}
      isParent={isParent}
      isChild={isChild}
      ref={useMergeRefs(ref, internalRef)}
      virtualPosition={virtualPosition}
      padBottom={padBottom}
      screenReaderContent={screenReaderContent}
      ariaPosinset={ariaPosinset}
      ariaSetsize={ariaSetsize}
      highlightType={highlightType}
      ariaDescribedby={isDisabledWithReason ? descriptionId : ''}
      value={option.option.value}
      withScrollbar={withScrollbar}
      sticky={sticky}
      {...baseProps}
    >
      <div className={clsx(styles.item, !isParent && wrappedOption.labelTag && styles['show-label-tag'])}>
        {!renderResult && hasCheckbox && !isParent && (
          <div className={styles.checkbox}>
            <CheckboxIcon checked={selected || false} disabled={option.disabled} />
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
        {!renderResult && !hasCheckbox && !isParent && selected && (
          <div className={styles['selected-icon']}>
            <InternalIcon name="check" />
          </div>
        )}
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
      </div>
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(Item));
