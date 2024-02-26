// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export interface AnalyticsMetadataProps {
  __analyticsMetadata: AnalyticsMetadata;
}

export interface AnalyticsMetadataStepProps {
  __analyticsMetadata: Omit<AnalyticsMetadata, 'flowType'>;
}

export interface AnalyticsMetadata {
  instanceId?: string;
  flowType?: 'create' | 'edit';
  errorContext?: string;
}

export const getAnalyticsProps = (metadata: AnalyticsMetadata): AnalyticsMetadataStepProps => ({
  __analyticsMetadata: metadata,
});
