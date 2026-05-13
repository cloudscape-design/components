// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Each component has its own test definition file.
// Import them here manually to form the full test suite.
import { TestSuite } from '../types';
import actionCard from './action-card';
import alert from './alert';

export const allSuites: TestSuite[] = [actionCard, alert];
