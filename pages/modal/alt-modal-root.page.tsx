// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import { Modal, Button } from '~components';
import styles from './styles.scss';

export default function () {
  const [visible, setVisible] = useState(false);
  const [confine, setConfine] = useState(true);
  const appRootRef = useRef<HTMLDivElement>(null);

  /**
   * Here I am creating a box that is scrollable. I have also included a button for removing the
   * box confines and the modalRoot prop on the modal. You can compare how my changes to the modal
   * component by allowing the modalRoot to become the target of the modal window can work in default
   * cases where you want it applied globally on the body tag but also for cases where you want it applied
   * within another container (for micro-frontend integrations).
   */

  return (
    <div>
      <div ref={appRootRef} className={confine ? styles.root : undefined}>
        <article>
          <h1>Alternate Modal Root</h1>
          <Button onClick={() => setVisible(true)}>Show modal</Button>
          <Button onClick={() => setConfine(!confine)}>Toggle box size</Button>
          <p style={{ fontSize: '30px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Orci porta non pulvinar neque laoreet suspendisse. Urna nec tincidunt praesent semper.
            Fermentum posuere urna nec tincidunt. Adipiscing at in tellus integer feugiat scelerisque varius morbi enim.
            Quis auctor elit sed vulputate mi sit. Nibh sit amet commodo nulla facilisi nullam vehicula ipsum. Vitae
            tortor condimentum lacinia quis vel eros donec ac. Amet tellus cras adipiscing enim eu turpis egestas
            pretium aenean. Aliquet lectus proin nibh nisl condimentum id. Ut pharetra sit amet aliquam id. Odio tempor
            orci dapibus ultrices in. Amet venenatis urna cursus eget nunc. Viverra orci sagittis eu volutpat odio
            facilisis mauris sit amet. Scelerisque eleifend donec pretium vulputate sapien nec sagittis. Vivamus arcu
            felis bibendum ut tristique et egestas. Quam vulputate dignissim suspendisse in est. Dapibus ultrices in
            iaculis nunc sed augue lacus viverra. Et ligula ullamcorper malesuada proin. Pretium aenean pharetra magna
            ac placerat vestibulum lectus. Mauris cursus mattis molestie a iaculis at erat pellentesque adipiscing.
            Vitae justo eget magna fermentum iaculis eu non diam. Metus vulputate eu scelerisque felis imperdiet proin
            fermentum leo vel. Sem et tortor consequat id porta nibh. Donec adipiscing tristique risus nec. Sit amet
            mauris commodo quis imperdiet. Lacinia at quis risus sed. Ultricies mi quis hendrerit dolor magna eget. Urna
            et pharetra pharetra massa massa. Arcu felis bibendum ut tristique et egestas quis. Tortor consequat id
            porta nibh. Suspendisse faucibus interdum posuere lorem ipsum. Tincidunt augue interdum velit euismod in.
            Aliquam id diam maecenas ultricies mi. Tortor dignissim convallis aenean et tortor at. Laoreet sit amet
            cursus sit amet dictum. Neque convallis a cras semper auctor neque vitae tempus quam. Mattis vulputate enim
            nulla aliquet porttitor. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed. Purus semper
            eget duis at tellus at. Urna cursus eget nunc scelerisque viverra mauris in aliquam. Nibh cras pulvinar
            mattis nunc sed. Sodales ut eu sem integer vitae justo eget. Ultrices neque ornare aenean euismod elementum
            nisi quis eleifend. Cursus vitae congue mauris rhoncus. Ipsum dolor sit amet consectetur adipiscing.
            Volutpat ac tincidunt vitae semper quis. Justo eget magna fermentum iaculis eu non diam. Amet justo donec
            enim diam vulputate ut. Massa tincidunt dui ut ornare lectus sit amet est placerat. Auctor eu augue ut
            lectus arcu bibendum at varius vel. Tempus urna et pharetra pharetra massa. Mauris commodo quis imperdiet
            massa tincidunt nunc pulvinar sapien. Elementum tempus egestas sed sed risus pretium quam. Mattis
            ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Risus commodo viverra maecenas
            accumsan. Ultrices neque ornare aenean euismod elementum nisi. Tellus mauris a diam maecenas sed enim.
            Scelerisque in dictum non consectetur a. Convallis convallis tellus id interdum velit laoreet id donec. Ac
            tincidunt vitae semper quis lectus nulla at. Est lorem ipsum dolor sit amet. Consequat interdum varius sit
            amet mattis vulputate enim nulla aliquet. Amet dictum sit amet justo. Hac habitasse platea dictumst quisque.
            Leo in vitae turpis massa sed elementum tempus egestas sed. Massa placerat duis ultricies lacus sed. Rutrum
            tellus pellentesque eu tincidunt. Tincidunt augue interdum velit euismod in pellentesque massa placerat
            duis. Tempor orci eu lobortis elementum nibh tellus molestie nunc.
          </p>
          <ScreenshotArea>
            <Modal
              header="Delete instance"
              visible={visible}
              onDismiss={() => setVisible(false)}
              closeAriaLabel="Close modal"
              modalRoot={confine ? appRootRef.current ?? undefined : undefined}
              footer={
                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="link">Cancel</Button>
                  <Button variant="primary">Delete</Button>
                </span>
              }
            >
              This will permanently delete your instance, and may affect the performance of other resources.
            </Modal>
          </ScreenshotArea>
        </article>
      </div>
    </div>
  );
}
