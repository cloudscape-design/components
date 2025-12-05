// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import ThemeSwitcher from './theme-switcher';

import styles from './header.scss';

export default function Header({ sticky }: { sticky?: boolean }) {
  return (
    <>
      {/* #h selector for compatibility with global navigation */}
      <header id="h" className={clsx(styles.header, sticky && styles['header-sticky'])}>
        <Link to="/">Demo Assets</Link>
        <ThemeSwitcher />
      </header>
    </>
  );
}
