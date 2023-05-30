// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import AppContext, { AppContextType } from '../app/app-context';
import Container from '~components/container';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Input from '~components/input';
import ColumnLayout from '~components/column-layout';
import Box from '~components/box';
import Link from '~components/link';
import Badge from '~components/badge';
import Button from '~components/button';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import ExpandableSection from '~components/expandable-section';
import { ContainerProps } from '~components/container';
import { BREAKPOINT_MAPPING } from '~components/internal/breakpoints';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './media.scss';
import image169 from './images/16-9.png';
import image43 from './images/4-3.png';
import image916 from './images/9-16.png';

import clsx from 'clsx';
type DemoContext = React.Context<AppContextType<{ [key: string]: string }>>;

function ContainerPlayground(props: ContainerProps & { mediaContent: React.ReactNode }) {
  const { urlParams } = useContext(AppContext as DemoContext);
  return (
    <Container
      {...props}
      media={{
        content: props.mediaContent,
        width: {
          default: urlParams.defaultWidth,
          xxs: urlParams.xxsWidth,
          xs: urlParams.xsWidth,
          s: urlParams.sWidth,
          m: urlParams.mWidth,
          l: urlParams.lWidth,
          xl: urlParams.xlWidth,
        },
        height: {
          default: urlParams.defaultHeight,
          xxs: urlParams.xxsHeight,
          xs: urlParams.xsHeight,
          s: urlParams.sHeight,
          m: urlParams.mHeight,
          l: urlParams.lHeight,
          xl: urlParams.xlHeight,
        },
        orientation: {
          default: urlParams.defaultOrientation as 'horizontal' | 'vertical',
          xxs: urlParams.xxsOrientation as 'horizontal' | 'vertical',
          xs: urlParams.xsOrientation as 'horizontal' | 'vertical',
          s: urlParams.sOrientation as 'horizontal' | 'vertical',
          m: urlParams.mOrientation as 'horizontal' | 'vertical',
          l: urlParams.lOrientation as 'horizontal' | 'vertical',
          xl: urlParams.xlOrientation as 'horizontal' | 'vertical',
        },
      }}
    />
  );
}

const BREAKPOINTS = [...BREAKPOINT_MAPPING].reverse();

function ConfigurationForm() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  return (
    <ExpandableSection
      variant="container"
      headerText="Responsive behaviour configuration"
      headerDescription="Verify or edit the settings below. They are defined on a per breakpoint basis."
    >
      <SpaceBetween direction="vertical" size="xxl">
        {BREAKPOINTS.map(([breakpointName, breakpointValue]) => (
          <SpaceBetween key={breakpointValue} direction="horizontal" size="m">
            <SpaceBetween direction="vertical" size="s">
              <Badge>
                {`${breakpointName.toUpperCase()}`} {`(${breakpointValue}px)`}
              </Badge>
              <Box variant="code">{}</Box>
            </SpaceBetween>
            <FormField label="Orientation">
              <RadioGroup
                items={[
                  {
                    value: 'horizontal',
                    label: 'Horizontal',
                  },
                  {
                    value: 'vertical',
                    label: 'Vertical',
                  },
                ]}
                onChange={({ detail }) =>
                  setUrlParams({ [breakpointName + 'Orientation']: detail.value as 'horizontal' | 'vertical' })
                }
                value={urlParams[breakpointName + 'Orientation']}
              />
            </FormField>
            <FormField description="Only valid for 'vertical' orientation." label="Width">
              <Input
                placeholder={'example: 30% or 200px'}
                value={urlParams[breakpointName + 'Width']}
                onChange={event => setUrlParams({ [breakpointName + 'Width']: event.detail.value })}
              />
            </FormField>
            <FormField description="Only valid for 'horizontal' orientation." label="Height">
              <Input
                placeholder={'example: 30% or 200px'}
                value={urlParams[breakpointName + 'Height']}
                onChange={event => setUrlParams({ [breakpointName + 'Height']: event.detail.value })}
              />
            </FormField>
          </SpaceBetween>
        ))}
      </SpaceBetween>
    </ExpandableSection>
  );
}

