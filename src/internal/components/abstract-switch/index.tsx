// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import useFocusVisible from '../../hooks/focus-visible';
import { useUniqueId } from '../../hooks/use-unique-id';
import { InternalBaseComponentProps } from '../../hooks/use-base-component/index.js';

export interface AbstractSwitchProps extends React.HTMLAttributes<HTMLElement>, InternalBaseComponentProps {
  controlId?: string;
  controlClassName: string;
  disabled?: boolean;
  nativeControl: (props: React.InputHTMLAttributes<HTMLInputElement>) => React.ReactElement;
  styledControl: React.ReactElement;
  label?: React.ReactNode;
  description?: React.ReactNode;
  descriptionBottomPadding?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  withoutLabel?: boolean;
}

function joinString(values: (string | undefined)[]) {
  return values.filter((value): value is string => !!value).join(' ');
}

export default function AbstractSwitch({
  controlId,
  controlClassName,
  disabled,
  nativeControl,
  styledControl,
  label,
  description,
  descriptionBottomPadding,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  withoutLabel,
  __internalRootRef,
  ...rest
}: AbstractSwitchProps) {
  const uniqueId = useUniqueId();
  const id = controlId || uniqueId;

  const focusVisible = useFocusVisible();
  const wrapperId = `${id}-wrapper`;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const WrapperElement = withoutLabel ? 'div' : 'label';
  const wrapperAttributes: Record<string, string | undefined> = {};
  if (!withoutLabel) {
    wrapperAttributes.id = wrapperId;
    wrapperAttributes.htmlFor = id;
  }

  const ariaLabelledByIds = [];
  if (label) {
    ariaLabelledByIds.push(labelId);
  }
  if (ariaLabelledby) {
    ariaLabelledByIds.push(ariaLabelledby);
  }

  const ariaDescriptons = [];
  if (ariaDescribedby) {
    ariaDescriptons.push(ariaDescribedby);
  }
  if (description) {
    ariaDescriptons.push(descriptionId);
  }

  return (
    <div {...rest} className={clsx(styles.wrapper, rest.className)} ref={__internalRootRef}>
      <WrapperElement
        {...wrapperAttributes}
        className={styles['label-wrapper']}
        aria-disabled={disabled ? 'true' : undefined}
      >
        <span className={clsx(styles.control, controlClassName)}>
          {styledControl}
          {nativeControl({
            ...focusVisible,
            id,
            disabled,
            'aria-describedby': ariaDescriptons.length ? joinString(ariaDescriptons) : undefined,
            'aria-labelledby': ariaLabelledByIds.length ? joinString(ariaLabelledByIds) : undefined,
            'aria-label': ariaLabel,
          })}
          {/*
          An empty element to display the outline, because the native control is invisible.
          Note: There is a CSS selector in src/toggle/styles.scss that relies on a span element selector to show focus.
          */}
          <span className={styles.outline} />
        </span>
        <span className={clsx(styles.content, !label && !description && styles['empty-content'])}>
          {label && (
            <span id={labelId} className={clsx(styles.label, { [styles['label-disabled']]: disabled })}>
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
      </WrapperElement>
    </div>
  );
}
