// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Button from '../../../lib/components/button';
import Icon, { IconProps } from '../../../lib/components/icon';
import IconProvider from '../../../lib/components/icon-provider';

import {
  hoverRules,
  matchesSelector,
  Rule,
  specificity,
  specificityRank,
  splitAtTrigger,
  splitCompounds,
  splitSelectorList,
  stripSpecificityHack,
} from './motion-css';
import styles from '../../../lib/components/icon/styles.css.js';

// `$icon-hover-motion` in hover-motion.scss. `parts` lists the `motion-*` hooks the icon's SVG must
// expose; `null` means the icon root is animated and the SVG needs no change at all.
const shippedMotion: Record<string, string[] | null> = {
  // whole-icon transforms, no SVG change
  announcement: null,
  heart: null,
  'heart-filled': null,
  settings: null,
  'thumbs-up': null,
  'thumbs-up-filled': null,
  'thumbs-down': null,
  'thumbs-down-filled': null,
  'face-happy-filled': null,
  'status-negative': null,
  // part-level
  'face-happy': ['motion-mouth'],
  'face-neutral': ['motion-mouth'],
  'face-sad': ['motion-mouth'],
  copy: ['motion-front', 'motion-back'],
  refresh: ['motion-arc'],
  upload: ['motion-arrow'],
  download: ['motion-arrow'],
  'upload-download': ['motion-up', 'motion-down'],
  undo: ['motion-arrow'],
  redo: ['motion-arrow'],
  external: ['motion-arrow'],
  shrink: ['motion-tr', 'motion-bl'],
  expand: ['motion-tl', 'motion-tr', 'motion-bl', 'motion-br'],
  'zoom-to-fit': ['motion-edge-tl', 'motion-edge-tr', 'motion-edge-bl', 'motion-edge-br'],
  multiscreen: ['motion-front', 'motion-back'],
  'lock-private': ['motion-shackle'],
  unlocked: ['motion-shackle'],
  history: ['motion-hands', 'motion-ring'],
  'backward-10-seconds': ['motion-arc', 'motion-one', 'motion-zero'],
  'forward-10-seconds': ['motion-arc', 'motion-one', 'motion-zero'],
  'view-horizontal': ['motion-panel'],
  'view-vertical': ['motion-panel'],
  'zoom-in': ['motion-arm'],
  'zoom-out': ['motion-arm'],
  bug: ['motion-leg-tl', 'motion-leg-mr', 'motion-leg-bl', 'motion-leg-tr', 'motion-leg-ml', 'motion-leg-br'],
  'status-positive': ['motion-check'],
  'status-warning': ['motion-exclamation'],
  'status-pending': ['motion-hands'],
  'status-in-progress': ['motion-dot-1', 'motion-dot-2', 'motion-dot-3'],
};

/**
 * The prototype animated these but they are deliberately NOT in the motion map.
 *
 * `notification` IS classed, because the hooks cost nothing and the drawing does not change;
 * only the map entry is withheld. Its clapper sits 0.75px lower than the prototype's, so the
 * bounce has less headroom — enabling it is a design call.
 *
 * The other three want more separately-addressable parts than our paths provide, so porting
 * them would mean editing the drawing rather than adding a class.
 */
const classedButNotMapped = ['notification'];
const needsGeometryWork = ['exit-full-screen', 'full-screen', 'mini-player'];

const notAnimated = [...classedButNotMapped, ...needsGeometryWork];

// Icons with no motion-map entry and no RTL-mirror entry in styles.scss.
const unmappedIconNames = ['calendar', 'search', 'filter', 'folder', 'key'];

/**
 * Renders a bare icon as if it were a component's own designated icon: the render container
 * carries the target-scope marker (`data-awsui-motion-target`), which is what
 * `$_animating-icon` checks via `:where([data-awsui-motion-target] *)`. Marking the container
 * rather than wrapping the icon keeps `container.firstElementChild` the icon's own span.
 */
const render1 = (name: string) => {
  const result = render(<Icon name={name as IconProps['name']} />);
  result.container.setAttribute('data-awsui-motion-target', 'true');
  return result;
};

