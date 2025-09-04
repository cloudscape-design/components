// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { HTMLAttributes, MouseEventHandler } from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import WithNativeAttributes from '../with-native-attributes';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  warnOnce: jest.fn(),
}));

const mockedWarnOnce = warnOnce as jest.MockedFunction<typeof warnOnce>;

describe('WithNativeAttributes', () => {
  beforeEach(() => {
    mockedWarnOnce.mockClear();
  });

  test('renders with basic props', () => {
    const { container } = render(
      <WithNativeAttributes tag="div" componentName="" nativeAttributes={{}}>
        Test content
      </WithNativeAttributes>
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild?.nodeName).toBe('DIV');
    expect(container.firstChild?.textContent).toBe('Test content');
  });
  test('works with different HTML tags', () => {
    const { container: spanContainer } = render(
      <WithNativeAttributes tag="span" componentName="" nativeAttributes={{}}>
        Span content
      </WithNativeAttributes>
    );

    const { container: buttonContainer } = render(
      <WithNativeAttributes tag="button" componentName="" nativeAttributes={{}}>
        Button content
      </WithNativeAttributes>
    );

    expect(spanContainer.firstChild?.nodeName).toBe('SPAN');
    expect(buttonContainer.firstChild?.nodeName).toBe('BUTTON');
  });

  test('handles empty nativeAttributes', () => {
    const { container } = render(
      <WithNativeAttributes<HTMLDivElement, HTMLAttributes<HTMLDivElement>>
        tag="div"
        componentName=""
        className="test-class"
        nativeAttributes={undefined}
      >
        Test content
      </WithNativeAttributes>
    );

    const element = container.firstElementChild!;
    expect(element).toHaveClass('test-class');
    expect(element.textContent).toBe('Test content');
  });

  test('concatenates className from rest props and nativeAttributes', () => {
    const { container } = render(
      <WithNativeAttributes
        tag="div"
        componentName=""
        className="base-class"
        nativeAttributes={{ className: 'native-class' }}
      >
        Test content
      </WithNativeAttributes>
    );

    const element = container.firstElementChild!;
    expect(element).toHaveClass('base-class');
    expect(element).toHaveClass('native-class');
  });

  test('merges style objects from rest props and nativeAttributes', () => {
    const { container } = render(
      <WithNativeAttributes
        tag="div"
        componentName=""
        style={{ color: 'red', fontSize: '16px' }}
        nativeAttributes={{ style: { backgroundColor: 'blue', fontSize: '18px' } }}
      >
        Test content
      </WithNativeAttributes>
    );

    const element = container.firstChild as HTMLElement;
    expect(element.style.color).toBe('red');
    expect(element.style.backgroundColor).toBe('blue');
    expect(element.style.fontSize).toBe('18px'); // nativeAttributes should override
  });

  test('chains event handlers', () => {
    const nativeHandler = jest.fn();
    const restHandler = jest.fn();

    const { container } = render(
      <WithNativeAttributes
        tag="button"
        componentName=""
        onClick={restHandler}
        nativeAttributes={{ onClick: nativeHandler }}
      >
        Click me
      </WithNativeAttributes>
    );

    const button = container.firstChild as HTMLButtonElement;
    button.click();

    expect(nativeHandler).toHaveBeenCalled();
    expect(restHandler).toHaveBeenCalled();
  });

  test('prevents rest handler execution when event is cancelled', () => {
    const nativeHandler = jest.fn((event => event.preventDefault()) as MouseEventHandler);
    const restHandler = jest.fn();

    const { container } = render(
      <WithNativeAttributes
        tag="button"
        componentName=""
        onClick={restHandler}
        nativeAttributes={{ onClick: nativeHandler }}
      >
        Click me
      </WithNativeAttributes>
    );

    const button = container.firstChild as HTMLButtonElement;
    button.click();

    expect(nativeHandler).toHaveBeenCalled();
    expect(restHandler).not.toHaveBeenCalled();
  });

  test('overrides other attributes and shows warning', () => {
    const { container } = render(
      <WithNativeAttributes
        tag="div"
        componentName="my-component"
        id="original-id"
        nativeAttributes={{ id: 'override-id' }}
      >
        Test content
      </WithNativeAttributes>
    );

    const element = container.firstElementChild!;
    expect(element.id).toBe('override-id');
    expect(mockedWarnOnce).toHaveBeenCalledWith(
      'my-component',
      'Overriding native attribute [id] which has a Cloudscape-provided value'
    );
  });

  test('passes through data attributes without warning', () => {
    const { container } = render(
      <WithNativeAttributes tag="div" componentName="" nativeAttributes={{ 'data-testid': 'test-element' }}>
        Test content
      </WithNativeAttributes>
    );

    const element = container.firstElementChild!;
    expect(element).toHaveAttribute('data-testid', 'test-element');
    expect(mockedWarnOnce).not.toHaveBeenCalled();
  });

  test('does not allow children to be overrwitten', () => {
    const { container } = render(
      <WithNativeAttributes tag="div" componentName="" nativeAttributes={{ children: 'Something custom' } as any}>
        Test content
      </WithNativeAttributes>
    );

    expect(container).toHaveTextContent('Test content');
  });
});
