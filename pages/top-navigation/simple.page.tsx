// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import TopNavigation from '~components/top-navigation';
import logo from './logos/simple-logo.svg';
import longLogo from './logos/long-logo.svg';
import narrowLogo from './logos/narrow-logo.svg';
import tallLogo from './logos/tall-logo.svg';
import { I18N_STRINGS } from './common';
import { Link } from '~components';

export default function TopNavigationPage() {
  return (
    <article>
      <h1>Simple TopNavigation</h1>
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          title: 'Title with an href',
        }}
      />
      <br />
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          title: 'Very long title which most probably will not fit on the page and we want to avoid wrapping it',
        }}
      />
      <br />
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          title: 'Title',
          logo: { src: logo, alt: 'Logo' },
        }}
      />
      <br />
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          logo: { src: longLogo, alt: 'Long logo, no title' },
        }}
      />
      <br />
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          logo: { src: narrowLogo, alt: 'Long narrow logo, no title' },
        }}
      />
      <br />
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          logo: { src: tallLogo, alt: 'Only logo, no title' },
          title: 'Tall logo, resized to fit',
        }}
      />
      <br />
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          custom: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img role="img" src={logo} alt="Custom Identity" />
              <Link>Custom Identity</Link>
            </div>
          ),
        }}
      />
    </article>
  );
}
