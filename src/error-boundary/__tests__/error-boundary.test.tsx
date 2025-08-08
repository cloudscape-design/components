// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import ErrorBoundary, { ErrorBoundaryProps } from '../../../lib/components/error-boundary';
import { BuiltInErrorBoundary } from '../../../lib/components/error-boundary/internal';
import { refreshPage } from '../../../lib/components/error-boundary/utils';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('../../../lib/components/error-boundary/utils', () => ({
  ...jest.requireActual('../../../lib/components/error-boundary/utils'),
  refreshPage: jest.fn(),
}));

type RenderProps = Omit<
  Partial<ErrorBoundaryProps> & { i18nProvider?: Record<string, Record<string, string>> },
  'children'
>;

function renderWithErrorBoundary(children: React.ReactNode, props?: RenderProps) {
  const onError = jest.fn();
  const Component = ({ children, ...rest }: RenderProps & { children: React.ReactNode }) => (
    <TestI18nProvider messages={rest.i18nProvider ?? {}}>
      <ErrorBoundary onError={onError} {...rest}>
        {children}
      </ErrorBoundary>
    </TestI18nProvider>
  );
  const result = render(<Component {...props}>{children}</Component>);
  return {
    onError,
    rerender: (children: React.ReactNode, props?: RenderProps) =>
      result.rerender(<Component {...props}>{children}</Component>),
  };
}
function findBoundary() {
  return createWrapper().findErrorBoundary();
}
function findHeader() {
  return findBoundary()!.findHeader();
}
function findDescription() {
  return findBoundary()!.findDescription();
}
function findAction() {
  return findBoundary()!.findAction();
}
function findRefreshAction() {
  return findBoundary()!.findRefreshAction();
}
function findFeedbackAction() {
  return findBoundary()!.findFeedbackAction();
}

// We suppress console error output for error boundary tests as the errors are actually expected, yet still logged.
let errorSpy: jest.SpyInstance;
beforeAll(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  errorSpy.mockRestore();
});

