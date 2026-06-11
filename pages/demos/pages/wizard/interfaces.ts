// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { ReactNode } from 'react';

import { SelectProps } from '@cloudscape-design/components/select';

export type EngineType = 'aurora' | 'mysql' | 'maria' | 'postgres' | 'oracle' | 'microsoft';

export interface EngineState {
  engineOption: EngineType;
  version: SelectProps.Option;
  edition: string;
  usecase: string;
}

export interface DetailsState {
  instanceClass: SelectProps.Option;
  storageType: string;
  storage: string;
  timeZone: SelectProps.Option;
  availabilityZone: SelectProps.Option;
  port: string;
  iamAuth: string;
  identifier: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AdvancedState {
  vpc: SelectProps.Option;
  subnet: SelectProps.Option;
  securityGroups: SelectProps.Option;
  accessibility: string;
  encryption: string;
  upgrades: string;
  backup: SelectProps.Option;
  monitoring: string;
  failover: SelectProps.Option;
  backtrack: string;
}

export interface WizardState {
  engine: EngineState;
  details: DetailsState;
  advanced: AdvancedState;
  review: undefined;
}

export interface ToolsContent {
  title: string;
  links: {
    href: string;
    text: string;
  }[];
  content: ReactNode;
}
