// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ActionCard from '../../../../../lib/components/action-card';
import Icon from '../../../../../lib/components/icon';
import { ExpandToggleButton } from '../../../../../lib/components/internal/components/expand-toggle-button';

import {
  hoverRules,
  splitAtTrigger,
  splitSelectorList,
  stripSpecificityHack,
} from '../../../../icon/__tests__/motion-css';

/**
 * Pins the "mark the position, not just the default" rule for `ExpandToggleButton`'s
 * `customIcon`: a consumer re-skinning the toggle affordance with a real Cloudscape `Icon`
 * inherits the target marker from the wrapping `<span data-awsui-motion-target>`, so it
 * reaches the generic hover floor exactly like the default caret does. Paired with the
 * unchanged negative from ActionCard's own slots, to prove "position the component defines"
 * vs. "arbitrary slot content" is actually enforced, not just documented.
 */

/** Every floor rule (no per-icon `.name-X`), reduced to its icon-side matchable tail. */
function floorTails(): string[] {
  const tails = new Set<string>();
  for (const rule of hoverRules()) {
    if (/name-/.test(rule.selector) || !/\bsvg\[data-awsui-icon-animated\]/.test(rule.selector)) {
      continue;
    }
    for (const selector of splitSelectorList(rule.selector)) {
      const tail = splitAtTrigger(selector)?.tail;
      if (tail) {
        tails.add(stripSpecificityHack(tail).trim());
      }
    }
  }
  return Array.from(tails);
}

const reachesFloor = (svg: Element) => floorTails().some(tail => svg.matches(tail));

describe('ExpandToggleButton: customIcon inherits the target marker from its wrapping position', () => {
  test('the DEFAULT caret reaches the generic floor (baseline)', () => {
    const { container } = render(<ExpandToggleButton onExpandableItemToggle={() => {}} />);
    const svg = container.querySelector('svg')!;
    expect(reachesFloor(svg)).toBe(true);
  });

  test('a consumer-supplied Cloudscape Icon passed as customIcon ALSO reaches the generic floor', () => {
    const { container } = render(
      <ExpandToggleButton onExpandableItemToggle={() => {}} customIcon={<Icon name="settings" />} />
    );
    const svg = container.querySelector('svg')!;
    expect(reachesFloor(svg)).toBe(true);
  });

  test('a raw builder <svg> passed as customIcon still does NOT animate — it has no data-awsui-icon-animated', () => {
    const { container } = render(
      <ExpandToggleButton
        onExpandableItemToggle={() => {}}
        customIcon={
          <svg viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="4" />
          </svg>
        }
      />
    );
    const svg = container.querySelector('svg')!;
    expect(svg.hasAttribute('data-awsui-icon-animated')).toBe(false);
    expect(reachesFloor(svg)).toBe(false);
  });
});

describe('unchanged: ActionCard slot content still does not reach the floor', () => {
  test("a Cloudscape Icon inside ActionCard's children (a slot, not a position the component defines) does not reach the floor", () => {
    const { container } = render(
      <ActionCard header="Card header">
        <Icon name="settings" />
      </ActionCard>
    );
    const bodySvg = container.querySelector('svg')!;
    expect(reachesFloor(bodySvg)).toBe(false);
  });

  test("the card's OWN icon slot still reaches the floor, for contrast", () => {
    const { container } = render(<ActionCard header="Card header" icon={<Icon name="settings" />} />);
    const iconWrapper = container.querySelector('[data-awsui-motion-target]')!;
    const svg = iconWrapper.querySelector('svg')!;
    expect(reachesFloor(svg)).toBe(true);
  });
});
