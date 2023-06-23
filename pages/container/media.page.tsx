// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import AppContext, { AppContextType } from '../app/app-context';
import { ContainerProps } from '~components/container';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Link from '~components/link';
import RadioGroup from '~components/radio-group';
import ScreenshotArea from '../utils/screenshot-area';
import SpaceBetween from '~components/space-between';
import image169 from './images/16-9.png';
import image43 from './images/4-3.png';
import image916 from './images/9-16.png';

import styles from './media.scss';

type DemoContext = React.Context<
  AppContextType<{
    width: string;
    height: string;
    position: 'top' | 'side';
    content: '16-9' | '4-3' | '9-16';
  }>
>;

function ContainerPlayground(props: ContainerProps) {
  const { urlParams } = useContext(AppContext as DemoContext);

  return (
    <Container
      {...props}
      media={{
        content: (
          <img
            src={urlParams.content === '4-3' ? image43 : urlParams.content === '9-16' ? image916 : image169}
            alt="A fun, accessible image"
          />
        ),
        width: urlParams.width,
        height: urlParams.height,
        position: urlParams.position,
      }}
    />
  );
}

function SettingsForm() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  return (
    <SpaceBetween direction="horizontal" size="m">
      <FormField description="Only valid for 'side' position." label="Media width">
        <Input
          placeholder={'example: 30%'}
          value={urlParams.width}
          onChange={event => setUrlParams({ width: event.detail.value })}
        />
      </FormField>
      <FormField description="Only valid for 'top' position." label="Media height">
        <Input
          placeholder={'example: 200px'}
          value={urlParams.height}
          onChange={event => setUrlParams({ height: event.detail.value })}
        />
      </FormField>
      <FormField label="Media position">
        <RadioGroup
          items={[
            {
              value: 'top',
              label: 'Top',
            },
            {
              value: 'side',
              label: 'Side',
            },
          ]}
          onChange={({ detail }) => setUrlParams({ position: detail.value as 'top' | 'side' })}
          value={urlParams.position}
        />
      </FormField>
      <FormField label="Content">
        <RadioGroup
          items={[
            {
              value: '16-9',
              label: '16:9 (landscape) image',
            },
            {
              value: '4-3',
              label: '4:3 (squareish) image',
            },
            {
              value: '9-16',
              label: '9:16 (portrait) image',
            },
          ]}
          onChange={({ detail }) => setUrlParams({ content: detail.value as '16-9' | '4-3' | '9-16' })}
          value={urlParams.content}
        />
      </FormField>
    </SpaceBetween>
  );
}

export default function MediaContainers() {
  return (
    <article>
      <h1>Media containers</h1>

      <ScreenshotArea>
        <SpaceBetween size="l">
          <SettingsForm />
          <ContainerPlayground
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
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
          </ContainerPlayground>
          <ContainerPlayground header="ContainerPlayground plain text in header">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
          </ContainerPlayground>
          <div className={styles.grid}>
            <ContainerPlayground
              fitHeight={true}
              header={<Header variant="h2">Fixed Height Container</Header>}
              footer="Footer"
            >
              Content area takes the available vertical space, fixed height of 400px
            </ContainerPlayground>
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
