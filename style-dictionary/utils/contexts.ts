// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { GlobalValue, ModeValue, TokenCategory } from '@cloudscape-design/theming-build';

export const createTopNavigationContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'top-navigation',
    selector: '.awsui-context-top-navigation',
    tokens,
    defaultMode: 'dark',
  };
};

export const createCompactTableContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'compact-table',
    selector: '.awsui-context-compact-table',
    tokens,
  };
};

export const createHeaderContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'header',
    selector: '.awsui-context-content-header',
    tokens,
    defaultMode: 'dark',
  };
};

export const createFlashbarContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'flashbar',
    selector: '.awsui-context-flashbar',
    tokens,
  };
};

export const createFlashbarWarningContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'flashbar-warning',
    selector: '.awsui-context-flashbar-warning',
    tokens,
  };
};

export const createAlertContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'alert',
    selector: '.awsui-context-alert',
    tokens,
  };
};

export const createHeaderAlertContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'alert-header',
    selector: '.awsui-context-content-header .awsui-context-alert',
    tokens,
  };
};

export const createAppLayoutToolsDrawerTriggerContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'app-layout-tools-drawer-trigger',
    selector: '.awsui-context-app-layout-tools-drawer-trigger',
    tokens,
  };
};

export const createAppLayoutToolbarContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'app-layout-toolbar',
    selector: '.awsui-context-app-layout-toolbar',
    tokens,
  };
};

export const createChatComponentsContext = (tokens: TokenCategory<string, GlobalValue | ModeValue>) => {
  return {
    id: 'chat-components',
    selector: '.awsui-context-chat-components',
    tokens,
  };
};
