// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Skeleton, SpaceBetween } from '~components';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';

export default function CustomSkeleton() {
  return (
    <ScreenshotArea>
      <h1>Custom Skeleton</h1>

      <SpaceBetween size="l" direction="vertical">
        <div>
          <h3>Default styling</h3>
          <Skeleton height="60px" width="300px" />
        </div>

        <div>
          <h3>Custom background - solid color</h3>
          <Skeleton
            height="60px"
            width="300px"
            style={{
              root: {
                background: palette.teal20,
              },
            }}
            data-testid="solid-background"
          />
        </div>

        <div>
          <h3>Custom background - gradient</h3>
          <Skeleton
            height="60px"
            width="300px"
            style={{
              root: {
                background: `linear-gradient(90deg, ${palette.blue20} 0%, ${palette.teal20} 50%, ${palette.blue20} 100%)`,
              },
            }}
          />
        </div>

        <div>
          <h3>Custom border radius - rounded</h3>
          <Skeleton
            height="60px"
            width="300px"
            style={{
              root: {
                borderRadius: '16px',
              },
            }}
          />
        </div>

        <div>
          <h3>Custom border radius - circle</h3>
          <Skeleton
            height="100px"
            width="100px"
            style={{
              root: {
                borderRadius: '50%',
              },
            }}
          />
        </div>

        <div>
          <h3>Combined custom styles - background + border radius</h3>
          <SpaceBetween size="m" direction="horizontal">
            <Skeleton
              height="80px"
              width="200px"
              style={{
                root: {
                  background: `linear-gradient(135deg, ${palette.green20} 0%, ${palette.teal20} 100%)`,
                  borderRadius: '12px',
                },
              }}
              data-testid="combined-1"
            />
            <Skeleton
              height="80px"
              width="200px"
              style={{
                root: {
                  background: `linear-gradient(135deg, ${palette.orange20} 0%, ${palette.red20} 100%)`,
                  borderRadius: '20px',
                },
              }}
              data-testid="combined-2"
            />
            <Skeleton
              height="80px"
              width="80px"
              style={{
                root: {
                  background: palette.blue40,
                  borderRadius: '50%',
                },
              }}
              data-testid="combined-3"
            />
          </SpaceBetween>
        </div>

        <div>
          <h3>Light-dark theme support</h3>
          <Skeleton
            height="60px"
            width="300px"
            style={{
              root: {
                background: `light-dark(${palette.neutral40}, ${palette.neutral80})`,
                borderRadius: '8px',
              },
            }}
          />
        </div>

        <div>
          <h3>Multiple skeletons with custom styling</h3>
          <SpaceBetween size="s">
            <Skeleton
              height="32px"
              width="250px"
              style={{
                root: {
                  background: palette.blue20,
                  borderRadius: '6px',
                },
              }}
            />
            <Skeleton
              height="20px"
              width="100%"
              style={{
                root: {
                  background: `linear-gradient(90deg, ${palette.neutral20} 25%, ${palette.neutral40} 50%, ${palette.neutral20} 75%)`,
                  borderRadius: '4px',
                },
              }}
            />
            <Skeleton
              height="20px"
              width="90%"
              style={{
                root: {
                  background: `linear-gradient(90deg, ${palette.neutral20} 25%, ${palette.neutral40} 50%, ${palette.neutral20} 75%)`,
                  borderRadius: '4px',
                },
              }}
            />
            <Skeleton
              height="20px"
              width="75%"
              style={{
                root: {
                  background: `linear-gradient(90deg, ${palette.neutral20} 25%, ${palette.neutral40} 50%, ${palette.neutral20} 75%)`,
                  borderRadius: '4px',
                },
              }}
            />
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
