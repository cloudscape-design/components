// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import {
  AppLayout,
  BreadcrumbGroup,
  Box,
  Button,
  Drawer,
  ExpandableSection,
  Flashbar,
  FormField,
  Header,
  HelpPanel,
  Link,
  Select,
  SideNavigation,
  SpaceBetween,
  Table,
  TextContent,
} from '~components';

export default function CloudscapeUserSettings() {
  return (
    <AppLayout
      // activeDrawerId={'settings'}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Demo Pages', href: '#' },
            { text: 'Cloudscape User Settings', href: '#' },
          ]}
        />
      }
      content={
        <Table
          header={
            <Header
              actions={
                <SpaceBetween direction="horizontal" size="m">
                  <Button onClick={() => alert(`Excellent job following instructions.`)} variant="normal">
                    Don&apos;t click me
                  </Button>

                  <Button
                    onClick={() => {
                      document.body.setAttribute('data-user-settings-layout-notifications-position', 'bottom-right');
                      document.body.setAttribute('data-user-settings-layout-width', 'full-width');
                      document.body.setAttribute('data-user-settings-accessibility-links', 'no-underline');
                      document.body.setAttribute('data-user-settings-theme-high-contrast-header', 'disabled');
                      document.body.setAttribute('data-user-settings-customization-toggle-navigation-modifier', 'n');
                      document.body.setAttribute('data-user-settings-customization-toggle-tools-modifier', 't');
                      document.body.setAttribute(
                        'data-user-settings-customization-toggle-stacked-flashbar-modifier',
                        'f'
                      );
                      document.body.setAttribute('data-user-settings-customization-toggle-split-panel-modifier', 's');
                      alert(`LIES.`);
                    }}
                    variant="primary"
                  >
                    I don&apos;t do anything
                  </Button>
                </SpaceBetween>
              }
              description="Open the Settings drawer to adjust various aspects of the design system."
              variant="awsui-h1-sticky"
            >
              Cloudscape User Settings
            </Header>
          }
          variant="full-page"
          columnDefinitions={[
            {
              cell: item => <Link href={`#/light/cloudscape-user-settings/demo`}>{item.film || '-'}</Link>,
              header: 'Film',
              id: 'film',
              isRowHeader: true,
            },
            {
              cell: item => item.releaseDate || '-',
              header: 'Release date',
              id: 'releaseDate',
            },
            {
              cell: item => item.numberOfTheaters || '-',
              header: 'Number of theaters',
              id: 'numberOfTheaters',
            },
            {
              cell: item => item.openingRevenue || '-',
              header: 'Opening revenue',
              id: 'openingRevenue',
            },
            {
              cell: item => item.lifetimeGross || '-',
              header: 'Lifetime gross',
              id: 'lifetimeGross',
            },
          ]}
          items={[
            {
              film: 'Avengers: Endgame',
              lifetimeGross: '$858,373,000',
              numberOfTheaters: '4,662',
              openingRevenue: '$357,115,007',
              releaseDate: 'Apr 26, 2019',
            },
            {
              film: 'Spider-Man: No Way Home',
              lifetimeGross: '$804,793,477',
              numberOfTheaters: '4,336',
              openingRevenue: '$260,138,569',
              releaseDate: 'Dec 17, 2021',
            },
            {
              film: 'Black Panther',
              lifetimeGross: '$700,059,566',
              numberOfTheaters: '4,084',
              openingRevenue: '$202,003,951',
              releaseDate: 'Feb 16, 2018',
            },
            {
              film: 'Avengers: Infinity War',
              lifetimeGross: '$678,815,482',
              numberOfTheaters: '4,474',
              openingRevenue: '$257,698,183',
              releaseDate: 'Apr 27, 2018',
            },
            {
              film: 'The Avengers',
              lifetimeGross: '$623,357,910',
              numberOfTheaters: '4,349',
              openingRevenue: '$207,438,708',
              releaseDate: 'May 4, 2012',
            },
            {
              film: 'Avengers: Age of Ultron',
              lifetimeGross: '$459,005,868',
              numberOfTheaters: '4,276',
              openingRevenue: '$191,271,109',
              releaseDate: 'May 1, 2015',
            },
            {
              film: 'Black Panther: Wakanda Forever',
              lifetimeGross: '$453,829,060',
              numberOfTheaters: '4,396',
              openingRevenue: '$181,339,761',
              releaseDate: 'Nov 11, 2022',
            },
            {
              film: 'Captain Marvel',
              lifetimeGross: '$426,829,839',
              numberOfTheaters: '4,310',
              openingRevenue: '$153,433,423',
              releaseDate: 'Mar 8, 2019',
            },
            {
              film: 'Doctor Strange in the Multiverse of Madness',
              lifetimeGross: '$411,331,607',
              numberOfTheaters: '4,534',
              openingRevenue: '$187,420,998',
              releaseDate: 'May 6, 2022',
            },
            {
              film: 'Iron Man 3',
              lifetimeGross: '$409,013,994',
              numberOfTheaters: '4,253',
              openingRevenue: '$174,144,585',
              releaseDate: 'May 3, 2013',
            },
            {
              film: 'Captain America: Civil War',
              lifetimeGross: '$408,084,349',
              numberOfTheaters: '4,226',
              openingRevenue: '$179,139,142',
              releaseDate: 'May 6, 2016',
            },
            {
              film: 'Spider-Man: Far from Home',
              lifetimeGross: '$390,532,085',
              numberOfTheaters: '4,634',
              openingRevenue: '$92,579,212',
              releaseDate: 'Jul 2, 2019',
            },
            {
              film: 'Guardians of the Galaxy Vol. 2',
              lifetimeGross: '$389,813,101',
              numberOfTheaters: '4,347',
              openingRevenue: '$146,510,104',
              releaseDate: 'May 5, 2017',
            },
            {
              film: 'Guardians of the Galaxy Vol. 3',
              lifetimeGross: '$358,995,815',
              numberOfTheaters: '4,450',
              openingRevenue: '$118,414,021',
              releaseDate: 'May 5, 2023',
            },
            {
              film: 'Thor: Love and Thunder',
              lifetimeGross: '$343,256,830',
              numberOfTheaters: '4,375',
              openingRevenue: '$144,165,107',
              releaseDate: '4,375',
            },
            {
              film: 'Spider-Man: Homecoming',
              lifetimeGross: '$334,201,140',
              numberOfTheaters: '4,348',
              openingRevenue: '$117,027,503',
              releaseDate: '4,348',
            },
            {
              film: 'Guardians of the Galaxy',
              lifetimeGross: '$333,176,600',
              numberOfTheaters: '4,088',
              openingRevenue: '$94,320,883',
              releaseDate: '4,080',
            },
            {
              film: 'Iron Man',
              lifetimeGross: '$318,604,126',
              numberOfTheaters: '4,154',
              openingRevenue: '$98,618,668',
              releaseDate: '4,105',
            },
            {
              film: 'Thor: Ragnarok',
              lifetimeGross: '$315,058,289',
              numberOfTheaters: '4,080',
              openingRevenue: '$122,744,989',
              releaseDate: '4,080',
            },
            {
              film: 'Iron Man 2',
              lifetimeGross: '$312,433,331',
              numberOfTheaters: '4,390',
              openingRevenue: '$128,122,480',
              releaseDate: 'May 7, 2010',
            },
          ]}
        />
      }
      navigation={
        <SideNavigation
          header={{
            href: `#/light/cloudscape-user-settings/demo`,
            text: `Navigation`,
          }}
          items={[
            {
              href: `#/light/cloudscape-user-settings/demo`,
              text: `Using a mouse...`,
              type: 'link',
            },
            {
              href: `#/light/cloudscape-user-settings/demo`,
              text: `...is such a grind...`,
              type: 'link',
            },
            {
              href: `#/light/cloudscape-user-settings/demo`,
              text: `...have you considered...`,
              type: 'link',
            },
            {
              href: `#/light/cloudscape-user-settings/demo`,
              text: `...adding a keyboard shortcut?`,
              type: 'link',
            },
          ]}
        />
      }
      drawers={[
        {
          ariaLabels: {
            closeButton: 'Settings close button',
            drawerName: 'Settings',
            triggerButton: 'Settings trigger button',
          },
          content: (
            <Drawer header={<h2>User Settings</h2>}>
              <TextContent>
                <p>
                  Cloudscape user settings were built to accommodate the unique needs of each individual user. Your
                  workflow is yours to optimize as you see fit.
                </p>

                <p>
                  <i>
                    Do you have an idea for a user setting addition? Or, perhaps, suggestions on how we can further
                    improve your experience?
                  </i>
                </p>

                <p>
                  <strong>Send us your thoughts in the feedback section. ❤️</strong>
                </p>
              </TextContent>

              <Box margin={{ bottom: 'm', top: 'm' }}>
                <div style={{ border: '1px solid #eaeded', width: '100%' }}></div>
              </Box>

              <SpaceBetween size="xs">
                <ExpandableSection headerText="Theme" variant="footer">
                  <SpaceBetween size="m">
                    <FormField
                      description="Adjusting the color scheme can improve readability and help reduce eye strain."
                      label="Color scheme"
                    >
                      <Select
                        selectedOption={{
                          label: 'Light mode',
                          value: 'light-mode',
                        }}
                        options={[
                          {
                            label: 'Light mode',
                            value: 'light-mode',
                          },
                          {
                            label: 'Dark mode',
                            value: 'dark-mode',
                          },
                        ]}
                      />
                    </FormField>

                    <FormField
                      description="Adjusting the density can increase the amount of content that fits in the viewport."
                      label="Density"
                    >
                      <Select
                        selectedOption={{
                          label: 'Comfortable',
                          value: 'comfortable',
                        }}
                        options={[
                          {
                            label: 'Comfortable',
                            value: 'comfortable',
                          },
                          {
                            label: 'Compact',
                            value: 'compact',
                          },
                        ]}
                      />
                    </FormField>

                    <FormField
                      description="Modify the presentation of the header content on a page."
                      label="High Contrast Header"
                    >
                      <Select
                        selectedOption={{
                          label: 'Enabled',
                          value: 'enabled',
                        }}
                        options={[
                          {
                            label: 'Enabled',
                            value: 'enabled',
                          },
                          {
                            label: 'Disabled',
                            value: 'disabled',
                          },
                        ]}
                      />
                    </FormField>

                    <FormField description="Add or remove visual depth for elements on a page." label="Box Shadow">
                      <Select
                        selectedOption={{
                          label: 'Enabled',
                          value: 'enabled',
                        }}
                        options={[
                          {
                            label: 'Enabled',
                            value: 'enabled',
                          },
                          {
                            label: 'Disabled',
                            value: 'disabled',
                          },
                        ]}
                      />
                    </FormField>

                    <FormField description="Add or remove curved corners for elements on a page." label="Border Radius">
                      <Select
                        selectedOption={{
                          label: 'Enabled',
                          value: 'enabled',
                        }}
                        options={[
                          {
                            label: 'Enabled',
                            value: 'enabled',
                          },
                          {
                            label: 'Disabled',
                            value: 'disabled',
                          },
                        ]}
                      />
                    </FormField>
                  </SpaceBetween>
                </ExpandableSection>

                <ExpandableSection headerText="Layout" variant="footer"></ExpandableSection>

                <ExpandableSection headerText="Accessibility" variant="footer"></ExpandableSection>

                <ExpandableSection headerText="Internationalization" variant="footer"></ExpandableSection>

                <ExpandableSection headerText="Keyboard Shortcuts" variant="footer"></ExpandableSection>

                <ExpandableSection headerText="Feedback" variant="footer"></ExpandableSection>
              </SpaceBetween>
            </Drawer>
          ),
          defaultSize: 400,
          id: 'settings',
          trigger: {
            iconName: 'settings',
          },
        },
      ]}
      notifications={
        <Flashbar
          items={[
            {
              content: 'Have you considered changing the Notifications position?',
              id: '1',
              type: 'success',
            },
            {
              content: 'Seriously, you should try it.',
              id: '2',
              type: 'warning',
            },
            {
              content: 'Open the settings drawer and navigate to the Layout category.',
              id: '3',
              type: 'info',
            },
            {
              content: 'Change the Notifications position property to Bottom right.',
              id: '4',
              type: 'error',
            },
            {
              content: 'Enjoy a delightful cup of coffee with your TOAST.',
              id: '5',
              type: 'success',
            },
          ]}
          stackItems={true}
        />
      }
      stickyNotifications={true}
      tools={
        <HelpPanel header={<h2>Tools</h2>}>
          <TextContent>
            <p>The navigation is telling you to add a keyboard shortcut.</p>

            <p>Don&apos;t forget about me!</p>
          </TextContent>
        </HelpPanel>
      }
    />
  );
}
