// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, waitFor } from '@testing-library/react';

import Alert from '../../../lib/components/alert/index.js';
import Button from '../../../lib/components/button/index.js';
import { metrics } from '../../../lib/components/internal/metrics.js';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api.js';
import { AlertFlashContentConfig } from '../../../lib/components/internal/plugins/controllers/alert-flash-content.js';
import awsuiPlugins from '../../../lib/components/internal/plugins/index.js';
import createWrapper from '../../../lib/components/test-utils/dom/index.js';
import { expectContent } from './runtime-content-utils.js';

import stylesCss from '../../../lib/components/alert/styles.css.js';

const pause = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

const defaultContent: AlertFlashContentConfig = {
  id: 'test-content',
  runReplacer(context, replacer) {
    replacer.replaceHeader(container => container.append('New header'));
    replacer.replaceContent(container => container.append('New content'));
    return {
      update: () => {},
      unmount: () => {},
    };
  },
};

let sendPanoramaMetricSpy: jest.SpyInstance;

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation();
  sendPanoramaMetricSpy = jest.spyOn(metrics, 'sendPanoramaMetric');
});

afterEach(() => {
  awsuiPluginsInternal.alertContent.clearRegisteredReplacer();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

test('renders replacement content initially', () => {
  awsuiPlugins.alertContent.registerContentReplacer(defaultContent);
  render(<Alert>Alert content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  expectContent(alertWrapper, stylesCss, {
    content: 'New content',
    contentReplaced: true,
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
  test('renders replacement header initially', () => {
    awsuiPlugins.alertContent.registerContentReplacer(defaultContent);
    render(<Alert header={existingHeader ? 'Header content' : undefined}>Alert content</Alert>);
    const alertWrapper = createWrapper().findAlert()!;
    expectContent(alertWrapper, stylesCss, {
      header: 'New header',
      headerReplaced: true,
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

test('restores content and header', async () => {
  const { rerender } = render(<Alert header="Alert header">Alert content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  expectContent(alertWrapper, stylesCss, {
    header: 'Alert header',
    headerReplaced: false,
    content: 'Alert content',
    contentReplaced: false,
  });

  awsuiPlugins.alertContent.registerContentReplacer({
    id: 'test-content',
    runReplacer(context, replacer) {
      const runUpdate = () => {
        if (context.headerRef.current?.textContent?.includes('Alert')) {
          replacer.replaceHeader(container => container.append('New header'));
          replacer.replaceContent(container => container.append('New content'));
        } else {
          replacer.restoreHeader();
          replacer.restoreContent();
        }
      };
      runUpdate();
      return {
        update: runUpdate,
        unmount: () => {},
      };
    },
  });
  await waitFor(() => {
    expectContent(alertWrapper, stylesCss, {
      header: 'New header',
      headerReplaced: true,
      content: 'New content',
      contentReplaced: true,
    });
  });

  rerender(<Alert header="Updated header">Alert content</Alert>);
  await waitFor(() => {
    expectContent(alertWrapper, stylesCss, {
      header: 'Updated header',
      headerReplaced: false,
      content: 'Alert content',
      contentReplaced: false,
    });
  });
});

test('removes styling if replacement is explicitly empty', () => {
  const plugin: AlertFlashContentConfig = {
    id: 'test-content',
    runReplacer(context, replacer) {
      replacer.hideHeader();
      replacer.hideContent();
      return {
        update: () => {},
        unmount: () => {},
      };
    },
  };
  awsuiPlugins.alertContent.registerContentReplacer(plugin);
  render(<Alert header="Initial header">Initial content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  expectContent(alertWrapper, stylesCss, {
    header: false,
    headerReplaced: true,
    content: false,
    contentReplaced: true,
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
  test('refs', () => {
    render(
      <Alert header="Alert header" action={<Button>Action button</Button>}>
        Alert content
      </Alert>
    );
    expect(runReplacer.mock.lastCall[0].headerRef.current).toHaveTextContent('Alert header');
    expect(runReplacer.mock.lastCall[0].contentRef.current).toHaveTextContent('Alert content');
  });
  test('type - default', () => {
    render(<Alert />);
    expect(runReplacer.mock.lastCall[0].type).toBe('info');
  });
  test('type - custom', () => {
    render(<Alert type="error" />);
    expect(runReplacer.mock.lastCall[0].type).toBe('error');
  });
});

test('calls unmount callback', () => {
  const unmountCallback = jest.fn();
  const plugin: AlertFlashContentConfig = {
    id: 'test-content',
    runReplacer(context, replacer) {
      replacer.replaceContent(container => container.append('New content'));
      return {
        update: () => {},
        unmount: unmountCallback,
      };
    },
  };
  awsuiPlugins.alertContent.registerContentReplacer(plugin);
  const { unmount } = render(<Alert>Alert content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  expectContent(alertWrapper, stylesCss, { content: 'New content', contentReplaced: true });
  expect(unmountCallback).not.toHaveBeenCalled();

  unmount();
  expect(unmountCallback).toHaveBeenCalled();
});

test('calls update callback', () => {
  const update = jest.fn();
  const plugin: AlertFlashContentConfig = {
    id: 'test-content',
    runReplacer: jest.fn(() => ({ update, unmount: () => {} })),
  };
  awsuiPlugins.alertContent.registerContentReplacer(plugin);
  const { rerender } = render(<Alert>Alert content</Alert>);
  expect(update).toHaveBeenCalledTimes(1);
  expect(plugin.runReplacer).toHaveBeenCalledTimes(1);

  rerender(<Alert>Alert new content</Alert>);
  expect(update).toHaveBeenCalledTimes(2);
  expect(plugin.runReplacer).toHaveBeenCalledTimes(1);
});

describe('asynchronous rendering', () => {
  test('allows asynchronous rendering of content', async () => {
    const asyncContent: AlertFlashContentConfig = {
      id: 'test-content-async',
      runReplacer(context, replacer) {
        (async () => {
          await pause(500);
          const content = document.createElement('div');
          content.append('New content');
          replacer.replaceContent(container => container.appendChild(content));
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
      runReplacer(context, replacer) {
        (async () => {
          await pause(500);
          replacer.hideHeader();
          replacer.restoreHeader();
          replacer.replaceHeader(headerFn);
          replacer.hideContent();
          replacer.restoreContent();
          replacer.replaceContent(contentFn);
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

    unmount();

    await waitFor(() => {
      const assertWarningLogged = (method: string) => {
        const message = `"${method}" called after component unmounted`;
        expect(consoleWarnSpy).toHaveBeenCalledWith('[AwsUi]', '[alert-content-replacer]', message);
        expect(sendPanoramaMetricSpy).toHaveBeenCalledWith({
          eventContext: 'awsui-runtime-api-warning',
          eventDetail: {
            component: 'alert-content-replacer',
            version: expect.any(String),
            message,
          },
        });
      };
      assertWarningLogged('hideHeader');
      assertWarningLogged('restoreHeader');
      assertWarningLogged('replaceHeader');
      assertWarningLogged('hideContent');
      assertWarningLogged('restoreContent');
      assertWarningLogged('replaceContent');
      expect(headerFn).not.toHaveBeenCalled();
      expect(contentFn).not.toHaveBeenCalled();
    });
  });
});

test('calls replacer when alert type changes', () => {
  const plugin: AlertFlashContentConfig = {
    id: 'plugin',
    runReplacer: (context, replacer) => {
      if (context.type === 'error') {
        replacer.replaceContent(container => (container.textContent = 'New error'));
      } else if (context.type === 'warning') {
        replacer.replaceContent(container => (container.textContent = 'New warning'));
      }
      return { update: () => {}, unmount: () => {} };
    },
  };
  awsuiPlugins.alertContent.registerContentReplacer(plugin);

  const { rerender } = render(<Alert type="error">Alert content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  expectContent(alertWrapper, stylesCss, { content: 'New error', contentReplaced: true });

  rerender(<Alert type="warning">Alert content</Alert>);
  expectContent(alertWrapper, stylesCss, { content: 'New warning', contentReplaced: true });
});

test('can only register a single provider', () => {
  const plugin1: AlertFlashContentConfig = {
    id: 'plugin-1',
    runReplacer: (context, replacer) => {
      replacer.replaceContent(container => container.append('Replacement 1'));
      return { update: () => {}, unmount: () => {} };
    },
  };
  const plugin2: AlertFlashContentConfig = {
    id: 'plugin-2',
    runReplacer: (context, replacer) => {
      replacer.replaceContent(container => container.append('Replacement 2'));
      return { update: () => {}, unmount: () => {} };
    },
  };

  awsuiPlugins.alertContent.registerContentReplacer(plugin1);
  awsuiPlugins.alertContent.registerContentReplacer(plugin2);

  expect(console.warn).toHaveBeenCalledWith(
    '[AwsUi]',
    '[alert-flash-content]',
    expect.stringContaining(
      'Cannot call `registerContentReplacer` with new provider: provider with id "plugin-1" already registered.'
    )
  );
  expect(sendPanoramaMetricSpy).toHaveBeenCalledWith({
    eventContext: 'awsui-runtime-api-warning',
    eventDetail: {
      component: 'alert-flash-content',
      version: expect.any(String),
      message: expect.stringContaining(
        'Cannot call `registerContentReplacer` with new provider: provider with id "plugin-1" already registered.'
      ),
    },
  });

  render(<Alert>Alert content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  expectContent(alertWrapper, stylesCss, {
    content: 'Replacement 1',
    contentReplaced: true,
  });
});
