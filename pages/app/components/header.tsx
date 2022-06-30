// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useContext } from 'react';
import styles from './header.scss';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './theme-switcher';
import AppContext from '../app-context';

export default function Header({ sticky }: { sticky?: boolean }) {
  const { mode } = useContext(AppContext);
  return (
    <>
      {/* #h selector for compatibility with global navigation */}
      <header id="h" className={clsx(styles.header, sticky && styles['header-sticky'])}>
        <Link to={`/${mode}/`}>Demo Assets</Link>
        <ThemeSwitcher />
      </header>
    </>
  );
}
