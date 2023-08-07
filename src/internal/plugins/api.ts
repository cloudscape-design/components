// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DrawerConfig, DrawersController, DrawersRegistrationListener } from './drawers-controller';
import { ActionButtonsController, ActionConfig, ActionRegistrationListener } from './action-buttons-controller';
import { FooterConfig, FooterController, FooterRegistrationListener } from './footer-controller';

const storageKey = Symbol.for('awsui-plugin-api');

interface AwsuiPluginApiPublic {
  appLayout: {
    registerDrawer(config: DrawerConfig): void;
    registerFooter(config: FooterConfig): void;
  };
  alert: {
    registerAction(config: ActionConfig): void;
  };
  flashbar: {
    registerAction(config: ActionConfig): void;
  };
}
interface AwsuiPluginApiInternal {
  appLayout: {
    clearRegisteredDrawers(): void;
    onDrawersRegistered(listener: DrawersRegistrationListener): () => void;
    onFooterRegistered(listener: FooterRegistrationListener): void;
  };
  alert: {
    onActionRegistered(listener: ActionRegistrationListener): void;
  };
  flashbar: {
    onActionRegistered(listener: ActionRegistrationListener): void;
  };
}

interface AwsuiApi {
  awsuiPlugins: AwsuiPluginApiPublic;
  awsuiPluginsInternal: AwsuiPluginApiInternal;
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

function loadApi() {
  if (typeof window === 'undefined') {
    return createApi();
  }
  const win = window as unknown as WindowWithApi;
  const api = findUpApi(win);
  if (api) {
    return api;
  }
  win[storageKey] = createApi();
  return win[storageKey];
}

export const { awsuiPlugins, awsuiPluginsInternal } = loadApi();

function createApi(): AwsuiApi {
  const appLayoutDrawers = new DrawersController();
  const alertActions = new ActionButtonsController();
  const flashbarActions = new ActionButtonsController();
  const appLayoutFooter = new FooterController();

  return {
    awsuiPlugins: {
      appLayout: {
        registerDrawer: appLayoutDrawers.registerDrawer,
        registerFooter: appLayoutFooter.registerFooter,
      },
      alert: {
        registerAction: alertActions.registerAction,
      },
      flashbar: {
        registerAction: flashbarActions.registerAction,
      },
    },
    awsuiPluginsInternal: {
      appLayout: {
        clearRegisteredDrawers: appLayoutDrawers.clearRegisteredDrawers,
        onDrawersRegistered: appLayoutDrawers.onDrawersRegistered,
        onFooterRegistered: appLayoutFooter.onFooterRegistered,
      },
      alert: {
        onActionRegistered: alertActions.onActionRegistered,
      },
      flashbar: {
        onActionRegistered: flashbarActions.onActionRegistered,
      },
    },
  };
}
