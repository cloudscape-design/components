// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, SpaceBetween } from '~components';
import AnnotationContext from '~components/annotation-context';
import Hotspot from '~components/hotspot';

import { annotationContextStrings } from '../onboarding/i18n';
import tutorials from '../onboarding/tutorials';
import { IframeWrapper } from '../utils/iframe-wrapper';

const tutorial = tutorials(() => {})[0];

function IframeContent() {
  return (
    <AnnotationContext
      currentTutorial={tutorial}
      i18nStrings={annotationContextStrings}
      onStartTutorial={() => {}}
      onExitTutorial={() => {}}
    >
      <Box padding="m">
        <SpaceBetween size="l">
          <div>
            Hotspot 1: <Hotspot hotspotId={tutorial.tasks[0].steps[0].hotspotId} />
          </div>
          <div>
            Hotspot 2: <Hotspot hotspotId={tutorial.tasks[0].steps[2].hotspotId} />
          </div>
        </SpaceBetween>
      </Box>
    </AnnotationContext>
  );
}

export default function () {
  return (
    <Box margin="m">
      <h1>Annotation context in iframe</h1>
      <p>Click the hotspot icons — the annotation popover should appear inside the iframe.</p>
      <IframeWrapper id="annotation-iframe" AppComponent={IframeContent} />
    </Box>
  );
}
