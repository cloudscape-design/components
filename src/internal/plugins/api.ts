// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DrawersApiInternal, DrawersApiPublic, DrawersController } from './controllers/drawers';
import { ActionsApiInternal, ActionsApiPublic, ActionButtonsController } from './controllers/action-buttons';

const storageKey = Symbol.for('awsui-plugin-api');

interface AwsuiApi {
  awsuiPlugins: {
    appLayout: DrawersApiPublic;
    alert: ActionsApiPublic;
    flashbar: ActionsApiPublic;
  };
  awsuiPluginsInternal: {
    appLayout: DrawersApiInternal;
    alert: ActionsApiInternal;
    flashbar: ActionsApiInternal;
  };
}

interface WindowWithApi extends Window {
  [storageKey]: AwsuiApi;
}

function findUpApi(currentWindow: WindowWithApi): AwsuiApi | undefined {
  try {
    if (currentWindow?.[storageKey]) {
      return currentWindow[storageKey];
    }

    if (!currentWindow || currentWindow.parent === currentWindow) {
      // When the window has no more parents, it references itself
      return undefined;
    }

    return findUpApi(currentWindow.parent as WindowWithApi);
  } catch (ex) {
    // Most likely a cross-origin access error
    return undefined;
  }
}

export function loadApi() {
  if (typeof window === 'undefined') {
    return installApi({});
  }
  const win = window as unknown as WindowWithApi;
  const existingApi = findUpApi(win);
  win[storageKey] = installApi(existingApi ?? {});
  return win[storageKey];
}

export const { awsuiPlugins, awsuiPluginsInternal } = loadApi();

type DeepPartial<T> = T extends (...args: any) => any ? T : { [P in keyof T]?: DeepPartial<T[P]> };

function installApi(api: DeepPartial<AwsuiApi>): AwsuiApi {
  api.awsuiPlugins ??= {};
  api.awsuiPluginsInternal ??= {};

  const appLayoutDrawers = new DrawersController();
  api.awsuiPlugins.appLayout = appLayoutDrawers.installPublic(api.awsuiPlugins.appLayout);
  api.awsuiPluginsInternal.appLayout = appLayoutDrawers.installInternal(api.awsuiPluginsInternal.appLayout);

  const alertActions = new ActionButtonsController();
  api.awsuiPlugins.alert = alertActions.installPublic(api.awsuiPlugins.alert);
  api.awsuiPluginsInternal.alert = alertActions.installInternal(api.awsuiPluginsInternal.alert);

  const flashbarActions = new ActionButtonsController();
  api.awsuiPlugins.flashbar = flashbarActions.installPublic(api.awsuiPlugins.flashbar);
  api.awsuiPluginsInternal.flashbar = flashbarActions.installInternal(api.awsuiPluginsInternal.flashbar);

  return api as AwsuiApi;
}
