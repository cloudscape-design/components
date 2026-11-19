// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import RadioGroup from '~components/radio-group';

import styles from './styles.scss';

export default function RadiosPage() {
  const [value, setValue] = useState<string>('two');
  return (
    <div>
      <h1>Radio groups demo</h1>
      <h2>Simple group</h2>
      <RadioGroup
        id="simple"
        value={value}
        onChange={event => setValue(event.detail.value)}
        items={[
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three', disabled: true },
        ]}
      />
      <div className={styles.scrollableContainer} id="scrollable-container">
        <h2>Group in container</h2>
        <RadioGroup
          id="in-container"
          value={value}
          onChange={event => setValue(event.detail.value)}
          items={[
            { label: 'Foo', value: 'foo' },
            { label: 'Bar', value: 'bar' },
            { label: 'Baz', value: 'baz' },
          ]}
        />
      </div>
    </div>
  );
}
