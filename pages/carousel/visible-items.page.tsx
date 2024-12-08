// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Carousel from '~components/carousel/index';

import { generateCarousels } from './utils';

export default function () {
  return (
    <>
      <h1>Basic Carousel with visible pages</h1>
      <div
        style={{
          padding: 20,
        }}
      >
        <Carousel
          size="medium"
          ariaLabel="Test carousel"
          ariaLabelNext="Next item"
          ariaLabelPrevious="Previous item"
          visibleItemNumber={3}
          items={generateCarousels()}
        />
      </div>
    </>
  );
}
