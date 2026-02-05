// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import ErrorBoundary, { ErrorBoundaryProps } from '../../../lib/components/error-boundary';
import { BuiltInErrorBoundaryProps } from '../../../lib/components/error-boundary/interfaces';
import { BuiltInErrorBoundary } from '../../../lib/components/error-boundary/internal';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import createWrapper from '../../../lib/components/test-utils/dom';

type RenderProps = Omit<
  Partial<ErrorBoundaryProps> & { i18nProvider?: Record<string, Record<string, string>> } & {
    [key: `data-${string}`]: string;
  },
  'children'
>;

type BoundaryTestSpec = Omit<ErrorBoundaryProps, 'children'> | Omit<BuiltInErrorBoundaryProps, 'children'>;

function createBoundary(id: string, other: Partial<ErrorBoundaryProps>): BoundaryTestSpec {
  return {
    i18nStrings: { headerText: id },
    errorBoundaryId: id,
    onError: jest.fn(),
    ...other,
  };
}
function createBuiltInBoundary(props: Partial<BuiltInErrorBoundaryProps>): BoundaryTestSpec {
  return { wrapper: content => <div>built-in({content})</div>, ...props };
}

function Recursive({ boundaries }: { boundaries: BoundaryTestSpec[] }) {
  if (boundaries.length === 0) {
    return <div>{{}}</div>;
  }
  const props = {
    ...boundaries[0],
    children: (
      <div>
        <Recursive boundaries={boundaries.slice(1)} />
      </div>
    ),
  };
  return 'onError' in props ? <ErrorBoundary {...props} /> : <BuiltInErrorBoundary {...props} />;
}

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

describe('standalone rendering and throwing', () => {
  test('renders content when there is no error in the content or fallback', () => {
    renderWithErrorBoundary(<b>Content</b>);
    expect(createWrapper().find('b')!.getElement()).toHaveTextContent('Content');
  });

  test('renders content when there is a potential error in the feedback action', () => {
    renderWithErrorBoundary(<b>Content</b>, {
      i18nStrings: { descriptionText: '<Feedback/>', components: { Feedback: () => <>{{}}</> } },
    });
    expect(createWrapper().find('b')!.getElement()).toHaveTextContent('Content');
  });

  test('renders content when there is a potential error in the fallback renderer', () => {
    renderWithErrorBoundary(<b>Content</b>, { renderFallback: () => <>{{}}</> });
    expect(createWrapper().find('b')!.getElement()).toHaveTextContent('Content');
  });

  test('renders fallback when there is an error in the content', () => {
    renderWithErrorBoundary(<b>{{}}</b>);
    expect(createWrapper().find('b')).toBe(null);
    expect(findBoundary()).not.toBe(null);
  });

  test('throws if there is an error in the content and feedback action', () => {
    const onError = jest.fn();
    expect(() =>
      renderWithErrorBoundary(<b>{{}}</b>, {
        onError,
        i18nStrings: { descriptionText: '<Feedback></Feedback>', components: { Feedback: () => <>{{}}</> } },
      })
    ).toThrow();
    expect(onError).not.toHaveBeenCalled();
  });

  test('throws if there is an error in the content and fallback renderer', () => {
    const onError = jest.fn();
    expect(() => renderWithErrorBoundary(<b>{{}}</b>, { onError, renderFallback: () => <>{{}}</> })).toThrow();
    expect(onError).not.toHaveBeenCalled();
  });

  test.each([undefined, 'test-id'])('calls onError when there is an error in the content, errorBoundaryId=%s', id => {
    const { onError } = renderWithErrorBoundary(<b>{{}}</b>, { errorBoundaryId: id });
    expect(onError).toHaveBeenCalledWith({
      error: expect.any(Error),
      errorInfo: expect.any(Object),
      errorBoundaryId: id,
    });
  });
});

