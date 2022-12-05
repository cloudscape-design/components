// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import { getBaseProps } from '../internal/base-component';
import { warnOnce } from '../internal/logging';
import { ProgressBarProps } from './interfaces';
import { fireNonCancelableEvent } from '../internal/events';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { Progress, ResultState, SmallText } from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import DynamicAriaLive from '../internal/components/dynamic-aria-live';

export { ProgressBarProps };

export default function ProgressBar({
  value = 0,
  status = 'in-progress',
  variant = 'standalone',
  resultButtonText,
  label,
  description,
  additionalInfo,
  resultText,
  onResultButtonClick,
  ...rest
}: ProgressBarProps) {
  const { __internalRootRef } = useBaseComponent('ProgressBar');
  const baseProps = getBaseProps(rest);
  const generatedName = useUniqueId('awsui-progress-bar-');

  const labelId = `${generatedName}-label`;
  const isInFlash = variant === 'flash';
  const isInProgressState = status === 'in-progress';

  if (isInFlash && resultButtonText) {
    warnOnce(
      'ProgressBar',
      'The `resultButtonText` is ignored if you set `variant="flash"`, and the result button is not displayed. Use the `buttonText` property and the `onButtonClick` event listener of the flashbar item in which the progress bar component is embedded.'
    );
  }

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root, variant && styles[variant])}
      ref={__internalRootRef}
    >
      <div className={isInFlash ? styles['flash-container'] : undefined}>
        <div className={clsx(styles['word-wrap'], styles[`label-${variant}`])} id={labelId}>
          {label}
        </div>
        {description && <SmallText color={isInFlash ? 'inherit' : undefined}>{description}</SmallText>}
        <div>
          {isInProgressState ? (
            <>
              <Progress value={value} labelId={labelId} isInFlash={isInFlash} />
              <DynamicAriaLive>{`${label ?? ''}: ${value}%`}</DynamicAriaLive>
            </>
          ) : (
            <ResultState
              resultText={resultText}
              isInFlash={isInFlash}
              resultButtonText={resultButtonText}
              status={status}
              onClick={() => {
                fireNonCancelableEvent(onResultButtonClick);
              }}
            />
          )}
        </div>
      </div>
      {additionalInfo && <SmallText color={isInFlash ? 'inherit' : undefined}>{additionalInfo}</SmallText>}
    </div>
  );
}

applyDisplayName(ProgressBar, 'ProgressBar');
