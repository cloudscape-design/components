// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import {
  getAnalyticsLabelAttribute,
  getAnalyticsMetadataAttribute,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { InternalBaseComponentProps } from '../../hooks/use-base-component/index.js';
import { useUniqueId } from '../../hooks/use-unique-id';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export interface AbstractSwitchProps extends React.HTMLAttributes<HTMLElement>, InternalBaseComponentProps {
  controlId?: string;
  controlClassName: string;
  outlineClassName: string;
  showOutline?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  nativeControl: (props: React.InputHTMLAttributes<HTMLInputElement>) => React.ReactElement;
  styledControl: React.ReactElement;
  label?: React.ReactNode;
  description?: React.ReactNode;
  descriptionBottomPadding?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  ariaControls?: string;
  onClick: () => void;
}

function joinString(values: (string | undefined)[]) {
  return values.filter((value): value is string => !!value).join(' ');
}

export default function AbstractSwitch({
  controlId,
  controlClassName,
  outlineClassName,
  showOutline,
  disabled,
  readOnly,
  nativeControl,
  styledControl,
  label,
  description,
  descriptionBottomPadding,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ariaControls,
  onClick,
  __internalRootRef,
  ...rest
}: AbstractSwitchProps) {
  const uniqueId = useUniqueId();
  const id = controlId || uniqueId;

  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const ariaLabelledByIds = [];
  if (label && !ariaLabel) {
    ariaLabelledByIds.push(labelId);
  }
  if (ariaLabelledby) {
    ariaLabelledByIds.push(ariaLabelledby);
  }

  const ariaDescriptions = [];
  if (ariaDescribedby) {
    ariaDescriptions.push(ariaDescribedby);
  }
  if (description) {
    ariaDescriptions.push(descriptionId);
  }

  return (
    <span
      {...rest}
      className={clsx(styles.wrapper, rest.className)}
      ref={__internalRootRef}
      {...getAnalyticsLabelAttribute(label ? `.${analyticsSelectors.label}` : `.${analyticsSelectors['native-input']}`)}
    >
      <span
        className={styles['label-wrapper']}
        aria-disabled={disabled ? 'true' : undefined}
        onClick={disabled || readOnly ? undefined : onClick}
        {...getAnalyticsMetadataAttribute(
          disabled || readOnly
            ? {}
            : {
                action: 'select',
                detail: {
                  label: label ? `.${analyticsSelectors.label}` : `.${analyticsSelectors['native-input']}`,
                },
              }
        )}
      >
        <span className={clsx(styles.control, controlClassName)}>
          {styledControl}
          {nativeControl({
            id,
            disabled,
            className: clsx(styles['native-input'], analyticsSelectors['native-input']),
            'aria-describedby': ariaDescriptions.length ? joinString(ariaDescriptions) : undefined,
            'aria-labelledby': ariaLabelledByIds.length ? joinString(ariaLabelledByIds) : undefined,
            'aria-label': ariaLabel,
            'aria-controls': ariaControls,
          })}
          <span className={clsx(styles.outline, outlineClassName, showOutline && styles['show-outline'])} />
        </span>
        <span className={clsx(styles.content, !label && !description && styles['empty-content'])}>
          {label && (
            <span
              id={labelId}
              className={clsx(styles.label, analyticsSelectors.label, { [styles['label-disabled']]: disabled })}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              id={descriptionId}
              className={clsx(styles.description, {
                [styles['description-disabled']]: disabled,
                [styles['description-bottom-padding']]: descriptionBottomPadding,
              })}
            >
              {description}
            </span>
          )}
        </span>
      </span>
    </span>
  );
}
