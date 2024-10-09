// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import * as useModalContext from '../../../context/modal-context';
import { useModalContextLoadingButtonComponent, useModalContextLoadingComponent } from '../index';
let mockModalContext: useModalContext.ModalContextProps;
beforeEach(() => {
  jest.resetAllMocks();
  mockModalContext = {
    isInModal: true,
    componentLoadingCount: { current: 0 },
    loadCompleteTime: { current: 0 },
  };
  jest.spyOn(useModalContext, 'useModalContext').mockReturnValue(mockModalContext);
});

describe('useModalContextLoadingButtonComponent', () => {
  test('should set loadCompleteTime when element is loaded', () => {
    const Demo = () => {
      return <button>{useModalContextLoadingButtonComponent(true, true)} content</button>;
    };
    render(<Demo />);
    expect(mockModalContext.componentLoadingCount.current).toBe(1);

    //wait for Demo to unmount
    setTimeout(() => {
      expect(mockModalContext.componentLoadingCount.current).toBe(0);
      expect(mockModalContext.loadCompleteTime.current).not.toBe(0);
    }, 100);
  });

  test('should not set loadCompleteTime if element is not inside modal', () => {
    const Demo = () => {
      return <button>{useModalContextLoadingButtonComponent(true, true)} content</button>;
    };
    mockModalContext.isInModal = false;
    render(<Demo />);
    expect(mockModalContext.componentLoadingCount.current).toBe(0);
    expect(mockModalContext.loadCompleteTime.current).toBe(0);
  });

  test('should not set loadCompleteTime if componentLoadingCount is not 0 ', () => {
    const Demo = () => {
      return <button>{useModalContextLoadingButtonComponent(true, true)} content</button>;
    };
    mockModalContext.componentLoadingCount.current = 2;
    render(<Demo />);
    expect(mockModalContext.componentLoadingCount.current).toBe(3);
    //wait for Demo to unmount
    setTimeout(() => {
      expect(mockModalContext.componentLoadingCount.current).toBe(2);
      expect(mockModalContext.loadCompleteTime.current).toBe(0);
    }, 100);
  });

  test('should not set componentLoadingCount or loadCompleteTime if element is not of type primary ', () => {
    const Demo = () => {
      return <button>{useModalContextLoadingButtonComponent(false, true)} content</button>;
    };
    render(<Demo />);
    expect(mockModalContext.componentLoadingCount.current).toBe(0);
    expect(mockModalContext.loadCompleteTime.current).toBe(0);
  });

  test('should not update loadCompleteTime if it is already set ', () => {
    mockModalContext.loadCompleteTime.current = 10;
    const Demo = () => {
      return <button>{useModalContextLoadingButtonComponent(true, true)} content</button>;
    };
    render(<Demo />);
    setTimeout(() => {
      expect(mockModalContext.loadCompleteTime.current).toBe(10);
    }, 100);
  });
});

describe('useModalContextLoadingComponent', () => {
  test('should set loadCompleteTime when invoked inside a modal', () => {
    const Demo = () => {
      return <div>{useModalContextLoadingComponent()} content</div>;
    };
    render(<Demo />);
    expect(mockModalContext.componentLoadingCount.current).toBe(1);
    //wait for Demo to unmount
    setTimeout(() => {
      expect(mockModalContext.componentLoadingCount.current).toBe(0);
      expect(mockModalContext.loadCompleteTime.current).not.toBe(0);
    }, 100);
  });

  test('should not set componentLoadingCount or loadCompleteTime when invoked outside a modal', () => {
    mockModalContext.isInModal = false;
    const Demo = () => {
      return <div>{useModalContextLoadingComponent()} content</div>;
    };
    render(<Demo />);
    expect(mockModalContext.componentLoadingCount.current).toBe(0);
    expect(mockModalContext.loadCompleteTime.current).toBe(0);
  });
});
