// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';
import { FlowType } from '../internal/analytics/interfaces';
import { BaseComponentProps } from '../internal/base-component';

export namespace TimelineProps {
  export interface AnalyticsMetadata {
    instanceIdentifier?: string;
    flowType?: FlowType;
    resourceType?: string;
  }
}

export interface TimelineProps extends BaseComponentProps {
  /**
   * Specifies additional analytics-related metadata.
   * * `instanceIdentifier` - A unique string that identifies this component instance in your application.
   * * `flowType` - Identifies the type of flow represented by the component.
   * * `resourceType` - Identifies the type of resource represented by the flow. **Note:** This API is currently experimental.
   * @analytics
   */
  analyticsMetadata?: TimelineProps.AnalyticsMetadata;

  /**
   * Array of step objects. Each object represents a step in the wizard with the following properties:
   *
   * - `title` (string) - Text that's displayed as the title in the navigation pane and form header.
   * - `content` (ReactNode) - Main content area to display form sections, form fields, and controls.
   */
  steps: ReadonlyArray<TimelineProps.Step>;

  /**
   * An object containing all the necessary localized strings required by the component.
   *
   * - `stepNumberLabel` ((stepNumber: number) => string) - A function that accepts a number (1-based indexing),
   * @i18n
   */
  i18nStrings?: TimelineProps.I18nStrings;
}

// Why not enums? Explained there
// https://stackoverflow.com/questions/52393730/typescript-string-literal-union-type-from-enum
export type Status = 'error' | 'warning' | 'success' | 'info' | 'stopped' | 'pending' | 'in-progress' | 'loading';
export type IconColor = 'blue' | 'grey' | 'green' | 'red' | 'yellow';

interface NestedStep {
  title: string;
  /**
   * time should be shown here
   */
  content?: React.ReactNode;
  action?: React.ReactNode;
  statusSlot?: React.ReactNode;
  /**
   * if timeline item is completed or not
   */
  completed: boolean;
  iconName?: IconProps.Name;
  iconAlt?: string;
  iconSvg?: React.ReactNode;
  status?: Status | string;
  iconColor?: IconColor | string;
}

export namespace TimelineProps {
  export interface StepAnalyticsMetadata {
    instanceIdentifier?: string;
  }
  export interface Step extends NestedStep {
    items?: ReadonlyArray<Step>;
  }

  export interface I18nStrings {
    stepNumberLabel?(stepNumber: number): string;
  }
}
