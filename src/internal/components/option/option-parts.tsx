// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from './styles.css.js';
import clsx from 'clsx';
import React from 'react';
import { IconProps } from '../../../icon/interfaces';
import InternalIcon from '../../../icon/internal';
import HighlightMatch from './highlight-match';

interface LabelProps {
  label?: string;
  prefix?: string;
  highlightText?: string;
  triggerVariant: boolean;
}
export const Label = ({ label, prefix, highlightText, triggerVariant }: LabelProps) => (
  <span className={clsx(styles.label, triggerVariant && styles['trigger-variant'])}>
    {!!prefix && (
      <span className={clsx(styles['label-prefix'], triggerVariant && styles['trigger-variant'])}>{prefix} </span>
    )}
    <HighlightMatch str={label} highlightText={highlightText} />
  </span>
);

interface LabelTagProps {
  labelTag?: string;
  highlightText?: string;
  triggerVariant: boolean;
}
export const LabelTag = ({ labelTag, highlightText, triggerVariant }: LabelTagProps) =>
  labelTag ? (
    <span className={clsx(styles['label-tag'], triggerVariant && styles['trigger-variant'])}>
      <HighlightMatch str={labelTag} highlightText={highlightText} />
    </span>
  ) : null;

interface DescriptionProps {
  description?: string;
  highlightText?: string;
  triggerVariant: boolean;
}
export const Description = ({ description, highlightText, triggerVariant }: DescriptionProps) =>
  description ? (
    // We do not reach AA compliance in Dark mode for highlighted state
    // TODO: Remove aria-disabled={true} when we fix AWSUI-10333
    <span className={clsx(styles.description, triggerVariant && styles['trigger-variant'])} aria-disabled={true}>
      <HighlightMatch str={description} highlightText={highlightText} />
    </span>
  ) : null;

interface TagsProps {
  tags?: ReadonlyArray<string>;
  highlightText?: string;
  triggerVariant: boolean;
}
export const Tags = ({ tags, highlightText, triggerVariant }: TagsProps) =>
  tags ? (
    <span className={clsx(styles.tags)}>
      {tags.map((tag, idx) => (
        // We do not reach AA compliance in Dark mode for highlighted state
        // TODO: Remove aria-disabled={true} when we fix AWSUI-10333
        <span key={idx} className={clsx(styles.tag, triggerVariant && styles['trigger-variant'])} aria-disabled={true}>
          <HighlightMatch str={tag} highlightText={highlightText} />
        </span>
      ))}
    </span>
  ) : null;

interface FilteringTagProps {
  filteringTags?: ReadonlyArray<string>;
  highlightText?: string;
  triggerVariant: boolean;
}
export const FilteringTags = ({ filteringTags, highlightText, triggerVariant }: FilteringTagProps) => {
  if (!highlightText || !filteringTags) {
    return null;
  }

  const searchElement = highlightText.toLowerCase();

  return (
    <span className={clsx(styles.tags)}>
      {filteringTags.map((filteringTag, key) => {
        const match = filteringTag.toLowerCase().indexOf(searchElement) !== -1;
        if (match) {
          return (
            // We do not reach AA compliance in Dark mode for highlighted state
            // TODO: Remove aria-disabled={true} when we fix AWSUI-10333
            <span
              className={clsx(styles.tag, triggerVariant && styles['trigger-variant'])}
              key={key}
              aria-disabled={true}
            >
              <HighlightMatch str={filteringTag} highlightText={highlightText} />
            </span>
          );
        }
        return null;
      })}
    </span>
  );
};

export const OptionIcon = (props: IconProps) => {
  if (!props.name && !props.url && !props.svg) {
    return null;
  }

  return (
    <span className={clsx(styles.icon, props.size === 'big' && [styles[`icon-size-big`]])}>
      <InternalIcon {...props} />
    </span>
  );
};
