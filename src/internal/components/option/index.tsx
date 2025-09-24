// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../../base-component';
import { isDevelopment } from '../../is-development';
import { OptionProps } from './interfaces';
import { Description, FilteringTags, Label, LabelTag, OptionIcon, Tags } from './option-parts';

import styles from './styles.css.js';

export { OptionProps };

function validateStringValue(value: string | undefined, propertyName: string) {
  if (typeof value !== 'undefined' && typeof value !== 'string') {
    warnOnce(
      'DropdownOption',
      `This component only supports string values, but "option.${propertyName}" has ${typeof value} type. The component may work incorrectly.`
    );
  }
}

const Option = ({
  option,
  highlightText,
  triggerVariant = false,
  isGroupOption = false,
  highlightedOption = false,
  selectedOption = false,
  disableTitleTooltip = false,
  labelContainerRef,
  labelRef,
  labelId,
  ...restProps
}: OptionProps) => {
  if (!option) {
    return null;
  }
  const { disabled } = option;
  const baseProps = getBaseProps(restProps);

  if (isDevelopment) {
    validateStringValue(option.label, 'label');
    validateStringValue(option.description, 'description');
    validateStringValue(option.labelTag, 'labelTag');
    option.tags?.forEach((tag, index) => {
      validateStringValue(tag, `tags[${index}]`);
    });
    option.filteringTags?.forEach((tag, index) => {
      validateStringValue(tag, `filteringTags[${index}]`);
    });
  }

  const className = clsx(
    styles.option,
    disabled && styles.disabled,
    isGroupOption && styles.parent,
    highlightedOption && styles.highlighted,
    baseProps.className
  );

  const icon = option.__customIcon || (
    <OptionIcon
      name={option.iconName}
      url={option.iconUrl}
      svg={option.iconSvg}
      alt={option.iconAlt}
      ariaLabel={option.iconAriaLabel}
      size="normal"
    />
  );

  // If labelContent is defined it is expected to be JSX, this is not safe to nest in a span so this condition nests it in a div instead.
  if (option.labelContent) {
    return (
      <div {...baseProps} data-value={option.value} className={className} lang={option.lang}>
        {icon}
        <div className={styles.content}>
          <div className={styles['label-content']}>
            <Label
              labelContainerRef={labelContainerRef}
              labelRef={labelRef}
              labelId={labelId}
              label={option.labelContent}
              prefix={option.__labelPrefix}
              highlightText={highlightText}
              triggerVariant={triggerVariant}
            />
            <LabelTag labelTag={option.labelTag} highlightText={highlightText} triggerVariant={triggerVariant} />
          </div>
          <Description
            description={option.description}
            highlightedOption={highlightedOption}
            selectedOption={selectedOption}
            highlightText={highlightText}
            triggerVariant={triggerVariant}
          />
          <Tags
            tags={option.tags}
            highlightedOption={highlightedOption}
            selectedOption={selectedOption}
            highlightText={highlightText}
            triggerVariant={triggerVariant}
          />
          <FilteringTags
            filteringTags={option.filteringTags}
            highlightedOption={highlightedOption}
            selectedOption={selectedOption}
            highlightText={highlightText}
            triggerVariant={triggerVariant}
          />
        </div>
      </div>
    );
  }

  return (
    <span
      {...baseProps}
      data-value={option.value}
      className={className}
      lang={option.lang}
      title={!disableTitleTooltip ? (option.label ?? option.value) : undefined}
    >
      {icon}
      <span className={styles.content}>
        <span className={styles['label-content']}>
          <Label
            labelContainerRef={labelContainerRef}
            labelRef={labelRef}
            labelId={labelId}
            label={option.label ?? option.value}
            prefix={option.__labelPrefix}
            highlightText={highlightText}
            triggerVariant={triggerVariant}
          />
          <LabelTag labelTag={option.labelTag} highlightText={highlightText} triggerVariant={triggerVariant} />
        </span>
        <Description
          description={option.description}
          highlightedOption={highlightedOption}
          selectedOption={selectedOption}
          highlightText={highlightText}
          triggerVariant={triggerVariant}
        />
        <Tags
          tags={option.tags}
          highlightedOption={highlightedOption}
          selectedOption={selectedOption}
          highlightText={highlightText}
          triggerVariant={triggerVariant}
        />
        <FilteringTags
          filteringTags={option.filteringTags}
          highlightedOption={highlightedOption}
          selectedOption={selectedOption}
          highlightText={highlightText}
          triggerVariant={triggerVariant}
        />
      </span>
    </span>
  );
};

export default Option;
