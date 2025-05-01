// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { SpaceBetween, TextContent } from '~components';
import Card from '~components/cards/composition';

import image43 from '../../container/images/4-3.png';
import ScreenshotArea from '../../utils/screenshot-area';

export default function BreadcrumbsPermutations() {
  const [clickCount, setClickCount] = useState(0);
  return (
    <ScreenshotArea>
      <TextContent>
        <h1>Cards demo</h1>
        <p>
          This example shows how you can configure the click area of a card to be in different positions using
          composition.
        </p>
        <ol>
          <li>The first card has a clickable image area</li>
          <li>The second card is entirely clickable</li>
          <li>The third card has a clickable content area only</li>
        </ol>
        <br />
      </TextContent>
      <SpaceBetween size="m" direction="horizontal">
        {/* 1st card */}
        <Card.Container direction="vertical">
          <Card.Header>Card header</Card.Header>

          <Card.Content>Card content</Card.Content>

          <Card.Footer>Card footer</Card.Footer>
          <Card.TouchArea onClick={() => setClickCount(clickCount + 1)}>
            <Card.Media maxSize={300} position="vertical">
              <img key={'image43'} src={image43} alt="placeholder" />,
            </Card.Media>
          </Card.TouchArea>
        </Card.Container>

        {/* 2nd card */}
        <Card.Container>
          <Card.TouchArea onClick={() => setClickCount(clickCount + 1)}>
            <Card.Header>Card header</Card.Header>

            <Card.Content>Card content</Card.Content>

            <Card.Footer>Card footer</Card.Footer>
          </Card.TouchArea>
        </Card.Container>

        {/* 3rd card */}
        <Card.Container direction="vertical">
          <Card.TouchArea onClick={() => setClickCount(clickCount + 1)}>
            <Card.Header>Card header</Card.Header>

            <Card.Content>Card content</Card.Content>

            <Card.Footer>Card footer</Card.Footer>
          </Card.TouchArea>
          <Card.Media maxSize={300}>
            <img key={'image43'} src={image43} alt="placeholder" />,
          </Card.Media>
        </Card.Container>

        {<div>Clicked {clickCount}</div>}
      </SpaceBetween>
    </ScreenshotArea>
  );
}
