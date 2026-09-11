// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import GenaiContextPanel, {
  createGenaiContextPanelDrawer,
} from '../../../../../lib/components/internal/components/genai-context-panel';

describe('GenaiContextPanel', () => {
  test('renders the header text and current system prompt value', () => {
    render(<GenaiContextPanel systemPrompt="be concise" i18nStrings={{ headerText: 'GenAI context' }} />);

    expect(screen.getByText('GenAI context')).toBeInTheDocument();
    expect(screen.getByDisplayValue('be concise')).toBeInTheDocument();
  });

  test('fires onSystemPromptChange when the prompt is edited', () => {
    const onSystemPromptChange = jest.fn();
    render(<GenaiContextPanel systemPrompt="" onSystemPromptChange={onSystemPromptChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });

    expect(onSystemPromptChange).toHaveBeenCalledTimes(1);
    expect(onSystemPromptChange.mock.calls[0][0].detail).toEqual({ value: 'hello' });
  });

  test('shows an empty state when there are no context files', () => {
    render(<GenaiContextPanel contextFiles={[]} />);

    expect(screen.getByText('No files added to the assistant context yet.')).toBeInTheDocument();
  });

  test('renders a model selector only when models are provided', () => {
    const { rerender } = render(<GenaiContextPanel />);
    expect(screen.queryByText('Model')).not.toBeInTheDocument();

    rerender(<GenaiContextPanel models={[{ id: 'm1', label: 'Model One' }]} selectedModelId="m1" />);
    expect(screen.getByText('Model')).toBeInTheDocument();
  });

  test('fires onContextFilesChange without the removed file when a token is dismissed', () => {
    const onContextFilesChange = jest.fn();
    const fileA = new File(['a'], 'a.txt', { type: 'text/plain' });
    const fileB = new File(['b'], 'b.txt', { type: 'text/plain' });

    render(<GenaiContextPanel contextFiles={[fileA, fileB]} onContextFilesChange={onContextFilesChange} />);

    fireEvent.click(screen.getByLabelText('Remove a.txt (file 1)'));

    expect(onContextFilesChange).toHaveBeenCalledTimes(1);
    expect(onContextFilesChange.mock.calls[0][0].detail.files).toEqual([fileB]);
  });
});

describe('createGenaiContextPanelDrawer', () => {
  test('returns a drawer item with sensible defaults', () => {
    const drawer = createGenaiContextPanelDrawer();

    expect(drawer.id).toBe('genai-context-panel');
    expect(drawer.resizable).toBe(true);
    expect(drawer.defaultSize).toBe(360);
    expect(drawer.trigger?.iconName).toBe('gen-ai');
    expect(drawer.ariaLabels.drawerName).toBe('GenAI context');
    expect(drawer.content).toBeTruthy();
  });

  test('uses the header text as the drawer name and forwards a custom id/badge', () => {
    const drawer = createGenaiContextPanelDrawer({
      id: 'my-drawer',
      badge: true,
      i18nStrings: { headerText: 'Assistant context' },
    });

    expect(drawer.id).toBe('my-drawer');
    expect(drawer.badge).toBe(true);
    expect(drawer.ariaLabels.drawerName).toBe('Assistant context');
  });
});
