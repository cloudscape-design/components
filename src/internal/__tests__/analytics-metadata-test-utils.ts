// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { GeneratedAnalyticsMetadataFragment } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getRawAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

export const validateComponentNameAndLabels = (element: HTMLElement, labelsClassNames: Record<string, string>) => {
  const { metadata, labelSelectors } = getRawAnalyticsMetadata(element);
  validateComponentName(metadata);
  validateLabels(labelSelectors, labelsClassNames);
};

const validateComponentName = (metadata: Array<GeneratedAnalyticsMetadataFragment>) => {
  const componentNames = metadata
    .filter(md => !!md.component && !!md.component.name)
    .map(md => md.component!.name)
    .filter(name => !name?.startsWith('awsui.'));
  if (componentNames.length > 0) {
    throw new Error(`Components names ${componentNames.join(' ,')} should start with "awsui."`);
  }
};

const validateLabels = (labelSelectors: Array<string>, labelsClassNames: Record<string, string>) => {
  const allowedClassNames = Object.values(labelsClassNames);
  const classNames = labelSelectors.reduce((acc: Array<string>, current) => {
    const parts = current
      .split(/\s+/)
      .filter(part => part.startsWith('.'))
      .map(part => part.replace('.', ''));
    acc = [...acc, ...parts];
    return acc;
  }, []);
  const wrongClassNames = classNames.filter(className => !allowedClassNames.includes(className));
  if (wrongClassNames.length > 0) {
    throw new Error(`ClassNames ${wrongClassNames.join(' ,')} are not stable.`);
  }
};
