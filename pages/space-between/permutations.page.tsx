// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import SpaceBetween, { SpaceBetweenProps } from '~components/space-between';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';
import Container from '~components/container';

const ExampleContent = ({ renderNull }: { renderNull?: boolean }) =>
  renderNull ? null : <div className={styles.box}>This is some text.</div>;

/* eslint-disable react/jsx-key */
const permutations = createPermutations<SpaceBetweenProps & { note?: string }>([
  {
    size: ['xxxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'],
    direction: ['vertical', 'horizontal'],
    children: [
      [
        <ExampleContent renderNull={true} />,
        <ExampleContent />,
        <ExampleContent renderNull={true} />,
        <ExampleContent />,
        <ExampleContent />,
        <ExampleContent renderNull={true} />,
      ],
    ],
  },
  {
    size: ['xs', 'xl'],
    direction: ['horizontal', 'vertical'],
    children: [
      [
        <ExampleContent renderNull={true} />,
        <SpaceBetween size="s">
          <ExampleContent renderNull={true} />
          <ExampleContent />
          <ExampleContent renderNull={true} />
          <ExampleContent />
          <ExampleContent />
          <ExampleContent renderNull={true} />
        </SpaceBetween>,
        <ExampleContent renderNull={true} />,
        <SpaceBetween size="l">
          <ExampleContent renderNull={true} />
          <ExampleContent />
          <ExampleContent />
          <ExampleContent />
          <ExampleContent renderNull={true} />
        </SpaceBetween>,
        <SpaceBetween size="xxl">
          <ExampleContent renderNull={true} />
          <ExampleContent />
          <ExampleContent />
          <ExampleContent />
          <ExampleContent renderNull={true} />
        </SpaceBetween>,
        <ExampleContent renderNull={true} />,
      ],
    ],
    note: ['nested vertical'],
  },
  {
    size: ['xs', 'xl'],
    direction: ['horizontal', 'vertical'],
    children: [
      [
        <ExampleContent renderNull={true} />,
        <SpaceBetween size="s" direction="horizontal">
          <ExampleContent renderNull={true} />
          <ExampleContent />
          <ExampleContent renderNull={true} />
          <ExampleContent />
          <ExampleContent />
          <ExampleContent renderNull={true} />
        </SpaceBetween>,
        <ExampleContent renderNull={true} />,
        <SpaceBetween size="l" direction="horizontal">
          <ExampleContent renderNull={true} />
          <ExampleContent />
          <ExampleContent />
          <ExampleContent />
          <ExampleContent renderNull={true} />
        </SpaceBetween>,
        <SpaceBetween size="xxl" direction="horizontal">
          <ExampleContent renderNull={true} />
          <ExampleContent />
          <ExampleContent />
          <ExampleContent />
          <ExampleContent renderNull={true} />
        </SpaceBetween>,
        <ExampleContent renderNull={true} />,
      ],
    ],
    note: ['nested horizontal'],
  },

  {
    size: ['xxl'],
    direction: ['vertical', 'horizontal'],
    children: [<ExampleContent />],
    note: ['single child'],
  },
]);
/* eslint-enable react/jsx-key */

export default function SpaceBetweenPermutations() {
  return (
    <>
      <h1>SpaceBetween permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            /*
             We're surrounding this in a Container so we can see any layouting side-effects the
             SpaceBetween component might have.
             */
            <Container
              header={
                <>
                  Size {permutation.size.toUpperCase()}, {permutation.direction}
                  {permutation.note && ', ' + permutation.note}
                </>
              }
            >
              Some content before.
              <SpaceBetween {...permutation} />
              Some content after.
            </Container>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
