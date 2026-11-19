// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { HotspotProps } from '../hotspot/interfaces';
import { AnnotationContextProps } from './interfaces';

export interface HotspotContext {
  getContentForId(id: string, direction: HotspotProps['direction']): JSX.Element | null;
  registerHotspot(id: string): void;
  unregisterHotspot(id: string): void;
  currentStepIndex: number;
  currentTutorial: AnnotationContextProps.Tutorial | null;
  onStartTutorial: AnnotationContextProps['onStartTutorial'];
  onExitTutorial: AnnotationContextProps['onExitTutorial'];
}

const defaultContext: HotspotContext = {
  getContentForId: () => null,
  registerHotspot() {},
  unregisterHotspot() {},
  currentStepIndex: 0,
  currentTutorial: null,
  onStartTutorial() {},
  onExitTutorial() {},
};

export const hotspotContext = React.createContext<HotspotContext>(defaultContext);
