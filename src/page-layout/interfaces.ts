// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AppLayoutProps } from '../app-layout/interfaces';

export interface PageLayoutProps extends AppLayoutProps {
  /**
   * If `true`, the navigation trigger is not displayed at all,
   * while navigation drawer might be displayed, but opened using a custom trigger.
   */
  navigationTriggerHide?: boolean;
}
