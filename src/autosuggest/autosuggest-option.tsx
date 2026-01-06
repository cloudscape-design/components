// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps, getBaseProps } from '../internal/base-component';
import OptionComponent from '../internal/components/option';
import { OptionDefinition, OptionGroup } from '../internal/components/option/interfaces';
import { getTestOptionIndexes } from '../internal/components/options-list/utils/test-indexes';
import { HighlightType } from '../internal/components/options-list/utils/use-highlight-option';
import SelectableItem from '../internal/components/selectable-item';
import { AutosuggestItem, AutosuggestProps } from './interfaces';

import styles from './styles.css.js';

interface AutosuggestOptionProps extends BaseComponentProps {
  index: number;
  virtualIndex?: number;
  nativeAttributes?: React.HTMLAttributes<HTMLDivElement>;
  highlightText: string;
  option: AutosuggestItem;
  highlighted: boolean;
  highlightType: HighlightType;
  current: boolean;
  virtualPosition?: number;
  padBottom?: boolean;
  screenReaderContent?: string;
  ariaSetsize?: number;
  ariaPosinset?: number;
  renderOption?: AutosuggestProps.AutosuggestOptionItemRenderer;
  parentProps?: AutosuggestItemParentProps;
}

export interface AutosuggestItemParentProps {
  index: number;
  virtualIndex?: number;
  option: AutosuggestItem;
  disabled: boolean;
}

const toAutosuggestOptionGroupItem = (
  props: AutosuggestItemParentProps
): AutosuggestProps.AutosuggestOptionGroupItem => {
  return {
    type: 'group',
    index: props.virtualIndex ?? props.index,
    option: props.option.option as OptionGroup,
    disabled: props.disabled,
  };
};

const toAutosuggestOptionItem = (props: {
  index: number;
  virtualIndex?: number;
  option: AutosuggestItem;
  disabled: boolean;
  selected: boolean;
  highlighted: boolean;
  parentProps?: AutosuggestItemParentProps;
}): AutosuggestProps.AutosuggestOptionItem => {
  return {
    type: 'item',
    index: props.virtualIndex ?? props.index,
    option: props.option.option as OptionDefinition,
    selected: props.selected,
    highlighted: props.highlighted,
    disabled: props.disabled,
    parent: props.parentProps
      ? toAutosuggestOptionGroupItem({
          index: props.parentProps.index,
          virtualIndex: props.parentProps.virtualIndex,
          option: props.parentProps.option,
          disabled: props.disabled,
        })
      : null,
  };
};

const toAutosuggestUseEnteredItem = (props: {
  option: AutosuggestItem;
}): AutosuggestProps.AutosuggestUseEnteredItem => {
  return {
    type: 'use-entered',
    option: props.option.option as OptionDefinition,
  };
};

const AutosuggestOption = (
  {
    index,
    virtualIndex,
    nativeAttributes = {},
    highlightText,
    option,
    highlighted,
    highlightType,
    current,
    virtualPosition,
    padBottom,
    screenReaderContent,
    ariaSetsize,
    ariaPosinset,
    renderOption,
    parentProps,
    ...rest
  }: AutosuggestOptionProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const baseProps = getBaseProps(rest);
  const useEntered = 'type' in option && option.type === 'use-entered';
  const isParent = 'type' in option && option.type === 'parent';
  const isChild = 'type' in option && option.type === 'child';
  const { throughIndex, inGroupIndex, groupIndex } = getTestOptionIndexes(option) || {};

  let optionContent;
  if (useEntered) {
    optionContent = option.label;
    // we don't want fancy generated content for screenreader for the "Use..." option,
    // just the visible text is fine
    screenReaderContent = undefined;
  } else if (isParent) {
    optionContent = option.label;
  } else {
    const a11yProperties: AutosuggestOptionProps['nativeAttributes'] = {};
    if (nativeAttributes['aria-label']) {
      a11yProperties['aria-label'] = nativeAttributes['aria-label'];
    }

    optionContent = (
      <div {...a11yProperties}>
        <OptionComponent option={option} highlightedOption={highlighted} highlightText={highlightText} />
      </div>
    );
  }

  const getAutosuggestItemProps = (option: AutosuggestItem) => {
    if (option.type === 'parent') {
      return toAutosuggestOptionGroupItem({
        option: option,
        index: index,
        virtualIndex: virtualIndex,
        disabled: !!option.disabled,
      });
    } else if (option.type === 'use-entered') {
      return toAutosuggestUseEnteredItem({
        option: option,
      });
    } else {
      return toAutosuggestOptionItem({
        option: option,
        index: index,
        virtualIndex: virtualIndex,
        disabled: !!option.disabled,
        highlighted: highlighted,
        selected: current,
        parentProps: parentProps,
      });
    }
  };

  const renderOptionWrapper = (option: AutosuggestItem) => {
    if (!renderOption) {
      return null;
    }

    return renderOption({ item: getAutosuggestItemProps(option), filterText: highlightText });
  };
  const renderResult = renderOptionWrapper(option);

  return (
    <SelectableItem
      {...baseProps}
      disableContentStyling={!!renderResult}
      className={styles.option}
      ariaSelected={current}
      highlighted={highlighted}
      disabled={option.disabled}
      hasBackground={useEntered}
      isParent={isParent}
      isChild={isChild}
      virtualPosition={virtualPosition}
      data-test-index={throughIndex}
      data-in-group-index={inGroupIndex}
      data-group-index={groupIndex}
      ref={ref}
      padBottom={padBottom}
      screenReaderContent={screenReaderContent}
      ariaSetsize={ariaSetsize}
      ariaPosinset={ariaPosinset}
      highlightType={highlightType.type}
      value={option.value}
    >
      {!renderResult ? optionContent : renderResult}
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(AutosuggestOption));
