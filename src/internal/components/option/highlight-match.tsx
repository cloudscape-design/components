// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';

const splitOnFiltering = (str: string, highlightText: string) => {
  // Filtering needs to be case insensitive
  const filteringPattern = highlightText.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
  const regexp = new RegExp(filteringPattern, 'gi');
  const noMatches = str.split(regexp);
  const matches = str.match(regexp);

  return { noMatches, matches };
};

export interface HighlightMatchProps {
  str?: string;
  highlightText?: string;
}

const Highlight = ({ str }: HighlightMatchProps) =>
  str ? <span className={clsx(styles['filtering-match-highlight'])}>{str}</span> : null;

export default function HighlightMatch({ str, highlightText }: HighlightMatchProps) {
  // splitOnFiltering creates a regex using user-provided strings, so we skip
  // highlighting if the generated regex would be too memory intensive.
  if (!str || !highlightText || highlightText.length > 100000) {
    return <span>{str}</span>;
  }

  if (str === highlightText) {
    return <Highlight str={str} />;
  }

  const { noMatches, matches } = splitOnFiltering(str, highlightText);

  const highlighted: (string | JSX.Element)[] = [];

  noMatches.forEach((noMatch, idx) => {
    highlighted.push(<span key={`noMatch-${idx}`}>{noMatch}</span>);

    if (matches && idx < matches.length) {
      highlighted.push(<Highlight key={`match-${idx}`} str={matches[idx]} />);
    }
  });

  return <span>{highlighted}</span>;
}