/** The counterpart to `render1`: no marker anywhere, so the icon is NOT an eligible target. */
const renderUnmarked = (name: string) => render(<Icon name={name as IconProps['name']} />);

/**
 * Hover rules scoped to ONE icon by its per-icon class — the bespoke tier.
 *
 * Deliberately throws when the icon has no per-icon class instead of returning `[]`. An
 * earlier version returned early there, which made every "this icon is not animated"
 * assertion below pass without ever reading the CSS: the generic floor needs no per-icon
 * class, so the one rule that could contradict them was the one rule never inspected.
 */
function bespokeHoverRulesFor(name: string): string[] {
  const localClass = styles[`name-${name}`];
  if (!localClass) {
    throw new Error(`${name} has no per-icon class; use genericFloorRules() to reason about it`);
  }
  return hoverRules()
    .filter(r => r.selector.includes(localClass))
    .map(r => r.rule);
}

/** Hover rules that require NO per-icon class — the floor every generated icon receives. */
const genericFloorRules = () =>
  hoverRules().filter(r => !/name-/.test(r.selector) && /\bsvg\[data-awsui-icon-animated\]/.test(r.selector));

/**
 * The icon-side tail of a selector (`.icon_hash > svg[data-awsui-icon-animated]`), for real DOM
 * matching. The region and theme scope sit on ancestors that jsdom has no `:hover` for; the
 * icon-side tail is what decides WHICH icons a rule can reach, and that is matchable.
 */
function iconSideTails(rules: Rule[]): string[] {
  const tails = new Set<string>();
  for (const rule of rules) {
    for (const selector of splitSelectorList(rule.selector)) {
      const tail = splitAtTrigger(selector)?.tail;
      if (tail && tail.includes('svg[data-awsui-icon-animated]')) {
        tails.add(stripSpecificityHack(tail).trim());
      }
    }
  }
  return Array.from(tails);
}

/** Does any rule in `rules` actually match the `<svg>` this icon renders? */
function svgIsReachedBy(
  name: string,
  rules: Rule[],
  renderFn: (name: string) => ReturnType<typeof render> = render1
): boolean {
  const svg = renderFn(name).container.querySelector('svg')!;
  return iconSideTails(rules).some(tail => svg.matches(tail));
}

/**
 * The `transform` that actually WINS on the rendered `<svg>` root while the trigger is active.
 *
 * jsdom never matches `:hover`, so the cascade is resolved here instead: take every hover rule
 * whose icon-side tail matches this element AND targets the root, then pick the highest-specificity
 * declaration, with later source order breaking ties. Specificity is computed on the FULL selector,
 * because the trigger and theme compounds count too.
 *
 * This exists because asserting that a rule EXISTS is what let a real cascade bug ship: the grouped
 * floor-cancel out-specified the whole-icon tilt on `face-happy` by one class-level unit (the
 * `:has(:is(…))`), silently resetting the tilt to `none` while rule-counting assertions stayed
 * green.
 */
function winningRootTransform(name: string): string | null {
  const svg = render1(name).container.querySelector('svg')!;
  const rules = hoverRules();
  let best: { rank: number; order: number; value: string } | null = null;

  for (let order = 0; order < rules.length; order++) {
    const rule = rules[order];
    const declaration = /(?:^|;)\s*transform\s*:\s*([^;]+)/.exec(rule.body);
    if (!declaration) {
      continue;
    }
    for (const selector of splitSelectorList(rule.selector)) {
      const tail = splitAtTrigger(selector)?.tail;
      if (!tail) {
        continue;
      }
      // Only a rule whose LAST compound is the svg root competes for the root's transform; one
      // ending in a part class targets a child. The split must be depth-aware: the floor-cancel's
      // `:has(:is(.a, .b))` contains spaces, and a naive `[^ ]*$` test skipped it entirely — which
      // made the paired control below fail, exactly as it was designed to.
      const compounds = splitCompounds(stripSpecificityHack(tail).trim());
      const last = compounds[compounds.length - 1];
      if (!last || !last.startsWith('svg[data-awsui-icon-animated')) {
        continue;
      }
      if (!matchesSelector(svg, tail)) {
        continue;
      }
      const rank = specificityRank(specificity(stripSpecificityHack(selector)));
      if (best === null || rank > best.rank || (rank === best.rank && order >= best.order)) {
        best = { rank, order, value: declaration[1].trim() };
      }
    }
  }

  return best === null ? null : best.value;
}

