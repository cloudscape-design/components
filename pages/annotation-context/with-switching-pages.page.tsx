// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext from '~components/annotation-context';
import Button from '~components/button';
import Hotspot from '~components/hotspot';
import SpaceBetween from '~components/space-between';
import Spinner from '~components/spinner';

import { annotationContextStrings } from '../onboarding/i18n';
import tutorials from '../onboarding/tutorials';

const tutorial = tutorials(() => {})[0];
const noop = () => {};

export default function AnnotationScroll() {
  const [currentPage, setCurrentPage] = useState<'1' | '2' | 'loading'>('1');

  return (
    <>
      <h1>Annotation Context: with switching pages</h1>
      <AnnotationContext
        currentTutorial={tutorial}
        i18nStrings={annotationContextStrings}
        onStartTutorial={noop}
        onExitTutorial={noop}
      >
        <div style={{ padding: 20 }}>
          <SpaceBetween size="l">
            {currentPage === 'loading' && <Spinner />}

            {currentPage === '1' && (
              <div>
                <div style={{ paddingBottom: '200px' }}>
                  first
                  <Hotspot hotspotId={tutorial.tasks[0].steps[0].hotspotId} />
                </div>
                <Button
                  onClick={() => {
                    setCurrentPage('loading');
                    setTimeout(() => setCurrentPage('2'), 100);
                  }}
                  data-testid="next-page"
                >
                  to next page
                </Button>
              </div>
            )}

            {currentPage === '2' && (
              <div data-testid="second-page">
                <div>
                  fourth
                  <Hotspot hotspotId={tutorial.tasks[0].steps[2].hotspotId} />
                </div>
              </div>
            )}
          </SpaceBetween>
        </div>
      </AnnotationContext>
    </>
  );
}
