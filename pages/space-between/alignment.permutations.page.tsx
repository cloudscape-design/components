// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import SpaceBetween, { SpaceBetweenProps } from '~components/space-between';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import Container from '~components/container';
import Button from '~components/button';
import Header from '~components/header';
import styles from './styles.scss';

const size = 'm';

const ExampleChildren = (
  <>
    <div className={styles['border-box-inner']}>
      <h2>Heading</h2>
    </div>
    <div className={styles['border-box-inner']}>
      <p>Paragraph</p>
    </div>
    <div className={styles['border-box-inner']}>
      <Button>Button</Button>
    </div>
  </>
);

const NestedExample = createPermutations([
  {
    direction: ['vertical', 'horizontal'] as SpaceBetweenProps.Direction[],
    alignItems: [undefined, 'center'] as SpaceBetweenProps.AlignItems[],
  },
]).map(({ direction, alignItems }) => (
  <div className={styles['border-box-outer']} key={`direction-${direction}-alignment-${alignItems || 'default'}`}>
    <h3>
      Direction: {direction}, alignment: {alignItems || 'default'}
    </h3>
    <SpaceBetween size={size} direction={direction} alignItems={alignItems}>
      {ExampleChildren}
    </SpaceBetween>
  </div>
));

/* eslint-disable react/jsx-key */
const permutations = createPermutations<Pick<SpaceBetweenProps, 'direction' | 'alignItems' | 'children'>>([
  {
    children: [ExampleChildren, NestedExample],
    direction: ['vertical', 'horizontal'],
    alignItems: [undefined, 'center', 'start', 'end'],
  },
]);
/* eslint-enable react/jsx-key */

export default function SpaceBetweenPermutations() {
  return (
    <>
      <h1>SpaceBetween - alignment</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Container
              header={
                <Header>
                  Direction: {permutation.direction}, alignment: {permutation.alignItems || 'default'}
                </Header>
              }
            >
              <SpaceBetween {...permutation} size={size} />
            </Container>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
