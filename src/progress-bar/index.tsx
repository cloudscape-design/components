// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import { getBaseProps } from '../internal/base-component';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { ProgressBarProps } from './interfaces';
import { fireNonCancelableEvent } from '../internal/events';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { Progress, ResultState, SmallText } from './internal';
import { joinStrings } from '../internal/utils/strings';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { throttle } from '../internal/utils/throttle';
import LiveRegion from '../internal/components/live-region';

const ASSERTION_FREQUENCY = 5000; // interval in ms between progress announcements

export { ProgressBarProps };

export default function ProgressBar({
  value = 0,
  status = 'in-progress',
  variant = 'standalone',
  resultButtonText,
  label,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  description,
  additionalInfo,
  resultText,
  onResultButtonClick,
  ...rest
}: ProgressBarProps) {
  const { __internalRootRef } = useBaseComponent('ProgressBar', {
    props: { variant },
  });
  const baseProps = getBaseProps(rest);
  const generatedName = useUniqueId('awsui-progress-bar-');

  const labelId = `${generatedName}-label`;
  const isInFlash = variant === 'flash';
  const isInProgressState = status === 'in-progress';

  const descriptionId = useUniqueId('progressbar-description-');
  const additionalInfoId = useUniqueId('progressbar-additional-info-');

  const [announcedValue, setAnnouncedValue] = useState('');
  const throttledAssertion = useMemo(() => {
    return throttle((value: ProgressBarProps['value']) => {
      setAnnouncedValue(`${value}%`);
    }, ASSERTION_FREQUENCY);
  }, []);

  useEffect(() => {
    throttledAssertion(value);
  }, [throttledAssertion, value]);

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
        {description && (
          <SmallText color={isInFlash ? 'inherit' : undefined} id={descriptionId}>
            {description}
          </SmallText>
        )}
        <div>
          {isInProgressState ? (
            <>
              <Progress
                value={value}
                ariaLabel={ariaLabel}
                ariaLabelledby={joinStrings(labelId, ariaLabelledby)}
                ariaDescribedby={joinStrings(
                  description ? descriptionId : undefined,
                  additionalInfo ? additionalInfoId : undefined,
                  ariaDescribedby
                )}
                isInFlash={isInFlash}
              />
              <LiveRegion delay={0}>
                {label}
                {label ? ': ' : null}
                {announcedValue}
              </LiveRegion>
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
      {additionalInfo && (
        <SmallText
          className={styles['additional-info']}
          color={isInFlash ? 'inherit' : undefined}
          id={additionalInfoId}
        >
          {additionalInfo}
        </SmallText>
      )}
    </div>
  );
}

applyDisplayName(ProgressBar, 'ProgressBar');
