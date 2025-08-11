// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonContext } from './button-context.js';
import { CollectionLabelContext } from './collection-label-context.js';
import { FormFieldContext } from './form-field-context.js';
import { InfoLinkLabelContext } from './info-link-label-context.js';
import { defaultValue as linkDefaultValue, LinkDefaultVariantContext } from './link-default-variant-context.js';
import {
  defaultValue as singleTabStopDefaultValue,
  SingleTabStopNavigationContext,
} from './single-tab-stop-navigation-context.js';

/*
 Use this context-resetter when creating a new modal-type context where typically the contents
 of the modal should not be affected by the surrounding components/DOM.
 */
const ResetContextsForModal = ({ children }: { children: React.ReactNode }) => (
  <ButtonContext.Provider value={{ onClick: () => {} }}>
    <CollectionLabelContext.Provider value={{ assignId: () => {} }}>
      <FormFieldContext.Provider value={{}}>
        <InfoLinkLabelContext.Provider value="">
          <LinkDefaultVariantContext.Provider value={linkDefaultValue}>
            <SingleTabStopNavigationContext.Provider value={singleTabStopDefaultValue}>
              {children}
            </SingleTabStopNavigationContext.Provider>
          </LinkDefaultVariantContext.Provider>
        </InfoLinkLabelContext.Provider>
      </FormFieldContext.Provider>
    </CollectionLabelContext.Provider>
  </ButtonContext.Provider>
);

export default ResetContextsForModal;
