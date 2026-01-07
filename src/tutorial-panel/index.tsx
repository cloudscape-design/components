// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { useContext, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { hotspotContext } from '../annotation-context/context';
import { getBaseProps } from '../internal/base-component';
import { NonCancelableCustomEvent } from '../internal/events';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import TutorialDetailView from './components/tutorial-detail-view';
import TutorialList from './components/tutorial-list';
import { TutorialPanelProps } from './interfaces';

import styles from './styles.css.js';

export { TutorialPanelProps };

export default function TutorialPanel({
  i18nStrings,
  loading,
  tutorials,
  onFeedbackClick,
  downloadUrl,
  ...restProps
}: TutorialPanelProps) {
  const { __internalRootRef } = useBaseComponent('TutorialPanel');
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useUniqueId();

  const baseProps = getBaseProps(restProps);
  const context = useContext(hotspotContext);

  function handleExitTutorial(event: NonCancelableCustomEvent<TutorialPanelProps.TutorialDetail>) {
    context.onExitTutorial(event);
    panelRef.current?.focus();
  }

  const mergedRef = useMergeRefs(panelRef, __internalRootRef);

  return (
    <>
      <div
        {...baseProps}
        className={clsx(baseProps.className, styles['tutorial-panel'])}
        ref={mergedRef}
        tabIndex={-1}
        {...(!context.currentTutorial && {
          role: 'region',
          'aria-labelledby': headingId,
        })}
      >
        {context.currentTutorial ? (
          <TutorialDetailView
            i18nStrings={i18nStrings}
            tutorial={context.currentTutorial}
            onExitTutorial={handleExitTutorial}
            currentStepIndex={context.currentStepIndex}
            onFeedbackClick={onFeedbackClick}
          />
        ) : (
          <TutorialList
            i18nStrings={i18nStrings}
            tutorials={tutorials}
            loading={loading}
            onStartTutorial={context.onStartTutorial}
            downloadUrl={downloadUrl}
            headingId={headingId}
          />
        )}
      </div>
    </>
  );
}

applyDisplayName(TutorialPanel, 'TutorialPanel');
