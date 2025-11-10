// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import Box from '../../../box/internal';
import { InternalDrawer } from '../../../drawer/internal';
import { Feature, MountContentPart } from '../../../internal/plugins/widget/interfaces';
import { formatDate } from '../../../internal/utils/date-time';
import Link from '../../../link/internal';
import List from '../../../list/internal';

import styles from './styles.css.js';

interface RuntimeContentPartProps<T> {
  mountContent: MountContentPart<T>;
  content: T;
}

export function RuntimeContentPart<T>({ content, mountContent }: RuntimeContentPartProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current!;
    const destructor = mountContent(container, content);

    return () => {
      destructor?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} />;
}

export default function RuntimeFeaturesNotificationDrawer<T>({
  features,
  mountItem,
  featuresPageLink,
}: {
  features: Array<Feature<T>>;
  mountItem: MountContentPart<T>;
  featuresPageLink?: string;
}) {
  return (
    // TODO i18n strings
    <InternalDrawer header="Latest feature releases" disableContentPaddings={true}>
      <Box
        padding={{ top: 'm', left: 'xl', right: 'xl', bottom: 'm' }}
        className={styles['runtime-feature-notifications-drawer-content']}
      >
        <List
          items={features}
          renderItem={item => ({
            id: item.id,
            content: <RuntimeContentPart mountContent={mountItem} content={item.header} />,
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
            <Link href={featuresPageLink}>See all feature releases</Link>
          </Box>
        )}
      </Box>
    </InternalDrawer>
  );
}
