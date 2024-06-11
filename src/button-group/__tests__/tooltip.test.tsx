// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tooltip from '../../../lib/components/button-group/tooltip';

describe('Tooltip component', () => {
  let trackRef: {
    current: HTMLDivElement;
  };
  let closeFunction: jest.Mock;

  beforeEach(() => {
    trackRef = { current: document.createElement('div') };
    closeFunction = jest.fn();
  });

  test('renders tooltip if open', () => {
    render(
      <Tooltip trackKey="test-key" trackRef={trackRef} content="Test Content" open={true} close={closeFunction} />
    );

    expect(screen.queryByText('Test Content')).toBeInTheDocument();
  });

  test('tooltip is not rendered if closed', () => {
    render(
      <Tooltip trackKey="test-key" trackRef={trackRef} content="Test Content" open={false} close={closeFunction} />
    );

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  test('calls close function on pointerdown event outside trackRef', () => {
    render(
      <Tooltip trackKey="test-key" trackRef={trackRef} content="Test Content" open={true} close={closeFunction} />
    );

    fireEvent.pointerDown(document);

    expect(closeFunction).toHaveBeenCalled();
  });

  test('does not call close function on pointerdown event inside trackRef', () => {
    document.body.appendChild(trackRef.current);
    render(
      <Tooltip trackKey="test-key" trackRef={trackRef} content="Tooltip Content" open={true} close={closeFunction} />
    );

    fireEvent.pointerDown(trackRef.current);

    expect(closeFunction).not.toHaveBeenCalled();
    document.body.removeChild(trackRef.current);
  });

  test('does not call close function on pointerdown event is tooltip is closed', () => {
    render(
      <Tooltip trackKey="test-key" trackRef={trackRef} content="Test Content" open={false} close={closeFunction} />
    );

    fireEvent.pointerDown(document);

    expect(closeFunction).not.toHaveBeenCalled();
  });

  test('calls close function on Escape keydown event', () => {
    render(
      <Tooltip trackKey="test-key" trackRef={trackRef} content="Tooltip Content" open={true} close={closeFunction} />
    );

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(closeFunction).toHaveBeenCalled();
  });

  test('calls close function on tooltip:toggle custom event with different trackKey', () => {
    render(
      <Tooltip trackKey="test-key" trackRef={trackRef} content="Tooltip Content" open={true} close={closeFunction} />
    );

    fireEvent(window, new CustomEvent('tooltip:toggle', { detail: { trackKey: 'different-key', open: true } }));

    expect(closeFunction).toHaveBeenCalled();
  });

  test('does not call close function on tooltip:toggle custom event with same trackKey', () => {
    render(
      <Tooltip trackKey="test-key" trackRef={trackRef} content="Tooltip Content" open={true} close={closeFunction} />
    );

    fireEvent(window, new CustomEvent('tooltip:toggle', { detail: { trackKey: 'test-key', open: true } }));

    expect(closeFunction).not.toHaveBeenCalled();
  });
});
