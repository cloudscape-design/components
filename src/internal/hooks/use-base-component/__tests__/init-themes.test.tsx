// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import useBaseComponent, {
  clearThemesInitialized,
  InternalBaseComponentProps,
} from '../../../../../lib/components/internal/hooks/use-base-component';

const awsuiGlobalFlagsSymbol = Symbol.for('awsui-global-flags');

jest.mock('../../../../../lib/components/internal/environment', () => ({
  ALWAYS_VISUAL_REFRESH: true,
  PACKAGE_SOURCE: 'components',
  PACKAGE_VERSION: '3.0.0',
  THEME: 'console',
}));

function InternalDemo({ __internalRootRef }: InternalBaseComponentProps) {
  return <div ref={__internalRootRef}>Demo</div>;
}

function Demo() {
  const baseComponentProps = useBaseComponent('DemoComponent');
  return <InternalDemo {...baseComponentProps} />;
}

describe('useBaseComponent initThemes with ALWAYS_VISUAL_REFRESH=true', () => {
  afterEach(() => {
    clearThemesInitialized();
    document.body.classList.remove('awsui-one-theme');
    document.body.classList.remove('awsui-visual-refresh');
    delete (window as any)[awsuiGlobalFlagsSymbol];
  });

  test('should add awsui-one-theme class when oneTheme flag is set', () => {
    (window as any)[awsuiGlobalFlagsSymbol] = { oneTheme: true };
    render(<Demo />);
    expect(document.body).toHaveClass('awsui-one-theme');
  });

  test('should not add awsui-visual-refresh class', () => {
    (window as any)[awsuiGlobalFlagsSymbol] = { oneTheme: true };
    render(<Demo />);
    expect(document.body).not.toHaveClass('awsui-visual-refresh');
  });

  test('should not add any theme class when no flag is set', () => {
    render(<Demo />);
    expect(document.body).not.toHaveClass('awsui-one-theme');
    expect(document.body).not.toHaveClass('awsui-visual-refresh');
  });
});
