// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ActionCard from '../../../lib/components/action-card';
import Icon from '../../../lib/components/icon';
import Link from '../../../lib/components/link';

/**
 * ActionCard is why `data-awsui-motion-trigger` carries independent `hover`/`focus` tokens
 * rather than a single presence flag: `.root` (hover) and `.header-button`/`.overlay-button`
 * (focus) are different elements, because `:focus-visible` doesn't bubble like `:hover` does.
 *
 * That depends on a DOM invariant: the element carrying the `hover` token must CONTAIN both
 * the target icon and whichever element carries the `focus` token, or `_on-hover-trigger`'s
 * `:has(...)` branch could never see it. This file pins that invariant against the REAL
 * rendered component.
 */

/** True if `element`'s `data-awsui-motion-trigger` value carries `token` (the `~=` semantics, in JS). */
function hasTriggerToken(element: Element, token: string): boolean {
  const value = element.getAttribute('data-awsui-motion-trigger');
  return value !== null && value.split(/\s+/).includes(token);
}

function findByTriggerToken(root: Element, token: string): Element | null {
  if (hasTriggerToken(root, token)) {
    return root;
  }
  return (
    Array.from(root.querySelectorAll('[data-awsui-motion-trigger]')).find(el => hasTriggerToken(el, token)) ?? null
  );
}

function assertInvariant(container: HTMLElement) {
  const hoverTrigger = findByTriggerToken(container.firstElementChild!, 'hover');
  const focusTrigger = findByTriggerToken(container.firstElementChild!, 'focus');
  const target = container.querySelector('[data-awsui-motion-target]');

  expect(hoverTrigger).not.toBeNull();
  expect(focusTrigger).not.toBeNull();
  expect(target).not.toBeNull();

  // Node.contains includes the element itself, so the focus/target elements need not be
  // proper descendants.
  expect(hoverTrigger!.contains(focusTrigger!)).toBe(true);
  expect(hoverTrigger!.contains(target!)).toBe(true);
}

describe('ActionCard: the hover-trigger element contains both the target icon and the focus trigger', () => {
  test('default configuration: header + icon + a real Link inside children', () => {
    const { container } = render(
      <ActionCard header="Card header" icon={<Icon name="heart" />}>
        <Link href="#">A link inside the card body</Link>
      </ActionCard>
    );
    assertInvariant(container);
  });

  test('no header: the standalone overlay button is the focus owner', () => {
    const { container } = render(
      <ActionCard ariaLabel="Card" icon={<Icon name="heart" />}>
        <Link href="#">A link inside the card body</Link>
      </ActionCard>
    );
    assertInvariant(container);
  });

  test('icon vertically centred (not in the header row): still holds', () => {
    const { container } = render(
      <ActionCard header="Card header" icon={<Icon name="heart" />} iconVerticalAlignment="center">
        <Link href="#">A link inside the card body</Link>
      </ActionCard>
    );
    assertInvariant(container);
  });

  test('the focus trigger and the target are DIFFERENT elements (not incidentally the same node)', () => {
    const { container } = render(
      <ActionCard header="Card header" icon={<Icon name="heart" />}>
        content
      </ActionCard>
    );
    const focusTrigger = findByTriggerToken(container.firstElementChild!, 'focus')!;
    const target = container.querySelector('[data-awsui-motion-target]')!;
    expect(focusTrigger).not.toBe(target);
  });
});