/**
 * REGRESSION: the grouped floor-cancel must not reach an icon that owns a whole-icon spec.
 *
 * `face-happy` and `face-neutral` each combine a whole-icon tilt with a `motion-mouth` part. The
 * cancel aggregate used to include every icon with ANY part, so it landed on the same element as
 * the tilt and out-ranked it, killing the tilt AND the floor while the mouth kept animating — so
 * the icons looked subtly wrong rather than dead. Confirmed in Chromium, then fixed by excluding
 * such icons: see `.poc-extract/probe-floor-cancel-cascade.mjs` (the bug) and
 * `probe-floor-cancel-fixed.mjs` (the post-fix invariants).
 */
describe('the floor-cancel must not out-rank whole-icon motion', () => {
  test.each([
    ['face-happy', 'rotate(-3deg)'],
    ['face-neutral', 'rotate(3deg)'],
  ])('%s keeps its whole-icon tilt: the winning transform is %s', (name, expected) => {
    expect(winningRootTransform(name)).toBe(expected);
  });

  test.each(['copy', 'external', 'refresh', 'upload'])(
    '%s is a part-only icon, so the cancel legitimately wins on its root',
    name => {
      // The paired control: if the cancel stopped matching ANYTHING, the assertions above would
      // pass for the wrong reason. Here `none` is the correct answer.
      expect(winningRootTransform(name)).toBe('none');
    }
  );

  test.each(['search', 'calendar'])('%s has no bespoke rule, so the generic floor wins', name => {
    expect(winningRootTransform(name)).toBe('scale(0.94)');
  });

  test.each(['settings', 'face-happy-filled'])('%s (whole-icon spec, no part) is unaffected', name => {
    expect(winningRootTransform(name)).toMatch(/^rotate\(-?\d+deg\)$/);
  });

  test('the cancel rule is the more specific of the two, which is why EXCLUSION is the fix', () => {
    // Pins the MECHANISM so nobody "simplifies" the exclusion away: the cancel genuinely
    // out-ranks the whole-icon rule, so source order could never have rescued the tilt.
    const cancel = hoverRules().find(r => r.selector.includes(':has(') && /transform\s*:\s*none/.test(r.body));
    expect(cancel).toBeTruthy();

    const wholeIcon = hoverRules().find(
      r => r.selector.includes(styles['name-face-happy']) && /transform\s*:\s*rotate/.test(r.body)
    );
    expect(wholeIcon).toBeTruthy();

    const rank = (rule: Rule) =>
      Math.max(...splitSelectorList(rule.selector).map(s => specificityRank(specificity(stripSpecificityHack(s)))));
    expect(rank(cancel!)).toBeGreaterThan(rank(wholeIcon!));

    // …and the fix is that it no longer matches this icon at all.
    const tails = splitSelectorList(cancel!.selector).map(s => splitAtTrigger(s)!.tail);
    const faceHappySvg = render1('face-happy').container.querySelector('svg')!;
    expect(tails.some(tail => matchesSelector(faceHappySvg, tail))).toBe(false);

    // Same helper, same rule, an icon it SHOULD reach — proving the check can observe a hit.
    const copySvg = render1('copy').container.querySelector('svg')!;
    expect(tails.some(tail => matchesSelector(copySvg, tail))).toBe(true);
  });
});

