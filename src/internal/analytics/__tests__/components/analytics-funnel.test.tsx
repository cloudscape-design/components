// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { FunnelMetrics } from '../../../../../lib/components/internal/analytics';
import { DATA_ATTR_FUNNEL_INTERACTION_ID } from '../../../../../lib/components/internal/analytics/selectors';
import {
  AnalyticsFunnel,
  AnalyticsFunnelStep,
  AnalyticsFunnelSubStep,
} from '../../../../../lib/components/internal/analytics/components/analytics-funnel';
import { useFunnel, useFunnelSubStep } from '../../../../../lib/components/internal/analytics/hooks/use-funnel';
import Button from '../../../../../lib/components/button';
import FormField from '../../../../../lib/components/form-field';
import Container from '../../../../../lib/components/container';
import Cards from '../../../../../lib/components/cards';
import ExpandableSection from '../../../../../lib/components/expandable-section';

import { mockedFunnelInteractionId, mockFunnelMetrics } from '../mocks';

describe('AnalyticsFunnel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockFunnelMetrics();
  });

  test('renders children', () => {
    const { getByText } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <div>Child Content</div>
      </AnalyticsFunnel>
    );

    const childElement = getByText('Child Content');
    expect(childElement).toBeInTheDocument();
  });

  test('adds analytics data attributes to root node', () => {
    const ChildComponent = () => {
      const { funnelProps } = useFunnel();

      return <div data-testid="root" {...funnelProps} />;
    };

    const optionalStepNumbers = [1, 3];
    const totalFunnelSteps = 5;

    const { getByTestId } = render(
      <AnalyticsFunnel
        funnelType="single-page"
        optionalStepNumbers={optionalStepNumbers}
        totalFunnelSteps={totalFunnelSteps}
      >
        <ChildComponent />
      </AnalyticsFunnel>
    );

    // Check if the root element has a specific data attribute
    expect(getByTestId('root')).toHaveAttribute(DATA_ATTR_FUNNEL_INTERACTION_ID, expect.any(String));
  });

  test('calls funnelStart when the component renders', () => {
    render(<AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1} />);

    expect(FunnelMetrics.funnelStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStart).toHaveBeenCalledWith(
      expect.objectContaining({
        funnelNameSelector: expect.any(String),
      })
    );
  });

  test('calls funnelComplete when the form is submitted without errors', async () => {
    // ChildComponent is a sample component that renders a button to call funnelSubmit
    const ChildComponent = () => {
      const { funnelSubmit } = useFunnel();

      return <button onClick={funnelSubmit}>Submit</button>;
    };

    const { getByText } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <ChildComponent />
      </AnalyticsFunnel>
    );

    fireEvent.click(getByText('Submit')); // Trigger the button click event
    await waitFor(() => {
      expect(FunnelMetrics.funnelComplete).toHaveBeenCalledTimes(1);
    });
  });

  test('does not call funnelComplete when the form is submitted with errors', () => {
    // ChildComponent is a sample component that renders a button to call funnelSubmit
    const ChildComponent = ({ renderError }: { renderError: boolean }) => {
      const { funnelSubmit } = useFunnel();

      return (
        <>
          <button onClick={funnelSubmit}>Submit</button>
          <FormField errorText={renderError ? 'An error' : undefined} />
        </>
      );
    };

    const { getByText, rerender } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <ChildComponent renderError={false} />
      </AnalyticsFunnel>
    );

    fireEvent.click(getByText('Submit')); // Trigger the button click event

    rerender(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <ChildComponent renderError={true} />
      </AnalyticsFunnel>
    );

    jest.runAllTimers();
    expect(FunnelMetrics.funnelComplete).not.toHaveBeenCalled();
  });

  test('calls funnelComplete once when the form is unmounted during the validation phase', () => {
    // ChildComponent is a sample component that renders a button to call funnelSubmit
    const ChildComponent = () => {
      const { funnelSubmit } = useFunnel();

      return <button onClick={funnelSubmit}>Submit</button>;
    };

    const { getByText, unmount } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <ChildComponent />
      </AnalyticsFunnel>
    );

    fireEvent.click(getByText('Submit')); // Trigger the button click event
    unmount();

    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledTimes(1);

    jest.runAllTimers();
    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledTimes(1);
  });

  test('does not emit events while the form is in a loading state', () => {
    // ChildComponent is a sample component that renders a button to call funnelSubmit
    const ChildComponent = () => {
      const { funnelSubmit } = useFunnel();

      return <button onClick={funnelSubmit}>Submit</button>;
    };

    const { getByText, rerender } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <ChildComponent />
        <Button />
      </AnalyticsFunnel>
    );

    fireEvent.click(getByText('Submit')); // Trigger the button click event

    rerender(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <ChildComponent />
        <Button loading={true} />
      </AnalyticsFunnel>
    );

    jest.runOnlyPendingTimers();

    expect(FunnelMetrics.funnelComplete).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelSuccessful).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelCancelled).not.toHaveBeenCalled();

    rerender(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <ChildComponent />
        <Button />
      </AnalyticsFunnel>
    );

    jest.runAllTimers();

    expect(FunnelMetrics.funnelComplete).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSuccessful).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelCancelled).not.toHaveBeenCalled();
  });

  test('calls funnelSuccessful when the component unmounts directly after submitting', () => {
    // ChildComponent is a sample component that renders a button to call funnelSubmit
    const ChildComponent = () => {
      const { funnelSubmit } = useFunnel();

      return <button onClick={funnelSubmit}>Submit</button>;
    };

    const { unmount, getByText } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <ChildComponent />
      </AnalyticsFunnel>
    );
    expect(FunnelMetrics.funnelSuccessful).not.toHaveBeenCalled();

    fireEvent.click(getByText('Submit')); // Trigger the button click event

    unmount();
    expect(FunnelMetrics.funnelSuccessful).toHaveBeenCalledTimes(1);
  });

  test('does not call funnelSuccessful when the form is submitted without errors but not unmounted', () => {
    // ChildComponent is a sample component that renders a button to call funnelSubmit
    const ChildComponent = () => {
      const { funnelSubmit } = useFunnel();

      return <button onClick={funnelSubmit}>Submit</button>;
    };

    const { getByText } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <ChildComponent />
      </AnalyticsFunnel>
    );
    expect(FunnelMetrics.funnelSuccessful).not.toHaveBeenCalled();

    fireEvent.click(getByText('Submit')); // Trigger the button click event

    jest.runAllTimers();

    expect(FunnelMetrics.funnelSuccessful).not.toHaveBeenCalled();
  });

  test('calls funnelSuccessful when the form is submitted and then later unmounted', () => {
    // ChildComponent is a sample component that renders a button to call funnelSubmit
    const ChildComponent = () => {
      const { funnelSubmit } = useFunnel();

      return <button onClick={funnelSubmit}>Submit</button>;
    };

    const { unmount, getByText } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={3}>
        <ChildComponent />
      </AnalyticsFunnel>
    );
    expect(FunnelMetrics.funnelSuccessful).not.toHaveBeenCalled();

    fireEvent.click(getByText('Submit')); // Trigger the button click event

    jest.runAllTimers();

    expect(FunnelMetrics.funnelSuccessful).not.toHaveBeenCalled();

    unmount();

    expect(FunnelMetrics.funnelSuccessful).toHaveBeenCalledTimes(1);
  });

  test('calls funnelCancelled when the component is unmounted without submitting', () => {
    // ChildComponent is a sample component that renders a button to call funnelCancel
    const ChildComponent = () => {
      const { funnelCancel } = useFunnel();

      return <button onClick={funnelCancel}>Cancel</button>;
    };

    const { unmount } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <ChildComponent />
      </AnalyticsFunnel>
    );
    expect(FunnelMetrics.funnelCancelled).not.toHaveBeenCalled();

    unmount();

    expect(FunnelMetrics.funnelComplete).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelCancelled).toHaveBeenCalledTimes(1);
  });
});

