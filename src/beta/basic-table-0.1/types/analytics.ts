// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type FlowType = 'create' | 'edit' | 'delete' | 'home' | 'dashboard' | 'view-resource';

type ErrorSubCategory =
  | 'DATA_FORMAT_ISSUES'
  | 'PARAMETER_VALIDATION_ISSUES'
  | 'ACCESS_CONTROL_ISSUES'
  | 'IDENTITY_MANAGEMENT_PROBLEMS'
  | 'RESOURCE_STATE_ISSUES'
  | 'RESOURCE_CAPACITY_PROBLEMS'
  | 'CONNECTION_PROBLEMS'
  | 'NETWORK_CONFIGURATION_ISSUES'
  | 'RESOURCE_LIMIT_EXCEEDED'
  | 'SERVICE_QUOTA_RESTRICTIONS'
  | 'SERVICE_INTEGRATION_CONFLICTS'
  | 'RESOURCE_CONFIGURATION_MISMATCHES'
  | 'SERVICE_SPECIFIC_OPERATIONS'
  | 'API_REQUEST_PROBLEMS'
  | 'OTHER';

type ErrorCategory =
  | 'INPUT_VALIDATION'
  | 'PERMISSION_IAM'
  | 'RESOURCE_AVAILABILITY'
  | 'NETWORK_CONNECTIVITY'
  | 'SERVICE_QUOTAS_LIMITS'
  | 'CONFIGURATION_CONFLICTS'
  | 'API_SPECIFIC'
  | 'OTHER';

export interface ErrorContext {
  errorCategory: ErrorCategory;
  errorSubCategory: ErrorSubCategory;
  errorMessage: string;
}

export interface AnalyticsMetadata {
  instanceIdentifier?: string;
  flowType?: FlowType;
  errorContext?: ErrorContext;
  resourceType?: string;
}
