// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Link } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2LinkPage() {
  return (
    <SimplePage title="Link with Style API v2" screenshotArea={{}}>
      <Link href="#" variant="primary" classNames={{ anchor: styles['styled-link'] }}>
        Primary link
      </Link>
      <Link href="#" variant="secondary" classNames={{ anchor: styles['styled-link'] }}>
        Secondary link
      </Link>
      <Link href="#" external={true} classNames={{ anchor: styles['styled-link'] }}>
        External link with icon
      </Link>
      <Link href="#" variant="info" classNames={{ anchor: styles['styled-link'] }}>
        Info link
      </Link>
    </SimplePage>
  );
}
