// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Each component has its own test definition file.
// Import them here manually to form the full test suite.
import { TestSuite } from '../types';
import alert from './alert';
import button from './button';
import dateRangePicker from './date-range-picker';
import table from './table';

export const allSuites: TestSuite[] = [alert, button, dateRangePicker, table];
