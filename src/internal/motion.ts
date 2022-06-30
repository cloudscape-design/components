// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { findUpUntil } from './utils/dom';

export const isMotionDisabled = (element: HTMLElement): boolean =>
  !!findUpUntil(element, node => node.classList.contains('awsui-motion-disabled')) ||
  (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')?.matches);
