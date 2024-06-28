// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AutoCaptureMetadata } from './interfaces';

const METADATA_DATA_ATTRIBUTE = 'awsuiAnalytics';
const METADATA_ATTRIBUTE = `data-awsui-analytics`;
const LABEL_DATA_ATTRIBUTE = 'awsuiAnalyticsLabel';
const LABEL_ATTRIBUTE = 'data-awsui-analytics-label';

export const getAnalyticsMetadataAttribute = (metadata: AutoCaptureMetadata) => ({
  [METADATA_ATTRIBUTE]: JSON.stringify(metadata),
});

export const copyAnalyticsMetadataAttribute = (props: any) => ({
  [METADATA_ATTRIBUTE]: props[METADATA_ATTRIBUTE],
});

export const getAnalyticslabelAttribute = (label: string) => ({
  [LABEL_ATTRIBUTE]: label,
});

const processEvent = ({ target }: MouseEvent) => {
  let metadata: AutoCaptureMetadata = {};
  let currentNode = target as HTMLElement | null;
  while (currentNode && currentNode.tagName !== 'body') {
    try {
      const currentMetadataString = currentNode.dataset[METADATA_DATA_ATTRIBUTE];
      if (currentMetadataString) {
        const currentMetadata = JSON.parse(currentMetadataString);
        metadata = mergeMetadata(metadata, processMetadata(currentNode, currentMetadata));
      }
    } finally {
      currentNode = findNextNode(currentNode);
    }
  }
  console.log(metadata);
};

const mergeMetadata = (metadata: AutoCaptureMetadata, localMetadata: AutoCaptureMetadata) => {
  const output = merge(metadata, localMetadata);
  if (output.component && output.component.name) {
    output.contexts = [...(output.contexts || []), { type: 'component', detail: output.component }];
    delete output.component;
  }
  return output;
};

const findNextNode = (node: HTMLElement): HTMLElement | null => {
  try {
    const referrer = node.dataset.awsuiReferrerId;
    if (referrer) {
      return document.querySelector(`[id="${referrer}"]`);
    }
    return node.parentElement;
  } catch (ex) {
    return null;
  }
};

const processMetadata = (node: HTMLElement, localMetadata: any): AutoCaptureMetadata => {
  return Object.keys(localMetadata).reduce((acc: any, key: string) => {
    if (typeof localMetadata[key] !== 'string') {
      acc[key] = processMetadata(node, localMetadata[key]);
    } else if (key.toLowerCase().match(/label$/)) {
      acc[key] = processLabel(node, localMetadata[key]);
    } else {
      acc[key] = localMetadata[key];
    }
    return acc;
  }, {});
};

function processLabel(node: HTMLElement | null, labelSelectors: string): string {
  if (labelSelectors) {
    const labelSelectorArray = labelSelectors.split(',');
    for (const labelSelector of labelSelectorArray) {
      const label = processSingleLabel(node, labelSelector);
      if (label) {
        return label;
      }
    }
  }
  return '';
}

function processSingleLabel(node: HTMLElement | null, labelSelector: string): string {
  let labelElement = node;
  if (labelElement && labelSelector !== '&') {
    if (labelSelector.startsWith('^')) {
      labelElement = findComponentUp(node);
      return processSingleLabel(labelElement, labelSelector.replace('^ ', ''));
    } else {
      labelElement = labelElement.querySelector(labelSelector) as HTMLElement | null;
    }
  }
  if (labelElement && labelElement.dataset[LABEL_DATA_ATTRIBUTE]) {
    return processLabel(labelElement, labelElement.dataset[LABEL_DATA_ATTRIBUTE]);
  }
  return getLabelFromElement(labelElement);
}

const getLabelFromElement = (element: HTMLElement | null): string => {
  if (!element) {
    return '';
  }
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    try {
      const elementWithLabel = document.querySelector(`[id="${ariaLabelledBy.split(' ')[0]}"]`);
      return elementWithLabel?.textContent || '';
    } catch (ex) {
      /* empty */
    }
  }

  return element?.textContent || '';
};

if (typeof window !== 'undefined') {
  window.addEventListener('mousedown', processEvent);
}

function findComponentUp(node: HTMLElement | null): HTMLElement | null {
  let firstComponentElement = node;
  while (
    firstComponentElement &&
    firstComponentElement?.tagName !== 'body' &&
    !isNodeComponent(firstComponentElement)
  ) {
    firstComponentElement = firstComponentElement.parentElement;
  }
  return firstComponentElement && firstComponentElement.tagName !== 'body' ? firstComponentElement : null;
}

const isNodeComponent = (node: HTMLElement): boolean => {
  const metadataString = node.dataset[METADATA_DATA_ATTRIBUTE] || '{}';
  try {
    const metadata = JSON.parse(metadataString);
    return !!metadata.component && !!metadata.component.name;
  } catch (ex) {
    return false;
  }
};

const merge = (target: any, source: any): any => {
  const merged: any = {};
  const targetKeys = Object.keys(target);
  const sourceKeys = Object.keys(source);
  const allKeys = [...targetKeys, ...sourceKeys.filter(key => !target[key])];
  for (const key of allKeys) {
    if (target[key] && !source[key]) {
      merged[key] = target[key];
    } else if (!target[key] && source[key]) {
      merged[key] = source[key];
    } else if (typeof target[key] === 'string') {
      merged[key] = source[key];
    } else {
      merged[key] = merge(target[key], source[key]);
    }
  }
  return JSON.parse(JSON.stringify(merged));
};
