// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

/**
 * DEV-PAGES-ONLY DEMO ASSETS. Not component source, not shipped, not imported by src/.
 *
 * These are the SEGMENTED SVGs from the Cloud Dynamics Protozoa prototype
 * (951833bf-7a5a-4e5b-9f28-843b8f70f8a8), with the prototype's part class names renamed
 * onto the canonical `motion-*` scheme so they run through the real production CSS in
 * `src/icon/motion.scss` unchanged.
 *
 * Why they exist: Cloudscape's shipped icons are UNSEGMENTED. SVGO merges same-class
 * sibling paths into a single `<path>`, so `notification` is one path, `bug` is one
 * path, and so on. A whole-icon transform is all an unsegmented path can do, which
 * cannot express a bell body rotating independently of its clapper or six legs
 * alternating. Shipping these motions for real would require RE-CUTTING each icon's
 * paths — see `$icon-motion-part-level` in src/icon/motion.scss. That is out of P0
 * scope, and unlike the CSS it cannot be theme-gated: the generated icons module is
 * theme-agnostic and copied identically into every artefact.
 *
 * The 7 motions that need no re-cut are in `$icon-motion` and are demonstrated on
 * Cloudscape's real built-in icons instead.
 */
const demoIcons: Record<string, JSX.Element> = {
  notification: (
    <svg className="awsui-icon" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path
        d="M14 12H2c-.39 0-.63-.44-.41-.76L4 8V5c0-2.21 1.79-4 4-4s4 1.79 4 4v3l2.41 3.24c.22.33-.02.76-.41.76Z"
        className="motion-bell"
      />
      <path d="M6 12.25c0 1.1.9 2 2 2s2-.9 2-2" className="motion-ringer" />
    </svg>
  ),
  external: (
    <svg className="awsui-icon" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path d="M3 5.012v8h8.01" />
      <path d="M13 9.012v-6H7M13.02 3 7 9.01" className="motion-arrow" />
    </svg>
  ),
  upload: (
    <svg className="awsui-icon" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path d="M1 1h14" />
      <path d="M13 10 8 5l-5 5M8 5v10" className="motion-arrow" />
    </svg>
  ),
  download: (
    <svg className="awsui-icon" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path d="M1 15h14" />
      <path d="M13 6l-5 5-5-5M8 11V1" className="motion-arrow" />
    </svg>
  ),
  shrink: (
    <svg className="awsui-icon" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path d="M10 1v5h5M10 6 15 1" className="motion-corner-tr" />
      <path d="M1 10h5v5M6 10 1 15" className="motion-corner-bl" />
    </svg>
  ),
  expand: (
    <svg className="awsui-icon" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path d="M14 7V2H9M10 6l4-4" className="motion-corner-tr" />
      <path d="M6.99 14H2V9M6 10l-4 4" className="motion-corner-bl" />
      <path d="M9 14h5V9M10 10l4 4" className="motion-corner-br" />
      <path d="M2 6.99V2h5M6 6 2 2" className="motion-corner-tl" />
    </svg>
  ),
  'status-warning': (
    <svg className="awsui-icon" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path d="M6.52 1.88l-5.33 9.76c-.13.23-.19.5-.19.76 0 .88.71 1.59 1.59 1.59H13.4c.88 0 1.59-.71 1.59-1.59 0-.27-.07-.53-.19-.76L9.48 1.88C9.18 1.34 8.62 1 8 1s-1.18.34-1.48.88Z" />
      <path d="M8 5v4M8 10v2" className="motion-exclamation" />
    </svg>
  ),
  bug: (
    <svg className="awsui-icon" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path d="M12 5.71a4 4 0 0 0-8 0v4a4 4 0 1 0 8 0v-4ZM12 6H4" />
      <path d="M15 8.71h-3" className="motion-leg-mr" />
      <path d="M4 8.71H1" className="motion-leg-ml" />
      <path d="M15 3.63l-3 2.08" className="motion-leg-tr" />
      <path d="M1 3.63l3 2.08" className="motion-leg-tl" />
      <path d="M15 13.78l-3-2.07" className="motion-leg-br" />
      <path d="M1 13.78l3-2.07" className="motion-leg-bl" />
    </svg>
  ),
  unlocked: (
    <svg className="awsui-icon" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path d="M11 7H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" />
      <path d="M9 7V4c0-1.65 1.35-3 3-3s3 1.35 3 3" className="motion-shackle" />
    </svg>
  ),
};

export const partLevelDemoIconNames = Object.keys(demoIcons);

export default demoIcons;
