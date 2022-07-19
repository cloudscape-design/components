// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import OptionComponent from '../internal/components/option';
import SelectableItem from '../internal/components/selectable-item';
import { BaseComponentProps, getBaseProps } from '../internal/base-component';
import { getTestOptionIndexes } from '../internal/components/options-list/utils/test-indexes';

import styles from './styles.css.js';
import { AutosuggestItem } from './interfaces';

export interface AutosuggestOptionProps extends BaseComponentProps {
  nativeAttributes?: Record<string, any>;
  highlightText: string;
  option: AutosuggestItem;
  highlighted: boolean;
  enteredTextLabel: (value: string) => string;
  virtualPosition?: number;
  padBottom?: boolean;
  screenReaderContent?: string;
  ariaSetsize?: number;
  ariaPosinset?: number;
  isKeyboard?: boolean;
}

const AutosuggestOption = (
  {
    nativeAttributes = {},
    highlightText,
    option,
    highlighted,
    enteredTextLabel,
    virtualPosition,
    padBottom,
    screenReaderContent,
    ariaSetsize,
    ariaPosinset,
    isKeyboard,
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
    optionContent = enteredTextLabel(option.value || '');
  } else if (isParent) {
    optionContent = option.label;
  } else {
    const a11yProperties: AutosuggestOptionProps['nativeAttributes'] = {};
    if (nativeAttributes['aria-label']) {
      a11yProperties['aria-label'] = nativeAttributes['aria-label'];
    }

    optionContent = (
      <div {...a11yProperties}>
        <OptionComponent option={option} highlightText={highlightText} />
      </div>
    );
  }

  return (
    <SelectableItem
      {...baseProps}
      className={styles.option}
      ariaSelected={highlighted || undefined}
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
      isKeyboard={isKeyboard}
    >
      {optionContent}
    </SelectableItem>
  );
};

export default React.memo(React.forwardRef(AutosuggestOption));
