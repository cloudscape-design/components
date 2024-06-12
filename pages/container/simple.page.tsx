// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Container from '~components/container';
import Header from '~components/header';
import ExpandableSection from '~components/expandable-section';
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
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
          </Container>
          <Container header="Container plain text in header">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
          </Container>
          <Container header={<Header variant="h2">Container header</Header>}>
            This container uses a semantically correct h2 in the header. Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui tortor, mollis vitae molestie sed,
            malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui tortor, mollis vitae molestie sed.
            Phasellus tincidunt suscipit varius.
          </Container>

          <Container header={<Header variant="h2">With footer</Header>} footer="Some footer text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
          </Container>
          <Container
            header={<Header variant="h2">With expandable footer</Header>}
            footer={
              <ExpandableSection headerText="Additional settings" variant="footer">
                Place additional form fields here.
              </ExpandableSection>
            }
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
          </Container>
          <Container>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
          </Container>
          <Container>
            ContainerWithASuperLongWordToTestWordWrappingContainerWithASuperLongWordToTestWordWrappingContainerWithASuperLongWordToTestWordWrappingContainerWithASuperLongWordToTestWordWrappingContainerWithASuperLongWordToTestWordWrappingContainerWithASuperLongWordToTestWordWrappingContainerWithASuperLongWordToTestWordWrapping
          </Container>
          <Container disableContentPaddings={true}>Content without gutters</Container>
          <Container disableHeaderPaddings={true} disableContentPaddings={true} header="Spaceless container header">
            Content without gutters
          </Container>
          <Container disableHeaderPaddings={true} header="Spaceless container header">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.
          </Container>
          <div>
            <Container variant="stacked" header="Stacked Container 1">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
              tortor, mollis vitae molestie sed, malesuada.
            </Container>
            <Container variant="stacked" header="Stacked Container 2">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
              tortor, mollis vitae molestie sed, malesuada.
            </Container>
            <Container variant="stacked" header="Stacked Container 3">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
              tortor, mollis vitae molestie sed, malesuada.
            </Container>
          </div>
          <div style={{ display: 'grid', minBlockSize: 300 }}>
            <Container fitHeight={true} header={<Header variant="h2">Fixed Height Container</Header>} footer="Footer">
              Content area takes the available vertical space
            </Container>
          </div>
          <Container
            disableContentPaddings={true}
            header={<Header variant="h2">Container Without Content</Header>}
          ></Container>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
