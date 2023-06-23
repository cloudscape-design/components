// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import { Button, Modal } from '~components';

export default function () {
  const [visible, setVisible] = useState(false);

  const content = [];

  for (let i = 0; i < 10; i++) {
    content.push(
      <p key={i} style={{ position: 'relative', zIndex: 10 }}>
        Bacon ipsum dolor amet jowl short ribs shankle prosciutto flank tenderloin tri-tip tongue. Meatloaf salami
        turducken bresaola ribeye flank shankle boudin sirloin. Picanha meatloaf short ribs chicken jowl andouille filet
        mignon spare ribs kevin rump corned beef. Cow pastrami beef ribs turkey kielbasa alcatra.
      </p>
    );
  }

  return (
    <article>
      <h1>Vertical scroll modal</h1>
      <Button data-testid="modal-trigger" onClick={() => setVisible(true)}>
        Show modal
      </Button>
      <ScreenshotArea>
        <Modal
          header="Modal title"
          visible={visible}
          onDismiss={() => setVisible(false)}
          closeAriaLabel="Close modal"
          footer="What?"
        >
          <div>
            <h3>Modal with vertical scroll</h3>
            <p>This is a large modal, it&apos;s size is equal to viewport size - 100px on each side.</p>
            <h3>Some random content</h3>
            <p>
              Bacon ipsum dolor amet cupim ham capicola meatball pastrami. Corned beef strip steak flank, drumstick
              short loin pork chop picanha. Landjaeger picanha spare ribs tongue chuck sausage pork belly, t-bone
              shankle short loin venison kevin. Ball tip t-bone leberkas flank, frankfurter pig corned beef spare ribs
              jerky pork loin shoulder tri-tip salami.
            </p>
            <p>
              Swine andouille pig pork belly pork chop meatball beef ribs prosciutto meatloaf spare ribs chuck shank
              pork loin. Capicola ham filet mignon chicken ground round pork leberkas bresaola shoulder shank strip
              steak. Kevin tri-tip pork chop short loin corned beef, beef drumstick doner. Beef kevin jerky tail.
            </p>
            {content}
          </div>
        </Modal>
      </ScreenshotArea>
    </article>
  );
}
