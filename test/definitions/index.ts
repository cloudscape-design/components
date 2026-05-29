// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Each component has its own test definition file.
// Import them here manually to form the full test suite.
import { TestSuite } from './types';
import actionCard from './visual/action-card';
import alert from './visual/alert';
import appLayout from './visual/app-layout';
import areaChart from './visual/area-chart';
import attributeEditor from './visual/attribute-editor';
import autosuggest from './visual/autosuggest';
import badge from './visual/badge';

export const allSuites: TestSuite[] = [actionCard, alert, appLayout, areaChart, attributeEditor, autosuggest, badge];
