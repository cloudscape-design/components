// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type SelectorsMapping = readonly { selector: string; tokens: readonly TokenMetadata[] }[];

export interface TokenMetadata {
  section: string;
  name: string;
  cssName: string;
  themeable: boolean;
  description?: string;
  descriptionVR?: string;
  components: string[];
}
