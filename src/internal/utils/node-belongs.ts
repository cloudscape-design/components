// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { containsOrEqual, findUpUntil } from './dom';

export function nodeBelongs(container: Node | null, target: Node): boolean {
  const portal =
    target instanceof HTMLElement &&
    findUpUntil(target, node => node instanceof HTMLElement && !!node.dataset.awsuiReferrerId);
  const referrer = portal instanceof HTMLElement ? document.getElementById(portal.dataset.awsuiReferrerId ?? '') : null;
  return referrer ? containsOrEqual(container, referrer) : containsOrEqual(container, target);
}
