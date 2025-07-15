// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface TokenProps {
  children: React.ReactNode;
  ariaLabel?: string;
  dismissLabel?: string;
  onDismiss?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}
