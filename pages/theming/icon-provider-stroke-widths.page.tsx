// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  FormField,
  IconProvider,
  Input,
  InputProps,
  Link,
  SpaceBetween,
  StatusIndicator,
} from '~components';
import Icon, { IconProps } from '~components/icon';
import icons from '~components/icon/generated/icons';
import { NonCancelableCustomEvent } from '~components/internal/events';

import ScreenshotArea from '../utils/screenshot-area';

import styles from '../icon/icons-list.scss';

const createStrokeHandler = (setter: (value: string) => void) => {
  return (evt: NonCancelableCustomEvent<InputProps.ChangeDetail>) => {
    const numValue = parseFloat(evt.detail.value);
    if (!isNaN(numValue) && numValue >= 0.5 && numValue <= 10) {
      setter(evt.detail.value);
    } else if (evt.detail.value === '') {
      setter(evt.detail.value);
    }
  };
};

const createSizeHandler = (setter: (value: string) => void) => {
  return (evt: NonCancelableCustomEvent<InputProps.ChangeDetail>) => {
    const numValue = parseFloat(evt.detail.value);
    if (!isNaN(numValue) && numValue >= 4 && numValue <= 96) {
      setter(evt.detail.value);
    } else if (evt.detail.value === '') {
      setter(evt.detail.value);
    }
  };
};

