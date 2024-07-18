// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import clsx from 'clsx';

import InternalAlert from '../../alert/internal';
import InternalBox from '../../box/internal';
import { InternalButton } from '../../button/internal';
import { HotspotProps } from '../../hotspot/interfaces';
import { useUniqueId } from '../../internal/hooks/use-unique-id/index.js';
import { scrollElementIntoView } from '../../internal/utils/scrollable-containers';
import { joinStrings } from '../../internal/utils/strings/join-strings.js';
import PopoverBody from '../../popover/body';
import PopoverContainer from '../../popover/container';
import { InternalPosition } from '../../popover/interfaces';
import InternalSpaceBetween from '../../space-between/internal';
import { AnnotationContextProps } from '../interfaces';

import styles from './styles.css.js';

export interface AnnotationPopoverProps {
  title: string;
  content: React.ReactNode;
  alert: React.ReactNode;

  direction: HotspotProps['direction'];

  nextButtonEnabled: boolean;
  onNextButtonClick: () => void;

  onFinish: () => void;

  showPreviousButton: boolean;
  previousButtonEnabled: boolean;
  onPreviousButtonClick: () => void;

  taskLocalStepIndex: number;

  totalLocalSteps: number;

  showFinishButton: boolean;

  onDismiss: () => void;

  trackRef: React.RefObject<HTMLElement>;

  i18nStrings: AnnotationContextProps['i18nStrings'];
}

const arrow = (position: InternalPosition | null) => (
  <div className={clsx(styles.arrow, styles[`arrow-position-${position}`])}>
    <div className={styles['arrow-outer']} />
    <div className={styles['arrow-inner']} />
  </div>
);

export function AnnotationPopover({
  title,
  content,
  alert,

  direction = 'top',

  taskLocalStepIndex,

  totalLocalSteps,

  showPreviousButton,
  showFinishButton,

  onDismiss,

  nextButtonEnabled,
  onNextButtonClick,

  onFinish,

  trackRef,

  previousButtonEnabled,
  onPreviousButtonClick,
  i18nStrings,
}: AnnotationPopoverProps) {
  useEffect(() => {
    scrollElementIntoView(trackRef.current ?? undefined);
  }, [trackRef]);

  const popoverHeaderId = useUniqueId('poppver-header-');
  const stepCounterId = useUniqueId('step-counter-');

  return (
    <PopoverContainer
      size="medium"
      fixedWidth={false}
      position={direction}
      trackRef={trackRef}
      trackKey={taskLocalStepIndex}
      variant="annotation"
      arrow={arrow}
      zIndex={1000}
    >
      <PopoverBody
        dismissButton={true}
        dismissAriaLabel={i18nStrings.labelDismissAnnotation}
        header={
          <InternalBox
            id={popoverHeaderId}
            color="text-body-secondary"
            fontSize="body-s"
            margin={{ top: 'xxxs' }}
            className={styles.header}
          >
            {title}
          </InternalBox>
        }
        onDismiss={onDismiss}
        className={styles.annotation}
        variant="annotation"
        overflowVisible="content"
        // create new dialog to have the native dialog behavior of the screen readers
        key={taskLocalStepIndex}
        ariaLabelledby={joinStrings(popoverHeaderId, stepCounterId)}
      >
        <InternalSpaceBetween size="s">
          <div className={styles.description}>
            <InternalBox className={styles.content}>{content}</InternalBox>
          </div>

          {alert && <InternalAlert type="warning">{alert}</InternalAlert>}

          <InternalSpaceBetween size="s">
            <div className={styles.divider} />

            <div className={styles.actionBar}>
              <div className={styles.stepCounter}>
                <InternalBox
                  id={stepCounterId}
                  className={styles['step-counter-content']}
                  color="text-body-secondary"
                  fontSize="body-s"
                >
                  {i18nStrings.stepCounterText(taskLocalStepIndex ?? 0, totalLocalSteps ?? 0)}
                </InternalBox>
              </div>
              <InternalSpaceBetween size="xs" direction="horizontal">
                {showPreviousButton && (
                  <InternalButton
                    variant="link"
                    onClick={onPreviousButtonClick}
                    disabled={!previousButtonEnabled}
                    formAction="none"
                    ariaLabel={i18nStrings.previousButtonText}
                    className={styles['previous-button']}
                  >
                    {i18nStrings.previousButtonText}
                  </InternalButton>
                )}

                {showFinishButton ? (
                  <InternalButton
                    onClick={onFinish}
                    formAction="none"
                    ariaLabel={i18nStrings.finishButtonText}
                    className={styles['finish-button']}
                  >
                    {i18nStrings.finishButtonText}
                  </InternalButton>
                ) : (
                  <InternalButton
                    onClick={onNextButtonClick}
                    disabled={!nextButtonEnabled}
                    formAction="none"
                    ariaLabel={i18nStrings.nextButtonText}
                    className={styles['next-button']}
                  >
                    {i18nStrings.nextButtonText}
                  </InternalButton>
                )}
              </InternalSpaceBetween>
            </div>
          </InternalSpaceBetween>
        </InternalSpaceBetween>
      </PopoverBody>
    </PopoverContainer>
  );
}
