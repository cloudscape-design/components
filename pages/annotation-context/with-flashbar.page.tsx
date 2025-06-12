// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AnnotationContext from '~components/annotation-context';
import Button from '~components/button';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Hotspot from '~components/hotspot';
import Link from '~components/link';

import { annotationContextStrings } from '../onboarding/i18n';
import tutorials from '../onboarding/tutorials';
import ScreenshotArea from '../utils/screenshot-area';

const tutorial = tutorials(() => {})[0];
const noop = () => {};

const dismissibleCommonProps: Partial<FlashbarProps.MessageDefinition> = {
  dismissible: true,
  dismissLabel: 'Dismiss',
  onDismiss: noop,
};

export default function AnnotationScroll() {
  return (
    <>
      <h1>Annotation Context: with Hotspots inside flashbar</h1>
      <ScreenshotArea>
        <AnnotationContext
          currentTutorial={tutorial}
          i18nStrings={annotationContextStrings}
          onStartTutorial={noop}
          onExitTutorial={noop}
        >
          <Flashbar
            items={[
              {
                ...dismissibleCommonProps,
                type: 'info',
                content: (
                  <>
                    info variant{' '}
                    <Link href="#" color="inverted">
                      click me
                    </Link>
                  </>
                ),
                action: (
                  <>
                    <Button>Click me</Button>
                    <Hotspot hotspotId={tutorial.tasks[0].steps[0].hotspotId}></Hotspot>
                  </>
                ),
              },
              {
                ...dismissibleCommonProps,
                type: 'success',
                content: 'success variant',
                action: (
                  <>
                    <Button>Click me</Button>
                    <Hotspot hotspotId={tutorial.tasks[0].steps[2].hotspotId}></Hotspot>
                  </>
                ),
              },
              {
                ...dismissibleCommonProps,
                type: 'warning',
                content: 'warning variant',
                action: (
                  <>
                    <Button>Click me</Button>
                    <Hotspot hotspotId={tutorial.tasks[0].steps[3].hotspotId}></Hotspot>
                  </>
                ),
              },
              {
                ...dismissibleCommonProps,
                type: 'error',
                content: 'error variant',
                action: (
                  <>
                    <Button>Click me</Button>
                    <Hotspot hotspotId={tutorial.tasks[0].steps[4].hotspotId}></Hotspot>
                  </>
                ),
              },
            ]}
          />
        </AnnotationContext>
      </ScreenshotArea>
    </>
  );
}
