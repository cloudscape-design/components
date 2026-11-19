// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import Link from '~components/link';

export default function LinkIntegrationTestPage() {
  const [clickCount, setClickCount] = useState<number>(0);
  const onFollow = useCallback((e: CustomEvent) => {
    setClickCount(clickCount => clickCount + 1);
    e.preventDefault();
  }, []);

  return (
    <>
      <h1>Link integration test</h1>
      <section>
        <h2>Link (role=link)</h2>
        <button type="submit" id="role-link-focus-target">
          Focus here
        </button>{' '}
        <Link id="role-link" href="#" onFollow={onFollow}>
          I am a link!
        </Link>
      </section>
      <section>
        <h2>Link (role=button)</h2>
        <button type="submit" id="role-button-focus-target">
          Focus here
        </button>{' '}
        <Link id="role-button" onFollow={onFollow}>
          I am secretly a button!
        </Link>
      </section>
      <section>
        <h2>Click events</h2>
        <div id="click-message">{clickCount} times clicked</div>
      </section>
    </>
  );
}
