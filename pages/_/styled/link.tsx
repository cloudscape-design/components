// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import BaseLink, { LinkProps } from '~components/link';

import styles from './link.scss';

export function Link(props: LinkProps) {
  return <BaseLink {...props} classNames={{ anchor: styles.anchor }} />;
}
