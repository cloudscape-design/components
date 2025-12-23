// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { useContext, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { hotspotContext } from '../annotation-context/context';
import { getBaseProps } from '../internal/base-component';
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

  const baseProps = getBaseProps(restProps);
  const context = useContext(hotspotContext);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const previousTutorialRef = useRef(context.currentTutorial);

  // Restore focus to the tutorial panel header when exiting a tutorial
  useEffect(() => {
    if (!context.currentTutorial && previousTutorialRef.current) {
      headerRef.current?.focus({ preventScroll: true });
    }
    previousTutorialRef.current = context.currentTutorial;
  }, [context.currentTutorial]);

  return (
    <>
      <div {...baseProps} className={clsx(baseProps.className, styles['tutorial-panel'])} ref={__internalRootRef}>
        {context.currentTutorial ? (
          <TutorialDetailView
            i18nStrings={i18nStrings}
            tutorial={context.currentTutorial}
            onExitTutorial={context.onExitTutorial}
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
            headerRef={headerRef}
          />
        )}
      </div>
    </>
  );
}

applyDisplayName(TutorialPanel, 'TutorialPanel');
