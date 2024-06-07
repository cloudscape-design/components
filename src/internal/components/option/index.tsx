// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { OptionProps } from './interfaces';
import { Label, LabelTag, Description, Tags, FilteringTags, OptionIcon } from './option-parts';
import { getBaseProps } from '../../base-component';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
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
  isGenericGroup = true,
  highlightedOption = false,
  selectedOption = false,
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
    highlightedOption && styles.highlighted
  );

  const icon = option.__customIcon || (
    <OptionIcon
      name={option.iconName}
      url={option.iconUrl}
      svg={option.iconSvg}
      alt={option.iconAlt}
      size={option.description || option.tags ? 'big' : 'normal'}
    />
  );

  // The option is conditionally assigned 'title' and 'aria-disabled' attributes to ensure it is viewed as a (generic) group  by assistive technology only when necessary.
  // Omitting the props might be necessary if they are provided on the parent element to avoid nested groups.
  // See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/generic_role
  const genericGroupProps = isGenericGroup
    ? {
        title: option.label ?? option.value,
        'aria-disabled': disabled,
      }
    : undefined;

  return (
    <span data-value={option.value} className={className} lang={option.lang} {...genericGroupProps} {...baseProps}>
      {icon}
      <span className={styles.content}>
        <span className={styles['label-content']}>
          <Label
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
