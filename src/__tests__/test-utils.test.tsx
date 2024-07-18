// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// The test-utils directory is compiled in a separate TypeScript task than the rest
// of the project. To make use of the generated wrapper file, tests live outside
// of the test-utils folder.
import React from 'react';
import { render } from 'react-dom';
import { render as renderTestingLibrary } from '@testing-library/react';

import Button from '../../lib/components/button';
import createWrapper from '../../lib/components/test-utils/dom';

describe('createWrapper', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('given attached node when creating a wrapper then no warning is printed', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(React.createElement(Button), container);

    createWrapper(container);

    expect(spy).not.toBeCalled();
  });
  test('given detached node when creating a wrapper then a warning is printed', () => {
    const container = document.createElement('div');
    render(React.createElement(Button), container);

    createWrapper(container);

    expect(spy).toBeCalledTimes(1);
  });
  test('given node rendered with "@testing-library/react" when creating a wrapper then no warning is printed', () => {
    const { container } = renderTestingLibrary(React.createElement(Button));

    createWrapper(container);

    expect(spy).not.toBeCalled();
  });
});
