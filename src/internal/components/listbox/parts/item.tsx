// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import InternalIcon from '../../../../icon/internal.js';
import { MultiselectProps } from '../../../../multiselect/interfaces';
import { SelectProps } from '../../../../select/interfaces.js';
import Tooltip from '../../../../tooltip/internal.js';
import { OptionDefinition, OptionGroup } from '../../../../types/option';
import { getBaseProps } from '../../../base-component';
import useHiddenDescription from '../../../hooks/use-hidden-description';
import CheckboxIcon from '../../checkbox-icon';
import Option from '../../option';
import { DropdownOption } from '../../option/interfaces';
import { HighlightType } from '../../options-list/utils/use-highlight-option.js';
import SelectableItem from '../../selectable-item';
import { SelectionType } from '../selection/interfaces';

import styles from '../../../../select/parts/styles.css.js';

export interface ItemProps {
  index: number;
  virtualIndex?: number;
  option: DropdownOption;
  /**
   * `single` renders a check mark on the selected option (Select).
   * `multi` renders a checkbox, interactive groups and the select-all row (Multiselect).
   */
  selectionType?: SelectionType;
  highlighted?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
  filteringValue?: string;
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
  renderOption?: SelectProps.SelectOptionItemRenderer | MultiselectProps.MultiselectOptionItemRenderer;
  parentProps?: ItemParentProps;
}

export interface ItemParentProps {
  index: number;
  virtualIndex?: number;
  option: DropdownOption;
  disabled: boolean;
  indeterminate?: boolean;
  highlighted?: boolean;
  selected?: boolean;
}

interface MultiselectItemParentProps extends ItemParentProps {
  indeterminate: boolean;
  highlighted: boolean;
  selected: boolean;
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
          disabled: props.parentProps.disabled,
        })
      : null,
  };
};

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
  parentProps?: ItemParentProps;
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
          disabled: props.parentProps.disabled,
          highlighted: props.parentProps?.highlighted ?? false,
          indeterminate: props.parentProps?.indeterminate ?? false,
          selected: props.parentProps?.selected ?? false,
        })
      : null,
  };
};

const Item = (
  {
    index,
    virtualIndex,
    option,
    selectionType = 'single',
    highlighted,
    selected,
    indeterminate,
    filteringValue,
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
  const isMulti = selectionType === 'multi';
  const isParent = option.type === 'parent';
  const isChild = option.type === 'child';
  const isSelectAll = option.type === 'select-all';
  const wrappedOption: OptionDefinition = option.option;
  const disabled = option.disabled || wrappedOption.disabled;
  const disabledReasonSource = isMulti
    ? option.disabledReason || wrappedOption.disabledReason
    : wrappedOption.disabledReason;
  const disabledReason = disabled && disabledReasonSource ? disabledReasonSource : '';
  const isDisabledWithReason = !!disabledReason;
  const internalRef = useRef<HTMLDivElement>(null);
  const { descriptionEl, descriptionId } = useHiddenDescription(disabledReason);
  const [canShowTooltip, setCanShowTooltip] = useState(true);
  useEffect(() => setCanShowTooltip(true), [highlighted]);
  const mergedRef = useMergeRefs(ref, internalRef);

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
    if (isMulti) {
      return (renderOption as MultiselectProps.MultiselectOptionItemRenderer)({
        item: getMultiselectItemProps(option),
        filterText: filteringValue,
      });
    }
    return (renderOption as SelectProps.SelectOptionItemRenderer)({
      item: getSelectItemProps(option),
      filterText: filteringValue,
    });
  };

  const renderResult = renderOptionWrapper(option);

  const optionElement = (
    <Option
      customContent={renderResult}
      option={{ ...wrappedOption, disabled }}
      highlightedOption={highlighted}
      selectedOption={selected}
      highlightText={filteringValue}
      isGroupOption={isParent}
    />
  );

  const disabledReasonElement = isDisabledWithReason && (
    <>
      {/* Stays mounted with custom content, so aria-describedby always points to an element. */}
      {descriptionEl}
      {!renderResult && highlighted && canShowTooltip && (
        <Tooltip
          className={styles['disabled-reason-tooltip']}
          getTrack={() => internalRef.current}
          content={disabledReason!}
          position="right"
          onEscape={() => setCanShowTooltip(false)}
        />
      )}
    </>
  );

  if (isMulti) {
    return (
      <SelectableItem
        disableContentStyling={!!renderResult}
        ariaSelected={isParent && indeterminate ? undefined : Boolean(selected)}
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
        ref={mergedRef}
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
        <div className={styles.item}>
          {!renderResult && (
            <div className={styles.checkbox}>
              <CheckboxIcon
                checked={selected}
                indeterminate={(isParent || isSelectAll) && indeterminate}
                disabled={disabled}
              />
            </div>
          )}
          {optionElement}
        </div>
        {disabledReasonElement}
      </SelectableItem>
    );
  }

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
      ref={mergedRef}
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
        {optionElement}
        {!renderResult && !isParent && selected && (
          <div className={styles['selected-icon']}>
            <InternalIcon name="check" />
          </div>
        )}
        {disabledReasonElement}
      </div>
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(Item));
