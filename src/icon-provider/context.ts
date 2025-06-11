// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createContext } from 'react';

import generatedIcons from '../icon/generated/icons';
import { IconProviderProps } from './interfaces';

export const InternalIconContext = createContext<IconProviderProps.Icons>(generatedIcons);
