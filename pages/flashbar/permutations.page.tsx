// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Link from '~components/link';
import Box from '~components/box';
import Button from '~components/button';
import ExpandableSection from '~components/expandable-section';

const noop = () => void 0;

/* eslint-disable react/jsx-key */
const permutations = createPermutations<FlashbarProps.MessageDefinition>([
  {
    type: ['success', 'warning', 'error', 'info'],
    buttonText: ['Go for it!'],
    dismissible: [true],
    onDismiss: [noop],
    dismissLabel: ['Dismiss'],
    header: [<span>Simple span content. The &apos;H&apos; in HTML stands for Pizza</span>],
    content: [<span>Simple span content</span>],
  },
  {
    buttonText: [null, 'Go for it!'],
    dismissible: [true, false],
    onDismiss: [noop],
    dismissLabel: ['Dismiss'],
    header: [
      '',
      <>
        HTML content. <span>The &apos;H&apos; in HTML stands for Pizza</span>
      </>,
      <span> Simple span content. The &apos;H&apos; in HTML stands for Pizza</span>,
    ],
    content: [
      '',
      'LongtextlongenoughtowrapLoremipsumdolorsitametconsecteturadipisicingelitseddoeiusmodtemporincididuntutlaboreetdoloremagnaaliquaUtenimadminimveniamquisnostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequatDuisauteiruredolorinreprehenderitinvoluptatevelitessecillumdoloreeufugiatnullapariaturExcepteursintoccaecatcupidatatnonproidentsuntinculpaquiofficiadeseruntmollitanimidestlaborumWhatever',
      <>
        <Box variant="p" color="inherit" padding={{ top: 'n' }}>
          Box (paragraph variant) content.{' '}
          <Link color="inverted" href="https://en.wikipedia.org/wiki/Pizza" external={true}>
            Pizza
          </Link>{' '}
          is a yeasted flatbread popularly topped with tomato sauce and cheese and baked in an oven. It is commonly
          topped with a selection of meats, vegetables and condiments. The term was first recorded in the 10th century,
          in a Latin manuscript from Gaeta in Central Italy. The modern pizza was invented in Naples, Italy, and the
          dish and its variants have since become popular and common in many areas of the world.
        </Box>
        <Box variant="p" color="inherit">
          In 2009, upon Italy&apos;s request, Neapolitan pizza was safeguarded in the European Union as a Traditional
          Speciality Guaranteed dish. The Associazione Verace Pizza Napoletana (the True Neapolitan Pizza Association)
          is a non-profit organization founded in 1984 with headquarters in Naples. It promotes and protects the
          &apos;true Neapolitan pizza&apos;.
        </Box>
        <Box variant="p" color="inherit" padding={{ bottom: 'n' }}>
          Pizza is sold fresh or frozen, either whole or in portions, and is a common fast food item in Europe and North
          America. Various types of ovens are used to cook them and many varieties exist. Several similar dishes are
          prepared from ingredients commonly used in pizza preparation, such as calzone and stromboli.
        </Box>
      </>,
      <span>Simple span content</span>,
    ],
  },
  {
    type: ['success', 'error', 'warning', 'info'],
    header: ['Flash header'],
    action: [
      <Button iconName="external" iconAlign="right">
        View results
      </Button>,
    ],
  },
  {
    type: ['success', 'warning', 'error'],
    loading: [true, false],
    header: [
      <Link color="inverted" href="#" variant="primary">
        This is a link
      </Link>,
    ],
    content: [
      <Box variant="p" color="inherit" padding="n">
        <Link color="inverted" href="#">
          This is also a link, but in the content region
        </Link>
      </Box>,
    ],
  },
  {
    type: ['success', 'error', 'warning', 'info'],
    header: [
      <span>
        Header with a button{' '}
        <Button href="#" iconName="external">
          Click me
        </Button>
      </span>,
    ],
    content: [
      <div>
        <p>Content with a button </p>
        <Button href="#" iconName="external">
          Click me
        </Button>
      </div>,
    ],
  },
  {
    buttonText: ['Go for it!'],
    header: ['header'],
    content: ['content'],
  },
  {
    header: ['header'],
    content: [
      <ExpandableSection defaultExpanded={true} headerText="Details">
        Expandable Section content
      </ExpandableSection>,
    ],
  },
]);
/* eslint-enable react/jsx-key */

export default function FlashbarPermutations() {
  return (
    <>
      <h1>Flashbar permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Flashbar items={[{ ...permutation, statusIconAriaLabel: permutation.type ?? 'info' }]} />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
