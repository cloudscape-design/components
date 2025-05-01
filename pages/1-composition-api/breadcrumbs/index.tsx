// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Icon, Link, Popover } from '~components';

import validateChildren from '../utils/validate-children';

import styles from './styles.scss';

function Group({ children }: any) {
  return <nav className={styles.group}>{children}</nav>;
}

function List({ children }: any) {
  // Using permitted content here to ensure children are wrapped in <li> elements
  const permittedContent = [ListItem];

  return <ol className={styles.list}>{validateChildren('Breadcrumbs.List', permittedContent, children)}</ol>;
}

function ListItem({ children }: any) {
  // Using permitted content here to provide additional constraints for other reasons. For example, within a system.
  const permittedContent = [Box, Icon, Link, Popover];

  return <li className={styles.item}>{validateChildren('Breadcrumbs.ListItem', permittedContent, children)}</li>;
}

export default {
  Group,
  List,
  ListItem,
};