describe('AnalyticsFunnelStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFunnelMetrics();
  });

  test('renders children components', () => {
    const { getByText } = render(
      <AnalyticsFunnelStep stepNumber={1} stepNameSelector=".step-name-selector">
        <div>Child Content</div>
      </AnalyticsFunnelStep>
    );

    const childElement = getByText('Child Content');
    expect(childElement).toBeInTheDocument();
  });

  test('calls funnelStepStart with the correct arguments when the step mounts', () => {
    const stepNumber = 2; // Must be different to mocked focussed element
    const stepNameSelector = '.step-name-selector';

    render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={stepNumber} stepNameSelector={stepNameSelector}>
          Step Content
          <Container />
          <Cards items={[]} cardDefinition={{}} />
          <ExpandableSection variant="container" />
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledWith({
      funnelInteractionId: mockedFunnelInteractionId,
      stepNumber,
      stepNameSelector,
      subStepAllSelector: expect.any(String),
      totalSubSteps: 3,
    });
  });

  test('calls funnelStepComplete with the correct arguments when the step unmounts', () => {
    const stepNumber = 1;
    const stepNameSelector = '.step-name-selector';

    const { rerender } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={stepNumber} stepNameSelector={stepNameSelector}>
          Step Content
          <Container />
          <Cards items={[]} cardDefinition={{}} />
          <ExpandableSection variant="container" />
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelStepComplete).not.toHaveBeenCalled();

    rerender(<AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1} />);

    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledWith({
      funnelInteractionId: mockedFunnelInteractionId,
      stepNumber,
      stepNameSelector,
      subStepAllSelector: expect.any(String),
      totalSubSteps: 3,
    });
  });

  test('does not call funnelStepComplete when the funnel unmounts without submitting', () => {
    const stepNumber = 1;
    const stepNameSelector = '.step-name-selector';

    const { unmount } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={stepNumber} stepNameSelector={stepNameSelector}>
          Step Content
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    unmount();

    expect(FunnelMetrics.funnelStepComplete).not.toHaveBeenCalled();
  });

  test('calls funnelStepStart and funnelStepComplete when stepNumber changes', () => {
    const stepNumber = 1;
    const stepNameSelector = '.step-name-selector';

    const { rerender } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={stepNumber} stepNameSelector={stepNameSelector}>
          Step Content
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelStepComplete).not.toHaveBeenCalled();

    rerender(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={stepNumber + 1} stepNameSelector={stepNameSelector}>
          Step Content
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelStepStart).toHaveBeenCalledTimes(2);
    expect(FunnelMetrics.funnelStepComplete).toHaveBeenCalledTimes(1);
  });

  test('does not call funnelStepStart when not in a AnalyticsFunnel Context', () => {
    render(
      <AnalyticsFunnelStep stepNumber={1} stepNameSelector=".step-name-selector">
        Step Content
      </AnalyticsFunnelStep>
    );

    expect(FunnelMetrics.funnelStepStart).not.toHaveBeenCalled();
  });

  test('does not call funnetStepComplete when not in a AnalyticsFunnel Context', () => {
    const { unmount } = render(
      <AnalyticsFunnelStep stepNumber={1} stepNameSelector=".step-name-selector">
        Step Content
      </AnalyticsFunnelStep>
    );

    unmount();
    expect(FunnelMetrics.funnelStepComplete).not.toHaveBeenCalled();
  });
});

describe('AnalyticsFunnelSubStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFunnelMetrics();
  });

  test('renders children components', () => {
    const { getByText } = render(
      <AnalyticsFunnelSubStep>
        <div>Substep Content</div>
      </AnalyticsFunnelSubStep>
    );

    const childElement = getByText('Substep Content');
    expect(childElement).toBeInTheDocument();
  });

  test('does not call funnelSubStepStart or funnelSubStepComplete when funnelInteractionId is not present', () => {
    const { getByTestId } = render(
      <AnalyticsFunnelSubStep>
        <div data-testid="substep-content">Substep Content</div>
      </AnalyticsFunnelSubStep>
    );

    fireEvent.focus(getByTestId('substep-content'));

    expect(FunnelMetrics.funnelSubStepStart).not.toHaveBeenCalled();
    expect(FunnelMetrics.funnelSubStepComplete).not.toHaveBeenCalled();
  });

  test('calls funnelSubStepStart with the correct arguments when the substep is focused', () => {
    // ChildComponent is a sample component that renders a button to call funnelSubmit
    const ChildComponent = () => {
      const { subStepRef, funnelSubStepProps } = useFunnelSubStep();

      return (
        <div ref={subStepRef} {...funnelSubStepProps}>
          <input data-testid="input" />
        </div>
      );
    };
    const stepNumber = 1;
    const stepNameSelector = '.step-name-selector';

    const { getByTestId } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={stepNumber} stepNameSelector={stepNameSelector}>
          <AnalyticsFunnelSubStep>
            <ChildComponent />
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    fireEvent.focus(getByTestId('input'));

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledWith({
      funnelInteractionId: mockedFunnelInteractionId,
      stepNumber,
      stepNameSelector,
      subStepAllSelector: expect.any(String),
      subStepSelector: expect.any(String),
      subStepNameSelector: expect.any(String),
    });
  });

  test('calls funnelSubStepComplete with the correct arguments when the substep loses focus', () => {
    const ChildComponent = () => {
      const { subStepRef, funnelSubStepProps } = useFunnelSubStep();

      return (
        <div ref={subStepRef} {...funnelSubStepProps}>
          <input data-testid="input" />
        </div>
      );
    };

    const stepNumber = 1;
    const stepNameSelector = '.step-name-selector';

    const { getByTestId } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={stepNumber} stepNameSelector={stepNameSelector}>
          <AnalyticsFunnelSubStep>
            <ChildComponent />
          </AnalyticsFunnelSubStep>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    fireEvent.blur(getByTestId('input'));

    expect(FunnelMetrics.funnelSubStepComplete).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepComplete).toHaveBeenCalledWith({
      funnelInteractionId: mockedFunnelInteractionId,
      stepNumber,
      stepNameSelector,
      subStepAllSelector: expect.any(String),
      subStepSelector: expect.any(String),
      subStepNameSelector: expect.any(String),
    });
  });
});
