// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

export { act } from '@testing-library/react';

/**
 * This file is a port of `renderHook` from @testing-library/react lib
 * The API is only available in v13+, which also requires React v18
 */

export interface RenderHookOptions<Props> {
  initialProps?: Props;
  wrapper?: React.JSXElementConstructor<{ children: React.ReactElement }>;
}

export function renderHook<Result, Props>(
  renderCallback: (initialProps: Props) => Result,
  options: RenderHookOptions<Props> = {}
) {
  const { initialProps, wrapper } = options;
  const result = React.createRef<Result>() as React.MutableRefObject<Result>;

  function TestComponent({ renderCallbackProps }: { renderCallbackProps: Props }) {
    const pendingResult = renderCallback(renderCallbackProps);

    React.useEffect(() => {
      result.current = pendingResult;
    });

    return null;
  }

  const { rerender: baseRerender, unmount } = render(<TestComponent renderCallbackProps={initialProps!} />, {
    wrapper,
  });

  function rerender(rerenderCallbackProps: Props) {
    return baseRerender(<TestComponent renderCallbackProps={rerenderCallbackProps} />);
  }

  return { result, rerender, unmount };
}
