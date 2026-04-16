// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface StyleAPI {
  variables: readonly StyleAPIVariable[];
  selectors: readonly StyleAPISelector[];
}

export interface StyleAPIVariable {
  name: string;
  description?: string;
}

export interface StyleAPISelector {
  className: string;
  tags?: string[];
  description?: string;
  attributes?: readonly StyleAPIAttribute[];
}

export interface StyleAPIAttribute {
  name: string;
  description?: string;
}
