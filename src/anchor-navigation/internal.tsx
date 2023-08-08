// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { AnchorNavigationProps } from './interfaces.js';
import { checkSafeUrl } from '../internal/utils/check-safe-url.js';
import useScrollSpy from './scroll-spy.js';
const navigateToItem = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  event.preventDefault();
  const href = event.currentTarget.getAttribute('href');
  if (href) {
    const el = document.getElementById(id);
    el?.scrollIntoView();
  }
};
const Anchor = ({ href, text, level, isActive }: AnchorNavigationProps.Anchor & { isActive: boolean }) => {
  checkSafeUrl('SideNavigation', href);

  return (
    <li className={clsx(styles['anchor-item'], { [styles['anchor-item-active']]: isActive })} key={href}>
      <a
        style={{
          // 2px for compensate for -2 negative margin, so the active item borders overlaps the border
          paddingLeft: `${level * 16}px`,
        }}
        onClick={e => navigateToItem(e, href)}
        className={clsx(styles['anchor-link'], { [styles['anchor-link-active']]: isActive })}
        {...(isActive ? { 'aria-current': true } : {})}
        href={href}
      >
        {text}
      </a>
    </li>
  );
};

export default function InternalAnchorNavigation({ anchors, ariaLabelledby, ...props }: AnchorNavigationProps) {
  const hrefs = useMemo(() => anchors.map(anchor => anchor.href), [anchors]);

  const [activeId] = useScrollSpy({ hrefs });
  return (
    <nav aria-labelledby={ariaLabelledby} className={styles.root} {...props}>
      <ol className={styles['anchor-list']}>
        {anchors.map((props, index) => {
          return <Anchor isActive={props.href === `#${activeId}`} key={index} {...props} />;
        })}
      </ol>
    </nav>
  );
}
