// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button } from '~components';

export default function PlaygroundExample() {
  return (
    <div style={{ margin: '40px' }}>
      <Button
        variant="primary"
        style={{
          root: {
            background: {
              active: 'rgb(0, 64, 77)',
              default: 'rgb(4, 125, 149)',
              hover: 'rgb(0, 85, 102)',
            },
            borderRadius: '4px',
            borderWidth: '0px',
            paddingBlock: '10px',
            paddingInline: '16px',
          },
        }}
      >
        I am a custom button!
      </Button>
    </div>
  );
}