export default function IconProviderStrokeWidthsPage() {
  const [strokeSmall, setStrokeSmall] = useState<string>('2');
  const [strokeNormal, setStrokeNormal] = useState<string>('2');
  const [strokeMedium, setStrokeMedium] = useState<string>('2');
  const [strokeBig, setStrokeBig] = useState<string>('3');
  const [strokeLarge, setStrokeLarge] = useState<string>('4');

  const [sizeSmall, setSizeSmall] = useState<string>('16');
  const [sizeNormal, setSizeNormal] = useState<string>('16');
  const [sizeMedium, setSizeMedium] = useState<string>('20');
  const [sizeBig, setSizeBig] = useState<string>('32');
  const [sizeLarge, setSizeLarge] = useState<string>('48');

  const strokeWidths = {
    small: strokeSmall ? `${strokeSmall}px` : undefined,
    normal: strokeNormal ? `${strokeNormal}px` : undefined,
    medium: strokeMedium ? `${strokeMedium}px` : undefined,
    big: strokeBig ? `${strokeBig}px` : undefined,
    large: strokeLarge ? `${strokeLarge}px` : undefined,
  };

  const sizes = {
    small: sizeSmall ? `${sizeSmall}px` : undefined,
    normal: sizeNormal ? `${sizeNormal}px` : undefined,
    medium: sizeMedium ? `${sizeMedium}px` : undefined,
    big: sizeBig ? `${sizeBig}px` : undefined,
    large: sizeLarge ? `${sizeLarge}px` : undefined,
  };

  // Remove undefined entries so only specified values are passed
  const cleanStrokeWidths = Object.fromEntries(
    Object.entries(strokeWidths).filter(([, v]) => v !== undefined)
  ) as typeof strokeWidths;

  const cleanSizes = Object.fromEntries(Object.entries(sizes).filter(([, v]) => v !== undefined)) as typeof sizes;

  return (
    <div style={{ padding: 15 }}>
      <h1>IconProvider strokeWidths prop</h1>
      <SpaceBetween size="l" direction="vertical">
        <Box variant="p">
          The <code>strokeWidths</code> prop on <code>IconProvider</code> allows direct control over SVG stroke-width
          per size variant, bypassing the default token values and automatic size-compensation scaling.
        </Box>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', maxWidth: '800px' }}>
          <FormField label="Small stroke">
            <Input
              type="number"
              value={strokeSmall}
              onChange={createStrokeHandler(setStrokeSmall)}
              placeholder="2"
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
          <FormField label="Normal stroke">
            <Input
              type="number"
              value={strokeNormal}
              onChange={createStrokeHandler(setStrokeNormal)}
              placeholder="2"
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
          <FormField label="Medium stroke">
            <Input
              type="number"
              value={strokeMedium}
              onChange={createStrokeHandler(setStrokeMedium)}
              placeholder="2"
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
          <FormField label="Big stroke">
            <Input
              type="number"
              value={strokeBig}
              onChange={createStrokeHandler(setStrokeBig)}
              placeholder="3"
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
          <FormField label="Large stroke">
            <Input
              type="number"
              value={strokeLarge}
              onChange={createStrokeHandler(setStrokeLarge)}
              placeholder="4"
              step={0.5}
              inputMode="decimal"
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', maxWidth: '800px' }}>
          <FormField label="Small size (px)">
            <Input
              type="number"
              value={sizeSmall}
              onChange={createSizeHandler(setSizeSmall)}
              placeholder="12"
              step={1}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="Normal size (px)">
            <Input
              type="number"
              value={sizeNormal}
              onChange={createSizeHandler(setSizeNormal)}
              placeholder="16"
              step={1}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="Medium size (px)">
            <Input
              type="number"
              value={sizeMedium}
              onChange={createSizeHandler(setSizeMedium)}
              placeholder="20"
              step={1}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="Big size (px)">
            <Input
              type="number"
              value={sizeBig}
              onChange={createSizeHandler(setSizeBig)}
              placeholder="32"
              step={1}
              inputMode="numeric"
            />
          </FormField>
          <FormField label="Large size (px)">
            <Input
              type="number"
              value={sizeLarge}
              onChange={createSizeHandler(setSizeLarge)}
              placeholder="48"
              step={1}
              inputMode="numeric"
            />
          </FormField>
        </div>

        <ScreenshotArea>
          <IconProvider icons={null} strokeWidths={cleanStrokeWidths} sizes={cleanSizes}>
            <SpaceBetween size="xl">
              <Box variant="h2">Icon sizes with custom stroke-widths</Box>

              <SpaceBetween size="xs">
                <Box variant="h3">
                  Small ({sizeSmall || '12'}px) — stroke: {strokeSmall || 'default'}px
                </Box>
                <div className={styles.wrapper}>
                  {Object.keys(icons).map(icon => (
                    <Icon key={icon} name={icon as IconProps['name']} variant="normal" size="small" />
                  ))}
                </div>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="h3">
                  Normal ({sizeNormal || '16'}px) — stroke: {strokeNormal || 'default'}px
                </Box>
                <div className={styles.wrapper}>
                  {Object.keys(icons).map(icon => (
                    <Icon key={icon} name={icon as IconProps['name']} variant="normal" size="normal" />
                  ))}
                </div>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="h3">
                  Medium ({sizeMedium || '20'}px) — stroke: {strokeMedium || 'default'}px
                </Box>
                <div className={styles.wrapper}>
                  {Object.keys(icons).map(icon => (
                    <Icon key={icon} name={icon as IconProps['name']} variant="normal" size="medium" />
                  ))}
                </div>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="h3">
                  Big ({sizeBig || '32'}px) — stroke: {strokeBig || 'default'}px
                </Box>
                <div className={styles.wrapper}>
                  {Object.keys(icons).map(icon => (
                    <Icon key={icon} name={icon as IconProps['name']} variant="normal" size="big" />
                  ))}
                </div>
              </SpaceBetween>

              <SpaceBetween size="xs">
                <Box variant="h3">
                  Large ({sizeLarge || '48'}px) — stroke: {strokeLarge || 'default'}px
                </Box>
                <div className={styles.wrapper}>
                  {Object.keys(icons).map(icon => (
                    <Icon key={icon} name={icon as IconProps['name']} variant="normal" size="large" />
                  ))}
                </div>
              </SpaceBetween>

              <Box variant="h2" padding={{ top: 'l' }}>
                Inline context examples
              </Box>

              <SpaceBetween size="m">
                <div>
                  <Button iconName="call" variant="primary">
                    Button
                  </Button>{' '}
                  <Button iconName="settings" variant="normal">
                    Settings
                  </Button>{' '}
                  <Button iconName="external" variant="link">
                    External
                  </Button>
                </div>

                <div>
                  <Link external={true} href="https://example.com/" variant="primary">
                    Learn more
                  </Link>
                </div>

                <SpaceBetween size="xs">
                  <StatusIndicator type="error">Error</StatusIndicator>
                  <StatusIndicator type="success">Success</StatusIndicator>
                  <StatusIndicator type="warning">Warning</StatusIndicator>
                  <StatusIndicator type="info">Info</StatusIndicator>
                </SpaceBetween>

                <Alert type="info" statusIconAriaLabel="Info">
                  This alert uses the custom stroke-width from the IconProvider.
                </Alert>
              </SpaceBetween>

              <Box variant="h2" padding={{ top: 'l' }}>
                Combined with size overrides
              </Box>
              <Box variant="p">
                When both <code>sizes</code> and <code>strokeWidths</code> are specified, the explicit stroke-width
                takes precedence over the automatic compensation from size scaling.
              </Box>
              <IconProvider icons={null} sizes={{ normal: '12px' }} strokeWidths={{ normal: '1.5px' }}>
                <SpaceBetween size="xs">
                  <Box variant="h3">Normal icons scaled to 12px with 1.5px stroke</Box>
                  <div className={styles.wrapper}>
                    {Object.keys(icons)
                      .slice(0, 20)
                      .map(icon => (
                        <Icon key={icon} name={icon as IconProps['name']} variant="normal" size="normal" />
                      ))}
                  </div>
                </SpaceBetween>
              </IconProvider>
            </SpaceBetween>
          </IconProvider>
        </ScreenshotArea>
      </SpaceBetween>
    </div>
  );
}
