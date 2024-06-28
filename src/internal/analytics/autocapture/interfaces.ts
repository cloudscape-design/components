// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface AutoCaptureMetadata {
  // action that the user performs. For example: "select".
  //The full list of possible values will be provided once requirements for all components are analyzed
  action?: string;

  //detail of the action. For example: label and href of a link
  detail?: Record<string, string>;

  // Information about the component from which the interaction is coming.
  component?: AutoCaptureMetadataComponent;

  // array of contexts outside the component, srtarting with the most generic
  contexts?: Array<
    AutoCaptureMetadataPageContext | AutoCaptureMetadataComponentContext | AutoCaptureMetadataCustomContext
  >;

  // version of the autocapture API, not the component
  version?: string;
}

interface AutoCaptureMetadataComponent {
  // name of the component. For example: "radio-group"
  name?: string;

  // captured label of the component. For example: label of the input field
  label?: string;

  // can be provided for some components
  instanceIdentifier?: string;

  // granular version of the component
  version?: string;

  // relevant properties of the component. For example: {variant: 'primary'} for Button, {external: 'true', href: '...'} for Link
  properties?: Record<string, string>;

  // relevant information on the specific area of the component in which the interaction happened
  innerContext?: Record<string, string>;
}

interface AutoCaptureMetadataPageContext {
  type: 'page';
  detail: {
    // page h1 heading
    label: string;
    // properties like url and locale are already present in the autocapture schema
  };
}

interface AutoCaptureMetadataComponentContext {
  type: 'component';
  detail: AutoCaptureMetadataComponent;
}

interface AutoCaptureMetadataCustomContext {
  type: 'widget' | 'custom';
  detail: {
    // provided in data-analytics attribute
    value: string;
  };
}
