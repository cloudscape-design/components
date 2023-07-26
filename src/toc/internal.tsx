// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import InternalBox from '../box/internal';
import InternalSpaceBetween from '../space-between/internal';
import { TocProps } from './interfaces';
import { checkSafeUrl } from '../internal/utils/check-safe-url.js';
import useScrollSpy from './scroll-spy.js';
import InternalExpandableSection from '../expandable-section/internal.js';

const Anchor = ({ href, text, level, isActive }: TocProps.Anchor & { isActive: boolean }) => {
  checkSafeUrl('SideNavigation', href);

  return (
    <li className={clsx(styles['anchor-item'], { [styles['anchor-item-active']]: isActive })} key={href}>
      <a
        style={{
          // 2px for compensate for -2 negative margin, so active item borders overlap
          paddingLeft: `${level * 16}px`,
        }}
        className={clsx(styles['anchor-link'], { [styles['anchor-link-active']]: isActive })}
        href={`#${href}`}
      >
        {text}
      </a>
    </li>
  );
};

const AnchorList = ({ anchors, activeHref }: { anchors: TocProps.Anchor[]; activeHref?: string }) => {
  return (
    <ul className={styles['anchor-list']}>
      {anchors.map((props, index) => (
        <Anchor isActive={props.href === activeHref} key={index} {...props} />
      ))}
    </ul>
  );
};

export default function InternalToc({ anchors, variant, ...props }: TocProps) {
  const [activeHref] = useScrollSpy({ hrefs: anchors.map(anchor => anchor.href) });
  // console.log(activeHref);
  // const activeHref = 'section-1';
  return (
    <div className={styles.root}>
      <InternalSpaceBetween direction="vertical" size="s">
        {variant === 'expandable' ? (
          <InternalExpandableSection variant="footer" headerText={props.title}>
            <AnchorList activeHref={activeHref} anchors={anchors} />
          </InternalExpandableSection>
        ) : (
          <>
            <InternalBox color="text-body-secondary" variant="h4">
              {props.title}
            </InternalBox>
            <AnchorList activeHref={activeHref} anchors={anchors} />
          </>
        )}
      </InternalSpaceBetween>
    </div>
  );
}
