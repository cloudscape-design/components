// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import Alert, { AlertProps } from '../../../lib/components/alert';
import { persistAlertDismiss, retrieveAlertDismiss } from '../../../lib/components/internal/persistence';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('../../../lib/components/internal/persistence', () => ({
  persistAlertDismiss: jest.fn(),
  retrieveAlertDismiss: jest.fn(),
}));

const mockPersistAlertDismiss = jest.mocked(persistAlertDismiss);
const mockRetrieveAlertDismiss = jest.mocked(retrieveAlertDismiss);

function renderAlert(props: AlertProps = {}) {
  const { container } = render(<Alert {...props} />);
  return {
    getWrapper: () => createWrapper(container).findAlert(),
    container,
  };
}

describe('Alert Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRetrieveAlertDismiss.mockResolvedValue(false);
  });

  describe('initialization', () => {
    it('calls retrieveAlertDismiss when persistenceConfig is provided', async () => {
      const persistenceConfig = { uniqueKey: 'test-alert' };
      renderAlert({ persistenceConfig, dismissible: true });

      await waitFor(() => {
        expect(mockRetrieveAlertDismiss).toHaveBeenCalledWith({ uniqueKey: 'test-alert' });
      });
    });

    it('does not call retrieveAlertDismiss when persistenceConfig is not provided', () => {
      renderAlert({ dismissible: true });
      expect(mockRetrieveAlertDismiss).not.toHaveBeenCalled();
    });

    it('renders alert when not previously dismissed', async () => {
      const { getWrapper } = renderAlert({
        persistenceConfig: { uniqueKey: 'test-alert' },
        dismissible: true,
        children: 'Test content',
      });

      await waitFor(() => {
        const wrapper = getWrapper();
        expect(wrapper).toBeTruthy();
        expect(wrapper!.getElement()).toBeInTheDocument();
      });
    });

    it('does not render alert when previously dismissed', async () => {
      mockRetrieveAlertDismiss.mockResolvedValue(true);
      const { getWrapper } = renderAlert({
        persistenceConfig: { uniqueKey: 'test-alert' },
        dismissible: true,
        children: 'Test content',
      });

      await new Promise(resolve => setTimeout(resolve, 200));
      expect(getWrapper()).toBeNull();
    });
  });

  describe('dismiss functionality', () => {
    it('calls persistAlertDismiss when dismiss button is clicked', async () => {
      const persistenceConfig = { uniqueKey: 'test-alert' };
      const onDismiss = jest.fn();
      const { getWrapper } = renderAlert({
        persistenceConfig,
        dismissible: true,
        onDismiss,
        children: 'Test content',
      });

      await waitFor(() => {
        expect(getWrapper()).toBeTruthy();
      });

      getWrapper()!.findDismissButton()!.click();

      expect(mockPersistAlertDismiss).toHaveBeenCalledWith({ uniqueKey: 'test-alert' });
      expect(onDismiss).toHaveBeenCalled();
    });

    it('does not call persistAlertDismiss when no persistenceConfig provided', () => {
      const onDismiss = jest.fn();
      const { getWrapper } = renderAlert({
        dismissible: true,
        onDismiss,
        children: 'Test content',
      });

      getWrapper()!.findDismissButton()!.click();

      expect(mockPersistAlertDismiss).not.toHaveBeenCalled();
      expect(onDismiss).toHaveBeenCalled();
    });

    it('calls persistAlertDismiss with crossServicePersistence config', async () => {
      const persistenceConfig = {
        uniqueKey: 'test-alert',
        crossServicePersistence: true,
      };
      const { getWrapper } = renderAlert({
        persistenceConfig,
        dismissible: true,
        children: 'Test content',
      });

      await waitFor(() => {
        expect(getWrapper()).toBeTruthy();
      });

      getWrapper()!.findDismissButton()!.click();

      expect(mockPersistAlertDismiss).toHaveBeenCalledWith({
        uniqueKey: 'test-alert',
        crossServicePersistence: true,
      });
    });
  });

  describe('persistence config variations', () => {
    it('does not call persistence functions when uniqueKey is empty', () => {
      const persistenceConfig = { uniqueKey: '' };
      const onDismiss = jest.fn();
      const { getWrapper } = renderAlert({
        persistenceConfig,
        dismissible: true,
        onDismiss,
        children: 'Test content',
      });

      expect(mockRetrieveAlertDismiss).not.toHaveBeenCalled();

      getWrapper()!.findDismissButton()!.click();

      expect(mockPersistAlertDismiss).not.toHaveBeenCalled();
      expect(onDismiss).toHaveBeenCalled();
    });
  });
});
