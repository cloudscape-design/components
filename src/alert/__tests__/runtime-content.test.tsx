// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, waitFor } from '@testing-library/react';

import Alert from '../../../lib/components/alert';
import Button from '../../../lib/components/button';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { AlertFlashContentConfig } from '../../../lib/components/internal/plugins/controllers/alert-flash-content';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectContent } from './runtime-content-utils';

import stylesCss from '../../../lib/components/alert/styles.css.js';

const pause = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

const defaultContent: AlertFlashContentConfig = {
  id: 'test-content',
  runReplacer(context, registerReplacement) {
    registerReplacement('header', container => {
      container.append('New header');
    });
    registerReplacement('content', container => {
      container.append('New content');
    });
    return {
      update: () => {},
      unmount: () => {},
    };
  },
};

afterEach(() => {
  awsuiPluginsInternal.alertContent.clearRegisteredReplacer();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

test('renders replacement content initially', async () => {
  awsuiPlugins.alertContent.registerContentReplacer(defaultContent);
  render(<Alert>Alert content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  await waitFor(() => {
    expectContent(alertWrapper, stylesCss, {
      content: 'New content',
      contentReplaced: true,
    });
  });
});

test('renders replacement content when asynchronously registered', async () => {
  render(<Alert>Alert content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  expectContent(alertWrapper, stylesCss, {
    content: 'Alert content',
    contentReplaced: false,
  });

  awsuiPlugins.alertContent.registerContentReplacer(defaultContent);
  await waitFor(() => {
    expectContent(alertWrapper, stylesCss, {
      content: 'New content',
      contentReplaced: true,
    });
  });
});

describe.each([true, false])('existing header:%p', existingHeader => {
  test('renders replacement header initially', async () => {
    awsuiPlugins.alertContent.registerContentReplacer(defaultContent);
    render(<Alert header={existingHeader ? 'Header content' : undefined}>Alert content</Alert>);
    const alertWrapper = createWrapper().findAlert()!;
    await waitFor(() => {
      expectContent(alertWrapper, stylesCss, {
        header: 'New header',
        headerReplaced: true,
      });
    });
  });

  test('renders replacement header when asynchronously registered', async () => {
    render(<Alert header={existingHeader ? 'Header content' : undefined}>Alert content</Alert>);
    const alertWrapper = createWrapper().findAlert()!;
    expectContent(alertWrapper, stylesCss, {
      header: existingHeader ? 'Header content' : undefined,
      headerReplaced: false,
    });

    awsuiPlugins.alertContent.registerContentReplacer(defaultContent);
    await waitFor(() => {
      expectContent(alertWrapper, stylesCss, {
        header: 'New header',
        headerReplaced: true,
      });
    });
  });
});

test('removes header styling if replacement header is explicitly empty', async () => {
  const plugin: AlertFlashContentConfig = {
    id: 'test-content',
    runReplacer(context, registerReplacement) {
      registerReplacement('header', 'remove');
      return {
        update: () => {},
        unmount: () => {},
      };
    },
  };
  awsuiPlugins.alertContent.registerContentReplacer(plugin);
  render(<Alert header="Initial header content" />);
  const alertWrapper = createWrapper().findAlert()!;
  await waitFor(() => {
    expectContent(alertWrapper, stylesCss, {
      header: false,
      headerReplaced: true,
    });
  });
});

describe('runReplacer arguments', () => {
  const runReplacer = jest.fn();
  beforeEach(() => {
    const plugin: AlertFlashContentConfig = {
      id: 'test-content',
      runReplacer,
    };
    awsuiPlugins.alertContent.registerContentReplacer(plugin);
  });
  test('refs', async () => {
    render(
      <Alert header="Alert header" action={<Button>Action button</Button>}>
        Alert content
      </Alert>
    );
    await waitFor(() => {
      expect(runReplacer.mock.lastCall[0].headerRef.current).toHaveTextContent('Alert header');
      expect(runReplacer.mock.lastCall[0].contentRef.current).toHaveTextContent('Alert content');
      expect(runReplacer.mock.lastCall[0].actionsRef.current).toHaveTextContent('Action button');
    });
  });
  test('type - default', async () => {
    render(<Alert />);
    await waitFor(() => {
      expect(runReplacer.mock.lastCall[0].type).toBe('info');
    });
  });
  test('type - custom', async () => {
    render(<Alert type="error" />);
    await waitFor(() => {
      expect(runReplacer.mock.lastCall[0].type).toBe('error');
    });
  });
});

test('calls unmount callback', async () => {
  const unmountCallback = jest.fn();
  const plugin: AlertFlashContentConfig = {
    id: 'test-content',
    runReplacer(context, registerReplacement) {
      registerReplacement('content', container => container.append('New content'));
      return {
        update: () => {},
        unmount: unmountCallback,
      };
    },
  };
  awsuiPlugins.alertContent.registerContentReplacer(plugin);
  const { unmount } = render(<Alert>Alert content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  await waitFor(() => {
    expectContent(alertWrapper, stylesCss, { content: 'New content', contentReplaced: true });
    expect(unmountCallback).not.toBeCalled();
  });

  unmount();
  expect(unmountCallback).toBeCalled();
});

test('calls update callback', async () => {
  const callback = jest.fn();
  const plugin: AlertFlashContentConfig = {
    id: 'test-content',
    runReplacer: jest.fn(() => {
      return {
        update: callback,
        unmount: () => {},
      };
    }),
  };
  awsuiPlugins.alertContent.registerContentReplacer(plugin);
  const { rerender } = render(<Alert>Alert content</Alert>);
  await waitFor(() => {
    expect(callback).toBeCalledTimes(0);
    expect(plugin.runReplacer).toBeCalledTimes(1);
  });
  rerender(<Alert>Alert new content</Alert>);
  expect(callback).toBeCalledTimes(1);
  expect(plugin.runReplacer).toBeCalledTimes(1);
});

describe('asynchronous rendering', () => {
  test('allows asynchronous rendering of content', async () => {
    const asyncContent: AlertFlashContentConfig = {
      id: 'test-content-async',
      runReplacer(context, registerReplacement) {
        (async () => {
          await pause(500);
          const content = document.createElement('div');
          content.append('New content');
          registerReplacement('content', container => {
            container.appendChild(content);
          });
        })();
        return {
          update: () => {},
          unmount: () => {},
        };
      },
    };
    awsuiPlugins.alertContent.registerContentReplacer(asyncContent);
    render(<Alert>Alert content</Alert>);
    const alertWrapper = createWrapper().findAlert()!;
    expectContent(alertWrapper, stylesCss, {
      content: 'Alert content',
      contentReplaced: false,
    });

    await waitFor(() => {
      expectContent(alertWrapper, stylesCss, {
        content: 'New content',
        contentReplaced: true,
      });
    });
  });

  test('warns if registerReplacement called after unmounting', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const headerFn = jest.fn();
    const contentFn = jest.fn();
    const asyncContent: AlertFlashContentConfig = {
      id: 'test-content-async',
      runReplacer(context, registerReplacement) {
        (async () => {
          await pause(500);
          registerReplacement('header', headerFn);
          registerReplacement('content', contentFn);
        })();
        return {
          update: () => {},
          unmount: () => {},
        };
      },
    };
    awsuiPlugins.alertContent.registerContentReplacer(asyncContent);
    const { unmount } = render(<Alert>Alert content</Alert>);
    const alertWrapper = createWrapper().findAlert()!;
    expectContent(alertWrapper, stylesCss, {
      content: 'Alert content',
      contentReplaced: false,
    });

    // Lets runReplacer fire but unmounts before replacement header/content are registered.
    await pause(0);
    unmount();

    await waitFor(() => {
      expect(consoleWarnSpy).toBeCalledWith(
        '[AwsUi] [Runtime alert/flash content] `registerReplacement` (header) called after component unmounted'
      );
      expect(consoleWarnSpy).toBeCalledWith(
        '[AwsUi] [Runtime alert/flash content] `registerReplacement` (content) called after component unmounted'
      );
      expect(headerFn).not.toBeCalled();
      expect(contentFn).not.toBeCalled();
    });
  });
});
