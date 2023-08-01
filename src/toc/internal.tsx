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

const Anchor = ({ id, text, level, isActive }: TocProps.Anchor & { isActive: boolean }) => {
  checkSafeUrl('SideNavigation', id);

  return (
    <li className={clsx(styles['anchor-item'], { [styles['anchor-item-active']]: isActive })} key={id}>
      <a
        style={{
          // 2px for compensate for -2 negative margin, so active item borders overlap
          paddingLeft: `${level * 16}px`,
        }}
        className={clsx(styles['anchor-link'], { [styles['anchor-link-active']]: isActive })}
        href={`#${id}`}
      >
        {text}
      </a>
    </li>
  );
};

const AnchorList = ({ anchors, activeId }: { anchors: TocProps.Anchor[]; activeId?: string }) => {
  return (
    <ul className={styles['anchor-list']}>
      {anchors.map((props, index) => (
        <Anchor isActive={props.id === activeId} key={index} {...props} />
      ))}
    </ul>
  );
};

export default function InternalToc({ anchors, variant, ...props }: TocProps) {
  const [activeId] = useScrollSpy({ hrefs: anchors.map(anchor => anchor.id) });
  // console.log(activeHref);
  // const activeHref = 'section-1';
  return (
    <div className={styles.root}>
      <InternalSpaceBetween direction="vertical" size="s">
        {variant === 'expandable' ? (
          <InternalExpandableSection variant="footer" headerText={props.title}>
            <AnchorList activeId={activeId} anchors={anchors} />
          </InternalExpandableSection>
        ) : (
          <>
            <InternalBox color="text-body-secondary" variant="h4">
              {props.title}
            </InternalBox>
            <AnchorList activeId={activeId} anchors={anchors} />
          </>
        )}
      </InternalSpaceBetween>
    </div>
  );
}
