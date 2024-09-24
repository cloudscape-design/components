// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Container from '~components/container';
import Grid from '~components/grid';
import Header from '~components/header';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Notifications } from './utils/content-blocks';

import styles from './landing-page.scss';

type PageContext = React.Context<AppContextType<{ stickyNotifications: boolean }>>;

export default function () {
  const { urlParams } = useContext(AppContext as PageContext);
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        headerVariant="high-contrast"
        disableContentPaddings={true}
        stickyNotifications={urlParams.stickyNotifications}
        notifications={<Notifications />}
        content={
          <Box margin={{ bottom: 'l' }}>
            <div className={styles.header}>
              <Box padding={{ vertical: 'xxxl', horizontal: 's' }}>
                <Grid
                  gridDefinition={[
                    { colspan: { xl: 6, l: 5, s: 6, xxs: 10 }, offset: { l: 2, xxs: 1 } },
                    { colspan: { xl: 2, l: 3, s: 4, xxs: 10 }, offset: { s: 0, xxs: 1 } },
                  ]}
                >
                  <div className={styles['header-title']}>
                    <Box variant="h1" fontWeight="heavy" fontSize="display-l" color="inherit">
                      Service name
                    </Box>
                    <Box fontWeight="light" padding={{ bottom: 's' }} fontSize="display-l" color="inherit">
                      Name sub-title
                    </Box>
                    <Box variant="p" fontWeight="light">
                      <span className={styles['header-sub-title']}>Some information about this service</span>
                    </Box>
                  </div>
                </Grid>
              </Box>
            </div>
            <Box padding={{ top: 'xxxl', horizontal: 's' }}>
              <Grid
                gridDefinition={[
                  { colspan: { xl: 6, l: 5, s: 6, xxs: 10 }, offset: { l: 2, xxs: 1 } },
                  { colspan: { xl: 2, l: 3, s: 4, xxs: 10 }, offset: { s: 0, xxs: 1 } },
                ]}
              >
                <div>
                  <Box variant="h1" tagOverride="h2" padding={{ bottom: 's', top: 'n' }}>
                    Features
                  </Box>
                  <Containers />
                </div>
                <Container header={<Header>Getting started</Header>}>
                  Some information to learn about this service
                </Container>
              </Grid>
            </Box>
          </Box>
        }
      />
    </ScreenshotArea>
  );
}
