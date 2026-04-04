// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Icon } from '~components';

export const shortHeader = 'Card header';
export const longHeader =
  'A very long header text that should wrap to multiple lines to test the layout behavior of the action card component';

export const shortDescription = 'A description of the action card';
export const longDescription =
  'A very long description text that should wrap to multiple lines to test the layout behavior of the action card component when content overflows';

export const shortContent = 'Card content';
export const longContent =
  'Very long content that should wrap to multiple lines to test the layout behavior of the action card component when the content area has a lot of text';

export const icon = <Icon name="angle-right" />;

export const reactNodeContent = (
  <Box padding="xs">
    <span>This is a React Node</span>
  </Box>
);

export const onClick = () => {};
