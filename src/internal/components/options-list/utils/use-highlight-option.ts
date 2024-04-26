// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useState } from 'react';

export class HighlightType {
  constructor(
    public type: 'keyboard' | 'mouse',
    public moveFocus: boolean = type === 'keyboard'
  ) {}
}

export interface HighlightedOptionProps<OptionType> {
  options: readonly OptionType[];
  isHighlightable: (option: OptionType) => boolean;
}

export interface HighlightedOptionState<OptionType> {
  highlightType: HighlightType;
  highlightedIndex: number;
  highlightedOption?: OptionType;
}

export interface HighlightedOptionHandlers<OptionType> {
  // Mouse handlers
  setHighlightedIndexWithMouse(index: number, moveFocus?: boolean): void;
  // Keyboard handlers
  moveHighlightWithKeyboard(direction: -1 | 1): void;
  highlightOptionWithKeyboard(option: OptionType): void;
  resetHighlightWithKeyboard(): void;
  goHomeWithKeyboard(): void;
  goEndWithKeyboard(): void;
}

export function useHighlightedOption<OptionType>({
  options,
  isHighlightable,
}: HighlightedOptionProps<OptionType>): [HighlightedOptionState<OptionType>, HighlightedOptionHandlers<OptionType>] {
  const [highlightedIndex, setHighlightedIndexState] = useState(-1);
  const [highlightType, setHighlightType] = useState<HighlightType>(new HighlightType('keyboard'));
  const setHighlightedIndex = useCallback((index: number, highlightType: HighlightType) => {
    setHighlightedIndexState(index);
    setHighlightType(highlightType);
  }, []);

  const highlightedOption =
    options[highlightedIndex] && isHighlightable(options[highlightedIndex]) ? options[highlightedIndex] : undefined;

  const moveHighlightFrom = (direction: -1 | 1, startIndex = highlightedIndex, highlightType: HighlightType) => {
    const fromBottomEnd = startIndex === -1 && direction === -1;
    let newIndex = fromBottomEnd ? options.length : startIndex;
    do {
      newIndex += direction;
    } while (options[newIndex] && !isHighlightable(options[newIndex]));

    if (options[newIndex]) {
      setHighlightedIndex(newIndex, highlightType);
    }
  };

  const moveHighlight = (direction: -1 | 1, highlightType: HighlightType) =>
    moveHighlightFrom(direction, highlightedIndex, highlightType);

  const highlightOption = useCallback(
    (option: OptionType, highlightType: HighlightType) => {
      const index = options.indexOf(option);
      setHighlightedIndex(index, highlightType);
    },
    [options, setHighlightedIndex]
  );

  return [
    { highlightType, highlightedIndex, highlightedOption },
    {
      setHighlightedIndexWithMouse: (index: number, moveFocus = false) =>
        setHighlightedIndex(index, new HighlightType('mouse', moveFocus)),
      moveHighlightWithKeyboard: (direction: -1 | 1) => moveHighlight(direction, new HighlightType('keyboard')),
      highlightOptionWithKeyboard: (option: OptionType) => highlightOption(option, new HighlightType('keyboard')),
      resetHighlightWithKeyboard: () => setHighlightedIndex(-1, new HighlightType('keyboard')),
      goHomeWithKeyboard: () => moveHighlightFrom(1, -1, new HighlightType('keyboard')),
      goEndWithKeyboard: () => moveHighlightFrom(-1, options.length, new HighlightType('keyboard')),
    },
  ];
}
