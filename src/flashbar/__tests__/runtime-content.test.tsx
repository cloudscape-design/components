// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, waitFor } from '@testing-library/react';

import Button from '../../../lib/components/button';
import Flashbar from '../../../lib/components/flashbar';
import { metrics } from '../../../lib/components/internal/metrics';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { AlertFlashContentConfig } from '../../../lib/components/internal/plugins/controllers/alert-flash-content';
import createWrapper from '../../../lib/components/test-utils/dom';
import { expectContent } from '../../alert/__tests__/runtime-content-utils';

import stylesCss from '../../../lib/components/flashbar/styles.css.js';

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

afterEach(() => {
  awsuiPluginsInternal.flashContent.clearRegisteredReplacer();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

test('renders runtime content initially', () => {
  awsuiPlugins.flashContent.registerContentReplacer(defaultContent);
  render(<Flashbar items={[{ content: 'Flash content' }]} />);
  const flashbarWrapper = createWrapper().findFlashbar()!;
  expectContent(flashbarWrapper.findItems()[0], stylesCss, {
    content: 'New content',
    contentReplaced: true,
  });
});

test('renders runtime content when asynchronously registered', async () => {
  render(<Flashbar items={[{ content: 'Flash content' }]} />);
  const flashbarWrapper = createWrapper().findFlashbar()!;
  expectContent(flashbarWrapper.findItems()[0], stylesCss, {
    content: 'Flash content',
    contentReplaced: false,
  });

  awsuiPlugins.flashContent.registerContentReplacer(defaultContent);
  await waitFor(() => {
    expectContent(flashbarWrapper.findItems()[0], stylesCss, {
      content: 'New content',
      contentReplaced: true,
    });
  });
});

describe.each([true, false])('existing header:%p', existingHeader => {
  test('renders runtime header initially', () => {
    awsuiPlugins.flashContent.registerContentReplacer(defaultContent);
    render(
      <Flashbar
        items={[
          {
            content: 'Flash content',
            header: existingHeader ? 'Flash header' : undefined,
          },
        ]}
      />
    );
    const flashbarWrapper = createWrapper().findFlashbar()!;
    expectContent(flashbarWrapper.findItems()[0], stylesCss, {
      header: 'New header',
      headerReplaced: true,
    });
  });

  test('renders runtime header when asynchronously registered', async () => {
    render(
      <Flashbar
        items={[
          {
            content: 'Flash content',
            header: existingHeader ? 'Flash header' : undefined,
          },
        ]}
      />
    );
    const flashWrapper = createWrapper().findFlashbar()!.findItems()[0];
    expectContent(flashWrapper, stylesCss, {
      header: existingHeader ? 'Flash header' : undefined,
      headerReplaced: false,
    });

    awsuiPlugins.flashContent.registerContentReplacer(defaultContent);
    await waitFor(() => {
      expectContent(flashWrapper, stylesCss, {
        header: 'New header',
        headerReplaced: true,
      });
    });
  });
});

test('restores content and header', async () => {
  const { rerender } = render(<Flashbar items={[{ header: 'Flash header', content: 'Flash content' }]} />);
  const flashWrapper = createWrapper().findFlashbar()!.findItems()[0];
  expectContent(flashWrapper, stylesCss, {
    header: 'Flash header',
    headerReplaced: false,
    content: 'Flash content',
    contentReplaced: false,
  });

  awsuiPlugins.flashContent.registerContentReplacer({
    id: 'test-content',
    runReplacer(context, replacer) {
      const runUpdate = () => {
        if (context.headerRef.current?.textContent?.includes('Flash')) {
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
    expectContent(flashWrapper, stylesCss, {
      header: 'New header',
      headerReplaced: true,
      content: 'New content',
      contentReplaced: true,
    });
  });

  rerender(<Flashbar items={[{ header: 'Updated header', content: 'Flash content' }]} />);
  await waitFor(() => {
    expectContent(flashWrapper, stylesCss, {
      header: 'Updated header',
      headerReplaced: false,
      content: 'Flash content',
      contentReplaced: false,
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
    awsuiPlugins.flashContent.registerContentReplacer(plugin);
  });
  test('refs', () => {
    render(
      <Flashbar
        items={[
          {
            header: 'Flash header',
            action: <Button>Action button</Button>,
            content: 'Flash content',
          },
        ]}
      />
    );
    expect(runReplacer.mock.lastCall[0].headerRef.current).toHaveTextContent('Flash header');
    expect(runReplacer.mock.lastCall[0].contentRef.current).toHaveTextContent('Flash content');
  });
  test('type - default', () => {
    render(<Flashbar items={[{}]} />);
    expect(runReplacer.mock.lastCall[0].type).toBe('info');
  });
  test('type - custom', () => {
    render(<Flashbar items={[{ type: 'error' }]} />);
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
  awsuiPlugins.flashContent.registerContentReplacer(plugin);
  const { unmount } = render(<Flashbar items={[{}]} />);
  const flashbarWrapper = createWrapper().findFlashbar()!;
  expectContent(flashbarWrapper.findItems()[0], stylesCss, { content: 'New content', contentReplaced: true });
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
  awsuiPlugins.flashContent.registerContentReplacer(plugin);
  const { rerender } = render(<Flashbar items={[{}]} />);
  expect(update).toBeCalledTimes(1);
  expect(plugin.runReplacer).toBeCalledTimes(1);

  rerender(<Flashbar items={[{ content: 'New content' }]} />);
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
    awsuiPlugins.flashContent.registerContentReplacer(asyncContent);
    render(<Flashbar items={[{ content: 'Flash content' }]} />);
    const flashWrapper = createWrapper().findFlashbar()!.findItems()[0];
    expectContent(flashWrapper, stylesCss, {
      content: 'Flash content',
      contentReplaced: false,
    });

    await waitFor(() => {
      expectContent(flashWrapper, stylesCss, {
        content: 'New content',
        contentReplaced: true,
      });
    });
  });

  test('warns if registerReplacement called after unmounting', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const sendPanoramaMetricSpy = jest.spyOn(metrics, 'sendPanoramaMetric');
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
    awsuiPlugins.flashContent.registerContentReplacer(asyncContent);
    const { unmount } = render(<Flashbar items={[{ content: 'Flash content' }]} />);
    const flashWrapper = createWrapper().findFlashbar()!.findItems()[0];
    expectContent(flashWrapper, stylesCss, {
      content: 'Flash content',
      contentReplaced: false,
    });

    unmount();

    await waitFor(() => {
      const assertWarningLogged = (method: string) => {
        const message = `"${method}" called after component unmounted`;
        expect(consoleWarnSpy).toBeCalledWith('[AwsUi]', '[flash-content-replacer]', message);
        expect(sendPanoramaMetricSpy).toBeCalledWith({
          eventName: 'awsui-runtime-api-warning',
          eventDetail: {
            component: 'flash-content-replacer',
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
      expect(headerFn).not.toBeCalled();
      expect(contentFn).not.toBeCalled();
    });
  });
});
