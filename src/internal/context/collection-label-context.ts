// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext } from 'react';

interface CollectionLabellingInterface {
  assignId?: (id: string) => void;
}

export const CollectionLabelContext = createContext<CollectionLabellingInterface>({});
