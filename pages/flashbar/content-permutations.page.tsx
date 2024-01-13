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
            Sed
          </Link>{' '}
          ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
          dolores eos qui ratione voluptatem sequi nesciunt.
        </Box>
        <Box variant="p" color="inherit">
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
          numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        </Box>
        <Box variant="p" color="inherit" padding={{ bottom: 'n' }}>
          Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
          ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
          molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
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
      <ScreenshotArea>
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
