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
  runReplacer(context, replacer) {
    replacer.replaceHeader(container => container.append('New header'));
    replacer.replaceContent(container => container.append('New content'));
    return {
      update: () => {},
      unmount: () => {},
    };
  },
};

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation();
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

test('renders replacement content when asynchronously registered', () => {
  render(<Alert>Alert content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  expectContent(alertWrapper, stylesCss, {
    content: 'Alert content',
    contentReplaced: false,
  });

  awsuiPlugins.alertContent.registerContentReplacer(defaultContent);
  expectContent(alertWrapper, stylesCss, {
    content: 'New content',
    contentReplaced: true,
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

  test('renders replacement header when asynchronously registered', () => {
    render(<Alert header={existingHeader ? 'Header content' : undefined}>Alert content</Alert>);
    const alertWrapper = createWrapper().findAlert()!;
    expectContent(alertWrapper, stylesCss, {
      header: existingHeader ? 'Header content' : undefined,
      headerReplaced: false,
    });

    awsuiPlugins.alertContent.registerContentReplacer(defaultContent);
    expectContent(alertWrapper, stylesCss, {
      header: 'New header',
      headerReplaced: true,
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
  expect(unmountCallback).not.toBeCalled();

  unmount();
  expect(unmountCallback).toBeCalled();
});

test('calls update callback', () => {
  const update = jest.fn();
  const plugin: AlertFlashContentConfig = {
    id: 'test-content',
    runReplacer: jest.fn(() => ({ update, unmount: () => {} })),
  };
  awsuiPlugins.alertContent.registerContentReplacer(plugin);
  const { rerender } = render(<Alert>Alert content</Alert>);
  expect(update).toBeCalledTimes(1);
  expect(plugin.runReplacer).toBeCalledTimes(1);

  rerender(<Alert>Alert new content</Alert>);
  expect(update).toBeCalledTimes(2);
  expect(plugin.runReplacer).toBeCalledTimes(1);
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
          replacer.replaceHeader(headerFn);
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
      expect(consoleWarnSpy).toBeCalledWith(
        '[AwsUi] [Runtime alert content] `replaceHeader` called after component unmounted'
      );
      expect(consoleWarnSpy).toBeCalledWith(
        '[AwsUi] [Runtime alert content] `replaceContent` called after component unmounted'
      );
      expect(headerFn).not.toBeCalled();
      expect(contentFn).not.toBeCalled();
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
    expect.stringContaining(
      'Cannot call `registerContentReplacer` with new provider: provider with id "plugin-1" already registered.'
    )
  );

  render(<Alert>Alert content</Alert>);
  const alertWrapper = createWrapper().findAlert()!;
  expectContent(alertWrapper, stylesCss, {
    content: 'Replacement 1',
    contentReplaced: true,
  });
});
