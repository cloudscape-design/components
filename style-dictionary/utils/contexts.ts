// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { GlobalValue, ModeValue, TokenCategory } from '@cloudscape-design/theming-build';

export const createTopNavigationContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'top-navigation',
    selector: '.awsui-context-top-navigation',
    tokens,
  };
};

export const createHeaderContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'header',
    selector: '.awsui-context-content-header',
    tokens,
  };
};

export const createFlashbarContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'flashbar',
    selector: '.awsui-context-flashbar',
    tokens,
  };
};
