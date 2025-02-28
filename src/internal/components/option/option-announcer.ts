// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition, OptionGroup } from './interfaces';
import { matchesString } from './utils/filter-options';

interface DefaultOptionDescriptionProps {
  option: OptionDefinition;
  parentGroup?: OptionGroup;
  highlightText?: string;
}

function getMatchingFilteringTags(filteringTags?: readonly string[], highlightText?: string): string[] {
  if (!highlightText || !filteringTags) {
    return [];
  }

  return filteringTags.filter(filteringTag => matchesString(filteringTag, highlightText, false));
}

function defaultOptionDescription({ option, parentGroup, highlightText }: DefaultOptionDescriptionProps) {
  return [
    parentGroup && parentGroup.label,
    option.__labelPrefix,
    option.label || option.value,
    option.description,
    option.labelTag,
  ]
    .concat(option.tags)
    .concat(getMatchingFilteringTags(option.filteringTags, highlightText))
    .filter(el => !!el)
    .join(' ');
}

export default defaultOptionDescription;
