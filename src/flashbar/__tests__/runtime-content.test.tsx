// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';

import Button from '../../../lib/components/button';
import Flashbar from '../../../lib/components/flashbar';
import awsuiPlugins from '../../../lib/components/internal/plugins';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { AlertFlashContentConfig } from '../../../lib/components/internal/plugins/controllers/alert-flash-content';
import FlashbarWrapper from '../../../lib/components/test-utils/dom/flashbar';
import FlashWrapper from '../../../lib/components/test-utils/dom/flashbar/flash';

import stylesCss from '../../../lib/components/flashbar/styles.css.js';

const pause = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

const expectFlashContent = (
  wrapper: FlashWrapper,
  {
    header,
    headerReplaced,
    content,
    contentReplaced,
  }: {
    header?: string | false;
    headerReplaced?: boolean;
    content?: string | false;
    contentReplaced?: boolean;
  }
) => {
  if (header) {
    if (headerReplaced) {
      expect(wrapper.findHeader()?.getElement()).toHaveClass(stylesCss.hidden);
      expect(wrapper.findReplacementHeader()?.getElement().textContent).toBe(header);
    } else {
      expect(wrapper.findReplacementHeader()?.getElement()).toHaveClass(stylesCss.hidden);
      expect(wrapper.findHeader()?.getElement().textContent).toBe(header);
    }
  } else if (header === false) {
    expect(wrapper.findHeader()?.getElement()).toHaveClass(stylesCss.hidden);
    expect(wrapper.findReplacementHeader()?.getElement()).toHaveClass(stylesCss.hidden);
  }
  if (content) {
    if (contentReplaced) {
      expect(wrapper.findContent()?.getElement()).toHaveClass(stylesCss.hidden);
      expect(wrapper.findReplacementContent()?.getElement().textContent).toBe(content);
    } else {
      expect(wrapper.findReplacementContent()?.getElement()).toHaveClass(stylesCss.hidden);
      expect(wrapper.findContent()?.getElement().textContent).toBe(content);
    }
  } else if (content === false) {
    expect(wrapper.findContent()?.getElement()).toHaveClass(stylesCss.hidden);
    expect(wrapper.findReplacementContent()?.getElement()).toHaveClass(stylesCss.hidden);
  }
};

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

function delay(advanceBy = 1) {
  const promise = act(() => new Promise(resolve => setTimeout(resolve)));
  jest.advanceTimersByTime(advanceBy);
  return promise;
}

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  awsuiPluginsInternal.flashContent.clearRegisteredReplacer();
  jest.useRealTimers();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

test('renders runtime content initially', async () => {
  awsuiPlugins.flashContent.registerContentReplacer(defaultContent);
  const { container } = render(<Flashbar items={[{ content: 'Flash content' }]} />);
  const flashbarWrapper = new FlashbarWrapper(container);
  await delay();
  expectFlashContent(flashbarWrapper.findItems()[0], {
    content: 'New content',
    contentReplaced: true,
  });
});

test('renders runtime content when asynchronously registered', async () => {
  const { container } = render(<Flashbar items={[{ content: 'Flash content' }]} />);
  const flashbarWrapper = new FlashbarWrapper(container);
  await delay();
  expectFlashContent(flashbarWrapper.findItems()[0], {
    content: 'Flash content',
    contentReplaced: false,
  });
  awsuiPlugins.flashContent.registerContentReplacer(defaultContent);
  await delay();
  expectFlashContent(flashbarWrapper.findItems()[0], {
    content: 'New content',
    contentReplaced: true,
  });
});

describe.each([true, false])('existing header:%p', existingHeader => {
  test('renders runtime header initially', async () => {
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
    await delay();
    expectFlashContent(flashbarWrapper.findItems()[0], {
      header: 'New header',
      headerReplaced: true,
    });
  });

  test('renders runtime header when asynchronously registered', async () => {
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
    await delay();
    expectFlashContent(flashbarWrapper.findItems()[0], {
      header: existingHeader ? 'Flash header' : undefined,
      headerReplaced: false,
    });
    awsuiPlugins.flashContent.registerContentReplacer(defaultContent);
    await delay();
    expectFlashContent(flashbarWrapper.findItems()[0], {
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
  test('refs', async () => {
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
    await delay();
    expect(runReplacer.mock.lastCall[0].headerRef.current).toHaveTextContent('Flash header');
    expect(runReplacer.mock.lastCall[0].contentRef.current).toHaveTextContent('Flash content');
    expect(runReplacer.mock.lastCall[0].actionsRef.current).toHaveTextContent('Action button');
  });
  test('type - default', async () => {
    render(<Flashbar items={[{}]} />);
    await delay();
    expect(runReplacer.mock.lastCall[0].type).toBe('info');
  });
  test('type - custom', async () => {
    render(<Flashbar items={[{ type: 'error' }]} />);
    await delay();
    expect(runReplacer.mock.lastCall[0].type).toBe('error');
  });
});

test('calls unmount callback', async () => {
  const unmountCallback = jest.fn();
  const plugin: AlertFlashContentConfig = {
    id: 'test-content',
    runReplacer() {
      return {
        update: () => {},
        unmount: unmountCallback,
      };
    },
  };
  awsuiPlugins.flashContent.registerContentReplacer(plugin);
  const { unmount } = render(<Flashbar items={[{}]} />);
  await delay();
  expect(unmountCallback).not.toBeCalled();
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
  awsuiPlugins.flashContent.registerContentReplacer(plugin);
  const { rerender } = render(<Flashbar items={[{}]} />);
  await delay();
  expect(callback).toBeCalledTimes(0);
  expect(plugin.runReplacer).toBeCalledTimes(1);
  rerender(<Flashbar items={[{ content: 'New content' }]} />);
  expect(callback).toBeCalledTimes(1);
  expect(plugin.runReplacer).toBeCalledTimes(1);
});

describe('asynchronous rendering', () => {
  test('allows asynchronous rendering of content', async () => {
    const asyncContent: AlertFlashContentConfig = {
      id: 'test-content-async',
      runReplacer(context, registerReplacement) {
        (async () => {
          await pause(1000);
          const content = document.createElement('div');
          content.append('New content');
          content.dataset.testid = 'test-content-async';
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
    awsuiPlugins.flashContent.registerContentReplacer(asyncContent);
    const { container } = render(<Flashbar items={[{ content: 'Flash content' }]} />);
    const flashWrapper = new FlashbarWrapper(container).findItems()[0];
    await delay();
    expectFlashContent(flashWrapper, {
      content: 'Flash content',
      contentReplaced: false,
    });
    await delay(1000);
    expectFlashContent(flashWrapper, {
      content: 'New content',
      contentReplaced: true,
    });
  });

  test('warns if registerReplacement called after unmounting', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const asyncContent: AlertFlashContentConfig = {
      id: 'test-content-async',
      runReplacer(context, registerReplacement) {
        (async () => {
          await pause(1000);
          registerReplacement('header', () => {});
          registerReplacement('content', () => {});
        })();
        return {
          update: () => {},
          unmount: () => {},
        };
      },
    };
    awsuiPlugins.flashContent.registerContentReplacer(asyncContent);
    const { unmount } = render(<Flashbar items={[{}]} />);
    await delay(500);
    unmount();
    await delay(1000);
    expect(consoleWarnSpy).toBeCalledWith(
      '[AwsUi] [Runtime alert/flash content] `registerReplacement` (header) called after component unmounted'
    );
    expect(consoleWarnSpy).toBeCalledWith(
      '[AwsUi] [Runtime alert/flash content] `registerReplacement` (content) called after component unmounted'
    );
  });
});
