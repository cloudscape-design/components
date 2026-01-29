// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import Box from '../../../box/internal';
import { InternalDrawer } from '../../../drawer/internal';
import { useInternalI18n } from '../../../i18n/context';
import { Feature, MountContentPart } from '../../../internal/plugins/widget/interfaces';
import { formatDate } from '../../../internal/utils/date-time';
import Link from '../../../link/internal';
import List from '../../../list/internal';

import styles from './styles.css.js';

interface RuntimeContentPartProps<T> {
  mountContent?: MountContentPart<T>;
  content: T;
}

export function RuntimeContentPart<T>({ content, mountContent }: RuntimeContentPartProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountContent) {
      return;
    }
    const container = ref.current!;
    const destructor = mountContent(container, content);

    return () => {
      destructor?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return mountContent ? <div ref={ref} /> : <span>{content}</span>;
}

export default function RuntimeFeaturesNotificationDrawer<T>({
  features,
  mountItem,
  featuresPageLink,
}: {
  features: Array<Feature<T>>;
  mountItem?: MountContentPart<T>;
  featuresPageLink?: string;
}) {
  const i18n = useInternalI18n('features-notification-drawer');

  return (
    <InternalDrawer header={i18n('i18nStrings.title', undefined)} disableContentPaddings={true}>
      <Box
        padding={{ top: 'm', left: 'xl', right: 'xl', bottom: 'm' }}
        className={styles['runtime-feature-notifications-drawer-content']}
      >
        <List
          items={features}
          renderItem={item => ({
            id: item.id,
            content: (
              <Box variant="h3">
                <RuntimeContentPart mountContent={mountItem} content={item.header} />
              </Box>
            ),
            secondaryContent: (
              <>
                {!!item.releaseDate && (
                  <Box margin={{ top: 'xs' }} fontSize="body-s" color="text-body-secondary">
                    {formatDate(item.releaseDate)}
                  </Box>
                )}
                {!!item.contentCategory && (
                  <Box margin={{ top: 'xs' }}>
                    <RuntimeContentPart mountContent={mountItem} content={item.contentCategory} />
                  </Box>
                )}
                <Box margin={{ top: 'xs' }}>
                  <RuntimeContentPart mountContent={mountItem} content={item.content} />
                </Box>
              </>
            ),
          })}
        />

        {!!featuresPageLink && (
          <Box padding={{ top: 's' }} className={styles['runtime-feature-notifications-footer']}>
            <Link href={featuresPageLink}>{i18n('i18nStrings.viewAll', undefined)}</Link>
          </Box>
        )}
      </Box>
    </InternalDrawer>
  );
}
