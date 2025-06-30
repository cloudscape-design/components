// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Flashbar } from '~components';

export default function PlaygroundExample() {
  return (
    <div style={{ margin: '40px' }}>
      <Flashbar
        items={[
          {
            content: 'Some of my styles are different.',
            header: 'I am a custom Flashbar!',
            type: 'info',
          },
        ]}
        style={{
          item: {
            root: {
              background: {
                info: 'hsl(190, 70%, 70%)',
              },
              borderColor: {
                info: 'rgb(0, 64, 77)',
              },
              borderRadius: '2px',
              borderWidth: '1px',
              color: {
                info: 'rgb(0, 64, 77)',
              },
            },
          },
        }}
      />
    </div>
  );
}
