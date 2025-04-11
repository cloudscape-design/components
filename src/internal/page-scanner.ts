// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

interface Components {
  element: HTMLElement;
  metadata: any;
  children?: Array<Components>;
}

const getElementsWithMetadata = (node: HTMLElement | Document = document) =>
  Array.from(node.querySelectorAll('[data-awsui-analytics]')) as Array<HTMLElement>;

const getComponents = (node: HTMLElement | Document = document) =>
  getElementsWithMetadata(node)
    .map(element => ({
      element,
      metadata: JSON.parse(element.dataset.awsuiAnalytics || '{}'),
    }))
    .filter(({ metadata }) => !!metadata.component)
    .map(({ element }) => ({
      element,
      metadata: getGeneratedAnalyticsMetadata(element).contexts[0].detail,
    }));

const buildTree = (components: Array<Components>, visited: Set<HTMLElement> = new Set()): Array<Components> => {
  const tree: Array<Components> = [];
  components.forEach(component => {
    if (visited.has(component.element)) {
      return;
    }
    visited.add(component.element);
    const children = getComponents(component.element);
    tree.push({
      ...component,
      children: buildTree(children, visited),
    });
  });
  return tree;
};

export const scanPage = () => {
  return buildTree(getComponents());
};
