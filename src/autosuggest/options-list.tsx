// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useSelectVisibleOption, useHighlightVisibleOption } from './controller';
import { getParentGroup } from './options-controller';
import { AutosuggestItem, AutosuggestProps } from './interfaces';
import VirtualList from './virtual-list';
import PlainList from './plain-list';

import { useAnnouncement } from '../select/utils/use-announcement';
import { OptionGroup } from '../internal/components/option/interfaces';

export interface AutosuggestOptionsListProps
  extends Pick<
    AutosuggestProps,
    'enteredTextLabel' | 'virtualScroll' | 'selectedAriaLabel' | 'renderHighlightedAriaLive'
  > {
  options: AutosuggestItem[];
  highlightedOption?: AutosuggestItem;
  selectOption: (option: AutosuggestItem) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  highlightedOptionId?: string;
  highlightText: string;
  listId: string;
  controlId: string;
  handleLoadMore: () => void;
  hasDropdownStatus?: boolean;
  listBottom?: React.ReactNode;
  isKeyboard: React.MutableRefObject<boolean>;
  highlightedType: 'mouse' | 'keyboard';
}

const isInteractive = (option?: AutosuggestItem) => {
  return !!option && !option.disabled && option.type !== 'parent';
};

const isHighlightable = (option?: AutosuggestItem) => {
  return !!option && option.type !== 'parent';
};

const createMouseEventHandler =
  (handler: (index: number) => void, isKeyboard: React.MutableRefObject<boolean>) => (itemIndex: number) => {
    // prevent mouse events to avoid losing focus from the input
    isKeyboard.current = false;
    if (itemIndex > -1) {
      handler(itemIndex);
    }
  };

export default function AutosuggestOptionsList({
  options,
  highlightedOption,
  selectOption,
  highlightedIndex,
  setHighlightedIndex,
  highlightedOptionId,
  highlightText,
  listId,
  controlId,
  enteredTextLabel,
  handleLoadMore,
  hasDropdownStatus,
  virtualScroll,
  selectedAriaLabel,
  renderHighlightedAriaLive,
  listBottom,
  isKeyboard,
  highlightedType,
}: AutosuggestOptionsListProps) {
  const highlightVisibleOption = useHighlightVisibleOption(options, setHighlightedIndex, isHighlightable);
  const selectVisibleOption = useSelectVisibleOption(options, selectOption, isInteractive);
  const handleMouseUp = createMouseEventHandler(selectVisibleOption, isKeyboard);
  const handleMouseMove = createMouseEventHandler(highlightVisibleOption, isKeyboard);

  const ListComponent = virtualScroll ? VirtualList : PlainList;

  const announcement = useAnnouncement({
    announceSelected: true,
    highlightedOption,
    getParent: option => getParentGroup(option)?.option as undefined | OptionGroup,
    selectedAriaLabel,
    renderHighlightedAriaLive,
  });

  return (
    <ListComponent
      listBottom={listBottom}
      handleLoadMore={handleLoadMore}
      filteredItems={options}
      highlightText={highlightText}
      highlightedOption={highlightedOption}
      highlightedIndex={highlightedIndex}
      enteredTextLabel={enteredTextLabel}
      highlightedA11yProps={highlightedOptionId ? { id: highlightedOptionId } : {}}
      hasDropdownStatus={hasDropdownStatus}
      menuProps={{ id: listId, ariaLabelledby: controlId, onMouseUp: handleMouseUp, onMouseMove: handleMouseMove }}
      screenReaderContent={announcement}
      highlightedType={highlightedType}
    />
  );
}
