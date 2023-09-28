// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const DATA_ATTR_FUNNEL = 'data-analytics-funnel';
export const DATA_ATTR_FUNNEL_INTERACTION_ID = `${DATA_ATTR_FUNNEL}-interaction-id`;
export const DATA_ATTR_FUNNEL_KEY = `${DATA_ATTR_FUNNEL}-key`;
export const DATA_ATTR_FUNNEL_VALUE = `${DATA_ATTR_FUNNEL}-value`;
export const DATA_ATTR_FUNNEL_STEP = `${DATA_ATTR_FUNNEL}-step`;
export const DATA_ATTR_FUNNEL_SUBSTEP = `${DATA_ATTR_FUNNEL}-substep`;

export const DATA_ATTR_FIELD_LABEL = 'data-analytics-field-label';
export const DATA_ATTR_FIELD_ERROR = 'data-analytics-field-error';

export const DATA_ATTR_ANALYTICS_ALERT = 'data-analytics-alert';
export const DATA_ATTR_ANALYTICS_FLASHBAR = 'data-analytics-flashbar';

export const FUNNEL_KEY_FUNNEL_NAME = 'funnel-name';
export const FUNNEL_KEY_STEP_NAME = 'step-name';
export const FUNNEL_KEY_SUBSTEP_NAME = 'substep-name';

export const getFunnelNameSelector = () => `[${DATA_ATTR_FUNNEL_KEY}="${FUNNEL_KEY_FUNNEL_NAME}"]`;
export const getFunnelKeySelector = (key: string) => `[${DATA_ATTR_FUNNEL_KEY}="${key}"]`;
export const getFunnelValueSelector = (value: string) => `[${DATA_ATTR_FUNNEL_VALUE}="${value}"]`;

export const getSubStepAllSelector = () => `[${DATA_ATTR_FUNNEL_SUBSTEP}]`;
export const getSubStepSelector = (subStepId: string) => `[${DATA_ATTR_FUNNEL_SUBSTEP}="${subStepId}"]`;
export const getSubStepNameSelector = (subStepId?: string) =>
  [subStepId ? getSubStepSelector(subStepId) : '', `[${DATA_ATTR_FUNNEL_KEY}="${FUNNEL_KEY_SUBSTEP_NAME}"]`].join(' ');

export const getFieldSlotSeletor = (id: string | undefined) => (id ? `[id="${id}"]` : undefined);

export const getNameFromSelector = (selector: string | undefined): string | undefined =>
  selector ? document.querySelector<HTMLElement>(selector)?.innerText?.trim() : undefined;
