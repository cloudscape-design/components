// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

import './css-style-api.css';

export default function Page() {
  return (
    <SimplePage title="CSS Style API — Link">
      <SpaceBetween size="m">
        <div>
          <p>
            Default link:{' '}
            <Link href="#">Learn more</Link>
          </p>
          <p>
            Custom styled link:{' '}
            <Link href="#" className="custom-link">
              Learn more
            </Link>
          </p>
          <p>
            External link with custom style:{' '}
            <Link href="#" external={true} className="custom-link">
              Open documentation
            </Link>
          </p>
          <p>
            Info link with custom style:{' '}
            <Link variant="info" className="custom-link">
              Info
            </Link>
          </p>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