describe('fallback customization with i18n', () => {
  test('renders empty messages when no provider or i18n strings given', () => {
    renderWithErrorBoundary(<b>{{}}</b>);
    expect(findHeader().getElement()).toHaveTextContent('');
    expect(findDescription().getElement()).toHaveTextContent('');
    expect(findAction()!.getElement()).toHaveTextContent('');
    expect(findRefreshAction()!.getElement()).toHaveTextContent('');
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
      i18nStrings: { descriptionText: 'xx' },
    });
    expect(findDescription().getElement()).toHaveTextContent('xx');
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

  test('customizes fallback feedback using i18n provider', () => {
    const Feedback = ({ children }: { children: React.ReactNode }) => <a href="https://feed.back">{children}</a>;
    const i18nProvider = {
      'error-boundary': {
        'i18nStrings.descriptionText':
          '{hasFeedback, select, true {Try again, <Feedback>share feedback</Feedback>.} other {Try again.}}',
      },
    };
    const { rerender } = renderWithErrorBoundary(<b>{{}}</b>);

    rerender(<b>{{}}</b>, { i18nProvider });
    expect(findDescription().getElement()).toHaveTextContent('Try again.');
    expect(findFeedbackAction()).toBe(null);

    rerender(<b>{{}}</b>, { i18nProvider, i18nStrings: { components: { Feedback } } });
    expect(findDescription().getElement()).toHaveTextContent('Try again, share feedback.');
    expect(findFeedbackAction()!.find('a')!.getElement()).toHaveTextContent('share feedback');
    expect(findFeedbackAction()!.find('a')!.getElement()).toHaveAttribute('href', 'https://feed.back');
  });

  test('customizes fallback feedback using i18n strings', () => {
    const Feedback = ({ children }: { children: React.ReactNode }) => (
      <a href="https://feed.back">{children || 'custom'}</a>
    );
    const { rerender } = renderWithErrorBoundary(<b>{{}}</b>);

    rerender(<b>{{}}</b>, {
      i18nStrings: { descriptionText: 'Try again.', components: { Feedback } },
    });
    expect(findDescription().getElement()).toHaveTextContent('Try again.');
    expect(findFeedbackAction()).toBe(null);

    rerender(<b>{{}}</b>, {
      i18nStrings: {
        descriptionText: 'Try again.',
        components: { Feedback },
      },
    });
    expect(findDescription().getElement()).toHaveTextContent('Try again.');
    expect(findFeedbackAction()).toBe(null);

    rerender(<b>{{}}</b>, {
      i18nStrings: {
        descriptionText: 'Try again, <Feedback>share feedback</Feedback>.',
        components: { Feedback },
      },
    });
    expect(findDescription().getElement()).toHaveTextContent('Try again, share feedback.');
    expect(findFeedbackAction()!.find('a')!.getElement()).toHaveTextContent('share feedback');
    expect(findFeedbackAction()!.find('a')!.getElement()).toHaveAttribute('href', 'https://feed.back');

    rerender(<b>{{}}</b>, {
      i18nStrings: { descriptionText: 'Try again, <Feedback></Feedback>.', components: { Feedback } },
    });
    expect(findDescription().getElement()).toHaveTextContent('Try again, custom.');
    expect(findFeedbackAction()!.find('a')!.getElement()).toHaveTextContent('custom');
    expect(findFeedbackAction()!.find('a')!.getElement()).toHaveAttribute('href', 'https://feed.back');
  });

  test('does not parse self-closing <Feedback/> tags', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nStrings: { descriptionText: 'Try again, <Feedback/>.', components: { Feedback: () => <>custom</> } },
    });
    expect(findDescription().getElement()).toHaveTextContent('Try again, <Feedback/>.');
  });

  test('does not throw when using unknown i18n tags', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nStrings: {
        headerText: 'Ooops, <Link>share feedback</Link>',
        descriptionText: 'Please, <Link>share feedback</Link>',
      },
    });
    expect(findHeader().getElement()).toHaveTextContent('Ooops, <Link>share feedback</Link>');
    expect(findDescription().getElement()).toHaveTextContent('Please, <Link>share feedback</Link>');
  });
});

