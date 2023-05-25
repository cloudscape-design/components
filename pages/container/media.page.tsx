// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Container from '~components/container';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';

export default function SimpleContainers() {
  return (
    <article>
      <h1>Simple containers</h1>
      <ScreenshotArea>
        <SpaceBetween size="l">
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
                Container with tag override
              </Header>
            }
            media={{
              content: (
                <img src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
              ),
              orientation: 'vertical',
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
          </Container>
          <Container
            media={{
              content: (
                <img src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
              ),
              orientation: 'horizontal',
            }}
            header="Container plain text in header"
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
          </Container>
          <div style={{ display: 'grid', minHeight: 300 }}>
            <Container
              media={{
                content: (
                  <img src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                ),
                orientation: 'horizontal',
              }}
              fitHeight={true}
              header={<Header variant="h2">Fixed Height Container</Header>}
              footer="Footer"
            >
              Content area takes the available vertical space
            </Container>
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
