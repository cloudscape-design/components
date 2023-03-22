// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { track, TrackFn } from '../analytics';

export const AnalyticsProviderContext = createContext<TrackFn>(track);
export const useAnalyticsProvider = () => useContext(AnalyticsProviderContext);

export const AnalyticsProvider = ({ children, value = track }: any) => {
  return <AnalyticsProviderContext.Provider value={value}>{children}</AnalyticsProviderContext.Provider>;
};

interface AnalyticsData {
  [key: string]: any;
}

interface AnalyticsContextValue {
  context: AnalyticsData;
  addContext: (analyticsData: AnalyticsData, callback?: (mergedContext: AnalyticsData) => void) => void;
  trackEvent: (data: AnalyticsData) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue>({
  context: {},
  addContext: () => {},
  trackEvent: () => {},
});

export const useAnalyticsContext = (): AnalyticsContextValue => {
  const context = useContext(AnalyticsContext);
  return context;
};

export const AnalyticsContextProvider: React.FC<{ value: AnalyticsData }> = ({ children, value }) => {
  const track = useAnalyticsProvider();
  const [context, setContext] = useState<AnalyticsData>(value);

  const addContext = useCallback((analyticsData: AnalyticsData, callback?: (mergedContext: AnalyticsData) => void) => {
    setContext(prevContext => {
      const mergedContext = { ...prevContext, ...analyticsData };
      callback?.(mergedContext);
      return mergedContext;
    });
  }, []);

  const trackEvent = (eventData: AnalyticsData) => {
    const mergedContext = { ...context, ...eventData };
    try {
      track(mergedContext);
    } catch (err) {
      // Ignore errors from track
    }
  };

  return <AnalyticsContext.Provider value={{ context, addContext, trackEvent }}>{children}</AnalyticsContext.Provider>;
};

interface WithContextProps {
  value: { [key: string]: any };
  children: React.ReactNode;
}

export const WithContext: React.FC<WithContextProps> = ({ value, children }) => {
  const localContext = useMemo(() => value, [value]);
  const { trackEvent } = useAnalyticsContext();

  const trackEventWithLocalContext = (data: AnalyticsData = {}) => {
    trackEvent({ ...localContext, ...data });
  };

  return (
    <AnalyticsContext.Provider value={{ ...useAnalyticsContext(), trackEvent: trackEventWithLocalContext }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useTrackComponentLifecycle = (context: any) => {
  const { trackEvent } = useAnalyticsContext();
  const startTime = Date.now();

  useEffect(() => {
    trackEvent({ ...context, action: 'mount' });

    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      trackEvent({ ...context, duration, action: 'unmount' });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
