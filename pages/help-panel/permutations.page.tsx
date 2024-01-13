// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import HelpPanel from '~components/help-panel';
import Box from '~components/box';
import Icon from '~components/icon';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';
import { Link } from '~components';

const mainContent = (
  <div>
    <p>
      This is a paragraph <b>with some bold text</b> and also <strong>some strong text</strong>. There can also be{' '}
      <i>italic text</i> or <em>emphasized text</em>. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare quam viverra orci sagittis. Id neque aliquam
      vestibulum morbi blandit cursus risus at. Elit at imperdiet dui accumsan sit amet nulla facilisi.
    </p>
    <h3>This is an h3</h3>
    <ul>
      <li>This is an unordered list.</li>

      <li>
        <b>Lorem ipsum dolor sit ameta</b> – <code>This is a line of code.</code>
      </li>
      <li>
        <b>Id neque aliquam vestibulum morbi blandit cursus</b> – This is normal list text.
      </li>
    </ul>

    <ol>
      <li>This is an ordered list.</li>
      <li>
        <b>This is a bolded list item.</b>
      </li>
      <li>
        <code>Ornare quam viverra orci sagittis.</code>
      </li>
    </ol>

    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut{' '}
      <i>labore et dolore magna</i> aliqua. Neque gravida in fermentum et sollicitudin. Diam phasellus vestibulum lorem
      sed.
    </p>

    <hr />

    <p>
      Code can be formatted as lines of code using a <code>{'<code>'}</code> tag or a block of code using a{' '}
      <code>{'<pre>'}</code> tag. For example, you can add inline code <code>like this</code> using a{' '}
      <code>{'<code>'}</code> tag or you can create blocks of code such as the following:
    </p>
    <pre>
      This is a block of code using a <code>{'<pre>'}</code> tag.
    </pre>
    <pre>
      It wraps lines if the content is long enough like this section. Normally <code>{'<pre>'}</code> tags maintain
      original spacing, but because the help panel area is limited and should not scroll horizontally, preformatted text
      lines are reformatted. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      ut labore et dolore magna aliqua. Adipiscing bibendum est ultricies integer quis. Sed lectus vestibulum mattis
      ullamcorper velit sed ullamcorper. Suscipit adipiscing bibendum est ultricies integer. Purus in massa tempor nec
      feugiat nisl pretium fusce.
    </pre>

    <h4>This is a rrrrrrrrrrrreeeeeeeeeeeeeaaaaaaaaaaaaaaaallllllllllllllllllllyyyyyyyyyyyyyy long h4</h4>
    <p>Below you will find a description list with terms and definitions:</p>
    <dl>
      <dt>This is a term</dt>
      <dd>This is a description.</dd>
      <dt>Lorem ipsum dolor</dt>
      <dd>
        <p>This is a description inside a p tag.</p>
      </dd>
      <dt>Term</dt>
      <dd>
        <code>
          Code can be used here if it makes sense. As you can see this is just inline code. Additionally, there is space
          between lines.
        </code>
      </dd>
    </dl>
    <span>This is a span. Spans do not have any styling added to them by default.</span>
    <span>This is another span..there should be no margin or space in between the two.</span>
    <span>One more span before a line break.</span>
    <br />
    <span>
      And then another span with some <em>emphasized text</em>.
    </span>

    <h5>This is an h5</h5>
    <span>This is another span. It is getting it&apos;s margins from surrounding elements.</span>
    <ul>
      <li>
        <p>This list item has a paragraph tag inside but still has the correct padding.</p>
      </li>
      <li>
        <ul>
          <li>This is a nested list.</li>
          <li>
            <a>This is a link</a>. And a <Link href="#">Cloudscape Link</Link>. Mi proin sed libero enim sed faucibus
            turpis.
          </li>
          <li>
            <pre>
              This is a code block in a list. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Tempor orci dapibus ultrices in iaculis nunc.
              Venenatis a condimentum vitae sapien pellentesque habitant morbi. Blandit massa enim nec dui nunc mattis
              enim. Nisi est sit amet facilisis. Neque vitae tempus quam pellentesque nec nam aliquam. Suspendisse in
              est ante in. Ut ornare lectus sit amet est placerat in egestas erat. Dictumst quisque sagittis purus sit
              amet volutpat consequat mauris nunc. Aliquam ultrices sagittis orci a scelerisque purus. Quis imperdiet
              massa tincidunt nunc pulvinar sapien et. Consequat interdum varius sit amet mattis vulputate.
            </pre>
          </li>
        </ul>
      </li>
    </ul>

    <div>
      <p>This is a paragraph inside a div.</p>
    </div>
    <div>This is just a div.</div>
  </div>
);

const footerContent = (
  <>
    <h3>
      Learn more <Icon name="external" />
    </h3>
    <ul>
      <li>
        <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOrigin">
          This is a link in the footer
        </a>
      </li>
      <li>
        <p>
          <a href="">This link is in a p tag</a>
        </p>
      </li>
    </ul>
    <p>These links above are unstyled automatically because that is the recommendation for the learn more section.</p>
  </>
);

export default function HelpPanelPermutations() {
  return (
    <ScreenshotArea gutters={false}>
      <Box variant="h1">Help panel styles</Box>
      <div className={styles.permutations}>
        {['default', 'medium', 'large'].map((panelSize, index) => (
          <div key={index} className={styles[panelSize]}>
            <HelpPanel footer={footerContent} header={<h2>Help panel #{index + 1}</h2>}>
              {mainContent}
            </HelpPanel>
          </div>
        ))}
      </div>
    </ScreenshotArea>
  );
}
