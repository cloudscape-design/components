// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// We use resolvedOptions to detect browser locale. This method allows us to override the value for testing.
export default function setResolvedOptions(newValue: { locale: string }): void {
  const dateTimeFormat = new Intl.DateTimeFormat(newValue.locale);
  const resolvedOptions = dateTimeFormat.resolvedOptions();

  window.Intl.DateTimeFormat.prototype.resolvedOptions = () => ({ ...resolvedOptions, ...newValue });
}
