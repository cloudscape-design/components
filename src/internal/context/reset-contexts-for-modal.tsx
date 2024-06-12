// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { FormFieldContext } from './form-field-context';
import { ButtonContext } from './button-context';
import { CollectionLabelContext } from './collection-label-context';
import { InfoLinkLabelContext } from './info-link-label-context';
import { LinkDefaultVariantContext, defaultValue as linkDefaultValue } from './link-default-variant-context';
import {
  SingleTabStopNavigationContext,
  defaultValue as singleTabStopDefaultValue,
} from './single-tab-stop-navigation-context';

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
