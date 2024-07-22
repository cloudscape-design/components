// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render } from '@testing-library/react';

import AnnotationContext from '../../../lib/components/annotation-context';
import Hotspot from '../../../lib/components/hotspot';
import createWrapper from '../../../lib/components/test-utils/dom';
import { AnnotationContextProps } from '../interfaces';
import { getTutorial, getTutorialWithMultipleStepsPerHotspot, i18nStrings } from './data';
import Tutorial = AnnotationContextProps.Tutorial;

const noop = () => {};

function renderAnnotationContext(children: React.ReactElement, tutorial?: Tutorial) {
  const currentTutorial = tutorial ?? getTutorial();
  const onStepChange = jest.fn();

  const { container, rerender: originalRerender } = render(
    <AnnotationContext
      onStartTutorial={noop}
      onExitTutorial={noop}
      i18nStrings={i18nStrings}
      currentTutorial={currentTutorial}
      onStepChange={onStepChange}
    >
      {children}
    </AnnotationContext>
  );

  const rerender = (children: React.ReactElement) =>
    originalRerender(
      <AnnotationContext
        onStartTutorial={noop}
        onExitTutorial={noop}
        i18nStrings={i18nStrings}
        currentTutorial={currentTutorial}
        onStepChange={onStepChange}
      >
        {children}
      </AnnotationContext>
    );

  const wrapper = createWrapper(container);

  return { rerender, wrapper, currentTutorial, onStepChange };
}

test('changes step when clicking on a hotspot', () => {
  const { wrapper, onStepChange } = renderAnnotationContext(
    <>
      <div id="first">
        <Hotspot hotspotId="first-hotspot" />
      </div>
      <div id="second">
        <Hotspot hotspotId="second-hotspot" />
      </div>
      <div id="third">
        <Hotspot hotspotId="third-hotspot" />
      </div>
    </>
  );

  const hotspot = wrapper.find('#second')!.findHotspot()!;

  hotspot.findTrigger().click();
  expect(onStepChange).toHaveBeenCalledTimes(1);

  expect(hotspot.findAnnotation()!.findContent().getElement()).toHaveTextContent('Second step content');

  // Clicking the same hotspot again should only close the annotation
  hotspot.findTrigger().click();
  expect(hotspot.findAnnotation()).toBeNull();
  expect(onStepChange).toHaveBeenCalledTimes(1);
});

test('shows the first step when opening a hotspot with multiple steps', () => {
  const { wrapper } = renderAnnotationContext(
    <>
      <div id="first">
        <Hotspot hotspotId="first-hotspot" />
      </div>
      <div id="second">
        <Hotspot hotspotId="second-hotspot" />
      </div>
    </>,
    getTutorialWithMultipleStepsPerHotspot()
  );
  {
    const hotspot = wrapper.find('#second')!.findHotspot()!;

    hotspot.findTrigger().click();

    expect(hotspot.findAnnotation()!.findContent().getElement()).toHaveTextContent('Third step content');
  }
  {
    const hotspot = wrapper.find('#first')!.findHotspot()!;

    hotspot.findTrigger().click();

    expect(hotspot.findAnnotation()!.findContent().getElement()).toHaveTextContent('First step content');
  }
});

test('annotation can be closed with the dismiss button', () => {
  const { wrapper } = renderAnnotationContext(<Hotspot hotspotId="first-hotspot" />);
  const hotspot = wrapper.findHotspot()!;

  expect(hotspot.findAnnotation()!.findContent().getElement()).toHaveTextContent('First step content');

  hotspot.findAnnotation()!.findDismissButton()!.click();

  expect(hotspot.findAnnotation()).toBeNull();
});

test('loads correct content from the tutorial', () => {
  const { wrapper } = renderAnnotationContext(<Hotspot hotspotId="second-hotspot" />);
  const annotation = wrapper.findHotspot()!.findAnnotation()!;

  expect(annotation.findContent().getElement()).toHaveTextContent('Second step content');
  expect(annotation.findHeader().getElement()).toHaveTextContent('TASK_2_SECOND_TASK_TEST');
  expect(annotation.findStepCounter().getElement()).toHaveTextContent('STEP_1_OF_2_TEST');
});