describe('Error boundary', () => {
  test('renders content when there is no error in the content or fallback', () => {
    renderWithErrorBoundary(<b>Content</b>);
    expect(createWrapper().find('b')!.getElement()).toHaveTextContent('Content');
  });

  test('renders content when there is a potential error in the fallback', () => {
    renderWithErrorBoundary(<b>Content</b>, {
      fallback: () => ({ header: {}, description: {}, action: {} }),
    });
    expect(createWrapper().find('b')!.getElement()).toHaveTextContent('Content');
  });

  test('renders fallback when there is an error in the content', () => {
    renderWithErrorBoundary(<b>{{}}</b>);
    expect(createWrapper().find('b')).toBe(null);
    expect(findBoundary()).not.toBe(null);
  });

  test('throws if there is an error in the content and fallback', () => {
    const onError = jest.fn();
    expect(() => renderWithErrorBoundary(<b>{{}}</b>, { onError, fallback: () => ({ header: {} }) })).toThrow();
    expect(onError).not.toHaveBeenCalled();
  });

  test.each([undefined, 'test-id'])('calls onError when there is an error in the content, errorBoundaryId=%s', id => {
    const { onError } = renderWithErrorBoundary(<b>{{}}</b>, { errorBoundaryId: id });
    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object), { errorBoundaryId: id });
  });

  test('uses hardcoded header when no provider or overrides given', () => {
    renderWithErrorBoundary(<b>{{}}</b>);
    expect(findHeader().getElement()).toHaveTextContent('Unexpected error, content failed to show');
  });

  test('customizes fallback header using i18n provider', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nProvider: {
        'error-boundary': {
          'i18nStrings.headerText': 'x',
        },
      },
    });
    expect(findHeader().getElement()).toHaveTextContent('x');
  });

  test('customizes fallback header using i18n strings', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nProvider: {
        'error-boundary': {
          'i18nStrings.headerText': 'x',
        },
      },
      i18nStrings: { headerText: 'xx' },
    });
    expect(findHeader().getElement()).toHaveTextContent('xx');
  });

  test('customizes fallback header using slot', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nProvider: {
        'error-boundary': {
          'i18nStrings.headerText': 'x',
        },
      },
      i18nStrings: { headerText: 'xx' },
      fallback: () => ({ header: <div id="xxx">xxx</div> }),
    });
    expect(findHeader().find('#xxx')!.getElement()).toHaveTextContent('xxx');
  });

  test('uses hardcoded description when no provider or overrides given', () => {
    renderWithErrorBoundary(<b>{{}}</b>);
    expect(findDescription().getElement()).toHaveTextContent('You can refresh the page to try again.');
  });

  test('customizes fallback description using i18n provider', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nProvider: {
        'error-boundary': {
          'i18nStrings.descriptionText': 'x',
        },
      },
    });
    expect(findDescription().getElement()).toHaveTextContent('x');
  });

  test('customizes fallback description using i18n strings', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nProvider: {
        'error-boundary': {
          'i18nStrings.descriptionText': 'x',
        },
      },
      i18nStrings: { descriptionText: () => 'xx' },
    });
    expect(findDescription().getElement()).toHaveTextContent('xx');
  });

  test('customizes fallback description using slot', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nProvider: {
        'error-boundary': {
          'i18nStrings.descriptionText': 'x',
        },
      },
      i18nStrings: { descriptionText: () => 'xx' },
      fallback: () => ({ description: <div id="xxx">xxx</div> }),
    });
    expect(findDescription().find('#xxx')!.getElement()).toHaveTextContent('xxx');
  });

  test('uses hardcoded refresh action text when no provider or overrides given', () => {
    renderWithErrorBoundary(<b>{{}}</b>);
    expect(findRefreshAction()!.getElement()).toHaveTextContent('Refresh page');
    expect(findAction()!.getElement()).toHaveTextContent('Refresh page');
  });

  test('customizes fallback refresh action text using i18n provider', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nProvider: {
        'error-boundary': {
          'i18nStrings.refreshActionText': 'x',
        },
      },
    });
    expect(findRefreshAction()!.getElement()).toHaveTextContent('x');
    expect(findAction()!.getElement()).toHaveTextContent('x');
  });

  test('customizes fallback refresh action text using i18n strings', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nProvider: {
        'error-boundary': {
          'i18nStrings.refreshActionText': 'x',
        },
      },
      i18nStrings: { refreshActionText: 'xx' },
    });
    expect(findRefreshAction()!.getElement()).toHaveTextContent('xx');
    expect(findAction()!.getElement()).toHaveTextContent('xx');
  });

  test('customizes fallback action using slot', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nProvider: {
        'error-boundary': {
          'i18nStrings.refreshActionText': 'x',
        },
      },
      i18nStrings: { refreshActionText: 'xx' },
      fallback: () => ({ action: <button id="xxx">xxx</button> }),
    });
    expect(findAction()!.find('#xxx')!.getElement()).toHaveTextContent('xxx');
    expect(findRefreshAction()).toBe(null);
  });

  test('customizes fallback feedback using i18n provider', () => {
    const i18nProvider = {
      'error-boundary': {
        'i18nStrings.descriptionText':
          '{feedbackAction, select, null {Try again.} other {Try again, {feedbackAction}.}}',
        'i18nStrings.feedbackActionText': 'share feedback',
      },
    };
    const { rerender } = renderWithErrorBoundary(<b>{{}}</b>);

    rerender(<b>{{}}</b>, { i18nProvider });
    expect(findDescription().getElement()).toHaveTextContent('Try again.');
    expect(findFeedbackAction()).toBe(null);

    rerender(<b>{{}}</b>, { i18nProvider, feedback: {} });
    expect(findDescription().getElement()).toHaveTextContent('Try again.');
    expect(findFeedbackAction()).toBe(null);

    rerender(<b>{{}}</b>, { i18nProvider, feedback: { onClick: () => {} } });
    expect(findDescription().getElement()).toHaveTextContent('Try again, share feedback.');
    expect(findFeedbackAction()!.getElement()).toHaveTextContent('share feedback');
    expect(findFeedbackAction()!.getElement().tagName).toBe('BUTTON');

    rerender(<b>{{}}</b>, { i18nProvider, feedback: { href: 'https://feedback', onClick: () => {} } });
    expect(findDescription().getElement()).toHaveTextContent('Try again, share feedback.');
    expect(findFeedbackAction()!.getElement()).toHaveTextContent('share feedback');
    expect(findFeedbackAction()!.getElement().tagName).toBe('A');
    expect(findFeedbackAction()!.getElement()).toHaveAttribute('href', 'https://feedback');
  });

  test('customizes fallback feedback using i18n strings', () => {
    const descriptionText = (feedback?: string) => (feedback ? `Try again, ${feedback}.` : 'Try again.');
    const feedbackActionText = 'share feedback';
    const i18nStrings = { descriptionText, feedbackActionText };
    const { rerender } = renderWithErrorBoundary(<b>{{}}</b>);

    rerender(<b>{{}}</b>, { i18nStrings: { descriptionText }, feedback: { href: 'https://feedback' } });
    expect(findFeedbackAction()).toBe(null);

    rerender(<b>{{}}</b>, { i18nStrings: { feedbackActionText }, feedback: { href: 'https://feedback' } });
    expect(findFeedbackAction()).toBe(null);

    rerender(<b>{{}}</b>, { i18nStrings });
    expect(findDescription().getElement()).toHaveTextContent('Try again.');
    expect(findFeedbackAction()).toBe(null);

    rerender(<b>{{}}</b>, { i18nStrings, feedback: {} });
    expect(findDescription().getElement()).toHaveTextContent('Try again.');
    expect(findFeedbackAction()).toBe(null);

    rerender(<b>{{}}</b>, { i18nStrings, feedback: { onClick: () => {} } });
    expect(findDescription().getElement()).toHaveTextContent('Try again, share feedback.');
    expect(findFeedbackAction()!.getElement()).toHaveTextContent('share feedback');
    expect(findFeedbackAction()!.getElement().tagName).toBe('BUTTON');

    rerender(<b>{{}}</b>, { i18nStrings, feedback: { href: 'https://feedback', onClick: () => {} } });
    expect(findDescription().getElement()).toHaveTextContent('Try again, share feedback.');
    expect(findFeedbackAction()!.getElement()).toHaveTextContent('share feedback');
    expect(findFeedbackAction()!.getElement().tagName).toBe('A');
    expect(findFeedbackAction()!.getElement()).toHaveAttribute('href', 'https://feedback');
  });

  test('adds error boundary id to the data attribute', () => {
    const findBoundary = (id: string) => createWrapper().find(`[data-awsui-boundary-id="${id}"]`)!.findErrorBoundary()!;

    renderWithErrorBoundary(<b>{{}}</b>, { errorBoundaryId: 'test-id1', fallback: () => ({ header: 'One' }) });
    renderWithErrorBoundary(<b>{{}}</b>, { errorBoundaryId: 'test-id2', fallback: () => ({ header: 'Two' }) });
    expect(findBoundary('test-id1').findHeader().getElement()).toHaveTextContent('One');
    expect(findBoundary('test-id2').findHeader().getElement()).toHaveTextContent('Two');
  });

  test('error is captured by the closest boundary', () => {
    const onErrorOuter = jest.fn();
    const onErrorInner = jest.fn();
    render(
      <ErrorBoundary onError={onErrorOuter} fallback={() => ({ header: 'outer' })} errorBoundaryId="outer">
        <div>
          <ErrorBoundary onError={onErrorInner} fallback={() => ({ header: 'inner' })} errorBoundaryId="inner">
            <div>{{}}</div>
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    );
    expect(findHeader().getElement()).toHaveTextContent('inner');
    expect(onErrorOuter).not.toHaveBeenCalled();
    expect(onErrorInner).toHaveBeenCalledWith(expect.any(Error), expect.any(Object), { errorBoundaryId: 'inner' });
  });

  test('deep-suppresses nested error boundaries', () => {
    const onErrorL1 = jest.fn();
    const onErrorL2 = jest.fn();
    const onErrorL3 = jest.fn();
    render(
      <ErrorBoundary onError={onErrorL1} fallback={() => ({ header: 'l1' })} errorBoundaryId="l1" suppressNested={true}>
        <div>
          <ErrorBoundary onError={onErrorL2} fallback={() => ({ header: 'l2' })} errorBoundaryId="l2">
            <div>
              <ErrorBoundary onError={onErrorL3} fallback={() => ({ header: 'l3' })} errorBoundaryId="l3">
                <div>{{}}</div>
              </ErrorBoundary>
            </div>
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    );
    expect(findHeader().getElement()).toHaveTextContent('l1');
    expect(onErrorL1).toHaveBeenCalledWith(expect.any(Error), expect.any(Object), { errorBoundaryId: 'l1' });
    expect(onErrorL2).not.toHaveBeenCalled();
    expect(onErrorL3).not.toHaveBeenCalled();
  });

  test('recovers from error when re-rendering a component with error boundary using a different React key', () => {
    const Component = ({ children }: { children: React.ReactNode }) => (
      <ErrorBoundary onError={jest.fn()}>
        <div>{children}</div>
      </ErrorBoundary>
    );
    const { rerender } = render(<Component>{null}</Component>);
    expect(findBoundary()).toBe(null);

    rerender(<Component>{{}}</Component>);
    expect(findBoundary()).not.toBe(null);

    rerender(<Component>{null}</Component>);
    expect(findBoundary()).not.toBe(null);

    rerender(<Component key="1">{null}</Component>);
    expect(findBoundary()).toBe(null);

    rerender(<Component key="1">{{}}</Component>);
    expect(findBoundary()).not.toBe(null);

    rerender(<Component key="2">{null}</Component>);
    expect(findBoundary()).toBe(null);
  });
});

