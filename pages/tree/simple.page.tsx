// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import Tree from '~components/tree';

export default function TreeSimpleScenario() {
  return (
    <>
      <Box padding="l">
        <h1>Tree demo</h1>

        <Tree
          items={[
            {
              id: 'src',
              name: 'src',
              children: [
                { id: 'srcindex.tsx', name: 'index.tsx' },
                {
                  id: 'components',
                  name: 'components',
                  badges: <Badge>{3}</Badge>,
                  children: [
                    {
                      id: 'button',
                      name: 'button',
                      children: [
                        {
                          id: 'srccomponentsbuttonindex.tsx',
                          name: 'index.tsx',
                          iconName: 'face-happy',
                        },
                        { id: 'srccomponentsbuttoninternal.tsx', name: 'internal.tsx' },
                      ],
                    },
                    {
                      id: 'spinner',
                      name: 'spinner',
                      children: [
                        { id: 'srccomponentsspinnerindex.tsx', name: 'index.tsx' },
                        { id: 'srccomponentsspinnerinternal.tsx', name: 'internal.tsx' },
                      ],
                    },
                  ],
                },
                {
                  id: 'pages',
                  name: 'pages',
                  children: [
                    { id: 'pagesindex.tsx', name: 'index.tsx' },
                    { id: 'pageskey-value-pairs.tsx', name: 'key-value-pairs.tsx' },
                  ],
                },
              ],
            },
          ]}
        />
      </Box>
    </>
  );
}
