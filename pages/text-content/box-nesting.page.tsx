// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Box, { BoxProps } from '~components/box';
import TextContent from '~components/text-content';
import createPermutations from '../utils/permutations';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './style.scss';

const colorPermutations = createPermutations<BoxProps>([
  {
    variant: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'strong', 'small', 'code', 'samp'],
    color: [undefined, 'inherit', 'text-label', 'text-body-secondary'],
  },
]);

const fontStylesPermutations = createPermutations<BoxProps>([
  {
    fontSize: ['body-s', 'body-m', 'heading-xs', 'heading-m', 'heading-xl', 'display-l'],
    variant: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'strong', 'small', 'code', 'samp'],
  },
  {
    fontWeight: ['light', 'normal', 'bold'],
    variant: ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'strong', 'small', 'code', 'samp'],
  },
]);

const layoutPermutations = createPermutations<BoxProps>([
  {
    variant: ['h1', 'h2', 'h3', 'h4', 'h5', 'p'],
    margin: ['n', 'xxl'],
  },
  {
    variant: ['h1', 'h2', 'h3', 'h4', 'h5', 'p'],
    padding: ['n', 'xxl'],
  },
  {
    variant: ['small'],
    display: ['none'],
  },
]);

export default function NestedBoxPermutations() {
  return (
    <ScreenshotArea>
      <TextContent>
        <hr />
        <h1> TextContent</h1>
        {colorPermutations.map((permutation, key) => (
          <div key={key} className={permutation.color ? styles[`box-${permutation.color as string}`] : styles.default}>
            <Box {...permutation}>
              variant: {permutation.variant}, color: {permutation.color}
            </Box>
          </div>
        ))}
      </TextContent>
      <hr />
      <TextContent>
        {fontStylesPermutations.map((permutation, key) => (
          <div key={key}>
            <Box {...permutation}>
              variant: {permutation.variant}
              {permutation.fontSize && `, fontSize: ${permutation.fontSize}`}
              {permutation.fontWeight && `, fontWeight: ${permutation.fontWeight}`}
            </Box>
          </div>
        ))}
      </TextContent>
      <hr />
      <TextContent>
        {layoutPermutations.map((permutation, index) => (
          <div key={index} className={styles['permutation-box']}>
            <Box {...permutation} className={styles['permutation-box']}>
              variant {permutation.variant} -{permutation.margin ? `margin: ${permutation.margin}` : ''}
              {permutation.padding ? `padding: ${permutation.padding}` : ''}
              {permutation.display ? `display: ${permutation.display}` : ''}
            </Box>
          </div>
        ))}
      </TextContent>
    </ScreenshotArea>
  );
}