test('navigates annotations in the correct order', () => {
  const { wrapper, onStepChange } = renderAnnotationContext(
    <>
      <Hotspot hotspotId="second-hotspot" />
      <Hotspot hotspotId="first-hotspot" />
      <Hotspot hotspotId="third-hotspot" />
    </>
  );

  {
    const annotation = wrapper.findAnnotation()!;
    expect(annotation.findContent().getElement()).toHaveTextContent('First step content');
    annotation.findNextButton().click();
  }
  {
    const annotation = wrapper.findAnnotation()!;
    expect(annotation.findContent().getElement()).toHaveTextContent('Second step content');
    annotation.findNextButton().click();
  }
  {
    const annotation = wrapper.findAnnotation()!;
    expect(annotation.findContent().getElement()).toHaveTextContent('Third step content');
    annotation.findPreviousButton().click();
  }
  {
    const annotation = wrapper.findAnnotation()!;
    expect(annotation.findContent().getElement()).toHaveTextContent('Second step content');
    annotation.findNextButton().click();
  }
  {
    const annotation = wrapper.findAnnotation()!;
    expect(annotation.findContent().getElement()).toHaveTextContent('Third step content');
    annotation.findFinishButton().click();
  }

  expect(onStepChange).not.toHaveBeenCalledWith(
    expect.objectContaining({ detail: expect.objectContaining({ reason: 'auto-fallback' }) })
  );
});

test('automatically detects correct annotation when switching pages', () => {
  const { rerender, wrapper, onStepChange } = renderAnnotationContext(
    <>
      <Hotspot hotspotId="first-hotspot" />
      <Hotspot hotspotId="second-hotspot" />
      <Hotspot hotspotId="third-hotspot" />
    </>
  );

  {
    const annotation = wrapper.findAnnotation()!;
    expect(annotation.findContent().getElement()).toHaveTextContent('First step content');
  }

  rerender(<Hotspot hotspotId="second-hotspot" />);

  expect(onStepChange).toHaveBeenCalledWith(
    expect.objectContaining({ detail: expect.objectContaining({ reason: 'auto-fallback' }) })
  );

  {
    const annotation = wrapper.findAnnotation()!;
    expect(annotation.findContent().getElement()).toHaveTextContent('Second step content');
  }
});

test('does not run into an endless loop in (un)registerHotspot when toggling Hotspot components in the DOM', done => {
  const ToggleExample = () => {
    const [isFirstHotspotVisible, setIsFirstHotspotVisible] = useState(true);
    return (
      <>
        <button id="toggle-button" onClick={() => setIsFirstHotspotVisible(!isFirstHotspotVisible)}>
          Toggle first-hotspot
        </button>
        {isFirstHotspotVisible && (
          <div id={'hotspot-1'}>
            <Hotspot hotspotId="first-hotspot" />
          </div>
        )}
        <div id={'hotspot-2'}>
          <Hotspot hotspotId="second-hotspot" />
        </div>
      </>
    );
  };

  const { wrapper, onStepChange } = renderAnnotationContext(<ToggleExample />);
  const toggleButton = wrapper.find('#toggle-button')!;

  toggleButton.click(); // hide the first hotspot
  expect(onStepChange).toHaveBeenCalledWith(
    expect.objectContaining({ detail: expect.objectContaining({ reason: 'auto-fallback' }) })
  );
  onStepChange.mockClear();

  toggleButton.click(); // show the first hotspot again
  expect(onStepChange).not.toHaveBeenCalled();

  /*
   In case of an endlessloop/timeout, the done() method wouldn't be called.
   Unfortunately, Jest will not detect this timeout and will freeze instead, see https://github.com/facebook/jest/issues/10538
  */
  done();
}, 1000);

test('trigger should have aria-label with steps information', () => {
  const { wrapper } = renderAnnotationContext(
    <>
      <Hotspot hotspotId="first-hotspot" />
      <div id="second">
        <Hotspot hotspotId="second-hotspot" />
      </div>
      <Hotspot hotspotId="third-hotspot" />
    </>
  );

  const hotspot = wrapper.find('#second')!.findHotspot()!;
  expect(hotspot.findTrigger().getElement().getAttribute('aria-label')).toBe('OPEN_HOTSPOT_TEST_FOR_STEP_1_OF_2_TEST');
  hotspot.findTrigger().click();
  expect(hotspot.findTrigger().getElement().getAttribute('aria-label')).toBe('CLOSE_HOTSPOT_TEST_FOR_STEP_1_OF_2_TEST');
});

test('annotation should have be labeled by header and step counter', () => {
  const { wrapper } = renderAnnotationContext(
    <>
      <Hotspot hotspotId="first-hotspot" />
      <Hotspot hotspotId="second-hotspot" />
      <Hotspot hotspotId="third-hotspot" />
    </>
  );

  const annotation = wrapper.findAnnotation()!;
  const labelIds = annotation.getElement().getAttribute('aria-labelledby');
  const label = labelIds!
    .split(' ')
    .map(label => annotation.find(`#${label}`)!.getElement().textContent)
    .join(' ');
  expect(label).toBe('TASK_1_FIRST_TASK_TEST STEP_1_OF_1_TEST');
});
