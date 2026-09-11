// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import VisualContext, { useVisualContext } from '../../../../../lib/components/internal/components/visual-context';

function ContextProbe({ element }: { element: 'html' | 'svg' | 'none' }) {
  const ref = useRef<Element | null>(null);
  const value = useVisualContext(ref);

  return (
    <>
      {element === 'html' && <div ref={node => void (ref.current = node)} />}
      {element === 'svg' && <svg ref={node => void (ref.current = node)} />}
      {element === 'none' && <div />}
      <div data-testid="context">{value}</div>
    </>
  );
}

describe('useVisualContext', () => {
  test('resolves context from an HTML start node', async () => {
    render(
      <VisualContext contextName="alert">
        <ContextProbe element="html" />
      </VisualContext>
    );

    await waitFor(() => {
      expect(screen.getByTestId('context')).toHaveTextContent('alert');
    });
  });

  test('resolves context from an SVG start node without throwing', async () => {
    expect(() =>
      render(
        <VisualContext contextName="alert">
          <ContextProbe element="svg" />
        </VisualContext>
      )
    ).not.toThrow();

    await waitFor(() => {
      expect(screen.getByTestId('context')).toHaveTextContent('alert');
    });
  });

  test('returns an empty string when no visual context ancestor exists', async () => {
    render(<ContextProbe element="none" />);

    await waitFor(() => {
      expect(screen.getByTestId('context')).toBeEmptyDOMElement();
    });
  });
});
