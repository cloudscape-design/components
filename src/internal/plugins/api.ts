// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BreadcrumbGroupProps } from '../../breadcrumb-group/interfaces';
import { ActionButtonsController, ActionsApiInternal, ActionsApiPublic } from './controllers/action-buttons';
import {
  AlertFlashContentApiInternal,
  AlertFlashContentApiPublic,
  AlertFlashContentController,
} from './controllers/alert-flash-content';
import { AppLayoutWidgetApiInternal, AppLayoutWidgetController } from './controllers/app-layout-widget';
import { BreadcrumbsApiInternal, BreadcrumbsController } from './controllers/breadcrumbs';
import { DrawersApiInternal, DrawersApiPublic, DrawersController } from './controllers/drawers';
import { DrawersController as DrawersControllerWidgetized } from './controllers/drawers-widget';
import { SharedReactContexts, SharedReactContextsApiInternal } from './controllers/shared-react-contexts';
import { reportRuntimeApiLoadMetric } from './helpers/metrics';

const storageKey = Symbol.for('awsui-plugin-api');
const storageKeyWidgetized = Symbol.for('awsui-plugin-api-widgetized');

interface AwsuiApi {
  awsuiPlugins: {
    appLayout: DrawersApiPublic;
    alert: ActionsApiPublic;
    alertContent: AlertFlashContentApiPublic;
    flashbar: ActionsApiPublic;
    flashContent: AlertFlashContentApiPublic;
  };
  awsuiPluginsInternal: {
    appLayout: DrawersApiInternal;
    appLayoutWidget: AppLayoutWidgetApiInternal;
    alert: ActionsApiInternal;
    alertContent: AlertFlashContentApiInternal;
    flashbar: ActionsApiInternal;
    flashContent: AlertFlashContentApiInternal;
    breadcrumbs: BreadcrumbsApiInternal<BreadcrumbGroupProps>;
    sharedReactContexts: SharedReactContextsApiInternal;
  };
}

interface AwsuiApiWidgetized {
  awsuiPluginsWidgetized: Partial<AwsuiApi['awsuiPlugins']>;
  awsuiPluginsInternalWidgetized: Partial<AwsuiApi['awsuiPluginsInternal']>;
}

interface WindowWithApi extends Window {
  [storageKey]: AwsuiApi;
  [storageKeyWidgetized]: Partial<AwsuiApiWidgetized>;
}

function findUpApi<T>(currentWindow: WindowWithApi, storageKey: keyof WindowWithApi): T | undefined {
  try {
    if (currentWindow?.[storageKey]) {
      return currentWindow[storageKey];
    }

    if (!currentWindow || currentWindow.parent === currentWindow) {
      // When the window has no more parents, it references itself
      return undefined;
    }

    return findUpApi(currentWindow.parent as WindowWithApi, storageKey);

    // Consumers in the past have not always been able to support not specifiying the value so we keep and ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (ex) {
    // Most likely a cross-origin access error
    return undefined;
  }
}

export function loadApi(): AwsuiApi & Partial<AwsuiApiWidgetized> {
  if (typeof window === 'undefined') {
    return { ...installApi({}), ...installApiWidgetized({}) };
  }
  const win = window as unknown as WindowWithApi;
  const existingApi = findUpApi<AwsuiApi>(win, storageKey);
  const existingApiWidgetized = findUpApi<AwsuiApiWidgetized>(win, storageKeyWidgetized);
  if (!existingApi || !existingApiWidgetized) {
    reportRuntimeApiLoadMetric();
  }
  win[storageKey] = installApi(existingApi ?? {});
  win[storageKeyWidgetized] = installApiWidgetized(existingApiWidgetized ?? {});
  return { ...win[storageKey], ...win[storageKeyWidgetized] };
}

export const { awsuiPlugins, awsuiPluginsInternal, awsuiPluginsWidgetized, awsuiPluginsInternalWidgetized } = loadApi();

type DeepPartial<T> = T extends (...args: any) => any ? T : { [P in keyof T]?: DeepPartial<T[P]> };

function installApi(api: DeepPartial<AwsuiApi>): AwsuiApi {
  api.awsuiPlugins ??= {};
  api.awsuiPluginsInternal ??= {};

  const appLayoutDrawers = new DrawersController();
  api.awsuiPlugins.appLayout = appLayoutDrawers.installPublic(api.awsuiPlugins.appLayout);
  api.awsuiPluginsInternal.appLayout = appLayoutDrawers.installInternal(api.awsuiPluginsInternal.appLayout);

  const appLayoutController = new AppLayoutWidgetController();
  api.awsuiPluginsInternal.appLayoutWidget = appLayoutController.installInternal(
    api.awsuiPluginsInternal.appLayoutWidget
  );

  const alertActions = new ActionButtonsController();
  api.awsuiPlugins.alert = alertActions.installPublic(api.awsuiPlugins.alert);
  api.awsuiPluginsInternal.alert = alertActions.installInternal(api.awsuiPluginsInternal.alert);

  const alertContent = new AlertFlashContentController();
  api.awsuiPlugins.alertContent = alertContent.installPublic(api.awsuiPlugins.alertContent);
  api.awsuiPluginsInternal.alertContent = alertContent.installInternal(api.awsuiPluginsInternal.alertContent);

  const flashContent = new AlertFlashContentController();
  api.awsuiPlugins.flashContent = flashContent.installPublic(api.awsuiPlugins.flashContent);
  api.awsuiPluginsInternal.flashContent = flashContent.installInternal(api.awsuiPluginsInternal.flashContent);

  const flashbarActions = new ActionButtonsController();
  api.awsuiPlugins.flashbar = flashbarActions.installPublic(api.awsuiPlugins.flashbar);
  api.awsuiPluginsInternal.flashbar = flashbarActions.installInternal(api.awsuiPluginsInternal.flashbar);

  const breadcrumbs = new BreadcrumbsController<BreadcrumbGroupProps>();
  api.awsuiPluginsInternal.breadcrumbs = breadcrumbs.installInternal(api.awsuiPluginsInternal.breadcrumbs);

  const sharedReactContexts = new SharedReactContexts();
  api.awsuiPluginsInternal.sharedReactContexts = sharedReactContexts.installInternal(
    api.awsuiPluginsInternal.sharedReactContexts
  );

  return api as AwsuiApi;
}

function installApiWidgetized(api: DeepPartial<AwsuiApiWidgetized>): AwsuiApiWidgetized {
  api.awsuiPluginsWidgetized ??= {};
  api.awsuiPluginsInternalWidgetized ??= {};

  const appLayoutDrawers = new DrawersControllerWidgetized();
  api.awsuiPluginsWidgetized.appLayout = appLayoutDrawers.installPublic(api.awsuiPluginsWidgetized.appLayout);
  api.awsuiPluginsInternalWidgetized.appLayout = appLayoutDrawers.installInternal(
    api.awsuiPluginsInternalWidgetized.appLayout
  );

  return api as AwsuiApiWidgetized;
}
