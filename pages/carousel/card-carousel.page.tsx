// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box/index';
import Carousel from '~components/carousel/index';

import { generateCardCarousels } from './utils';

export default function () {
  return (
    <>
      <Box padding={'m'} variant="h1">
        Cards Carousel
      </Box>
      <div
        style={{
          padding: 20,
        }}
      >
        <Carousel
          size={350}
          ariaLabel="Test carousel"
          ariaLabelNext="Next item"
          ariaLabelPrevious="Previous item"
          visibleItemNumber={3}
          items={generateCardCarousels()}
        />
      </div>
    </>
  );
}
