// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  ContentDisplayOptionWrapper,
  default as CollectionContentDisplayPreferenceWrapper,
} from '../collection-preferences/content-display-preference';

import styles from '../../../content-display-preference/styles.selectors.js';

export { ContentDisplayOptionWrapper };

/**
 * Test utils wrapper for the standalone `ContentDisplayPreference` component.
 *
 * It reuses the finders of the content display control used inside `CollectionPreferences`
 * (title, description, options, drag handles, visibility toggles, column filter, no-match),
 * anchored on the standalone component root.
 */
export default class ContentDisplayPreferenceWrapper extends CollectionContentDisplayPreferenceWrapper {
  static rootSelector: string = styles.root;
}
