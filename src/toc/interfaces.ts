// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface TocProps {
  /**
   * Specify the TOC title, displayed above the items.
   */
  title?: string;

  /**
   * List of anchors
   *
   * */
  anchors: TocProps.Anchor[];

  /**
   *
   * */
  variant?: 'default' | 'expandable';

  /**
   * Disable scroll spy
   * */
  disableScrollSpy?: boolean;
}

export namespace TocProps {
  /**
   * Anchor with the id.
   */ export interface Anchor {
    text: string;
    href: string;
    level: number;
  }
}
