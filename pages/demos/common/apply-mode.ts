// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { applyDensity, applyMode, Density, disableMotion, Mode } from '@cloudscape-design/global-styles';

import * as localStorage from './local-storage';

import '@cloudscape-design/global-styles/index.css';
import './custom-font.css';

(window as any).disableMotionForTests = disableMotion;

// always `true` in this design
export const isVisualRefresh = true;

// Initialize density
export let currentDensity: Density = localStorage.load('Awsui-Density-Preference') ?? Density.Comfortable;
applyDensity(currentDensity);

export function updateDensity(density: string) {
  applyDensity(density as Density);
  localStorage.save('Awsui-Density-Preference', density);
  currentDensity = density as Density;
}

// Initialize mode
export let currentMode: Mode = localStorage.load('Awsui-Mode-Preference') ?? Mode.Light;
applyMode(currentMode);

export function updateMode(mode: string) {
  applyMode(mode as Mode);
  localStorage.save('Awsui-Mode-Preference', mode);
  currentMode = mode as Mode;
}

// Initialize direction
export let currentDirection: string = localStorage.load('Awsui-Direction-Preference') ?? 'ltr';
document.documentElement.dir = currentDirection;

export function updateDirection(direction: string) {
  document.documentElement.dir = direction;
  localStorage.save('Awsui-Direction-Preference', direction);
  currentDirection = direction;
}
