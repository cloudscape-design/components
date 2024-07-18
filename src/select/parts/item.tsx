// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import InternalIcon from '../../icon/internal.js';
import { getBaseProps } from '../../internal/base-component';
import CheckboxIcon from '../../internal/components/checkbox-icon';
import Option from '../../internal/components/option';
import { DropdownOption, OptionDefinition } from '../../internal/components/option/interfaces';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option.js';
import SelectableItem from '../../internal/components/selectable-item';
import Tooltip from '../../internal/components/tooltip';
import useHiddenDescription from '../../internal/hooks/use-hidden-description';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';

import styles from './styles.css.js';

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
  highlightType?: HighlightType['type'];
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
    highlightType,
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

  return (
    <SelectableItem
      ariaSelected={Boolean(selected)}
      selected={selected}
      isNextSelected={isNextSelected}
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
      {...baseProps}
    >
      <div className={clsx(styles.item, !isParent && wrappedOption.labelTag && styles['show-label-tag'])}>
        {hasCheckbox && !isParent && (
          <div className={styles.checkbox}>
            <CheckboxIcon checked={selected || false} disabled={option.disabled} />
          </div>
        )}
        {isParent ? (
          <span>{wrappedOption.label || wrappedOption.value}</span>
        ) : (
          <Option
            option={{ ...wrappedOption, disabled }}
            highlightedOption={highlighted}
            selectedOption={selected}
            highlightText={filteringValue}
          />
        )}
        {!hasCheckbox && !isParent && selected && (
          <div className={styles['selected-icon']}>
            <InternalIcon name="check" />
          </div>
        )}
        {isDisabledWithReason && (
          <>
            {descriptionEl}
            {highlighted && (
              <Tooltip
                className={styles['disabled-reason-tooltip']}
                trackRef={internalRef}
                value={disabledReason!}
                position="right"
              />
            )}
          </>
        )}
      </div>
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(Item));
