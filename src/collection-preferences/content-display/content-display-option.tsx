// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, forwardRef } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { ToggleProps } from '../../toggle/interfaces';
import InternalToggle from '../../toggle/internal';
import { OptionWithVisibility } from './utils';

import styles from '../styles.css.js';

const componentPrefix = 'content-display-option';
export const getClassName = (suffix?: string) => styles[[componentPrefix, suffix].filter(Boolean).join('-')];

interface ContentDisplayOptionProps {
  onToggle?: (option: OptionWithVisibility) => void;
  option: OptionWithVisibility;
  toggleClassNames?: ToggleProps.ClassNames;
}

const ContentDisplayOption = forwardRef(
  ({ onToggle, option, toggleClassNames }: ContentDisplayOptionProps, ref: ForwardedRef<HTMLDivElement>) => {
    const idPrefix = useUniqueId(componentPrefix);
    const controlId = `${idPrefix}-control-${option.id}`;
    return (
      <div ref={ref} className={getClassName('content')}>
        <label className={getClassName('label')} htmlFor={controlId}>
          {option.label}
        </label>
        <div className={getClassName('toggle')}>
          <InternalToggle
            checked={!!option.visible}
            onChange={() => onToggle && onToggle(option)}
            disabled={option.alwaysVisible === true}
            controlId={controlId}
            classNames={toggleClassNames}
          />
        </div>
      </div>
    );
  }
);

export default ContentDisplayOption;
