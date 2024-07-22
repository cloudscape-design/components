// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Tiles from '~components/tiles';

import ScreenshotArea from '../utils/screenshot-area';
import img from './assets/amazon.svg';

export default function TilesPage() {
  const [value, setValue] = useState<string>('bar');
  return (
    <article>
      <h1>Tiles demo</h1>
      <ScreenshotArea>
        <Tiles
          value={value}
          onChange={event => setValue(event.detail.value)}
          columns={3}
          items={[
            { label: 'Foo', value: 'foo', image: <img src={img} alt="Amazon" /> },
            { label: 'Bar', value: 'bar', image: <img src={img} alt="Amazon" /> },
            { label: 'Baz', value: 'baz', image: <img src={img} alt="Amazon" />, disabled: true },
            { label: 'Boo', value: 'boo', image: <img src={img} alt="Amazon" /> },
          ]}
        />
      </ScreenshotArea>
    </article>
  );
}
