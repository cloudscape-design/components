// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react';

import FeaturePrompt, { FeaturePromptProps } from '../../../../../lib/components/internal/do-not-use/feature-prompt';
import FeaturePromptWrapper from '../../../../../lib/components/test-utils/dom/internal/feature-prompt';

function renderComponent(jsx: React.ReactElement) {
  const { container, ...rest } = render(jsx);
  const wrapper = new FeaturePromptWrapper(container);

  return { wrapper, ...rest };
}

const TestComponent = ({ onDismiss }: { onDismiss?: FeaturePromptProps['onDismiss'] }) => {
  const featurePromptRef = useRef<FeaturePromptProps.Ref>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={trackRef}>tracked element</div>
      <button
        data-testid="trigger-button"
        onClick={() => {
          featurePromptRef.current?.show();
        }}
      >
        trigger the feature prompt
      </button>
      <button
        data-testid="dismiss-button"
        onClick={() => {
          featurePromptRef.current?.dismiss();
        }}
      >
        dismiss the feature prompt
      </button>
      <FeaturePrompt
        ref={featurePromptRef}
        position="left"
        header={<div>header</div>}
        content={<div>content</div>}
        onDismiss={onDismiss}
        getTrack={() => trackRef.current}
        trackKey="track-element"
      />
    </div>
  );
};

describe('FeaturePrompt', () => {
  test('should render feature prompt only after calling show method', () => {
    const { getByTestId, wrapper } = renderComponent(<TestComponent />);

    expect(wrapper.findContent()).toBeFalsy();

    getByTestId('trigger-button').click();

    expect(wrapper.findHeader()!.getElement()).toHaveTextContent('header');
    expect(wrapper.findContent()!.getElement()).toHaveTextContent('content');
  });

  test('should dismiss feature prompt on shifting focus away', () => {
    const { getByTestId, wrapper } = renderComponent(<TestComponent />);

    expect(wrapper.findContent()).toBeFalsy();

    getByTestId('trigger-button').click();

    expect(wrapper.findHeader()!.getElement()).toHaveTextContent('header');
    expect(wrapper.findContent()!.getElement()).toHaveTextContent('content');

    fireEvent.blur(wrapper.findContent()!.getElement());
    expect(wrapper.findContent()).toBeFalsy();
  });

  test('should call component onDismiss when dismissed via close button', () => {
    const onDismissMock = jest.fn();
    const { getByTestId, wrapper } = renderComponent(<TestComponent onDismiss={onDismissMock} />);

    getByTestId('trigger-button').click();
    expect(wrapper.findContent()).toBeTruthy();

    wrapper.findDismissButton()!.click();

    expect(onDismissMock).toHaveBeenCalledTimes(1);
    expect(wrapper.findContent()).toBeFalsy();
  });

  test('should call component onDismiss when dismissed via blur', () => {
    const onDismissMock = jest.fn();
    const { getByTestId, wrapper } = renderComponent(<TestComponent onDismiss={onDismissMock} />);

    getByTestId('trigger-button').click();
    expect(wrapper.findContent()).toBeTruthy();

    fireEvent.blur(wrapper.findContent()!.getElement());

    expect(onDismissMock).toHaveBeenCalledTimes(1);
    expect(wrapper.findContent()).toBeFalsy();
  });
});
