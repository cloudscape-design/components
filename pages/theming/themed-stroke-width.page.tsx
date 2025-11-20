// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { Box, FormField, Input, SpaceBetween } from '~components';
import Icon, { IconProps } from '~components/icon';
import icons from '~components/icon/generated/icons';
import { applyTheme, Theme } from '~components/theming';

import ScreenshotArea from '../utils/screenshot-area';

import styles from '../icon/icons-list.scss';

export default function () {
  const [themed, setThemed] = useState<boolean>(true);
  const [strokeSmall, setStrokeSmall] = useState<string>('1px');
  const [strokeNormal, setStrokeNormal] = useState<string>('1px');
  const [strokeMedium, setStrokeMedium] = useState<string>('1px');
  const [strokeBig, setStrokeBig] = useState<string>('1.5px');
  const [strokeLarge, setStrokeLarge] = useState<string>('2px');

  useEffect(() => {
    const theme: Theme = {
      tokens: {
        borderWidthIconSmall: strokeSmall,
        borderWidthIconNormal: strokeNormal,
        borderWidthIconMedium: strokeMedium,
        borderWidthIconBig: strokeBig,
        borderWidthIconLarge: strokeLarge,
      },
    };

    let reset: () => void = () => {};
    const result = applyTheme({
      theme: themed ? theme : { tokens: {} },
      baseThemeId: 'visual-refresh',
    });
    reset = result.reset;
    return reset;
  }, [themed, strokeSmall, strokeNormal, strokeMedium, strokeBig, strokeLarge]);

  return (
    <div style={{ padding: 15 }}>
      <h1>Themed Icon Stroke Width</h1>
      <Box padding={{ bottom: 'm' }} variant="small">
        When not working, reload the page
      </Box>
      <SpaceBetween size="m" direction="vertical">
        <label>
          <input
            type="checkbox"
            data-testid="apply-theme"
            checked={themed}
            onChange={evt => setThemed(evt.currentTarget.checked)}
          />
          <span style={{ marginInlineStart: 5 }}>Apply custom stroke widths</span>
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', maxWidth: '800px' }}>
          <FormField label="New small size" description="Default: 2px">
            <Input
              type="number"
              value={strokeSmall}
              onChange={evt => setStrokeSmall(evt.detail.value)}
              placeholder="1px"
            />
          </FormField>

          <FormField label="Normal (16px)" description="Default: 2px">
            <Input
              type="number"
              value={strokeNormal}
              onChange={evt => setStrokeNormal(evt.detail.value)}
              placeholder="1px"
            />
          </FormField>

          <FormField label="Medium (20px)" description="Default: 2px">
            <Input
              type="number"
              value={strokeMedium}
              onChange={evt => setStrokeMedium(evt.detail.value)}
              placeholder="1px"
            />
          </FormField>

          <FormField label="Big (32px)" description="Default: 3px">
            <Input
              type="number"
              value={strokeBig}
              onChange={evt => setStrokeBig(evt.detail.value)}
              placeholder="1.5px"
            />
          </FormField>

          <FormField label="Large (48px)" description="Default: 4px">
            <Input
              type="number"
              value={strokeLarge}
              onChange={evt => setStrokeLarge(evt.detail.value)}
              placeholder="2px"
            />
          </FormField>
        </div>
      </SpaceBetween>

      <Box variant="h2" padding={{ top: 'l' }}>
        New small icon size options
      </Box>
      <Box variant="p" color="text-body-secondary" padding={{ bottom: 'm' }}>
        Compare three potential small icon sizes with custom stroke widths applied.
      </Box>

      <ScreenshotArea>
        <SpaceBetween size="xl">
          <SpaceBetween size="xs">
            <Box variant="h3">Option 1: 12px (Too small, details are broken)</Box>
            <div className={styles.wrapper}>
              {Object.keys(icons).map(icon => (
                <Icon key={`12-${icon}`} name={icon as IconProps['name']} variant="normal" size="small-12" />
              ))}
            </div>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Box variant="h3">Option 2: 13px (Look ok)</Box>
            <div className={styles.wrapper}>
              {Object.keys(icons).map(icon => (
                <Icon key={`13-${icon}`} name={icon as IconProps['name']} variant="normal" size="small-13" />
              ))}
            </div>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Box variant="h3">
              Option 3: 14px (✅ Look better than other two maintaining visual details in 1px stroke)
            </Box>
            <div className={styles.wrapper}>
              {Object.keys(icons).map(icon => (
                <Icon key={`14-${icon}`} name={icon as IconProps['name']} variant="normal" size="small-14" />
              ))}
            </div>
          </SpaceBetween>

          <Box variant="h2" padding={{ top: 'l' }}>
            Other Icon Sizes
          </Box>

          <SpaceBetween size="xs">
            <Box variant="h3">Normal (16px)</Box>
            <div className={styles.wrapper}>
              {Object.keys(icons).map(icon => (
                <Icon key={icon} name={icon as IconProps['name']} variant="normal" size="normal" />
              ))}
            </div>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Box variant="h3">Medium (20px)</Box>
            <div className={styles.wrapper}>
              {Object.keys(icons).map(icon => (
                <Icon key={icon} name={icon as IconProps['name']} variant="normal" size="medium" />
              ))}
            </div>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Box variant="h3">Big (32px)</Box>
            <div className={styles.wrapper}>
              {Object.keys(icons).map(icon => (
                <Icon key={icon} name={icon as IconProps['name']} variant="normal" size="big" />
              ))}
            </div>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Box variant="h3">Large (48px)</Box>
            <div className={styles.wrapper}>
              {Object.keys(icons).map(icon => (
                <Icon key={icon} name={icon as IconProps['name']} variant="normal" size="large" />
              ))}
            </div>
          </SpaceBetween>
        </SpaceBetween>
      </ScreenshotArea>
    </div>
  );
}