describe('fallback customization with renderFallback', () => {
  const findCustomHeader = () => findBoundary()!.find('#h');
  const findCustomDescription = () => findBoundary()!.find('#d');
  const findCustomAction = () => findBoundary()!.find('#a');
  const renderFallback = (definition: ErrorBoundaryProps.FallbackProps) => (
    <div>
      <div id="h">{definition.header}</div>
      <div id="d">{definition.description}</div>
      <div id="a">{definition.action}</div>
    </div>
  );

  test('replaces the entire fallback with a custom component', () => {
    renderWithErrorBoundary(<b>{{}}</b>, { renderFallback: () => <div>Ooops!</div> });
    expect(findBoundary()!.getElement().innerHTML).toBe('<div>Ooops!</div>');
    expect(findHeader()).toBe(null);
    expect(findDescription()).toBe(null);
    expect(findFeedbackAction()).toBe(null);
    expect(findRefreshAction()).toBe(null);
  });

  test('uses provider definition as input', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nProvider: {
        'error-boundary': {
          'i18nStrings.headerText': 'Ooops!',
          'i18nStrings.descriptionText': 'Try again.',
          'i18nStrings.refreshActionText': 'Refresh',
        },
      },
      renderFallback,
    });
    expect(findHeader().getElement().textContent).toBe('Ooops!');
    expect(findCustomHeader()!.getElement().textContent).toBe('Ooops!');
    expect(findDescription().getElement().textContent).toBe('Try again.');
    expect(findCustomDescription()!.getElement().textContent).toBe('Try again.');
    expect(findRefreshAction()!.getElement().textContent).toBe('Refresh');
    expect(findCustomAction()!.getElement().textContent).toBe('Refresh');
  });

  test('uses i18n definition as input', () => {
    renderWithErrorBoundary(<b>{{}}</b>, {
      i18nStrings: {
        headerText: 'Ooops!',
        refreshActionText: 'Refresh',
        descriptionText: 'Try again and <Feedback>report</Feedback>.',
        components: { Feedback: ({ children }) => <a href="https://feed.back">{children}</a> },
      },
      renderFallback,
    });
    expect(findHeader().getElement().textContent).toBe('Ooops!');
    expect(findCustomHeader()!.getElement().textContent).toBe('Ooops!');
    expect(findDescription().getElement().textContent).toBe('Try again and report.');
    expect(findCustomDescription()!.getElement().textContent).toBe('Try again and report.');
    expect(findFeedbackAction()!.getElement().textContent).toBe('report');
    expect(findAction()!.getElement().textContent).toBe('Refresh');
    expect(findCustomAction()!.getElement().textContent).toBe('Refresh');
  });
});

