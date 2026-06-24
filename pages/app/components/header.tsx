// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import AppContext from '../app-context';
import ThemeSwitcher from './theme-switcher';

import styles from './header.scss';

export default function Header({ sticky }: { sticky?: boolean }) {
  const { mode } = useContext(AppContext);
  // Preserve the query string (theme, density, motion, …) when navigating back to the index.
  const { search } = useLocation();
  return (
    <>
      {/* #h selector for compatibility with global navigation */}
      <header id="h" className={clsx(styles.header, sticky && styles['header-sticky'])}>
        <Link to={{ pathname: `/${mode}/`, search }}>Demo Assets</Link>
        <ThemeSwitcher />
      </header>
    </>
  );
}
