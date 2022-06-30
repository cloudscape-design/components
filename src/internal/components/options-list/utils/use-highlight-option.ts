// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useState } from 'react';

export function createHighlightedOptionHook<OptionType>({
  isHighlightable,
}: {
  isHighlightable: (option: OptionType) => boolean;
}) {
  return function useHighlightedOption(options: ReadonlyArray<OptionType>) {
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const highlightedOption =
      options[highlightedIndex] && isHighlightable(options[highlightedIndex]) ? options[highlightedIndex] : undefined;

    const moveHighlightFrom = (direction: -1 | 1, startIndex = highlightedIndex) => {
      let newIndex = startIndex;
      do {
        newIndex += direction;
      } while (options[newIndex] && !isHighlightable(options[newIndex]));

      if (options[newIndex]) {
        setHighlightedIndex(newIndex);
      }
    };

    const moveHighlight = (direction: -1 | 1) => moveHighlightFrom(direction);

    const highlightOption = useCallback(
      (option: OptionType) => {
        const index = options.indexOf(option);
        setHighlightedIndex(index);
      },
      [options]
    );

    return {
      setHighlightedIndex,
      highlightedIndex,
      highlightedOption,
      moveHighlight,
      resetHighlight: () => setHighlightedIndex(-1),
      goHome: () => moveHighlightFrom(1, -1),
      goEnd: () => moveHighlightFrom(-1, options.length),
      highlightOption,
    };
  };
}
