// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SpaceBetween, TextContent } from '~components';

import ScreenshotArea from '../../utils/screenshot-area';
import ConfiguredExamples from './examples/configured-examples';
import ControllableListLayout from './examples/controllable-list-layout';
import ListServiceOverview from './examples/list-service-overview';

export default function DescriptionListPermutations() {
  return (
    <ScreenshotArea>
      <SpaceBetween size="l">
        <TextContent>
          <h1>Key-value pair demo</h1>
          <p>
            This example shows how you can use composition and configuration together to create an API that suits your
            data structure the best. This can be done in a stacking mannor and also at the same time to achieve desired
            results with minimal effort.
          </p>
          <ol>
            <li>
              The first example is an interactive demo that shows how you can create custom layouts by making the list
              direction and item direction properties of the atomic elements
            </li>
            <li>
              The second example demonstrates how you can stack a configuration API on top of the composed atoms in
              order to add custom layout logic for data where you may not know ahead of time how many pairs you may have
            </li>
            <li>
              The third example compares a partially composed + configured column layout with a fully composed column
              layout. The composed + configured example stacks configuration APIs on top of composition for a more rigid
              structure where you know the number of columns
            </li>
            <li>
              The fourth example combines a configured pair with a composed list, to create a more fluid, flexible
              layout with no columns
            </li>
            <li>
              The fifth example shows a real use case where you might want to combine composition and configuration to
              have a rigid layout in one container, but fluid layout in the other
            </li>
          </ol>
          <br />
        </TextContent>

        {/* 1st example */}
        <ControllableListLayout />

        {/* 2nd-4th examples */}
        <ConfiguredExamples />

        {/* 5th example */}
        <ListServiceOverview />
      </SpaceBetween>
    </ScreenshotArea>
  );
}