export default function SimpleContainers() {
  const getArray = (length: number) => Array.from({ length }, (v, i) => i);
  return (
    <article>
      <h1>Simple containers</h1>

      <ScreenshotArea>
        <SpaceBetween size="xl">
          <ConfigurationForm />
          <SpaceBetween size="s">
            <Box variant="h3">Single container</Box>
            <ContainerPlayground
              header={
                <Header variant="h2">
                  <Link fontSize="inherit" variant="primary">
                    Simple container
                  </Link>
                </Header>
              }
              mediaContent={<img src={image169} alt="16:9 image" />}
            >
              Content area takes the available vertical space
            </ContainerPlayground>
          </SpaceBetween>
          <SpaceBetween size="s">
            <Box variant="h3">Column layout (4 columns)</Box>
            <ColumnLayout columns={4}>
              {getArray(4).map(i => (
                <ContainerPlayground
                  key={i}
                  header={<Header variant="h2">Container title</Header>}
                  footer="Footer"
                  mediaContent={<img src={image169} alt="16:9 image" />}
                >
                  <SpaceBetween size="s">
                    Content area takes the available vertical space
                    <Button>Action</Button>
                  </SpaceBetween>
                </ContainerPlayground>
              ))}
            </ColumnLayout>
          </SpaceBetween>
          <SpaceBetween size="s">
            <Box variant="h3">Column layout (3 columns)</Box>
            <ColumnLayout columns={3}>
              {getArray(3).map(i => (
                <ContainerPlayground
                  key={i}
                  header={
                    <Header variant="h2">
                      <Link fontSize="inherit" variant="primary">
                        Container title
                      </Link>
                    </Header>
                  }
                  footer="Footer"
                  mediaContent={<img src={image169} alt="16:9 image" />}
                >
                  Content area takes the available vertical space
                </ContainerPlayground>
              ))}
            </ColumnLayout>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h3">Column layout (2 columns)</Box>
            <ColumnLayout columns={2}>
              {getArray(2).map(i => (
                <ContainerPlayground
                  key={i}
                  header={
                    <Header variant="h2">
                      <Link fontSize="inherit" variant="primary">
                        Container title
                      </Link>
                    </Header>
                  }
                  footer="Footer"
                  mediaContent={<img src={image169} alt="16:9 image" />}
                >
                  Content area takes the available vertical space
                </ContainerPlayground>
              ))}
            </ColumnLayout>
          </SpaceBetween>
          <SpaceBetween size="s">
            <Box variant="h3">Grid with different images with different aspect ratios</Box>
            <div className={clsx(styles.grid)}>
              <ContainerPlayground
                fitHeight={true}
                header={<Header variant="h2">16:9 Image Container</Header>}
                mediaContent={<img src={image169} alt="16:9 image" />}
                footer="Footer"
              >
                Content area takes the available vertical space
              </ContainerPlayground>
              <ContainerPlayground
                fitHeight={true}
                header={<Header variant="h2">4:3 Image Container</Header>}
                mediaContent={<img src={image43} alt="4:3 image" />}
                footer="Footer"
              >
                Content area takes the available vertical space Content area takes the available vertical space Content
              </ContainerPlayground>
              <ContainerPlayground
                fitHeight={true}
                header={<Header variant="h2">9:16 Image Container</Header>}
                mediaContent={<img src={image916} alt="9:16 image" />}
                footer="Footer"
              >
                Content area takes the available vertical space
              </ContainerPlayground>
            </div>
          </SpaceBetween>
          <SpaceBetween size="s">
            <Box variant="h3">Custom CSS grid</Box>
            <div className={styles.grid}>
              {getArray(2).map(i => (
                <ContainerPlayground
                  key={i}
                  header={<Header variant="h2">Container title</Header>}
                  footer="Footer"
                  mediaContent={<img src={image169} alt="16:9 image" />}
                >
                  Content area takes the available vertical space
                </ContainerPlayground>
              ))}
              <ContainerPlayground
                fitHeight={true}
                header={<Header variant="h2">Container title</Header>}
                footer="Footer"
                mediaContent={<img src={image169} alt="16:9 image" />}
              >
                Content area takes the available vertical space Content area takes the available vertical space Content
                area takes the available vertical space Content area takes the available vertical space Content area
                takes the available vertical space Content area takes the available vertical space Content area takes
                the available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space
              </ContainerPlayground>
            </div>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h3">Custom CSS grid with fixed 400px height</Box>
            <div className={clsx(styles.grid, styles['grid-fixed-height'])}>
              {getArray(2).map(i => (
                <ContainerPlayground
                  key={i}
                  header={<Header variant="h2">Container title</Header>}
                  footer="Footer"
                  mediaContent={<img src={image169} alt="16:9 image" />}
                >
                  Content area takes the available vertical space
                </ContainerPlayground>
              ))}
              <ContainerPlayground
                fitHeight={true}
                header={<Header variant="h2">Container title</Header>}
                footer="Footer"
                mediaContent={<img src={image169} alt="16:9 image" />}
              >
                Content area takes the available vertical space Content area takes the available vertical space Content
                area takes the available vertical space Content area takes the available vertical space Content area
                takes the available vertical space Content area takes the available vertical space Content area takes
                the available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space Content area takes the
                available vertical space Content area takes the available vertical space
              </ContainerPlayground>
            </div>
          </SpaceBetween>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
