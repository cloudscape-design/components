// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import DropdownFooter from '../internal/components/dropdown-footer';
import { KeyCode } from '../internal/keycode';

import testUtilStyles from './test-classes/styles.css.js';

interface StatusFooterProps {
  content: React.ReactNode | null;
  id: string;
  hasItems: boolean;
  /** Whether the status belongs to the root list or to an expanded group. Used by test-utils to tell them apart. */
  scope: 'root' | 'group';
}

// Wraps the shared DropdownFooter so that interactions with the recovery button inside it are
// handled exclusively by the button and are not interpreted by the button dropdown handlers:
// a click must not toggle the enclosing expandable group, and Enter/Space must not activate the
// highlighted menu item or toggle the dropdown.
const StatusFooter = ({ content, id, hasItems, scope }: StatusFooterProps) => {
  const stopActivationKeys = (event: React.KeyboardEvent) => {
    if (event.keyCode === KeyCode.enter || event.keyCode === KeyCode.space) {
      event.stopPropagation();
    }
  };
  return (
    <div
      className={testUtilStyles[`${scope}-status`]}
      onClick={event => event.stopPropagation()}
      onKeyDown={stopActivationKeys}
      onKeyUp={stopActivationKeys}
    >
      <DropdownFooter content={content} id={id} hasItems={hasItems} />
    </div>
  );
};

export default StatusFooter;
