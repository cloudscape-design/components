// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Link from '~components/link';
import Box from '~components/box';

const noop = () => void 0;

/* eslint-disable react/jsx-key */
const permutations = createPermutations<FlashbarProps.MessageDefinition>([
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
]);
/* eslint-enable react/jsx-key */

export default function FlashbarPermutations() {
  return (
    <>
      <h1>Flashbar permutations - content</h1>
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
