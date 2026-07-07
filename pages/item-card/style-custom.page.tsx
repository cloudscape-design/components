// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SpaceBetween } from '~components';
import ItemCard from '~components/item-card';

import { SimplePage } from '../app/templates';

export default function CustomCard() {
  const background = 'light-dark(#ffe1e1, rgb(40, 0, 0))';

  return (
    <SimplePage
      title="Item card with custom style api"
      screenshotArea={{
        style: {
          padding: 10,
        },
      }}
    >
      <SpaceBetween size="m" direction="horizontal">
        <ItemCard
          disableHeaderPaddings={true}
          style={{
            root: {
              background,
              borderColor: 'green',
              borderRadius: '8px',
              borderWidth: '4px',
              boxShadow: '0px 5px 5px red',
            },
            content: {
              paddingBlock: '4px',
              paddingInline: '4px',
            },
          }}
        >
          Card content
        </ItemCard>

        <ItemCard
          header="Card header"
          style={{
            root: {
              background,
              borderColor: 'magenta',
              borderRadius: '0px',
              borderWidth: '1px',
              boxShadow: '0px 5px 5px green',
            },
            content: {
              paddingBlock: '20px',
              paddingInline: '40px',
            },
            header: {
              paddingBlock: '20px',
              paddingInline: '40px',
            },
          }}
        >
          Card content
        </ItemCard>

        <ItemCard
          footer="Card footer"
          style={{
            root: {
              background,
              borderColor: '#000',
              borderRadius: '20px',
              borderWidth: '3px',
              boxShadow: '0px 5px 5px blue',
            },
            content: {
              paddingBlock: '40px',
              paddingInline: '40px',
            },
            footer: {
              root: {
                paddingBlock: '40px',
                paddingInline: '40px',
              },
              divider: {
                borderColor: '#000',
                borderWidth: '3px',
              },
            },
          }}
        >
          Card content
        </ItemCard>

        <ItemCard
          header="Card header"
          footer="Card footer"
          style={{
            root: {
              background,
              borderColor: 'blue',
              borderRadius: '40px',
              borderWidth: '4px',
              boxShadow: '5px 5px 5px pink',
            },
            header: {
              paddingBlock: '60px',
              paddingInline: '10px',
            },
            footer: {
              root: {
                paddingBlock: '60px',
                paddingInline: '10px',
              },
              divider: {
                borderWidth: '0px',
              },
            },
          }}
        />

        <ItemCard
          header="Card header"
          footer="Card footer"
          style={{
            root: {
              background,
              borderColor: 'purple',
              borderRadius: '240px',
              borderWidth: '6px',
              boxShadow: '0px 5px 5px orange',
            },
            content: {
              paddingBlock: '20px',
              paddingInline: '140px',
            },
            header: {
              paddingBlock: '20px 0px',
              paddingInline: '140px',
            },
            footer: {
              root: {
                paddingBlock: '40px',
                paddingInline: '140px',
              },
              divider: {
                borderColor: 'purple',
                borderWidth: '6px',
              },
            },
          }}
        >
          Card content
        </ItemCard>
      </SpaceBetween>
    </SimplePage>
  );
}
