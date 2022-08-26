// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useState } from 'react';

export type HighlightType = 'keyboard' | 'mouse';

export function createHighlightedOptionHook<OptionType>({
  isHighlightable,
}: {
  isHighlightable: (option: OptionType) => boolean;
}) {
  return function useHighlightedOption({ options }: { options: ReadonlyArray<OptionType> }) {
    const [highlightedIndex, setHighlightedIndexState] = useState(-1);
    const [highlightType, setHighlightType] = useState<HighlightType>('keyboard');
    const setHighlightedIndex = useCallback((index: number, highlightType: HighlightType) => {
      setHighlightedIndexState(index);
      setHighlightType(highlightType);
    }, []);
    const highlightedOption =
      options[highlightedIndex] && isHighlightable(options[highlightedIndex]) ? options[highlightedIndex] : undefined;

    const moveHighlightFrom = (direction: -1 | 1, startIndex = highlightedIndex, highlightType: HighlightType) => {
      let newIndex = startIndex;
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

    return {
      highlightType,
      highlightedIndex,
      highlightedOption,
      // Mouse handlers
      setHighlightedIndex: (index: number) => setHighlightedIndex(index, 'mouse'),
      // Keyboard handlers
      moveHighlight: (direction: -1 | 1) => moveHighlight(direction, 'keyboard'),
      highlightOption: (option: OptionType) => highlightOption(option, 'keyboard'),
      resetHighlight: () => setHighlightedIndex(-1, 'keyboard'),
      goHome: () => moveHighlightFrom(1, -1, 'keyboard'),
      goEnd: () => moveHighlightFrom(-1, options.length, 'keyboard'),
    };
  };
}
