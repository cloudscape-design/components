// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import InternalIcon from '../../../../icon/internal.js';
import type { MultiselectProps } from '../../../../multiselect/interfaces';
import type { SelectProps } from '../../../../select/interfaces';
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

import styles from './styles.css.js';

export interface ItemProps {
  index: number;
  option: DropdownOption;
  /**
   * `single` renders a check mark on the selected option. `multi` renders a checkbox on every option
   * (including group headers) and supports the indeterminate state.
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
  hideTopDivider?: boolean;
  sticky?: boolean;
  renderOption?: SelectProps.SelectOptionItemRenderer | MultiselectProps.MultiselectOptionItemRenderer;
  parentProps?: ItemParentProps;
}

export interface ItemParentProps {
  index: number;
  option: DropdownOption;
  disabled: boolean;
  indeterminate?: boolean;
  highlighted?: boolean;
  selected?: boolean;
}

interface RenderItemProps {
  index: number;
  option: DropdownOption;
  disabled: boolean;
  selected: boolean;
  highlighted: boolean;
  indeterminate: boolean;
  parentProps?: ItemParentProps;
}

const toSingleGroupItem = (props: ItemParentProps): SelectProps.SelectOptionGroupItem => ({
  type: 'group',
  index: props.index,
  option: props.option.option as OptionGroup,
  disabled: props.disabled,
});

const toMultiGroupItem = (props: ItemParentProps): MultiselectProps.MultiselectOptionGroupItem => ({
  type: 'group',
  index: props.index,
  option: props.option.option as OptionGroup,
  indeterminate: props.indeterminate ?? false,
  selected: props.selected ?? false,
  highlighted: props.highlighted ?? false,
  disabled: props.disabled,
});

// The item shape passed to `renderOption`. Select and Multiselect expose different shapes,
// so the selection type picks the shape.
function toRenderItem(
  selectionType: SelectionType,
  props: RenderItemProps
): SelectProps.SelectItem | MultiselectProps.MultiselectItem {
  const { option, index, disabled, selected, highlighted, indeterminate, parentProps } = props;
  const isMulti = selectionType === 'multi';

  if (option.type === 'parent') {
    return isMulti
      ? toMultiGroupItem({ option, index, disabled, highlighted, selected, indeterminate })
      : toSingleGroupItem({ option, index, disabled });
  }
  return {
    type: 'item',
    index,
    option: option.option as OptionDefinition,
    selected,
    highlighted,
    disabled,
    parent: parentProps ? (isMulti ? toMultiGroupItem(parentProps) : toSingleGroupItem(parentProps)) : null,
  };
}

const Item = (
  {
    index,
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
    hideTopDivider,
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
  const wrappedOption: OptionDefinition = option.option;
  const disabled = option.disabled || wrappedOption.disabled;
  const disabledReason = disabled && wrappedOption.disabledReason ? wrappedOption.disabledReason : '';
  const isDisabledWithReason = !!disabledReason;
  const internalRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(ref, internalRef);

  const { descriptionEl, descriptionId } = useHiddenDescription(disabledReason);

  const [canShowTooltip, setCanShowTooltip] = useState(true);
  useEffect(() => setCanShowTooltip(true), [highlighted]);

  const renderResult = renderOption
    ? (renderOption as (props: { item: any; filterText?: string }) => React.ReactNode)({
        item: toRenderItem(selectionType, {
          option,
          index,
          disabled: !!disabled,
          highlighted: !!highlighted,
          selected: !!selected,
          indeterminate: indeterminate ?? false,
          parentProps,
        }),
        filterText: filteringValue,
      })
    : null;

  const optionContent = (
    <Option
      customContent={renderResult}
      option={{ ...wrappedOption, disabled }}
      highlightedOption={highlighted}
      selectedOption={selected}
      highlightText={filteringValue}
      isGroupOption={isParent}
    />
  );

  const disabledReasonContent = !renderResult && isDisabledWithReason && (
    <>
      {descriptionEl}
      {highlighted && canShowTooltip && (
        <Tooltip
          className={styles['disabled-reason-tooltip']}
          getTrack={() => internalRef.current}
          content={disabledReason}
          position="right"
          onEscape={() => setCanShowTooltip(false)}
        />
      )}
    </>
  );

  const commonProps = {
    disableContentStyling: !!renderResult,
    selected,
    isNextSelected,
    isPreviousSelected,
    highlighted,
    isParent,
    isChild,
    highlightType,
    ref: mergedRef,
    virtualPosition,
    padBottom,
    screenReaderContent,
    ariaPosinset,
    ariaSetsize,
    ariaDescribedby: isDisabledWithReason ? descriptionId : '',
    value: option.option.value,
    withScrollbar,
    hideTopDivider,
    sticky,
  };

  if (isMulti) {
    const mixed = isParent && indeterminate;
    return (
      <SelectableItem
        {...commonProps}
        ariaSelected={mixed ? undefined : Boolean(selected)}
        ariaChecked={mixed ? 'mixed' : Boolean(selected)}
        disabled={disabled}
        useInteractiveGroups={true}
        {...baseProps}
      >
        <div className={styles.item}>
          {!renderResult && (
            <div className={styles.checkbox}>
              <CheckboxIcon checked={selected} indeterminate={isParent && indeterminate} disabled={disabled} />
            </div>
          )}
          {optionContent}
        </div>
        {disabledReasonContent}
      </SelectableItem>
    );
  }

  return (
    <SelectableItem {...commonProps} ariaSelected={Boolean(selected)} disabled={option.disabled} {...baseProps}>
      <div className={clsx(styles.item, !isParent && wrappedOption.labelTag && styles['show-label-tag'])}>
        {optionContent}
        {!renderResult && !isParent && selected && (
          <div className={styles['selected-icon']}>
            <InternalIcon name="check" />
          </div>
        )}
        {disabledReasonContent}
      </div>
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(Item));
