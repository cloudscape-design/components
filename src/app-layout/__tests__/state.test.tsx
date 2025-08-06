// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import { forceMobileModeSymbol } from '../../../lib/components/internal/hooks/use-mobile';
import { describeEachAppLayout, renderComponent } from './utils';

describeEachAppLayout({ themes: ['refresh-toolbar'] }, () => {
  test('content dom reference is preserved when changing state', () => {
    const refSpy = jest.fn();
    const { rerender, wrapper } = renderComponent(
      <AppLayout navigation="testing" content={<div ref={refSpy}>content</div>} />
    );

    expect(refSpy).toHaveBeenCalledTimes(1);
    expect(refSpy).toHaveBeenCalledWith(expect.any(HTMLElement));
    expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');

    refSpy.mockClear();
    rerender(<AppLayout navigationHide={true} navigation="testing" content={<div ref={refSpy}>content</div>} />);
    expect(refSpy).toHaveBeenCalledTimes(0);
    expect(wrapper.findContentRegion().getElement()).toHaveTextContent('content');

    rerender(<></>);
    expect(refSpy).toHaveBeenCalledTimes(1);
    expect(refSpy).toHaveBeenCalledWith(null);
  });

  // does not work without this fix: https://github.com/cloudscape-design/component-toolkit/pull/151
  test.skip('content dom reference is preserved when changing switching between desktop and mobile', () => {
    const refSpy = jest.fn();
    renderComponent(<AppLayout content={<div ref={refSpy}>content</div>} />);

    expect(refSpy).toHaveBeenCalledTimes(1);
    expect(refSpy).toHaveBeenCalledWith(expect.any(HTMLElement));

    refSpy.mockClear();
    const globalWithFlags = globalThis as any;
    globalWithFlags[forceMobileModeSymbol] = !globalWithFlags[forceMobileModeSymbol];
    act(() => {
      window.dispatchEvent(new CustomEvent('resize'));
    });
    expect(refSpy).toHaveBeenCalledTimes(0);

    globalWithFlags[forceMobileModeSymbol] = !globalWithFlags[forceMobileModeSymbol];
    act(() => {
      window.dispatchEvent(new CustomEvent('resize'));
    });
    expect(refSpy).toHaveBeenCalledTimes(0);
  });
});
