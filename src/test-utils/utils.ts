// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act as reactDomAct } from 'react-dom/test-utils';

export const act = ('act' in React ? React.act : reactDomAct) as typeof reactDomAct;
