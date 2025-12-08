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
import { getTestOptionIndexes } from '../../internal/components/options-list/utils/test-indexes';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option.js';
import SelectableItem from '../../internal/components/selectable-item';
import Tooltip from '../../internal/components/tooltip';
import useHiddenDescription from '../../internal/hooks/use-hidden-description';
import { SelectProps } from '../interfaces';

import styles from './styles.css.js';

export interface ItemProps<T = SelectProps.SelectOptionItemRenderer> {
  index?: number;
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
}

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

  const { throughIndex, inGroupIndex, groupIndex } = getTestOptionIndexes(option) || {};
  const globalIndex = virtualIndex ?? index ?? null;

  const renderOptionWrapper = (option: DropdownOption) => {
    if (!renderOption) {
      return null;
    }

    let item: SelectProps.SelectOptionItem | SelectProps.SelectOptionGroupItem;

    switch (option.type) {
      case 'parent':
        item = {
          index: globalIndex,
          type: 'parent',
          option: option.option as OptionGroup,
          disabled: !!disabled,
        };
        break;
      case 'child':
      default:
        item = {
          index: globalIndex,
          type: 'child',
          option: option.option as OptionDefinition,
          selected: !!selected,
          highlighted: !!highlighted,
          disabled: !!disabled,
        };
        break;
    }

    return renderOption({ item, filterText: filteringValue });
  };
  const renderResult = renderOptionWrapper(option);

  return (
    <SelectableItem
      data-test-index={throughIndex}
      data-in-group-index={inGroupIndex}
      data-group-index={groupIndex}
      disableContentStyling={!!renderOption}
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
        {
          <Option
            customContent={renderResult}
            option={{ ...wrappedOption, disabled }}
            highlightedOption={highlighted}
            selectedOption={selected}
            highlightText={filteringValue}
            isGroupOption={isParent}
          />
        }
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
                trackRef={internalRef}
                value={disabledReason!}
                position="right"
                hideOnOverscroll={true}
                onDismiss={() => setCanShowTooltip(false)}
              />
            )}
          </>
        )}
      </div>
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(Item));
