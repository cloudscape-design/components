// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Fragment, FunctionComponent, ReactNode } from 'react';
import { cleanup, render } from '@testing-library/react';

import flattenChildren from '../../../../../lib/components/internal/vendor/react-keyed-flatten-children';

const Assert: FunctionComponent<{
  assert: (result: ReturnType<typeof flattenChildren>) => void;
  children: ReactNode;
}> = props => {
  const result = flattenChildren(props.children);
  props.assert(result);
  return (
    <div data-testid="assert-container">
      {React.Children.map(result, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              'data-reactkey': child.key,
            } as React.HTMLAttributes<HTMLElement>)
          : child
      )}
    </div>
  );
};

function getRenderedChildren(container: HTMLElement) {
  const assertContainer = container.querySelector('[data-testid="assert-container"]');
  if (!assertContainer) {
    throw new Error('No assert container found');
  }
  return Array.from(assertContainer.children);
}

// test('simple children', () => {
//   render(
//     <Assert
//       assert={result => {
//         expect(result.length).toBe(4);
//         expect(isElement(result[0]) && result[0].key).toBe('.0');
//         expect(result[1]).toBe('two');
//         expect(isElement(result[2]) && result[2].key).toBe('.2');
//         expect(result[3]).toBe('10');
//       }}
//     >
//       <span>one</span>
//       two
//       <span>three</span>
//       10
//     </Assert>
//   );
// });

// test('nested arrays and fragments with mixed content', () => {
//   render(
//     <Assert
//       assert={result => {
//         expect(result.length).toBe(8);
//         expect(result.map((c: any) => c.key)).toEqual([
//           '.0',
//           undefined,
//           '.1:$a',
//           undefined,
//           '.1:2:$b',
//           undefined,
//           undefined,
//           '.2',
//         ]);
//       }}
//     >
//       <span>start</span>
//       {['one', <span key="a">nested element</span>, ['two', <span key="b">deep element</span>, 'three', 4]]}
//       <span>end</span>
//     </Assert>
//   );
// });

// test('conditional children', () => {
//   render(
//     <Assert
//       assert={result => {
//         expect(result.length).toBe(3);
//         expect(isElement(result[0]) && result[0].key).toBe('.0');
//         expect(isElement(result[1]) && result[1].key).toBe('.2');
//         expect(isElement(result[2]) && result[2].key).toBe('.4');
//       }}
//     >
//       <span>one</span>
//       {false}
//       <span>three</span>
//       {null}
//       <span>five</span>
//     </Assert>
//   );
// });

// test('keyed children', () => {
//   render(
//     <Assert
//       assert={result => {
//         expect(result.length).toBe(5);
//         expect(result.map((c: any) => c.key)).toEqual(['.$one', '.$two', undefined, '.$four', '.4']);
//       }}
//     >
//       <span key="one">one</span>
//       <span key="two">two</span>
//       three
//       <span key="four">four</span>
//       <span>five</span>
//     </Assert>
//   );
// });

// test('fragment children', () => {
//   render(
//     <Assert
//       assert={result => {
//         expect(result.length).toBe(3);
//         expect(result.map((c: any) => c.key)).toEqual(['.0..$one', '.0..$two', '.1..$three']);
//       }}
//     >
//       <>
//         <span key="one">one</span>
//         <span key="two">two</span>
//       </>
//       <>
//         <span key="three">three</span>
//       </>
//     </Assert>
//   );
// });

// test('keyed fragment children', () => {
//   render(
//     <Assert
//       assert={result => {
//         expect(result.length).toBe(3);
//         expect(result.map((c: any) => c.key)).toEqual(['.$apple..$one', '.$apple..$two', '.$banana..$three']);
//       }}
//     >
//       <Fragment key="apple">
//         <span key="one">one</span>
//         <span key="two">two</span>
//       </Fragment>
//       <Fragment key="banana">
//         <span key="three">three</span>
//       </Fragment>
//     </Assert>
//   );
// });

// test('array children', () => {
//   render(
//     <Assert
//       assert={result => {
//         expect(result.length).toBe(5);
//         expect(result.map((c: any) => c.key)).toEqual(['.0', undefined, '.1:$apple', '.1:2', '.2']);
//       }}
//     >
//       <span>one</span>
//       {['two', <span key="apple">three</span>, <span key="four">four</span>]}
//       <span>five</span>
//     </Assert>
//   );
// });

test('renders through to react', () => {
  const { container } = render(
    <Assert
      assert={result => {
        expect(result.length).toBe(6);
      }}
    >
      <span>head</span>
      <>
        <span key="one">one</span>
        <span key="two">two</span>
      </>
      <span>body</span>
      {false}
      <Fragment key="banana">
        <span key="three">three</span>
      </Fragment>
      <span>foot</span>
    </Assert>
  );

  const children = getRenderedChildren(container);

  expect(children.length).toBe(6);
  expect(Array.from(children).map(child => child.getAttribute('data-reactkey'))).toEqual([
    '.0',
    '.$apple..$one',
    '.$apple..$two',
    '.2',
    '.$banana..$three',
    '.5',
  ]);
});

afterAll(cleanup);
