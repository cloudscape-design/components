// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button, Link } from '~components';

import logo1 from './1.png';
import logo2 from './2.png';
import logo3 from './3.png';
import logo4 from './4.png';
import logo5 from './5.png';

export function generateCarousels() {
  // generate
  return [
    {
      content: <div style={{ color: 'white' }}>1</div>,
      backgroundStyle: `url(${logo1})`,
    },
    {
      content: <div style={{ color: 'white' }}>2</div>,
      backgroundStyle: `url(${logo2})`,
    },
    {
      content: <div style={{ color: 'white' }}>3</div>,
      backgroundStyle: `url(${logo3})`,
    },
    {
      content: <div style={{ color: 'white' }}>4</div>,
      backgroundStyle: `url(${logo4})`,
    },
    {
      content: <div style={{ color: 'white' }}>5</div>,
      backgroundStyle: `url(${logo5})`,
    },
  ];
}
