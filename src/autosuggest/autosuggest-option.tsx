// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps, getBaseProps } from '../internal/base-component';
import OptionComponent from '../internal/components/option';
import { getTestOptionIndexes } from '../internal/components/options-list/utils/test-indexes';
import { HighlightType } from '../internal/components/options-list/utils/use-highlight-option';
import SelectableItem from '../internal/components/selectable-item';
import { AutosuggestItem } from './interfaces';

import styles from './styles.css.js';

export interface AutosuggestOptionProps extends BaseComponentProps {
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
}

const AutosuggestOption = (
  {
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

  return (
    <SelectableItem
      {...baseProps}
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
      {optionContent}
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(AutosuggestOption));
