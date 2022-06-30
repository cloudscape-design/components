// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { OptionProps } from './interfaces';
import { Label, LabelTag, Description, Tags, FilteringTags, OptionIcon } from './option-parts';
import { getBaseProps } from '../../base-component';
import { warnOnce } from '../../logging';
import { isDevelopment } from '../../is-development';

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

  const className = clsx(styles.option, disabled && styles.disabled, isGroupOption && styles.parent);

  const icon = option.__customIcon || (
    <OptionIcon
      name={option.iconName}
      url={option.iconUrl}
      svg={option.iconSvg}
      alt={option.iconAlt}
      size={option.description || option.tags ? 'big' : 'normal'}
    />
  );

  return (
    <div
      title={option.label || option.value}
      data-value={option.value}
      className={className}
      aria-disabled={disabled}
      {...baseProps}
    >
      {icon}
      <div className={clsx(styles.content)}>
        <div className={clsx(styles['label-content'])}>
          <Label
            label={option.label || option.value}
            prefix={option.__labelPrefix}
            highlightText={highlightText}
            triggerVariant={triggerVariant}
          />
          <LabelTag labelTag={option.labelTag} highlightText={highlightText} triggerVariant={triggerVariant} />
        </div>
        <Description description={option.description} highlightText={highlightText} triggerVariant={triggerVariant} />
        <Tags tags={option.tags} highlightText={highlightText} triggerVariant={triggerVariant} />
        <FilteringTags
          filteringTags={option.filteringTags}
          highlightText={highlightText}
          triggerVariant={triggerVariant}
        />
      </div>
    </div>
  );
};

export default Option;
