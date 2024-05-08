// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Container from '~components/container/internal';
import AppLayout from '~components/app-layout';
import Flashbar from '~components/flashbar';
import ScreenshotArea from '../utils/screenshot-area';

export default function () {
  const [isSticky, setSticky] = useState(true);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        stickyNotifications={isSticky}
        notifications={
          <Flashbar
            items={[
              {
                type: 'success',
                header: 'Success message',
                buttonText: 'Toggle sticky notifications',
                statusIconAriaLabel: 'success',
                onButtonClick: () => setSticky(sticky => !sticky),
              },
            ]}
          />
        }
        content={
          <article>
            <h1>Sticky container</h1>

            <Container disableHeaderPaddings={true} header={'Header content'} __stickyHeader={true} id="inside-body">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
              tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam
              dui tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius. Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui tortor, mollis vitae
              molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui tortor, mollis
              vitae molestie sed. Phasellus tincidunt suscipit varius. Lorem ipsum dolor sit amet, consectetur
              adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui tortor, mollis vitae molestie sed,
              malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui tortor, mollis vitae molestie
              sed. Phasellus tincidunt suscipit varius.
            </Container>
            <div style={{ inlineSize: '100%', height: '100px', overflow: 'auto' }} id="scrollable-div">
              <Container disableHeaderPaddings={true} header={'Header content'} __stickyHeader={true} id="inside-div">
                {/* Dummy button to have a focusable element inside the scrollable container to
                  stop axe from reporting 'scrollable-region-focusable' */}
                <button>Dummy</button>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam
                dui tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing.
                Nullam dui tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius. Lorem ipsum dolor sit
                amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui tortor, mollis vitae
                molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui tortor, mollis
                vitae molestie sed. Phasellus tincidunt suscipit varius. Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui tortor, mollis vitae molestie sed,
                malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui tortor, mollis vitae molestie
                sed. Phasellus tincidunt suscipit varius.
              </Container>
            </div>

            <div style={{ inlineSize: '100%', height: '1000px' }}></div>
          </article>
        }
        navigationHide={true}
        toolsHide={true}
      />
    </ScreenshotArea>
  );
}
