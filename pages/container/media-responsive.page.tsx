// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import AppContext, { AppContextType } from '../app/app-context';
import Container from '~components/container';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Input from '~components/input';
import Box from '~components/box';
import Badge from '~components/badge';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import ExpandableSection from '~components/expandable-section';
import { ContainerProps } from '~components/container';
import { BREAKPOINT_MAPPING } from '~components/internal/breakpoints';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './media.scss';
import image169 from './images/16-9.png';
import image43 from './images/4-3.png';
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

const BREAKPOINTS = BREAKPOINT_MAPPING.reverse();

function ConfigurationForm() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  return (
    <ExpandableSection
      // variant="container"
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
  return (
    <article>
      <h1>Simple containers</h1>

      <ScreenshotArea>
        <SpaceBetween size="l">
          <ConfigurationForm />
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
            mediaContent={<img src={image169} alt="Landscape image" />}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
          </ContainerPlayground>
          <ContainerPlayground
            mediaContent={<img src={image43} alt="4:3 image" />}
            header="ContainerPlayground plain text in header"
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
            tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
            tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius. mediaContent=
          </ContainerPlayground>
          <div className={styles.grid}>
            <ContainerPlayground
              fitHeight={true}
              header={<Header variant="h2">Fixed Height ContainerPlayground</Header>}
              footer="Footer"
              mediaContent={<img src={image169} alt="4:3 image" />}
            >
              Content area takes the available vertical space
            </ContainerPlayground>
            <ContainerPlayground
              fitHeight={true}
              header={<Header variant="h2">Fixed Height ContainerPlayground</Header>}
              footer="Footer"
              mediaContent={<img src={image169} alt="4:3 image" />}
            >
              Content area takes the available vertical space
            </ContainerPlayground>
            <ContainerPlayground
              fitHeight={true}
              header={<Header variant="h2">Fixed Height ContainerPlayground</Header>}
              footer="Footer"
              mediaContent={<img src={image169} alt="4:3 image" />}
            >
              Content area takes the available vertical space
            </ContainerPlayground>
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
