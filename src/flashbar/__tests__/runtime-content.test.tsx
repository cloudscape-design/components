// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, waitFor } from '@testing-library/react';

import Button from '../../../lib/components/button';
import Flashbar from '../../../lib/components/flashbar';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { AlertFlashContentConfig } from '../../../lib/components/internal/plugins/controllers/alert-flash-content';
import createWrapper from '../../../lib/components/test-utils/dom';
import FlashbarWrapper from '../../../lib/components/test-utils/dom/flashbar';
import { expectContent } from '../../alert/__tests__/runtime-content-utils';

import stylesCss from '../../../lib/components/flashbar/styles.css.js';

const pause = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

const defaultContent: AlertFlashContentConfig = {
  id: 'test-content',
  runReplacer(context, registerReplacement) {
    registerReplacement('header', {
      type: 'replace',
      onReplace: container => {
        container.append('New header');
      },
    });
    registerReplacement('content', {
      type: 'replace',
      onReplace: container => {
        container.append('New content');
      },
    });
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

test('renders runtime content when asynchronously registered', () => {
  render(<Flashbar items={[{ content: 'Flash content' }]} />);
  const flashbarWrapper = createWrapper().findFlashbar()!;
  expectContent(flashbarWrapper.findItems()[0], stylesCss, {
    content: 'Flash content',
    contentReplaced: false,
  });

  awsuiPlugins.flashContent.registerContentReplacer(defaultContent);
  expectContent(flashbarWrapper.findItems()[0], stylesCss, {
    content: 'New content',
    contentReplaced: true,
  });
});

describe.each([true, false])('existing header:%p', existingHeader => {
  test('renders runtime header initially', () => {
    awsuiPlugins.flashContent.registerContentReplacer(defaultContent);
    const { container } = render(
      <Flashbar
        items={[
          {
            content: 'Flash content',
            header: existingHeader ? 'Flash header' : undefined,
          },
        ]}
      />
    );
    const flashbarWrapper = new FlashbarWrapper(container);
    expectContent(flashbarWrapper.findItems()[0], stylesCss, {
      header: 'New header',
      headerReplaced: true,
    });
  });

  test('renders runtime header when asynchronously registered', () => {
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
      header: existingHeader ? 'Flash header' : undefined,
      headerReplaced: false,
    });

    awsuiPlugins.flashContent.registerContentReplacer(defaultContent);
    expectContent(flashbarWrapper.findItems()[0], stylesCss, {
      header: 'New header',
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
    expect(runReplacer.mock.lastCall[0].actionsRef.current).toHaveTextContent('Action button');
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
    runReplacer(context, registerReplacement) {
      registerReplacement('content', { type: 'replace', onReplace: container => container.append('New content') });
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
      runReplacer(context, registerReplacement) {
        (async () => {
          await pause(500);
          const content = document.createElement('div');
          content.append('New content');
          registerReplacement('content', {
            type: 'replace',
            onReplace: container => {
              container.appendChild(content);
            },
          });
        })();
        return {
          update: () => {},
          unmount: () => {},
        };
      },
    };
    awsuiPlugins.flashContent.registerContentReplacer(asyncContent);
    const { container } = render(<Flashbar items={[{ content: 'Flash content' }]} />);
    const flashWrapper = new FlashbarWrapper(container).findItems()[0];
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
    const headerFn = jest.fn();
    const contentFn = jest.fn();
    const asyncContent: AlertFlashContentConfig = {
      id: 'test-content-async',
      runReplacer(context, registerReplacement) {
        (async () => {
          await pause(500);
          registerReplacement('header', { type: 'replace', onReplace: headerFn });
          registerReplacement('content', { type: 'replace', onReplace: contentFn });
        })();
        return {
          update: () => {},
          unmount: () => {},
        };
      },
    };
    awsuiPlugins.flashContent.registerContentReplacer(asyncContent);
    const { unmount, container } = render(<Flashbar items={[{ content: 'Flash content' }]} />);
    const flashWrapper = new FlashbarWrapper(container).findItems()[0];
    expectContent(flashWrapper, stylesCss, {
      content: 'Flash content',
      contentReplaced: false,
    });

    unmount();

    await waitFor(() => {
      expect(consoleWarnSpy).toBeCalledWith(
        '[AwsUi] [Runtime flash content] `registerReplacement` (header) called after component unmounted'
      );
      expect(consoleWarnSpy).toBeCalledWith(
        '[AwsUi] [Runtime flash content] `registerReplacement` (content) called after component unmounted'
      );
      expect(headerFn).not.toBeCalled();
      expect(contentFn).not.toBeCalled();
    });
  });
});
