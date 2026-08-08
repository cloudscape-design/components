// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Button from '../../../lib/components/button';
import Icon, { IconProps } from '../../../lib/components/icon';
import IconProvider from '../../../lib/components/icon-provider';

import styles from '../../../lib/components/icon/styles.css.js';

// `$icon-motion` in motion.scss: motions that need NO geometry re-cut. `parts` lists the
// `motion-*` hooks the icon's SVG must expose; `null` means the icon root is animated and
// the SVG needs no change at all.
const p0Motion: Record<string, string[] | null> = {
  heart: null,
  settings: null,
  undo: ['motion-arrow'],
  redo: ['motion-arrow'],
  'status-positive': ['motion-check'],
  copy: ['motion-front', 'motion-back'],
  refresh: ['motion-arc'],
};

// `$icon-motion-part-level` in motion.scss: the moving piece sits inside an SVGO-merged
// path, so shipping these would require re-cutting the icon. Out of P0 scope, so the real
// icons deliberately do NOT carry these hooks — the dev page uses segmented demo assets.
const requiresRecut = [
  'notification',
  'external',
  'upload',
  'download',
  'shrink',
  'expand',
  'status-warning',
  'bug',
  'unlocked',
];

// Icons with no motion-map entry and no RTL-mirror entry in styles.scss.
const unmappedIconNames = ['calendar', 'search', 'filter', 'folder', 'key'];

const render1 = (name: string) => render(<Icon name={name as IconProps['name']} />);

describe('P0 icon motion (no geometry re-cut)', () => {
  describe.each(Object.keys(p0Motion))('%s', name => {
    test('exposes a per-icon `name-*` class, which is what scopes its motion', () => {
      // The class only exists in the CSS module when motion.scss emits a rule for it, so
      // a missing entry here means the icon silently has no motion hook.
      expect(styles[`name-${name}`]).toBeTruthy();
      expect(render1(name).container.firstElementChild).toHaveClass(styles[`name-${name}`]);
    });

    const parts = p0Motion[name];
    if (parts) {
      test.each(parts)('SVG exposes the %s part class', part => {
        expect(render1(name).container.querySelector(`svg .${part}`)).toBeTruthy();
      });
    } else {
      test('needs no part hook at all (whole-icon transform)', () => {
        expect(render1(name).container.querySelector('svg [class*="motion-"]')).toBeNull();
      });
    }
  });

  test('adding a part class leaves the existing stroke helper classes intact', () => {
    // The generator preserves every class on the path; the motion class is additive.
    expect(render1('undo').container.querySelector('svg .motion-arrow')).toHaveClass('stroke-linejoin-round');
  });
});

describe('motions that require re-cutting paths are not faked on real icons', () => {
  test.each(requiresRecut)('%s still gets a name-* class so the CSS is ready', name => {
    expect(styles[`name-${name}`]).toBeTruthy();
    expect(render1(name).container.firstElementChild).toHaveClass(styles[`name-${name}`]);
  });

  test.each(requiresRecut)('%s has NO motion-* hooks, because that would re-cut it', name => {
    expect(render1(name).container.querySelector('svg [class*="motion-"]')).toBeNull();
  });

  test.each(requiresRecut)('%s remains a single merged shape, as on mainline', name => {
    // SVGO merges same-class siblings. This is the property that makes part-level motion
    // impossible without a re-cut, so it is asserted rather than assumed.
    const { container } = render1(name);
    const shapes = container.querySelectorAll('svg > *');
    const multiSubpath = Array.from(shapes).some(s => ((s.getAttribute('d') || '').match(/[Mm]/g) || []).length > 1);
    expect(multiSubpath).toBe(true);
  });
});

describe('icons with no motion-map entry', () => {
  test.each(unmappedIconNames)('%s has no per-icon motion class', name => {
    expect(render1(name).container.firstElementChild!.className).not.toMatch(/name-/);
  });

  test('motion part classes never leak onto an unmapped icon', () => {
    for (const name of unmappedIconNames) {
      expect(render1(name).container.querySelector('svg [class*="motion-"]')).toBeNull();
    }
  });
});

// The per-icon class reflects the name that was ASKED FOR, not what actually rendered,
// because InternalIcon builds its className before choosing a render path. Motion
// selectors therefore also require `svg.awsui-icon`, which only the generated icon set
// carries. These are the two ways a builder's own SVG keeps `.name-x`.
describe('builder-supplied SVGs are not animated', () => {
  const builderSvg = (
    <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <circle cx="8" cy="8" r="4" />
    </svg>
  );

  test('every generated icon carries the awsui-icon provenance marker', () => {
    for (const name of [...Object.keys(p0Motion), ...requiresRecut, ...unmappedIconNames]) {
      expect(render1(name).container.querySelector('svg')).toHaveClass('awsui-icon');
    }
  });

  test('Button with both iconName and iconSvg keeps name-* but renders an unmarked svg', () => {
    const { container } = render(<Button iconName="settings" iconSvg={builderSvg} ariaLabel="custom" />);

    const icon = container.querySelector(`.${styles['name-settings']}`);
    // The stale per-icon class is still there — exactly why it is not sufficient alone.
    expect(icon).toBeTruthy();

    const svg = icon!.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg).not.toHaveClass('awsui-icon');
  });

  test('IconProvider override of a built-in name renders an unmarked svg', () => {
    const { container } = render(
      <IconProvider icons={{ settings: builderSvg }}>
        <Icon name="settings" />
      </IconProvider>
    );

    const icon = container.querySelector(`.${styles['name-settings']}`);
    expect(icon).toBeTruthy();

    const svg = icon!.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg).not.toHaveClass('awsui-icon');
  });

  test('an IconProvider override does not resurrect the built-in geometry', () => {
    const { container } = render(
      <IconProvider icons={{ settings: builderSvg }}>
        <Icon name="settings" />
      </IconProvider>
    );
    expect(container.querySelector('circle')).toBeTruthy();
    expect(container.querySelector('path')).toBeNull();
  });

  test('the `svg` prop keeps the per-icon class but renders an unmarked svg', () => {
    const { container } = render(<Icon name="settings" svg={builderSvg} />);
    expect(container.firstElementChild).toHaveClass(styles['name-settings']);
    expect(container.querySelector('svg')).not.toHaveClass('awsui-icon');
  });
});
