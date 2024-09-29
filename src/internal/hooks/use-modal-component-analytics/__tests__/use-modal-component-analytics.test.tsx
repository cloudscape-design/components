// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { PerformanceMetrics } from '../../../analytics';
import * as useModalContext from '../../../context/modal-context';
import { useModalComponentAnalytics, usePrimaryButtonModalComponentAnalytics } from '../index';

let modalPerformanceDataSpy: jest.SpyInstance,
  mockModalContext: useModalContext.ModalContextProps,
  refMock: React.RefObject<HTMLDivElement>;

beforeEach(() => {
  jest.resetAllMocks();
  modalPerformanceDataSpy = jest.spyOn(PerformanceMetrics, 'modalPerformanceData');
  mockModalContext = {
    isInModal: true,
    instanceIdentifier: 'test-Id',
    componentLoadingCount: { current: 0 },
    loadStartTime: { current: 0 },
    performanceMetricLogged: { current: false },
  };
  refMock = {
    current: {
      offsetWidth: 100,
      offsetHeight: 200,
    } as HTMLDivElement,
  };
  jest.spyOn(window, 'getComputedStyle').mockImplementation(
    () =>
      ({
        display: 'block',
        // You can add other style properties as needed for the test
      }) as CSSStyleDeclaration
  );
  jest.spyOn(useModalContext, 'useModalContext').mockReturnValue(mockModalContext);
  jest.spyOn(React, 'useRef').mockReturnValue(refMock);
});

describe('usePrimaryButtonModalAnalytics', () => {
  test('should invoke modalPerformanceData when element within is loaded', () => {
    const Demo = () => {
      return <button>{usePrimaryButtonModalComponentAnalytics(true, refMock, [])} content</button>;
    };
    render(<Demo />);
    expect(modalPerformanceDataSpy).toHaveBeenCalledWith(expect.objectContaining({ instanceIdentifier: 'test-Id' }));
    expect(mockModalContext.performanceMetricLogged).toBeTruthy();
  });

  test('should not invoke modalPerformanceData if element is not inside modal', () => {
    const Demo = () => {
      return <button>{usePrimaryButtonModalComponentAnalytics(true, refMock, [])} content</button>;
    };
    mockModalContext.isInModal = false;
    render(<Demo />);
    expect(modalPerformanceDataSpy).not.toHaveBeenCalled();
    expect(mockModalContext.performanceMetricLogged.current).toBeFalsy();
  });

  test('should not invoke modalPerformanceData if componentLoadingCount is not 0 ', () => {
    const Demo = () => {
      return <button>{usePrimaryButtonModalComponentAnalytics(true, refMock, [])} content</button>;
    };
    mockModalContext.componentLoadingCount.current = 2;
    render(<Demo />);
    expect(modalPerformanceDataSpy).not.toHaveBeenCalled();
    expect(mockModalContext.performanceMetricLogged.current).toBeFalsy();
  });

  test('should not invoke modalPerformanceData if element is not of type primary ', () => {
    const Demo = () => {
      return <button>{usePrimaryButtonModalComponentAnalytics(false, refMock, [])} content</button>;
    };
    render(<Demo />);
    expect(modalPerformanceDataSpy).not.toHaveBeenCalled();
    expect(mockModalContext.performanceMetricLogged.current).toBeFalsy();
  });

  test('should not invoke modalPerformanceData if refMock current is not set ', () => {
    refMock = { current: null };
    const Demo = () => {
      return <button>{usePrimaryButtonModalComponentAnalytics(true, refMock, [])} content</button>;
    };
    render(<Demo />);
    expect(modalPerformanceDataSpy).not.toHaveBeenCalled();
    expect(mockModalContext.performanceMetricLogged.current).toBeFalsy();
  });

  test('should not invoke modalPerformanceData if element is hidden ', () => {
    refMock = {
      current: {
        offsetWidth: 0,
        offsetHeight: 0,
      } as HTMLDivElement,
    };
    const Demo = () => {
      return <button>{usePrimaryButtonModalComponentAnalytics(true, refMock, [])} content</button>;
    };
    render(<Demo />);
    expect(modalPerformanceDataSpy).not.toHaveBeenCalled();
    expect(mockModalContext.performanceMetricLogged.current).toBeFalsy();
  });

  test('should not invoke modalPerformanceData if performanceMetricLogged is already logged ', () => {
    mockModalContext.performanceMetricLogged.current = true;
    const Demo = () => {
      return <button>{usePrimaryButtonModalComponentAnalytics(true, refMock, [])} content</button>;
    };
    render(<Demo />);
    expect(modalPerformanceDataSpy).not.toHaveBeenCalled();
  });
});

describe('usePrimaryButtonModalAnalytics', () => {
  test('should invoke modalPerformanceData when invoked inside a modal', () => {
    const Demo = () => {
      return <div>{useModalComponentAnalytics()} content</div>;
    };
    render(<Demo />);
    setTimeout(() => {
      expect(modalPerformanceDataSpy).toHaveBeenCalled();
      expect(mockModalContext.performanceMetricLogged.current).toBeTruthy();
    }, 100);
  });

  test('should not invoke modalPerformanceData when invoked outside a modal', () => {
    mockModalContext.isInModal = false;
    const Demo = () => {
      return <div>{useModalComponentAnalytics()} content</div>;
    };
    render(<Demo />);
    expect(modalPerformanceDataSpy).not.toHaveBeenCalled();
    expect(mockModalContext.performanceMetricLogged.current).toBeFalsy();
  });
});