test('built-in error boundaries are suppressed by default', () => {
  expect(() =>
    render(
      <BuiltInErrorBoundary>
        <div>
          <BuiltInErrorBoundary>
            <div>{{}}</div>
          </BuiltInErrorBoundary>
        </div>
      </BuiltInErrorBoundary>
    )
  ).toThrow();
});

test('built-in error boundaries are active when wrapped with a standalone error boundary', () => {
  const onError = jest.fn();
  render(
    <ErrorBoundary onError={onError} fallback={() => ({ header: 'x' })} errorBoundaryId="x">
      <BuiltInErrorBoundary>
        <div id="outer-div">
          <BuiltInErrorBoundary>
            <div id="inner-div">{{}}</div>
          </BuiltInErrorBoundary>
        </div>
      </BuiltInErrorBoundary>
    </ErrorBoundary>
  );
  expect(createWrapper().find('#inner-div')).toBe(null);
  expect(createWrapper().find('#outer-div')).not.toBe(null);
  expect(createWrapper().find('#outer-div')!.findErrorBoundary()!.findHeader().getElement()).toHaveTextContent('x');
  expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object), { errorBoundaryId: 'x' });
});

test('built-in error boundaries are suppressed when suppress nested is used on standalone error boundary', () => {
  const onError = jest.fn();
  render(
    <div id="outer-div">
      <ErrorBoundary onError={onError} fallback={() => ({ header: 'x' })} errorBoundaryId="x" suppressNested={true}>
        <div id="inner-div">
          <BuiltInErrorBoundary>
            <BuiltInErrorBoundary>
              <div>{{}}</div>
            </BuiltInErrorBoundary>
          </BuiltInErrorBoundary>
        </div>
      </ErrorBoundary>
    </div>
  );
  expect(createWrapper().find('#inner-div')).toBe(null);
  expect(createWrapper().find('#outer-div')).not.toBe(null);
  expect(createWrapper().find('#outer-div')!.findErrorBoundary()!.findHeader().getElement()).toHaveTextContent('x');
  expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object), { errorBoundaryId: 'x' });
});

test('built-in error boundaries are suppressed when suppress nested is used on built-in error boundary', () => {
  const onError = jest.fn();
  render(
    <ErrorBoundary onError={onError} fallback={() => ({ header: 'x' })} errorBoundaryId="x">
      <div id="outer-div">
        <BuiltInErrorBoundary suppressNested={true}>
          <div id="inner-div">
            <BuiltInErrorBoundary>
              <div>{{}}</div>
            </BuiltInErrorBoundary>
          </div>
        </BuiltInErrorBoundary>
      </div>
    </ErrorBoundary>
  );
  expect(createWrapper().find('#inner-div')).toBe(null);
  expect(createWrapper().find('#outer-div')).not.toBe(null);
  expect(createWrapper().find('#outer-div')!.findErrorBoundary()!.findHeader().getElement()).toHaveTextContent('x');
  expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object), { errorBoundaryId: 'x' });
});

test('window reload is called when the refresh action is clicked', () => {
  renderWithErrorBoundary(<b>{{}}</b>);
  findRefreshAction()!.click();
  expect(refreshPage).toHaveBeenCalledTimes(1);
});
