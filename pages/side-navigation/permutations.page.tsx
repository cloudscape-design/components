// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import Badge from '~components/badge';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

import logoSmall from './logos/logo-small.svg';
import logoLarge from './logos/logo-large.svg';
import logoTall from './logos/logo-tall.svg';

const permutations = createPermutations<SideNavigationProps>([
  {
    activeHref: [undefined, '#/', '#/duplicate', '#/guidelines/', '#/getting_started/'],
    items: [
      [
        {
          type: 'link',
          text: 'Duplicate',
          href: '#/duplicate',
        },
        {
          type: 'link-group',
          text: 'Guidelines',
          href: '#/guidelines/',
          items: [
            {
              type: 'link',
              text: 'Key concepts',
              href: '#/guidelines/key_concepts/',
            },
            {
              type: 'link',
              text: 'Tenets',
              href: '#/guidelines/tenets/',
            },
            {
              type: 'link',
              text: 'Accessibility',
              href: '#/guidelines/accessibility/',
            },
            {
              type: 'link',
              text: 'Duplicate',
              href: '#/duplicate',
            },
          ],
        },
        {
          type: 'section-group',
          title: 'Section group title',
          items: [
            {
              type: 'link',
              text: 'Overview',
              href: '#/page1',
            },
            {
              type: 'section',
              text: 'Contributions',
              items: [
                {
                  type: 'link',
                  text: 'Design',
                  href: '#/design',
                },
                {
                  type: 'link',
                  text: 'Dev',
                  href: '#/dev',
                },
              ],
            },
          ],
        },
        {
          type: 'expandable-link-group',
          text: 'Getting started',
          href: '#/getting_started/',
          items: [
            {
              type: 'link',
              text: 'Trainings and videos',
              href: '#/getting_started/trainings and_videos/',
            },
            {
              type: 'expandable-link-group',
              text: 'For designers',
              href: '#/getting_started/for_designers/',
              items: [
                {
                  type: 'link',
                  text: 'Duplicate',
                  href: '#/duplicate',
                },
                {
                  type: 'link',
                  text: 'Resources',
                  href: '#/getting_started/for_designers/resources/',
                },
                {
                  type: 'link',
                  text: 'Research',
                  href: '#/getting_started/for_designers/research/',
                },
              ],
            },
          ],
        },
        {
          type: 'link',
          text: 'Components',
          href: '#/components/',
        },
        {
          type: 'link',
          text: 'Contact',
          href: '#/contact/',
        },
        {
          type: 'section',
          text: 'Contributions',
          items: [
            {
              type: 'link',
              text: 'Design',
              href: '#/design',
            },
            {
              type: 'link',
              text: 'Dev',
              href: '#/dev',
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'link',
          text: 'Notifications',
          href: '#/notifications',
          info: <Badge color="blue">10</Badge>,
        },
        {
          type: 'link',
          text: 'Documentation',
          href: 'https://aws.amazon.com/docs/',
          external: true,
          externalIconAriaLabel: 'Opens in a new tab',
        },
      ],
    ],
    header: [{ text: 'Console Name', href: '#/' }],
  },
  {
    items: [
      [
        {
          type: 'section',
          text: 'Contributions',
          defaultExpanded: false,
          items: [
            {
              type: 'link',
              text: 'Design',
              href: '#/design',
            },
            {
              type: 'link',
              text: 'Dev',
              href: '#/dev',
            },
          ],
        },
      ],
    ],
    header: [
      { text: 'Console Name', href: '#/' },
      { text: 'Console Name', href: '#/', logo: { src: logoSmall, alt: 'logo' } },
      {
        text: 'A very very very very very very very very very very very very long console Name',
        href: '#/',
        logo: { src: logoSmall, alt: 'logo' },
      },
      { href: '#/', logo: { src: logoLarge, alt: 'logo' } },
      { text: 'Console Name', href: '#/', logo: { src: logoTall, alt: 'logo' } },
      {
        text: 'A very very very very very very very very very very very very long console Name',
        href: '#/',
        logo: { src: logoTall, alt: 'logo' },
      },
      { href: '#/', logo: { src: logoTall, alt: 'logo' } },
    ],
  },
  {
    items: [
      [
        {
          type: 'link',
          text: 'Design',
          href: '#/design',
        },
        {
          type: 'link',
          text: 'Dev',
          href: '#/dev',
        },
      ],
    ],
  },
  {
    activeHref: [
      '#/hey',
      '#/guidelines/',
      '#/getting_started/trainings and_videos/',
      '#/getting_started/for_designers/resources/',
    ],
    items: [
      [
        {
          type: 'link',
          text: 'very long link but with separate words, It is not adivsable to have such long text in here but it is what it is and we cannot prevent it. We just need to make sure it looks the way we want',
          href: '#/hey',
        },
        {
          type: 'link',
          text: 'verylonglinkinonewordItisnotadivsabletohavesuchlongtextinherebutitiswhatitisandwecannotpreventitWejustneedtomakesureitlooksthewaywewant',
          href: '#/hey/a',
        },
        {
          type: 'link-group',
          text: 'Long title for link group header link Long title for link group header link',
          href: '#/guidelines/',
          items: [
            {
              type: 'link',
              text: 'Key concepts',
              href: '#/guidelines/key_concepts/',
            },
            {
              type: 'link',
              text: 'Long title for link group link Long title for link group link Long title for link group link',
              href: '#/guidelines/tenets/',
            },
            {
              type: 'link',
              text: 'LongtitleforlinkgroupLongtitleforlinkgroupLongtitleforlinkgroup',
              href: '#/longtitle',
            },
            {
              type: 'link',
              text: 'Writing guidelines',
              href: '#/guidelines/writing_guidelines/',
            },
          ],
        },
        {
          type: 'expandable-link-group',
          text: 'Long title for expandable link group header Long title for expandable link group header',
          href: '#/getting_started/',
          defaultExpanded: true,
          items: [
            {
              type: 'link',
              text: 'LongtitleforexpandablelinkgrouplinkLongtitleforexpandablelinkgrouplinkLongtitleforexpandablelinkgrouplink',
              href: '#/longtitle/expandable-group-link',
            },
            {
              type: 'link',
              text: 'Long title for expandable link group link Long title for expandable link group link',
              href: '#/getting_started/trainings and_videos/a',
            },
            {
              type: 'expandable-link-group',
              text: 'For designers',
              href: '#/getting_started/for_designers/',
              items: [
                {
                  type: 'link',
                  text: 'Design checklist',
                  href: '#/getting_started/for_designers/design_checklist/',
                },
                {
                  type: 'link',
                  text: 'Resources',
                  href: '#/getting_started/for_designers/resources/',
                },
                {
                  type: 'link',
                  text: 'Research',
                  href: '#/getting_started/for_designers/research/',
                },
              ],
            },
          ],
        },
        {
          type: 'section',
          text: 'Long title for section Long title for section Long title for section Long title for section',
          items: [
            {
              type: 'link',
              text: 'Long title for section Long title for section Long title for section Long title for section',
              href: '#/design',
            },
            {
              type: 'link',
              text: 'dshjfjshfjshbdkfjbdsnfkjsdkfhjskdjhfkjsbdkfjskdfjksdbfkjsdhjf',
              href: '#/gibberish',
            },
          ],
        },
      ],
    ],
    header: [{ text: 'Very long console name that spans on two lines', href: '#/' }],
  },
  {
    header: [
      { text: 'Very long console name that spans on two lines', href: '#/' },
      { text: 'VerylongconsolenamethatspansontwolinesVerylongconsolenamethatspansontwolines', href: '#/' },
    ],
    activeHref: ['#/a', '#/c', '#/e'],
    items: [
      [
        {
          type: 'link',
          text: 'Long title for link A Long title for link A Long title for link A Long title for link A',
          href: '#/a',
          info: <Badge color="blue">10</Badge>,
        },
        {
          type: 'link',
          text: 'dshjfjshfjshbdkfjbdsnfkjsdkfhjskdjhfkjsbdkfjskdfjksdbfkjsdhjf',
          href: '#/gibberish',
          info: <Badge color="blue">10</Badge>,
        },
        {
          type: 'link',
          text: 'Long title for link B Long title for link B Long title for link B Long title for link B',
          href: '#/c',
          external: true,
        },
        {
          type: 'link',
          text: 'dshjfjshfjshbdkfjbdsnfkjsdkfhjskdjhfkjsbdkfjskdfjksdbfkjsdhjf',
          href: '#/gibberish',
          external: true,
        },
        {
          type: 'link',
          text: 'Long title for link E Long title for link E Long title for link E Long title for link E',
          href: '#/e',
          external: true,
          info: <Badge color="blue">10</Badge>,
        },
        {
          type: 'link',
          text: 'dshjfjshfjshbdkfjbdsnfkjsdkfhjskdjhfkjsbdkfjskdfjksdbfkjsdhjf',
          href: '#/gibberish',
          external: true,
          info: <Badge color="blue">10</Badge>,
        },
      ],
    ],
  },
]);

export default function SideNavigationPermutations() {
  return (
    <>
      <h1>Side navigation permutations</h1>
      <ScreenshotArea style={{ maxWidth: 400 }}>
        <PermutationsView permutations={permutations} render={permutation => <SideNavigation {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
