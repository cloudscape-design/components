// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface BaseComponentProps {
  /**
   * Adds the specified classes to the root element of the component.
   * @deprecated Custom CSS is not supported. For testing and other use cases, use [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).
   */
  className?: string;
  /**
   * Adds the specified ID to the root element of the component.
   * @deprecated The usage of the `id` attribute is reserved for internal use cases. For testing and other use cases,
   * use [data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes). If you must
   * use the `id` attribute, consider setting it on a parent element instead.
   */
  id?: string;
  // we also support data-* attributes, but they are always implicitly allowed by typescript
  // http://www.typescriptlang.org/docs/handbook/jsx.html#attribute-type-checking
  // "Note: If an attribute name is not a valid JS identifier (like a data-* attribute), it is not considered to be an error"
}
