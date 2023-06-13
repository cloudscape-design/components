// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';

import Container, { ContainerProps } from '~components/container';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import Button from '~components/button';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import image169 from './images/16-9.png';
import image43 from './images/4-3.png';
import image916 from './images/9-16.png';
import imageVideo from './images/video.png';

const permutations = createPermutations<ContainerProps.Media>([
  {
    content: [
      <img key={'image169'} src={image169} alt="placeholder" />,
      <img key={'image43'} src={image43} alt="placeholder" />,
      <img key={'image916'} src={image916} alt="placeholder" />,
      <img key={'imageVideo'} src={imageVideo} alt="placeholder" />,
    ],
    position: ['side'],
    width: ['', '33%', '50%'],
  },
  {
    content: [
      <img key={'image169'} src={image169} alt="placeholder" />,
      <img key={'image43'} src={image43} alt="placeholder" />,
      <img key={'image916'} src={image916} alt="placeholder" />,
      <img key={'imageVideo'} src={imageVideo} alt="placeholder" />,
    ],
    position: ['top'],
    height: ['', 100, 200, 300],
  },
]);

const PermutationContainer = ({ permutation }: { permutation: ContainerProps.Media }) => {
  return (
    <Container
      header={
        <Header
          variant="h2"
          headingTagOverride="h1"
          description={
            <>
              Some additional text{' '}
              <Link fontSize="inherit" variant="primary">
                with a link
              </Link>
              .
            </>
          }
          info={<Link variant="info">Info</Link>}
        >
          <Link fontSize="heading-m" href="" variant="primary">
            Secondary link
          </Link>
        </Header>
      }
      footer={<Link>Learn more</Link>}
      media={{ ...permutation }}
    >
      <SpaceBetween direction="vertical" size="m">
        <span>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
          tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
          tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
        </span>
        <Button>Button</Button>
      </SpaceBetween>
    </Container>
  );
};

export default function MediaPermutations() {
  return (
    <>
      <h1>Media permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => <PermutationContainer permutation={permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
