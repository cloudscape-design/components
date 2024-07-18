// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect } from 'react';
import clsx from 'clsx';

import AnnotationContext from '~components/annotation-context';
import Hotspot from '~components/hotspot';
import properties from '~components/internal/generated/custom-css-properties';

import { annotationContextStrings } from '../onboarding/i18n';
import tutorials from '../onboarding/tutorials';
import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

const tutorial = tutorials(() => {})[0];

export default function AnnotationScroll() {
  const onStartTutorial = () => {};
  const onExitTutorial = () => {};

  useLayoutEffect(() => {
    const fixedHeightVar = '--fixed-height';
    document.documentElement.style.setProperty(fixedHeightVar, '180px');
    document.documentElement.style.setProperty(
      properties.contentScrollMargin,
      // Add 4px to scroll-margin to avoid edge on edge
      `calc(var(${fixedHeightVar}) + 4px) 0 calc(var(${fixedHeightVar}) + 4px) 0`
    );
  }, []);

  return (
    <>
      <h1>Annotation Context: Annotation Scroll</h1>
      <ScreenshotArea>
        <AnnotationContext
          currentTutorial={tutorial}
          i18nStrings={annotationContextStrings}
          onStartTutorial={onStartTutorial}
          onExitTutorial={onExitTutorial}
        >
          <div className={styles.parent}>
            <span />
            <Hotspot data-testid="hotspot-1" hotspotId={tutorial.tasks[0].steps[0].hotspotId}></Hotspot>
            <Hotspot data-testid="hotspot-2" hotspotId={tutorial.tasks[0].steps[2].hotspotId}></Hotspot>
          </div>
          <div className={clsx(styles.fixed, styles.header)} data-testid="header" />
          <div className={clsx(styles.fixed, styles.footer)} data-testid="footer" />
        </AnnotationContext>
      </ScreenshotArea>
    </>
  );
}