describe('error propagation and suppressNested', () => {
  test('adds error boundary id to the data attribute', () => {
    const findBoundary = (id: string) => createWrapper().find(`[data-awsui-boundary-id="${id}"]`)!.findErrorBoundary()!;

    renderWithErrorBoundary(<b>{{}}</b>, {
      errorBoundaryId: 'test-id1',
      i18nStrings: { headerText: 'One' },
    });
    renderWithErrorBoundary(<b>{{}}</b>, {
      errorBoundaryId: 'test-id2',
      i18nStrings: { headerText: 'Two' },
    });
    expect(findBoundary('test-id1').findHeader().getElement()).toHaveTextContent('One');
    expect(findBoundary('test-id2').findHeader().getElement()).toHaveTextContent('Two');
  });

  test('error is captured by the closest boundary', () => {
    const onErrorOuter = jest.fn();
    const onErrorInner = jest.fn();
    render(
      <ErrorBoundary onError={onErrorOuter} i18nStrings={{ headerText: 'outer' }} errorBoundaryId="outer">
        <div>
          <ErrorBoundary onError={onErrorInner} i18nStrings={{ headerText: 'inner' }} errorBoundaryId="inner">
            <div>{{}}</div>
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    );
    expect(findHeader().getElement()).toHaveTextContent('inner');
    expect(onErrorOuter).not.toHaveBeenCalled();
    expect(onErrorInner).toHaveBeenCalledWith({
      error: expect.any(Error),
      errorInfo: expect.any(Object),
      errorBoundaryId: 'inner',
    });
  });

  test.each<{ description: string; boundaries: BoundaryTestSpec[]; expected: string }>([
    {
      description: 'suppresses boundaries deeply',
      boundaries: [
        createBoundary('l1', { suppressNested: true }),
        createBoundary('l2', { suppressible: true }),
        createBoundary('l3', { suppressible: true }),
      ],
      expected: 'l1',
    },
    {
      description: 'does not suppress boundary with suppressible=false',
      boundaries: [
        createBoundary('l1', { suppressNested: true }),
        createBoundary('l2', { suppressible: true }),
        createBoundary('l3', { suppressible: false }),
      ],
      expected: 'l3',
    },
    {
      description: 'does not suppress boundary under suppressible=false',
      boundaries: [
        createBoundary('l1', { suppressNested: true }),
        createBoundary('l2', { suppressible: false }),
        createBoundary('l3', { suppressible: true }),
      ],
      expected: 'l3',
    },
    {
      description: 'can use suppress nested and suppressible together',
      boundaries: [
        createBoundary('l1', { suppressNested: true }),
        createBoundary('l2', { suppressNested: true, suppressible: false }),
        createBoundary('l3', { suppressible: true }),
      ],
      expected: 'l2',
    },
  ])('suppressNested and suppressible: $description', ({ boundaries, expected }) => {
    render(<Recursive boundaries={boundaries} />);
    expect(findHeader().getElement()).toHaveTextContent(expected);
    for (const { onError, errorBoundaryId } of boundaries.filter(b => 'onError' in b)) {
      if (errorBoundaryId === expected) {
        expect(onError).toHaveBeenCalledWith({
          error: expect.any(Error),
          errorInfo: expect.any(Object),
          errorBoundaryId,
        });
      } else {
        expect(onError).not.toHaveBeenCalled();
      }
    }
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

describe('built-in error boundaries', () => {
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
      <ErrorBoundary onError={onError} i18nStrings={{ headerText: 'x' }} errorBoundaryId="x">
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
    expect(onError).toHaveBeenCalledWith({
      error: expect.any(Error),
      errorInfo: expect.any(Object),
      errorBoundaryId: 'x',
    });
  });

  test.each<{ description: string; boundaries: BoundaryTestSpec[]; expected: string }>([
    {
      description: 'suppresses built-in boundaries deeply',
      boundaries: [
        createBoundary('standalone', { suppressNested: true }),
        createBuiltInBoundary({}),
        createBuiltInBoundary({}),
      ],
      expected: 'standalone',
    },
    {
      description: 'suppresses built-in boundary under suppressible=true',
      boundaries: [
        createBoundary('outer', { suppressNested: true }),
        createBuiltInBoundary({}),
        createBoundary('inner', { suppressible: true }),
        createBuiltInBoundary({}),
      ],
      expected: 'outer',
    },
    {
      description: 'does not suppress built-in boundary under suppressible=false',
      boundaries: [
        createBoundary('outer', { suppressNested: true }),
        createBuiltInBoundary({}),
        createBoundary('inner', { suppressible: false }),
        createBuiltInBoundary({}),
      ],
      expected: 'built-in(inner)',
    },
  ])('suppressing built-in boundaries, $description', ({ boundaries, expected }) => {
    render(<Recursive boundaries={boundaries} />);
    expect(findBoundary()!.getElement().parentElement!.textContent).toBe(expected);
    for (const { onError, errorBoundaryId } of boundaries.filter(b => 'onError' in b)) {
      if (errorBoundaryId && expected.includes(errorBoundaryId)) {
        expect(onError).toHaveBeenCalledWith({
          error: expect.any(Error),
          errorInfo: expect.any(Object),
          errorBoundaryId,
        });
      } else {
        expect(onError).not.toHaveBeenCalled();
      }
    }
  });

  test('built-in error boundaries are suppressed when suppress nested is used on built-in error boundary', () => {
    const onError = jest.fn();
    render(
      <ErrorBoundary onError={onError} i18nStrings={{ headerText: 'x' }} errorBoundaryId="x">
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
    expect(onError).toHaveBeenCalledWith({
      error: expect.any(Error),
      errorInfo: expect.any(Object),
      errorBoundaryId: 'x',
    });
  });

  test('built-in error boundaries can add a wrapper fallback output', () => {
    render(
      <ErrorBoundary onError={() => {}} i18nStrings={{ headerText: 'X' }}>
        <BuiltInErrorBoundary wrapper={content => <div id="wrapper">{content}</div>}>
          <div>{{}}</div>
        </BuiltInErrorBoundary>
      </ErrorBoundary>
    );
    expect(createWrapper().find('#wrapper')).not.toBe(null);
    expect(createWrapper().find('#wrapper')!.findErrorBoundary()).not.toBe(null);
    expect(createWrapper().find('#wrapper')!.findErrorBoundary()!.findHeader().getElement()).toHaveTextContent('X');
  });

  test('built-in error boundaries can use both renderFallback and wrapper', () => {
    render(
      <ErrorBoundary onError={() => {}} renderFallback={() => <b>X</b>}>
        <BuiltInErrorBoundary wrapper={content => <div id="wrapper">{content}</div>}>
          <div>{{}}</div>
        </BuiltInErrorBoundary>
      </ErrorBoundary>
    );
    expect(createWrapper().find('#wrapper')).not.toBe(null);
    expect(createWrapper().find('#wrapper')!.findErrorBoundary()).not.toBe(null);
    expect(createWrapper().find('#wrapper')!.findErrorBoundary()!.getElement().innerHTML).toBe('<b>X</b>');
  });
});

describe('default behaviors', () => {
  let originalLocation: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalLocation = Object.getOwnPropertyDescriptor(window, 'location');
  });

  afterEach(() => {
    if (originalLocation) {
      Object.defineProperty(window, 'location', originalLocation);
    }
  });

  test('window reload is called when the refresh action is clicked', () => {
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', { configurable: true, value: { reload: mockReload } });

    renderWithErrorBoundary(<b>{{}}</b>);
    findRefreshAction()!.click();
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  test('hides default refresh in cross-origin iframes', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        get href() {
          throw new Error();
        },
      },
    });

    renderWithErrorBoundary(<b>{{}}</b>);
    expect(findRefreshAction()).toBe(null);
  });
});

