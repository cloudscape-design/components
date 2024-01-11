// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext from '~components/annotation-context';
import Checkbox from '~components/checkbox';
import Hotspot from '~components/hotspot';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import tutorials from '../onboarding/tutorials';
import { annotationContextStrings } from '../onboarding/i18n';

const tutorial = tutorials(() => {})[0];
const noop = () => {};

export default function AnnotationScroll() {
  const [checkboxIsChecked, setCheckboxIsChecked] = useState(false);
  const [toggleIsChecked, setToggleIsChecked] = useState(false);
  const [radiogroupValue, setRadiogroupValue] = useState('first');

  return (
    <>
      <h1>Annotation Context: with Hotspots inside components using AbstractSwitch</h1>
      <AnnotationContext
        currentTutorial={tutorial}
        i18nStrings={annotationContextStrings}
        onStartTutorial={noop}
        onExitTutorial={noop}
      >
        <div style={{ padding: 20 }}>
          <SpaceBetween size="l">
            <Checkbox
              checked={checkboxIsChecked}
              onChange={e => {
                console.log('Checkbox toggled');
                setCheckboxIsChecked(e.detail.checked);
              }}
              description="This is a description"
            >
              This is the checkbox label
              <Hotspot hotspotId={tutorial.tasks[0].steps[0].hotspotId} />
            </Checkbox>

            <Toggle
              checked={toggleIsChecked}
              onChange={e => {
                console.log('Toggle toggled');
                setToggleIsChecked(e.detail.checked);
              }}
              description="This is a description"
            >
              This is the toggle label
              <Hotspot hotspotId={tutorial.tasks[0].steps[2].hotspotId}></Hotspot>
            </Toggle>

            <RadioGroup
              onChange={({ detail }) => {
                console.log('Radio button selected');
                setRadiogroupValue(detail.value);
              }}
              value={radiogroupValue}
              items={[
                { value: 'first', label: 'First choice', description: 'This is a description' },
                {
                  value: 'second',
                  label: (
                    <>
                      Second choice <Hotspot hotspotId={tutorial.tasks[0].steps[3].hotspotId} />
                    </>
                  ),
                  description: 'This is a description',
                },
                { value: 'third', label: 'Third choice', description: 'This is a description' },
              ]}
            />
          </SpaceBetween>
        </div>
      </AnnotationContext>
    </>
  );
}
