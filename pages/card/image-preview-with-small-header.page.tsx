// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ButtonGroup from '~components/button-group';
import Header from '~components/header';
import Card from '~components/internal/components/card';

import image from '../container/images/16-9.png';
import { CardPage } from './common';

export default function ButtonsScenario() {
  return (
    <article>
      <CardPage title="Image preview">
        <Card
          header={
            <Header
              variant="small"
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
              description="Metadata about file - 4GB"
            >
              image-title.jpg
            </Header>
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
    </article>
  );
}