describe('base props passing to fallback', () => {
  test('class name is added to the fallback', () => {
    renderWithErrorBoundary(<b>{{}}</b>, { className: 'test' });
    expect(findBoundary()!.getElement()).toHaveClass('test');
  });

  test('data-attributes are added to the fallback', () => {
    renderWithErrorBoundary(<b>{{}}</b>, { 'data-resource-guidance': 'off' });
    expect(findBoundary()!.getElement().dataset.resourceGuidance).toBe('off');
  });

  test('other attributes are not added to the fallback', () => {
    renderWithErrorBoundary(<b>{{}}</b>, { 'aria-label': 'label' } as any);
    expect(findBoundary()!.getElement()).not.toHaveAttribute('aria-label');
  });
});

describe('__awsui__ API', () => {
  test('error state can be forced with forceError() and cleared with clearForcedError()', () => {
    const onError = jest.fn();
    render(
      <ErrorBoundary onError={onError} renderFallback={() => <div>Ooops!</div>} errorBoundaryId="X">
        <div />
      </ErrorBoundary>
    );
    expect(findBoundary()).toBe(null);

    createWrapper().find('[data-awsui-boundary-id="X"]')!.getElement().__awsui__!.forceError!();
    expect(findBoundary()!.getElement().textContent).toBe('Ooops!');
    expect(onError).not.toHaveBeenCalled();

    createWrapper().find('[data-awsui-boundary-id="X"]')!.getElement().__awsui__!.clearForcedError!();
    expect(findBoundary()).toBe(null);
  });

  test('clearForcedError() has no effect on the real error state', () => {
    render(
      <ErrorBoundary onError={() => {}} renderFallback={() => <div>Ooops!</div>} errorBoundaryId="X">
        <div>{{}}</div>
      </ErrorBoundary>
    );
    expect(findBoundary()).not.toBe(null);

    createWrapper().find('[data-awsui-boundary-id="X"]')!.getElement().__awsui__!.forceError!();
    expect(findBoundary()).not.toBe(null);

    createWrapper().find('[data-awsui-boundary-id="X"]')!.getElement().__awsui__!.clearForcedError!();
    expect(findBoundary()).not.toBe(null);
  });
});

describe('component misuse', () => {
  test('error boundary shows fallback even if the required onError callback is not provided', () => {
    const ErrorBoundaryCustom = ErrorBoundary as React.ComponentType<Omit<ErrorBoundaryProps, 'onError'>>;
    render(<ErrorBoundaryCustom i18nStrings={{ headerText: 'Ooops!' }}>{{}}</ErrorBoundaryCustom>);
    expect(findHeader()!.getElement().textContent).toBe('Ooops!');
  });
});
