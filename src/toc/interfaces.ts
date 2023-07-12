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
}

export namespace TocProps {
  /**
   * Anchor with the id.
   */ export interface Anchor {
    text: string;
    id: string;
    level: number;
    isActive?: boolean;
  }
}
