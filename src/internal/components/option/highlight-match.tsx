// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import styles from './styles.css.js';

const splitOnFiltering = (str: string, highlightText: string) => {
  // We match by creating a regex using user-provided strings, so we skip
  // highlighting if the generated regex would be too memory intensive.
  if (highlightText.length > 10_000) {
    return { noMatches: [str], matches: null };
  }

  // Filtering needs to be case insensitive
  const filteringPattern = highlightText.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
  const regexp = new RegExp(filteringPattern, 'gi');
  const noMatches = str.split(regexp);
  const matches = str.match(regexp);

  return { noMatches, matches };
};

interface HighlightMatchProps {
  str?: string;
  highlightText?: string;
  labelRef?: React.RefObject<HTMLElement>;
}

function Highlight({ str, labelRef }: HighlightMatchProps) {
  return (
    <mark ref={labelRef} className={styles['filtering-match-highlight']}>
      {str}
    </mark>
  );
}

export default function HighlightMatch({ str, highlightText, labelRef }: HighlightMatchProps) {
  if (!str || !highlightText) {
    return <span ref={labelRef}>{str}</span>;
  }

  if (str === highlightText) {
    return <Highlight labelRef={labelRef} str={str} />;
  }

  const { noMatches, matches } = splitOnFiltering(str, highlightText);

  const highlighted: (string | JSX.Element)[] = [];

  noMatches.forEach((noMatch, idx) => {
    highlighted.push(<span key={`noMatch-${idx}`}>{noMatch}</span>);

    if (matches && idx < matches.length) {
      highlighted.push(<Highlight key={`match-${idx}`} str={matches[idx]} />);
    }
  });

  return <span ref={labelRef}>{highlighted}</span>;
}
