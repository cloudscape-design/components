// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { NonCancelableCustomEvent } from '~components';

import Input, { InputProps } from '~components/input';
import TopNavigation from '~components/top-navigation';
import { I18N_STRINGS } from './common';

export default function () {
  const inputRef = useRef<InputProps.Ref>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [events, setEvents] = useState<string[]>([]);
  const onUtilityClick = (event: NonCancelableCustomEvent<unknown>) => {
    setEvents(events => [...events, JSON.stringify(event.detail)]);
  };
  return (
    <article>
      <h1>TopNavigation Integ Page</h1>
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          title: 'Title with an href',
        }}
        search={
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search..."
            value={inputValue}
            onChange={event => setInputValue(event.detail.value)}
          />
        }
        utilities={[
          {
            type: 'button',
            variant: 'primary-button',
            text: 'New thing',
            iconName: 'add-plus',
            disableTextCollapse: true,
            onClick: onUtilityClick,
          },
          {
            type: 'button',
            text: 'Docs',
            href: 'https://docs.aws.amazon.com/',
            external: true,
            externalIconAriaLabel: 'opens in a new tab',
            onClick: onUtilityClick,
          },
          {
            type: 'button',
            ariaLabel: 'Notifications',
            iconName: 'notification',
            disableUtilityCollapse: true,
            href: '/should-not-navigate',
            onClick: evt => {
              evt.preventDefault();
              onUtilityClick(evt);
            },
          },
          {
            type: 'menu-dropdown',
            text: 'John Doe',
            title: 'John Doe',
            description: 'john.doe@example.com',
            iconName: 'envelope',
            items: [{ id: 'signout', text: 'Sign out' }],
            onItemClick: onUtilityClick,
          },
        ]}
      />
      <code>
        <pre id="events">{events.join('\n')}</pre>
      </code>
      <button type="button" onClick={() => setEvents([])} id="clear">
        Clear events
      </button>
      <button type="button" onClick={() => inputRef.current?.focus()} id="focus-input">
        Focus input
      </button>
    </article>
  );
}
