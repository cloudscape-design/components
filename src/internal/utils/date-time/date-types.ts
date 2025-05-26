// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export type DateLocale = string;

/**
 * Specifies the granularity at which a date will be displayed
 **/
export type DateGranularity = 'day' | 'month';

/**
 * The formats that allow for an editable value
 * * `iso`: ISO 8601 format without time, e.g.: 2024-01-30 (or 2024-01)
 * * `slashed`: similiar to ISO 8601 but with '/' in place of '-'. e.g.: 2024/01/30 (or 2024/01)
 **/
export type EditableDateFormat = 'iso' | 'slashed';

/**
 * The format that does note allow for an editable value
 * * `long-localized`: a more human-readable, localized format, e.g.: January 30, 2024 (or January, 2024)
 **/
export type StaticDateFormat = 'long-localized';

export type DateFormat = EditableDateFormat | StaticDateFormat;
