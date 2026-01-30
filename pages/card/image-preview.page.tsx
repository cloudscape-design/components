// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonGroup from '~components/button-group';
import Card from '~components/internal/components/card';

import image from '../container/images/16-9.png';
import { CardPage } from './common';

export default function CardScenario() {
  return (
    <CardPage title="Image preview">
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
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            width: '100%',
            height: 300,
          }}
        />
      </Card>
    </CardPage>
  );
}
