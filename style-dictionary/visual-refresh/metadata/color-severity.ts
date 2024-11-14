// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';

const metadata: StyleDictionary.MetadataIndex = {
  colorBackgroundNotificationSeverityCritical: {
    description:
      'Background color in a notification to represent a critical error or a critically high-level of severity. For example: "Sev-1"',
    public: true,
    themeable: true,
  },
  colorBackgroundNotificationSeverityHigh: {
    description:
      'Background color in a notification to represent an error status or a high-level of severity. For example: "Failed" or "Sev-2"',
    public: true,
    themeable: true,
  },
  colorBackgroundNotificationSeverityMedium: {
    description: 'Background color in a notification to represent a medium-level of severity. For example: "Sev-3"',
    public: true,
    themeable: true,
  },
  colorBackgroundNotificationSeverityLow: {
    description:
      'Background color in a notification to represent a warning or a low-level of severity. For example: "Warning" or "Sev-4"',
    public: true,
    themeable: true,
  },
  colorBackgroundNotificationSeverityNeutral: {
    description:
      'Background color in a notification to represent a neutral status, a severity level of no impact, or the lowest-level of severity. For example: "Pending" or "Sev-5"',
    public: true,
    themeable: true,
  },
  colorTextNotificationSeverityCritical: {
    description:
      'Text color in a notification to represent a critical error or a critically high-level of severity. For example: "Sev-1"',
    public: true,
    themeable: true,
  },
  colorTextNotificationSeverityHigh: {
    description:
      'Text color in a notification to represent an error status or a high-level of severity. For example: "Failed" or "Sev-2"',
    public: true,
    themeable: true,
  },
  colorTextNotificationSeverityMedium: {
    description: 'Text color in a notification to represent a medium-level of severity. For example: "Sev-3"',
    public: true,
    themeable: true,
  },
  colorTextNotificationSeverityLow: {
    description:
      'Text color in a notification to represent a warning or a low-level of severity. For example: "Warning" or "Sev-4"',
    public: true,
    themeable: true,
  },
  colorTextNotificationSeverityNeutral: {
    description:
      'Text color in a notification to represent a neutral status, a severity level of no impact, or the lowest-level of severity. For example: "Pending" or "Sev-5"',
    public: true,
    themeable: true,
  },
};

export default metadata;