describe('shipped icon motion', () => {
  describe.each(Object.keys(shippedMotion))('%s', name => {
    test('exposes a per-icon `name-*` class, which is what scopes its motion', () => {
      // The class only exists in the CSS module when hover-motion.scss emits a rule for it, so a
      // missing entry here means the icon silently has no motion hook.
      expect(styles[`name-${name}`]).toBeTruthy();
      expect(render1(name).container.firstElementChild).toHaveClass(styles[`name-${name}`]);
    });

    test('has at least one bespoke hover rule in the built CSS', () => {
      expect(bespokeHoverRulesFor(name).length).toBeGreaterThan(0);
    });

    const parts = shippedMotion[name];
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

  /**
   * The RTL mirror is SELF-CORRECTING for icon-relative motion, so directional nudges are
   * correct and are deliberately kept.
   *
   * `scaleX(-1)` is applied to the OUTER `.icon` span and our motion animates an inner element,
   * so the nudge inherits the mirror exactly as the drawing does: the arrowhead renders reversed
   * and the nudge reverses with it. An earlier version of this test asserted the opposite — that
   * mirrored icons must avoid `translate` — which forced `undo`/`redo` into a scale and destroyed
   * their meaning. Measured on screen, `external` moves up-right in LTR and up-LEFT in RTL.
   *
   * What does NOT self-correct is a wrapper rotating the icon as a state change, because that
   * changes which way "up" points without changing what the icon depicts. This asserts the
   * invariant that actually matters: no icon in the motion map is one of the icons rendered
   * inside a rotating wrapper.
   */
  test('no mapped icon is one that gets rotated by a wrapper', () => {
    // `spinWhenOpen` (src/internal/styles/motion/utils.ts) is only ever applied to the dropdown
    // carets. Those are the icons whose "up" is not stable, so they must stay unmapped.
    const rotatedByAWrapper = ['caret-down-filled', 'caret-up-filled', 'angle-down', 'angle-up'];
    for (const name of rotatedByAWrapper) {
      expect(Object.keys(shippedMotion)).not.toContain(name);
    }
  });

  test('the mirrored icons keep their directional nudges', () => {
    // Locks in the correction: these must NOT be flattened to a scale again.
    for (const name of ['undo', 'redo', 'external', 'shrink']) {
      const rules = bespokeHoverRulesFor(name).join('\n');
      expect(rules).toMatch(/animation-name/);
    }
    // And the keyframes they name are translate-based.
    const css = hoverRules()
      .map(r => r.rule)
      .join('\n');
    expect(css).toMatch(/animation-name:\s*\S*icon-nudge-back/);
    expect(css).toMatch(/animation-name:\s*\S*icon-nudge-forward/);
    expect(css).toMatch(/animation-name:\s*\S*icon-nudge-up-right/);
    expect(css).toMatch(/animation-name:\s*\S*icon-nudge-down-left/);
  });
});

/**
 * The floor is the SECOND tier, and it is deliberately NOT per-icon: it is scoped by region,
 * TARGET SCOPE and the opt-in attribute, so every generated icon whose ancestor (or itself)
 * carries `data-awsui-motion-target` receives it. That is the specified cascade — a bespoke
 * `.name-X` rule overrides the floor rather than being the thing that enables motion in the
 * first place.
 *
 * It is safe to apply this broadly precisely because it is a uniform scale of the SVG root:
 * it needs no knowledge of the drawing, so it neither requires a re-cut nor reverses under
 * rotation or the RTL mirror. Those constraints bind the bespoke tier, not the floor.
 */
describe('the generic hover floor', () => {
  test('is emitted, and is scoped by region and the opt-in attribute rather than by icon name', () => {
    const rules = genericFloorRules();
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) {
      expect(rule.selector).not.toMatch(/name-/);
      // The opt-in still binds: an SVG without the attribute is unreachable, and a
      // builder-supplied one does not carry it unless the builder opts in deliberately.
      expect(rule.selector).toMatch(/svg\[data-awsui-icon-animated\]/);
    }
  });

  test('is scale-only, so it is geometry-, rotation- and mirror-invariant', () => {
    const transforms = genericFloorRules()
      .flatMap(r => Array.from(r.body.matchAll(/transform\s*:\s*([^;]+)/g)))
      .map(m => m[1].trim());

    expect(transforms.length).toBeGreaterThan(0);
    for (const value of transforms) {
      // `none` is the motion-off reset; anything else must be a bare scale.
      expect(value).toMatch(/^(none|scale\([^)]*\))$/);
    }
  });

  test('reaches every generated icon whose ancestor carries the target marker, including ones with no map entry', () => {
    const rules = genericFloorRules();
    for (const name of [...Object.keys(shippedMotion), ...notAnimated, ...unmappedIconNames]) {
      expect(svgIsReachedBy(name, rules)).toBe(true);
    }
  });

  /** Target scope: an icon with no `data-awsui-motion-target` anywhere in its ancestor chain
   * stays still even in an otherwise-armed region — the ActionCard gap this round closes. */
  test('does NOT reach an icon with no target marker anywhere in its ancestor chain', () => {
    const rules = genericFloorRules();
    for (const name of [...Object.keys(shippedMotion), ...notAnimated, ...unmappedIconNames]) {
      expect(svgIsReachedBy(name, rules, renderUnmarked)).toBe(false);
    }
  });
});

