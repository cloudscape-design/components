// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonGroup from '~components/button-group';
import Card from '~components/internal/components/card';

import image from '../container/images/16-9.png';
import ScreenshotArea from '../utils/screenshot-area';

export default function ButtonsScenario() {
  return (
    <article>
      <h1>Image preview</h1>
      <ScreenshotArea>
        <Card
          header="image-title.jpg"
          description="Metadata about file - 4GB"
          actions={
            <ButtonGroup
              onItemClick={() => null}
              items={[
                {
                  type: 'icon-button',
                  id: 'download',
                  iconName: 'download',
                  text: 'Download',
                },
                {
                  type: 'icon-button',
                  id: 'expand',
                  iconName: 'expand',
                  text: 'Expand',
                },
              ]}
              variant={'icon'}
            />
          }
          disableContentPaddings={true}
        >
          <img
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
            src={image}
          />
        </Card>
      </ScreenshotArea>
    </article>
  );
}
