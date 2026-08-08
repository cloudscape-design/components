// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import Header from '~components/header';
import Icon, { IconProps } from '~components/icon';
import IconProvider from '~components/icon-provider';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import AppContext, { Theme } from '../app/app-context';
import demoIcons, { partLevelDemoIconNames } from './motion-poc/demo-icons';

import styles from './motion.scss';

// `$icon-motion` in src/icon/motion.scss — the 7 motions that need no geometry re-cut.
// These run on Cloudscape's REAL built-in icons.
const p0Icons: IconProps['name'][] = ['settings', 'heart', 'undo', 'redo', 'status-positive', 'copy', 'refresh'];

// Not in either motion map — these show the generic hover floor on its own.
const genericIcons: IconProps['name'][] = ['search', 'filter', 'calendar', 'folder', 'user-profile', 'key'];

// A builder's own SVG: no `awsui-icon` marker, so it can never match a motion selector
// even though the wrapper still carries `.name-notification`.
const builderSvg = (
  <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
    <circle cx="8" cy="8" r="5" />
    <path d="M8 5v6" />
  </svg>
);

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.cell}>
      {children}
      <span className={styles.label}>{label}</span>
    </div>
  );
}

/**
 * Renders a dev-pages-only SEGMENTED demo asset through the REAL production path and the
 * REAL production CSS: `iconName` supplies the `.name-<x>` opt-in class, and the demo SVG
 * carries the `awsui-icon` marker that the motion selectors require.
 *
 * This is deliberately the SAME code path as the "builder SVG" cases further down. The
 * only difference is the marker, which is exactly what decides whether motion applies.
 * It also shows the marker is a provenance CONVENTION, not a hard boundary: a builder who
 * copies the class onto their own SVG opts themselves in.
 */
function SegmentedDemoIcon({ name }: { name: string }) {
  return (
    <Button
      variant="icon"
      iconName={name as IconProps['name']}
      iconSvg={demoIcons[name]}
      ariaLabel={`${name} (segmented demo asset)`}
    />
  );
}

export default function IconMotionPage() {
  const { urlParams, setUrlParams } = React.useContext(AppContext);
  const oneTheme = urlParams.theme === Theme.OneTheme;

  return (
    <Box margin="l">
      <SpaceBetween size="l">
        <Header
          variant="h1"
          description="Hover or keyboard-focus a control to play its icon micro-interaction. CSS only, no JavaScript. One Theme only."
        >
          Icon hover motion
        </Header>

        <SpaceBetween size="xs">
          <Checkbox
            checked={oneTheme}
            onChange={({ detail }) => setUrlParams({ theme: detail.checked ? Theme.OneTheme : Theme.Default })}
          >
            One Theme (<code>.awsui-one-theme</code>) — motion only applies when this is on
          </Checkbox>
          <Checkbox
            checked={urlParams.motionDisabled}
            onChange={({ detail }) => setUrlParams({ motionDisabled: detail.checked })}
          >
            Motion disabled (<code>.awsui-motion-disabled</code>) — should suppress everything below
          </Checkbox>
          <Box color="text-body-secondary" fontSize="body-s">
            Requires the dev server to run with <code>INCLUDE_ONE_THEME=true</code>. Without it One Theme is not
            composed into the artefact and the motion CSS is not emitted at all.
          </Box>
        </SpaceBetween>

        <div>
          <Header
            variant="h2"
            description="Cloudscape's REAL built-in icons. Either a whole-icon transform, or the moving piece is already its own path so only a class attribute was added — verified pixel-identical with the same shape count. No geometry re-cut, so these are shippable in P0."
          >
            P0 scope — real built-in icons, no re-cut
          </Header>
          <div className={styles.grid}>
            {p0Icons.map(name => (
              <Cell key={name} label={`${name} (Button)`}>
                <Button variant="icon" iconName={name} ariaLabel={name} />
              </Cell>
            ))}
            {p0Icons.map(name => (
              <Cell key={`${name}-link`} label={`${name} (Link)`}>
                <Link href="#" onFollow={event => event.preventDefault()}>
                  <Icon name={name} />
                </Link>
              </Cell>
            ))}
          </div>
        </div>

        <div>
          <Header
            variant="h2"
            description="Icons with no motion-map entry. They get the shared default only: a subtle scale on hover."
          >
            Generic floor — real icons, P0 scope
          </Header>
          <div className={styles.grid}>
            {genericIcons.map(name => (
              <Cell key={name} label={name}>
                <Button variant="icon" iconName={name} ariaLabel={name} />
              </Cell>
            ))}
          </div>
        </div>

        <div>
          <Header
            variant="h2"
            description="The designer's own SEGMENTED SVGs from the Protozoa prototype, rendered through the real production CSS. Cloudscape's shipped icons are unsegmented — SVGO merges same-class paths into one — so they physically cannot express these motions. Shipping them would require RE-CUTTING each icon's paths, which is out of P0 scope and, unlike the CSS, cannot be theme-gated."
          >
            Requires re-cutting paths — demo assets, NOT P0 scope
          </Header>
          <div className={styles.grid}>
            {partLevelDemoIconNames.map(name => (
              <Cell key={name} label={name}>
                <SegmentedDemoIcon name={name} />
              </Cell>
            ))}
          </div>
        </div>

        <div>
          <Header
            variant="h2"
            description="The same real icons with no interactive ancestor. Nothing should move on hover."
          >
            Outside an eligible region — no motion
          </Header>
          <div className={styles.grid}>
            {[...p0Icons, ...genericIcons].map(name => (
              <Cell key={name} label={name}>
                <Icon name={name} size="medium" />
              </Cell>
            ))}
          </div>
        </div>

        <div>
          <Header
            variant="h2"
            description="All three still carry .name-settings, because the class reflects the name that was ASKED FOR, not what rendered. Only the built-in one may animate: the other two render a builder's SVG, which has no awsui-icon marker."
          >
            Provenance — builder SVGs must stay still
          </Header>
          <div className={styles.grid}>
            <Cell label="Button iconName + iconSvg">
              <Button iconName="settings" iconSvg={builderSvg} ariaLabel="iconName plus iconSvg" />
            </Cell>
            <Cell label="IconProvider override">
              <IconProvider icons={{ settings: builderSvg }}>
                <Button variant="icon" iconName="settings" ariaLabel="IconProvider override" />
              </IconProvider>
            </Cell>
            <Cell label="built-in (animates)">
              <Button variant="icon" iconName="settings" ariaLabel="built-in settings" />
            </Cell>
          </div>
        </div>
      </SpaceBetween>
    </Box>
  );
}