describe('icons deliberately not animated', () => {
  test.each(needsGeometryWork)('%s has no motion-* hooks in its SVG', name => {
    expect(render1(name).container.querySelector('svg [class*="motion-"]')).toBeNull();
  });

  test('notification IS classed, so only the map entry is withheld', () => {
    // The hooks are free and change no pixels; withholding the map entry is the design gate.
    const svg = render1('notification').container.querySelector('svg')!;
    expect(svg.querySelector('.motion-bell')).toBeTruthy();
    expect(svg.querySelector('.motion-ringer')).toBeTruthy();
  });

  test.each(notAnimated)('%s gets no BESPOKE motion (it keeps only the generic floor)', name => {
    // NOTE: a per-icon class is NOT a motion signal on its own — several icons have one
    // because they are in the RTL-mirror list in styles.scss. So this asserts the absence of a
    // hover RULE scoped to the icon, not the absence of the class.
    const localClass = styles[`name-${name}`];
    const scopedToIcon = localClass ? hoverRules().filter(r => r.selector.includes(localClass)) : [];
    expect(scopedToIcon).toEqual([]);
  });

  test.each(notAnimated)('%s is reached ONLY by the floor, never by part-level motion', name => {
    // Asserting the absence of any part-level selector is the real guarantee; asserting "no
    // motion at all" would be false, because the geometry-blind floor legitimately applies.
    const partRules = hoverRules().filter(r => /svg\[data-awsui-icon-animated\]\s+\./.test(r.selector));
    expect(svgIsReachedBy(name, partRules)).toBe(false);
    expect(svgIsReachedBy(name, genericFloorRules())).toBe(true);
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
// selectors therefore also require `data-awsui-icon-animated`, which the generator stamps onto
// the generated set. The attribute is a feature opt-in, not a claim of origin: it defaults to
// off, so these two ways a builder's own SVG keeps `.name-x` still animate nothing.
describe('builder-supplied SVGs are not animated', () => {
  const builderSvg = (
    <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <circle cx="8" cy="8" r="4" />
    </svg>
  );

  test('every generated icon opts in via data-awsui-icon-animated', () => {
    for (const name of [...Object.keys(shippedMotion), ...notAnimated, ...unmappedIconNames]) {
      expect(render1(name).container.querySelector('svg')).toHaveAttribute('data-awsui-icon-animated', 'true');
    }
  });

  test('Button with both iconName and iconSvg keeps name-* but renders a non-opted-in svg', () => {
    const { container } = render(<Button iconName="settings" iconSvg={builderSvg} ariaLabel="custom" />);

    const icon = container.querySelector(`.${styles['name-settings']}`);
    // The stale per-icon class is still there — exactly why it is not sufficient alone.
    expect(icon).toBeTruthy();

    const svg = icon!.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg).not.toHaveAttribute('data-awsui-icon-animated');
  });

  test('IconProvider override of a built-in name renders a non-opted-in svg', () => {
    const { container } = render(
      <IconProvider icons={{ settings: builderSvg }}>
        <Icon name="settings" />
      </IconProvider>
    );

    const icon = container.querySelector(`.${styles['name-settings']}`);
    expect(icon).toBeTruthy();

    const svg = icon!.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg).not.toHaveAttribute('data-awsui-icon-animated');
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

  test('the `svg` prop keeps the per-icon class but renders a non-opted-in svg', () => {
    const { container } = render(<Icon name="settings" svg={builderSvg} />);
    expect(container.firstElementChild).toHaveClass(styles['name-settings']);
    expect(container.querySelector('svg')).not.toHaveAttribute('data-awsui-icon-animated');
  });
});
