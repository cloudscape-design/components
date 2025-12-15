// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Box from '~components/box';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import ButtonGroup from '~components/button-group';
import Calendar from '~components/calendar';
import Container from '~components/container';
import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import FileTokenGroup, { FileTokenGroupProps } from '~components/file-token-group';
import Header from '~components/header';
import Modal from '~components/modal';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';
import Slider from '~components/slider';
import SpaceBetween from '~components/space-between';
import Tabs from '~components/tabs';
import Token from '~components/token';
import Tooltip from '~components/tooltip';

import ScreenshotArea from '../utils/screenshot-area';

export default function InternalTooltipExamples() {
  return (
    <>
      <Box padding="l">
        <SpaceBetween size="l">
          <Header variant="h1">Tooltip</Header>
          {/* <InteractivePositionControlExample /> */}
          {/* <TrackKeyBehaviorExample /> */}
          {/* <EscapeKeyBehaviorExample /> */}
          {/* <ContentStressTestExample /> */}
          <DisabledActionsExample />
          <TruncatedTextExample />
          <IconOnlyButtonsExample />
          {/* <TableActionsExample /> */}
          {/* <RapidHoverTestExample /> */}
          {/* <NestedElementsExample /> */}
          {/* <InteractiveContentExample /> */}
          <FileInputItemExample />
          {/* <IconButtonItemExample />
          <IconToggleButtonItemExample /> */}
          {/* <MenuDropdownItemExample /> */}
          <ButtonExample />
          <SelectItemExample />
          <MultiselectItemExample />
          <TokenExample />
          <FileTokenGroupExample />
          <SegmentedControlExample />
          <BreadcrumbGroupExample />
          <SliderExample />
          <CalendarExample />
          <DateRangePickerExample />
          <TabsExample />
        </SpaceBetween>
      </Box>
    </>
  );
}

// function InteractivePositionControlExample() {
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [position, setPosition] = useState<'top' | 'right' | 'bottom' | 'left'>('top');
//   const buttonRef = useRef<HTMLDivElement>(null);

//   return (
//     <Container header={<Header variant="h2">Interactive Position Control</Header>}>
//       <ScreenshotArea>
//         <SpaceBetween size="m">
//           <SpaceBetween direction="horizontal" size="l" alignItems="center">
//             <SegmentedControl
//               selectedId={position}
//               onChange={({ detail }) => setPosition(detail.selectedId as 'top' | 'right' | 'bottom' | 'left')}
//               options={[
//                 { id: 'top', text: 'Top' },
//                 { id: 'right', text: 'Right' },
//                 { id: 'bottom', text: 'Bottom' },
//                 { id: 'left', text: 'Left' },
//               ]}
//             />
//             <div
//               ref={buttonRef}
//               onMouseEnter={() => setShowTooltip(true)}
//               onMouseLeave={() => setShowTooltip(false)}
//               style={{ display: 'inline-block' }}
//             >
//               <Button
//                 variant="primary"
//                 nativeButtonAttributes={{
//                   onFocus: () => setShowTooltip(true),
//                   onBlur: () => setShowTooltip(false),
//                 }}
//               >
//                 Hover
//               </Button>
//               {showTooltip && (
//                 <Tooltip
//                   content={`Tooltip positioned on ${position}`}
//                   getTrack={() => buttonRef.current}
//                   position={position}
//                   onEscape={() => setShowTooltip(false)}
//                   trackKey={`position-${position}`}
//                 />
//               )}
//             </div>
//           </SpaceBetween>
//         </SpaceBetween>
//       </ScreenshotArea>
//     </Container>
//   );
// }

// function TrackKeyBehaviorExample() {
//   // Example 1: undefined trackKey
//   const example1Ref = useRef<HTMLDivElement>(null);
//   const [show1, setShow1] = useState(false);

//   // Example 2: trackKey changes every render
//   const example2Ref = useRef<HTMLDivElement>(null);
//   const [show2, setShow2] = useState(false);
//   const [renderCount, setRenderCount] = useState(0);

//   // Example 3: different trackKeys, same element
//   const example4Ref = useRef<HTMLDivElement>(null);
//   const [show4, setShow4] = useState(false);
//   const [trackKey4, setTrackKey4] = useState('trackKey-A');

//   return (
//     <Container header={<Header variant="h2">TrackKey Behavior</Header>}>
//       <ScreenshotArea>
//         <SpaceBetween size="l">
//           {/* Example 1: undefined trackKey (auto-generated) */}
//           <Container header={<Header variant="h3">1. Undefined TrackKey (Auto-Generated)</Header>}>
//             <SpaceBetween size="s">
//               {/* <Box fontSize="body-s">
//                 <strong>Test:</strong> No explicit trackKey provided. Should auto-generate from string content.
//               </Box> */}
//               <div
//                 ref={example1Ref}
//                 onMouseEnter={() => setShow1(true)}
//                 onMouseLeave={() => setShow1(false)}
//                 style={{ display: 'inline-block' }}
//               >
//                 <Button
//                   variant="primary"
//                   nativeButtonAttributes={{
//                     onFocus: () => setShow1(true),
//                     onBlur: () => setShow1(false),
//                   }}
//                 >
//                   Hover - no explicit trackKey
//                 </Button>
//                 {show1 && (
//                   <Tooltip
//                     content="Auto-generated trackKey from this string"
//                     getTrack={() => example1Ref.current}
//                     position="top"
//                     onEscape={() => setShow1(false)}
//                     // No trackKey prop - should auto-generate
//                   />
//                 )}
//               </div>
//             </SpaceBetween>
//           </Container>

//           {/* Example 2: trackKey changes every render */}
//           <Container header={<Header variant="h3">2. TrackKey Changes Every Render</Header>}>
//             <SpaceBetween size="s">
//               {/* <Box fontSize="body-s">
//                 <strong>Test:</strong> TrackKey includes render count. Each render creates new tooltip instance.
//               </Box> */}
//               <SpaceBetween direction="horizontal" size="s">
//                 <div
//                   ref={example2Ref}
//                   onMouseEnter={() => setShow2(true)}
//                   onMouseLeave={() => setShow2(false)}
//                   style={{ display: 'inline-block' }}
//                 >
//                   <Button
//                     variant="primary"
//                     nativeButtonAttributes={{
//                       onFocus: () => setShow2(true),
//                       onBlur: () => setShow2(false),
//                     }}
//                   >
//                     Hover - trackKey changes per render
//                   </Button>
//                   {show2 && (
//                     <Tooltip
//                       content={`Render count: ${renderCount}`}
//                       getTrack={() => example2Ref.current}
//                       position="top"
//                       onEscape={() => setShow2(false)}
//                       trackKey={`render-${renderCount}`}
//                     />
//                   )}
//                 </div>
//                 <Button onClick={() => setRenderCount(renderCount + 1)}>Force Re-render ({renderCount})</Button>
//               </SpaceBetween>
//             </SpaceBetween>
//           </Container>

//           {/* Example 3: different trackKeys, same element */}
//           <Container header={<Header variant="h3">3. Different TrackKeys, Same Element</Header>}>
//             <SpaceBetween size="s">
//               {/* <Box fontSize="body-s">
//                 <strong>Test:</strong> Same button, but tooltip uses different trackKeys. Forces position recalculation.
//               </Box> */}
//               <SpaceBetween direction="horizontal" size="s">
//                 <div
//                   ref={example4Ref}
//                   onMouseEnter={() => setShow4(true)}
//                   onMouseLeave={() => setShow4(false)}
//                   style={{ display: 'inline-block' }}
//                 >
//                   <Button
//                     variant="primary"
//                     nativeButtonAttributes={{
//                       onFocus: () => setShow4(true),
//                       onBlur: () => setShow4(false),
//                     }}
//                   >
//                     Hover - trackKey switches
//                   </Button>
//                   {show4 && (
//                     <Tooltip
//                       content={`Using trackKey: ${trackKey4}`}
//                       getTrack={() => example4Ref.current}
//                       position="top"
//                       onEscape={() => setShow4(false)}
//                       trackKey={trackKey4}
//                     />
//                   )}
//                 </div>
//                 <Button onClick={() => setTrackKey4(trackKey4 === 'trackKey-A' ? 'trackKey-B' : 'trackKey-A')}>
//                   Switch TrackKey (Current: {trackKey4})
//                 </Button>
//               </SpaceBetween>
//             </SpaceBetween>
//           </Container>

//           {/* Example 4: changing trackKey forces position recalc */}
//           {/* <Container header={<Header variant="h3">4. TrackKey Forces Position Recalculation</Header>}>
//             <SpaceBetween size="s">
//               <Box fontSize="body-s">
//                 <strong>Test:</strong> When position changes, trackKey must change to force position recalculation.
//               </Box>
//               <SpaceBetween direction="horizontal" size="s">
//                 <SegmentedControl
//                   selectedId={position5}
//                   onChange={({ detail }) => setPosition5(detail.selectedId as any)}
//                   options={[
//                     { id: 'top', text: 'Top' },
//                     { id: 'right', text: 'Right' },
//                     { id: 'bottom', text: 'Bottom' },
//                     { id: 'left', text: 'Left' },
//                   ]}
//                 />
//                 <div
//                   ref={example5Ref}
//                   onMouseEnter={() => setShow5(true)}
//                   onMouseLeave={() => setShow5(false)}
//                   style={{ display: 'inline-block' }}
//                 >
//                   <Button variant="primary">Hover - trackKey includes position</Button>
//                   {show5 && (
//                     <Tooltip
//                       content={`Position: ${position5} (trackKey forces recalc)`}
//                       getTrack={() => example5Ref.current}
//                       position={position5}
//                       onEscape={() => setShow5(false)}
//                       trackKey={`position-recalc-${position5}`}
//                     />
//                   )}
//                 </div>
//               </SpaceBetween>
//             </SpaceBetween>
//           </Container> */}
//         </SpaceBetween>
//       </ScreenshotArea>
//     </Container>
//   );
// }

function EscapeKeyBehaviorExample() {
  // Test 1: Tooltip with modal open
  const [showModal1, setShowModal1] = useState(false);
  const [showTooltip1, setShowTooltip1] = useState(false);
  const modal1Ref = useRef<HTMLDivElement>(null);

  // Test 2: Tooltip with nested dialogs
  const [showDialog1, setShowDialog1] = useState(false);
  const [showDialog2, setShowDialog2] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const dialog2Ref = useRef<HTMLDivElement>(null);

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Test: Escape key behavior in various scenarios - modals, dialogs, multiple tooltips, spam, animation"
        >
          Escape Key Behavior Tests
        </Header>
      }
    >
      <ScreenshotArea>
        <SpaceBetween size="l">
          {/* Test 1: Tooltip + Modal */}
          <Container header={<Header variant="h3">1. Tooltip with Modal Open</Header>}>
            <SpaceBetween size="s">
              <Box fontSize="body-s">
                <strong>Test:</strong> Open modal, hover button for tooltip, press Escape. Tooltip closes (because of
                stopPropagation), modal stays open.
              </Box>
              <Button onClick={() => setShowModal1(true)}>Open Cloudscape Modal</Button>
              <Modal
                visible={showModal1}
                onDismiss={() => {
                  setShowModal1(false);
                  setShowTooltip1(false);
                }}
                header="Modal with Tooltip Test"
                closeAriaLabel="Close modal"
                footer={
                  <Box float="right">
                    <Button
                      onClick={() => {
                        setShowModal1(false);
                        setShowTooltip1(false);
                      }}
                    >
                      Close Modal
                    </Button>
                  </Box>
                }
              >
                <SpaceBetween size="m">
                  <Box>
                    <strong>Critical Test:</strong> Hover button below to show tooltip, then press Escape. The
                    tooltip&apos;s Escape handler uses capture phase + stopPropagation, so only the tooltip should
                    close. The modal should stay open.
                  </Box>
                  <div
                    ref={modal1Ref}
                    onMouseEnter={() => setShowTooltip1(true)}
                    onMouseLeave={() => setShowTooltip1(false)}
                    style={{ display: 'inline-block' }}
                  >
                    <Button variant="primary">Hover for tooltip</Button>
                    {showTooltip1 && (
                      <Tooltip
                        content="Press Escape - only I should close, modal stays open"
                        getTrack={() => modal1Ref.current}
                        position="top"
                        onEscape={() => setShowTooltip1(false)}
                        trackKey="modal-esc-test"
                      />
                    )}
                  </div>
                </SpaceBetween>
              </Modal>
            </SpaceBetween>
          </Container>

          {/* Test 2: Tooltip + Nested Modals */}
          <Container header={<Header variant="h3">2. Tooltip with Nested Modals</Header>}>
            <SpaceBetween size="s">
              <Box fontSize="body-s">
                <strong>Test:</strong> Open modal 1, then modal 2, hover for tooltip, press Escape. Only tooltip closes
                first.
              </Box>
              <Button onClick={() => setShowDialog1(true)}>Open First Modal</Button>
              <Modal
                visible={showDialog1}
                onDismiss={() => {
                  setShowDialog1(false);
                  setShowDialog2(false);
                  setShowTooltip2(false);
                }}
                header="First Modal"
                closeAriaLabel="Close first modal"
                footer={
                  <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button onClick={() => setShowDialog2(true)}>Open Second Modal</Button>
                      <Button
                        onClick={() => {
                          setShowDialog1(false);
                          setShowDialog2(false);
                          setShowTooltip2(false);
                        }}
                      >
                        Close All
                      </Button>
                    </SpaceBetween>
                  </Box>
                }
              >
                <Box>Click &quot;Open Second Modal&quot; button to test nested modals with tooltip.</Box>
              </Modal>
              <Modal
                visible={showDialog2}
                onDismiss={() => {
                  setShowDialog2(false);
                  setShowTooltip2(false);
                }}
                header="Second Modal (Nested)"
                closeAriaLabel="Close second modal"
                footer={
                  <Box float="right">
                    <Button onClick={() => setShowDialog2(false)}>Close This Modal</Button>
                  </Box>
                }
              >
                <SpaceBetween size="m">
                  <Box fontSize="body-s">
                    Hover button below, press Escape. Tooltip closes first (stopPropagation), then next Escape closes
                    this modal.
                  </Box>
                  <div
                    ref={dialog2Ref}
                    onMouseEnter={() => setShowTooltip2(true)}
                    onMouseLeave={() => setShowTooltip2(false)}
                    style={{ display: 'inline-block' }}
                  >
                    <Button variant="primary">Hover for tooltip</Button>
                    {showTooltip2 && (
                      <Tooltip
                        content="1st Escape: closes me | 2nd Escape: closes modal"
                        getTrack={() => dialog2Ref.current}
                        position="top"
                        onEscape={() => setShowTooltip2(false)}
                        trackKey="nested-modal-esc"
                      />
                    )}
                  </div>
                </SpaceBetween>
              </Modal>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

// function ContentStressTestExample() {
//   // Test 1: Very long unbroken text
//   const longTextRef = useRef<HTMLDivElement>(null);
//   const [showLongText, setShowLongText] = useState(false);

//   // Test 2: Multiline with inline elements
//   const multilineRef = useRef<HTMLDivElement>(null);
//   const [showMultiline, setShowMultiline] = useState(false);

//   // Test 3: Very long URL
//   const urlRef = useRef<HTMLDivElement>(null);
//   const [showUrl, setShowUrl] = useState(false);

//   // Test 4: Mixed content (text + code + lists + inline elements)
//   const mixedRef = useRef<HTMLDivElement>(null);
//   const [showMixed, setShowMixed] = useState(false);

//   return (
//     <Container header={<Header variant="h2">Content</Header>}>
//       <ScreenshotArea>
//         <SpaceBetween size="l">
//           {/* Test 1: Very long unbroken text */}
//           <Container header={<Header variant="h3">1. Very Long Unbroken Text (No Spaces)</Header>}>
//             <SpaceBetween size="s">
//               <Box fontSize="body-s">
//                 <strong>Test:</strong> Single word with 200+ characters. Should wrap or handle overflow gracefully.
//               </Box>
//               <div
//                 ref={longTextRef}
//                 onMouseEnter={() => setShowLongText(true)}
//                 onMouseLeave={() => setShowLongText(false)}
//                 style={{ display: 'inline-block' }}
//               >
//                 <Button
//                   variant="primary"
//                   nativeButtonAttributes={{
//                     onFocus: () => setShowLongText(true),
//                     onBlur: () => setShowLongText(false),
//                   }}
//                 >
//                   Hover for unbroken text
//                 </Button>
//                 {showLongText && (
//                   <Tooltip
//                     content="verylongunbrokenwordwithnospacesthatshouldtestwrappingbehaviorandoverflowhandlinginthtooltipcomponentthisisaverylongstringthatgoeson andgoesandonandontotesttheedgecasesofcontentrendering"
//                     getTrack={() => longTextRef.current}
//                     position="top"
//                     onEscape={() => setShowLongText(false)}
//                     trackKey="unbroken-text"
//                   />
//                 )}
//               </div>
//             </SpaceBetween>
//           </Container>

//           {/* Test 2: Multiline with inline elements */}
//           <Container header={<Header variant="h3">2. Multiline with Inline Elements</Header>}>
//             <SpaceBetween size="s">
//               <Box fontSize="body-s">
//                 <strong>Test:</strong> Complex multiline content with mixed inline elements (strong, em, code, br).
//               </Box>
//               <div
//                 ref={multilineRef}
//                 onMouseEnter={() => setShowMultiline(true)}
//                 onMouseLeave={() => setShowMultiline(false)}
//                 style={{ display: 'inline-block' }}
//               >
//                 <Button
//                   variant="primary"
//                   nativeButtonAttributes={{
//                     onFocus: () => setShowMultiline(true),
//                     onBlur: () => setShowMultiline(false),
//                   }}
//                 >
//                   Hover for multiline content
//                 </Button>
//                 {showMultiline && (
//                   <Tooltip
//                     content={
//                       <div style={{ maxWidth: '350px' }}>
//                         <strong>Bold Header Text</strong> followed by <em>italic emphasis</em> and regular text
//                         <br />
//                         <br />
//                         Line 2: <code style={{ background: '#f0f0f0', padding: '2px 4px' }}>
//                           inline code block
//                         </code>{' '}
//                         with more text after it
//                         <br />
//                         <br />
//                         Line 3: Mixed <strong>bold</strong>, <em>italic</em>,{' '}
//                         <code style={{ background: '#f0f0f0', padding: '2px 4px' }}>code</code>, and{' '}
//                         <a href="#" style={{ color: '#0073bb' }}>
//                           link
//                         </a>
//                         <br />
//                         <br />
//                         Line 4: Special characters &lt;&gt;&amp;&quot;&#39; and{' '}
//                         <span style={{ background: '#ff9900', padding: '2px 4px' }}>highlighted span</span>
//                       </div>
//                     }
//                     getTrack={() => multilineRef.current}
//                     position="top"
//                     onEscape={() => setShowMultiline(false)}
//                     trackKey="multiline-inline"
//                   />
//                 )}
//               </div>
//             </SpaceBetween>
//           </Container>

//           {/* Test 3: Very long URL */}
//           <Container header={<Header variant="h3">3. Very Long URL/Path (Unbroken)</Header>}>
//             <SpaceBetween size="s">
//               <Box fontSize="body-s">
//                 <strong>Test:</strong> Long URL with no natural break points. Should handle word-break appropriately.
//               </Box>
//               <div
//                 ref={urlRef}
//                 onMouseEnter={() => setShowUrl(true)}
//                 onMouseLeave={() => setShowUrl(false)}
//                 style={{ display: 'inline-block' }}
//               >
//                 <Button
//                   variant="primary"
//                   nativeButtonAttributes={{
//                     onFocus: () => setShowUrl(true),
//                     onBlur: () => setShowUrl(false),
//                   }}
//                 >
//                   Hover for long URL
//                 </Button>
//                 {showUrl && (
//                   <Tooltip
//                     content={
//                       <div style={{ maxWidth: '300px', wordBreak: 'break-all' }}>
//                         https://example-domain-name.com/very/long/path/with/many/segments/that/continues/for/a/very/long/time/and/includes/query/parameters?param1=verylongvalue&param2=anotherlongvalue&param3=yetanotherlongparametervalue
//                       </div>
//                     }
//                     getTrack={() => urlRef.current}
//                     position="top"
//                     onEscape={() => setShowUrl(false)}
//                     trackKey="long-url"
//                   />
//                 )}
//               </div>
//             </SpaceBetween>
//           </Container>

//           {/* Test 4: Mixed content stress */}
//           <Container header={<Header variant="h3">4. Mixed Content Stress Test</Header>}>
//             <SpaceBetween size="s">
//               <Box fontSize="body-s">
//                 <strong>Test:</strong> Combination of text, code blocks, lists, and inline elements in one tooltip.
//               </Box>
//               <div
//                 ref={mixedRef}
//                 onMouseEnter={() => setShowMixed(true)}
//                 onMouseLeave={() => setShowMixed(false)}
//                 style={{ display: 'inline-block' }}
//               >
//                 <Button
//                   variant="primary"
//                   nativeButtonAttributes={{
//                     onFocus: () => setShowMixed(true),
//                     onBlur: () => setShowMixed(false),
//                   }}
//                 >
//                   Hover for mixed content
//                 </Button>
//                 {showMixed && (
//                   <Tooltip
//                     content={
//                       <div style={{ maxWidth: '320px' }}>
//                         <strong>Configuration Required:</strong>
//                         <br />
//                         <br />
//                         Set the following parameters:
//                         <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
//                           <li>
//                             <code style={{ background: '#f0f0f0', padding: '2px 4px' }}>region</code>: AWS region code
//                           </li>
//                           <li>
//                             <code style={{ background: '#f0f0f0', padding: '2px 4px' }}>accessKeyId</code>: Your access
//                             key
//                           </li>
//                           <li>
//                             <code style={{ background: '#f0f0f0', padding: '2px 4px' }}>secretAccessKey</code>:{' '}
//                             <em>Keep secret!</em>
//                           </li>
//                         </ul>
//                         <strong>Example:</strong>
//                         <br />
//                         <code
//                           style={{
//                             display: 'block',
//                             padding: '8px',
//                             background: '#232f3e',
//                             color: '#fff',
//                             fontSize: '11px',
//                             marginTop: '4px',
//                           }}
//                         >
//                           region: &quot;us-west-2&quot;
//                         </code>
//                       </div>
//                     }
//                     getTrack={() => mixedRef.current}
//                     position="top"
//                     onEscape={() => setShowMixed(false)}
//                     trackKey="mixed-content"
//                   />
//                 )}
//               </div>
//             </SpaceBetween>
//           </Container>
//         </SpaceBetween>
//       </ScreenshotArea>
//     </Container>
//   );
// }

function DisabledActionsExample() {
  const deleteWrapperRef = useRef<HTMLDivElement>(null);
  const saveWrapperRef = useRef<HTMLDivElement>(null);
  const downloadWrapperRef = useRef<HTMLDivElement>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  return (
    <Container header={<Header variant="h2">Disabled Actions with Explanations</Header>}>
      <ScreenshotArea>
        <SpaceBetween direction="horizontal" size="s">
          <div
            ref={deleteWrapperRef}
            onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
            style={{ display: 'inline-block' }}
          >
            <Button disabled={true} iconName="remove">
              Delete
            </Button>
            {showDelete && (
              <Tooltip
                content="You don't have permission to delete this resource"
                getTrack={() => deleteWrapperRef.current}
                position="top"
                onEscape={() => setShowDelete(false)}
                trackKey="delete-disabled"
              />
            )}
          </div>

          <div
            ref={saveWrapperRef}
            onMouseEnter={() => setShowSave(true)}
            onMouseLeave={() => setShowSave(false)}
            style={{ display: 'inline-block' }}
          >
            <Button disabled={true} variant="primary" iconName="upload">
              Save
            </Button>
            {showSave && (
              <Tooltip
                content="No changes to save"
                getTrack={() => saveWrapperRef.current}
                position="top"
                onEscape={() => setShowSave(false)}
                trackKey="save-disabled"
              />
            )}
          </div>

          <div
            ref={downloadWrapperRef}
            onMouseEnter={() => setShowDownload(true)}
            onMouseLeave={() => setShowDownload(false)}
            style={{ display: 'inline-block' }}
          >
            <Button disabled={true} iconName="download">
              Download Report
            </Button>
            {showDownload && (
              <Tooltip
                content="Report generation in progress. Please wait..."
                getTrack={() => downloadWrapperRef.current}
                position="top"
                onEscape={() => setShowDownload(false)}
                trackKey="download-disabled"
              />
            )}
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function TruncatedTextExample() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  return (
    <Container header={<Header variant="h2">Truncated Text with Overflow Tooltips</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="s">
          <div
            ref={ref1}
            onMouseEnter={() => setShow1(true)}
            onMouseLeave={() => setShow1(false)}
            style={{ maxWidth: '200px' }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '8px',
                background: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              my-very-long-filename-document-final-v2.pdf
            </div>
            {show1 && (
              <Tooltip
                content="my-very-long-filename-document-final-v2.pdf"
                getTrack={() => ref1.current}
                onEscape={() => setShow1(false)}
                trackKey="file1"
              />
            )}
          </div>

          <div
            ref={ref2}
            onMouseEnter={() => setShow2(true)}
            onMouseLeave={() => setShow2(false)}
            style={{ maxWidth: '200px' }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '8px',
                background: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              arn:aws:s3:::my-bucket-name/path/to/resource
            </div>
            {show2 && (
              <Tooltip
                content="arn:aws:s3:::my-bucket-name/path/to/resource"
                getTrack={() => ref2.current}
                onEscape={() => setShow2(false)}
                trackKey="arn"
              />
            )}
          </div>

          <div
            ref={ref3}
            onMouseEnter={() => setShow3(true)}
            onMouseLeave={() => setShow3(false)}
            style={{ maxWidth: '200px' }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '8px',
                background: '#f0f0f0',
                borderRadius: '4px',
              }}
            >
              user@example-company-domain-name.com
            </div>
            {show3 && (
              <Tooltip
                content="user@example-company-domain-name.com"
                getTrack={() => ref3.current}
                onEscape={() => setShow3(false)}
                trackKey="email"
              />
            )}
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function IconOnlyButtonsExample() {
  const refs = {
    edit: useRef<HTMLDivElement>(null),
    copy: useRef<HTMLDivElement>(null),
    delete: useRef<HTMLDivElement>(null),
    settings: useRef<HTMLDivElement>(null),
  };
  const [show, setShow] = useState({ edit: false, copy: false, delete: false, settings: false });

  return (
    <Container header={<Header variant="h2">Icon-Only Actions</Header>}>
      <ScreenshotArea>
        <SpaceBetween direction="horizontal" size="xs">
          {[
            { key: 'edit', icon: 'edit', label: 'Edit item' },
            { key: 'copy', icon: 'copy', label: 'Copy to clipboard' },
            { key: 'delete', icon: 'remove', label: 'Delete item' },
            { key: 'settings', icon: 'settings', label: 'Open settings' },
          ].map(({ key, icon, label }) => (
            <div
              key={key}
              ref={refs[key as keyof typeof refs]}
              onMouseEnter={() => setShow({ ...show, [key]: true })}
              onMouseLeave={() => setShow({ ...show, [key]: false })}
              style={{ display: 'inline-block' }}
            >
              <Button
                variant="icon"
                iconName={icon as any}
                nativeButtonAttributes={{
                  onFocus: () => setShow({ ...show, [key]: true }),
                  onBlur: () => setShow({ ...show, [key]: false }),
                }}
              />
              {show[key as keyof typeof show] && (
                <Tooltip
                  content={label}
                  getTrack={() => refs[key as keyof typeof refs].current}
                  position="top"
                  onEscape={() => setShow({ ...show, [key]: false })}
                  trackKey={key}
                />
              )}
            </div>
          ))}
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function TableActionsExample() {
  const actionRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [showActions, setShowActions] = useState([false, false, false]);

  const toggleAction = (index: number, value: boolean) => {
    const newState = [...showActions];
    newState[index] = value;
    setShowActions(newState);
  };

  return (
    <Container
      header={
        <Header variant="h2" description="Test: Row actions in table with tooltips">
          Table Row Actions
        </Header>
      }
    >
      <ScreenshotArea>
        <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right', width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {['Instance-001', 'Instance-002', 'Instance-003'].map((name, index) => (
                <tr key={index} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{name}</td>
                  <td style={{ padding: '12px' }}>Running</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <SpaceBetween direction="horizontal" size="xs">
                      <div
                        ref={actionRefs[index]}
                        onMouseEnter={() => toggleAction(index, true)}
                        onMouseLeave={() => toggleAction(index, false)}
                        style={{ display: 'inline-block' }}
                      >
                        <Button
                          variant="icon"
                          iconName="edit"
                          nativeButtonAttributes={{
                            onFocus: () => toggleAction(index, true),
                            onBlur: () => toggleAction(index, false),
                          }}
                        />
                        {showActions[index] && (
                          <Tooltip
                            content={`Edit ${name}`}
                            getTrack={() => actionRefs[index].current}
                            position="left"
                            onEscape={() => toggleAction(index, false)}
                            trackKey={`edit-${index}`}
                          />
                        )}
                      </div>
                    </SpaceBetween>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScreenshotArea>
    </Container>
  );
}

function RapidHoverTestExample() {
  const buttonRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const [activeButtons, setActiveButtons] = useState([false, false, false, false, false]);

  const toggleButton = (index: number, value: boolean) => {
    const newState = [...activeButtons];
    newState[index] = value;
    setActiveButtons(newState);
  };

  return (
    <Container header={<Header variant="h2">Hover Test</Header>}>
      <ScreenshotArea>
        <SpaceBetween direction="horizontal" size="xs">
          {[0, 1, 2, 3, 4].map(index => (
            <div key={index} ref={buttonRefs[index]}>
              <Button
                variant="icon"
                iconName="settings"
                nativeButtonAttributes={{
                  onMouseEnter: () => toggleButton(index, true),
                  onMouseLeave: () => toggleButton(index, false),
                  onFocus: () => toggleButton(index, true),
                  onBlur: () => toggleButton(index, false),
                }}
              />
              {activeButtons[index] && (
                <Tooltip
                  content={`Button ${index + 1}`}
                  getTrack={() => buttonRefs[index].current}
                  position="top"
                  onEscape={() => toggleButton(index, false)}
                  trackKey={`rapid-${index}`}
                />
              )}
            </div>
          ))}
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function NestedElementsExample() {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [showParent, setShowParent] = useState(false);
  const [showChild, setShowChild] = useState(false);

  return (
    <Container header={<Header variant="h2">Nested Elements - Independent Tooltips</Header>}>
      <ScreenshotArea>
        <div style={{ padding: '20px' }}>
          <div
            ref={parentRef}
            onMouseEnter={() => setShowParent(true)}
            onMouseLeave={() => setShowParent(false)}
            style={{
              display: 'inline-block',
              padding: '30px',
              background: '#0073bb',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Parent Element (hover)
            <div
              style={{
                marginTop: '12px',
              }}
            >
              <div
                ref={childRef}
                onMouseEnter={e => {
                  e.stopPropagation();
                  setShowParent(false);
                  setShowChild(true);
                }}
                onMouseLeave={e => {
                  e.stopPropagation();
                  setShowChild(false);
                  setShowParent(true);
                }}
                style={{
                  display: 'inline-block',
                }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: '#ff9900',
                    borderRadius: '4px',
                  }}
                >
                  Child Element (hover)
                </div>
                {showChild && (
                  <Tooltip
                    content="This is the child tooltip - should replace parent"
                    getTrack={() => childRef.current}
                    position="right"
                    onEscape={() => setShowChild(false)}
                    trackKey="nested-child"
                  />
                )}
              </div>
            </div>
            {showParent && (
              <Tooltip
                content="This is the parent tooltip"
                getTrack={() => parentRef.current}
                position="top"
                onEscape={() => setShowParent(false)}
                trackKey="nested-parent"
              />
            )}
          </div>
        </div>
      </ScreenshotArea>
    </Container>
  );
}

function InteractiveContentExample() {
  const linkRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const [showLink, setShowLink] = useState(false);
  const [showCode, setShowCode] = useState(false);

  return (
    <Container header={<Header variant="h2">Interactive & Formatted Content</Header>}>
      <ScreenshotArea>
        <SpaceBetween direction="horizontal" size="l">
          <div
            ref={linkRef}
            onMouseEnter={() => setShowLink(true)}
            onMouseLeave={() => setShowLink(false)}
            style={{ display: 'inline-block' }}
          >
            <a
              href="#"
              onFocus={() => setShowLink(true)}
              onBlur={() => setShowLink(false)}
              style={{ color: '#0073bb', textDecoration: 'underline', cursor: 'pointer' }}
              onClick={e => e.preventDefault()}
            >
              Documentation Link
            </a>
            {showLink && (
              <Tooltip
                content={
                  <div>
                    <strong>AWS Documentation</strong>
                    <br />
                    Click to view complete API reference
                    <br />
                    Last updated: Today
                  </div>
                }
                getTrack={() => linkRef.current}
                position="top"
                onEscape={() => setShowLink(false)}
                trackKey="link-tooltip"
              />
            )}
          </div>

          <div
            ref={codeRef}
            onMouseEnter={() => setShowCode(true)}
            onMouseLeave={() => setShowCode(false)}
            style={{ display: 'inline-block' }}
          >
            <span
              style={{
                padding: '4px 8px',
                background: '#f0f0f0',
                borderRadius: '4px',
                fontFamily: 'monospace',
                cursor: 'pointer',
              }}
            >
              aws.config.region
            </span>
            {showCode && (
              <Tooltip
                content={
                  <div>
                    <code
                      style={{
                        display: 'block',
                        padding: '8px',
                        background: '#232f3e',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {`const AWS = require('aws-sdk');\nAWS.config.update({\n  region: 'us-west-2'\n});`}
                    </code>
                  </div>
                }
                getTrack={() => codeRef.current}
                position="bottom"
                onEscape={() => setShowCode(false)}
                trackKey="code-tooltip"
              />
            )}
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function FileInputItemExample() {
  return (
    <Container header={<Header variant="h2">ButtonGroup - FileInputItem (Internal Tooltips)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <Box color="text-status-info" fontSize="body-s">
            <strong>Keyboard Navigation:</strong> ButtonGroup is a composite widget. Press Tab to focus the group, then
            use Arrow keys to navigate between items within the group. This is standard ARIA behavior.
          </Box>
          <ButtonGroup
            variant="icon"
            ariaLabel="File actions"
            items={[
              { type: 'icon-button', id: 'copy', text: 'Copy', iconName: 'copy' },
              { type: 'icon-button', id: 'cut', text: 'Cut', iconName: 'file' },
              {
                type: 'icon-file-input',
                id: 'file-upload',
                text: 'Upload file',
                accept: 'image/*',
                multiple: true,
              },
            ]}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function IconButtonItemExample() {
  return (
    <Container header={<Header variant="h2">ButtonGroup - IconButtonItem (Internal Tooltips)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <Box color="text-status-info" fontSize="body-s">
            <strong>Keyboard Navigation:</strong> ButtonGroup is a composite widget. Press Tab to focus the group, then
            use Arrow keys to navigate between items within the group. This is standard ARIA behavior.
          </Box>
          <ButtonGroup
            variant="icon"
            ariaLabel="Actions"
            items={[
              { type: 'icon-button', id: 'settings', text: 'Settings', iconName: 'settings' },
              { type: 'icon-button', id: 'refresh', text: 'Refresh', iconName: 'refresh' },
              { type: 'icon-button', id: 'download', text: 'Download', iconName: 'download' },
            ]}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function IconToggleButtonItemExample() {
  return (
    <Container header={<Header variant="h2">ButtonGroup - IconToggleButtonItem (Internal Tooltips)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <Box color="text-status-info" fontSize="body-s">
            <strong>Keyboard Navigation:</strong> ButtonGroup is a composite widget. Press Tab to focus the group, then
            use Arrow keys to navigate between items within the group. This is standard ARIA behavior.
          </Box>
          <ButtonGroup
            variant="icon"
            ariaLabel="Toggle actions"
            items={[
              {
                type: 'icon-toggle-button',
                id: 'toggle1',
                text: 'Favorite',
                iconName: 'star',
                pressedIconName: 'star-filled',
                pressed: false,
              },
              {
                type: 'icon-toggle-button',
                id: 'toggle2',
                text: 'Like',
                iconName: 'thumbs-up',
                pressedIconName: 'thumbs-up-filled',
                pressed: true,
              },
              {
                type: 'icon-toggle-button',
                id: 'toggle3',
                text: 'Lock',
                iconName: 'lock-private',
                pressedIconName: 'unlocked',
                pressed: false,
              },
            ]}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function MenuDropdownItemExample() {
  return (
    <Container header={<Header variant="h2">ButtonGroup - MenuDropdownItem (Internal Tooltips)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <Box color="text-status-info" fontSize="body-s">
            <strong>Keyboard Navigation:</strong> ButtonGroup is a composite widget. Press Tab to focus the group, then
            use Arrow keys to navigate between items within the group. This is standard ARIA behavior.
          </Box>
          <ButtonGroup
            variant="icon"
            ariaLabel="Item actions"
            items={[
              { type: 'icon-button', id: 'edit', text: 'Edit', iconName: 'edit' },
              { type: 'icon-button', id: 'delete', text: 'Delete', iconName: 'remove' },
              {
                type: 'menu-dropdown',
                id: 'menu',
                text: 'More actions',
                items: [
                  { id: 'copy', text: 'Copy' },
                  { id: 'move', text: 'Move' },
                  { id: 'rename', text: 'Rename' },
                  { id: 'share', text: 'Share' },
                ],
              },
            ]}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function ButtonExample() {
  return (
    <Container header={<Header variant="h2">Button (Disabled Reason)</Header>}>
      <ScreenshotArea>
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="primary" disabled={true} disabledReason="Action cannot be performed at this time">
            Primary disabled
          </Button>
          <Button variant="normal" disabled={true} disabledReason="Insufficient permissions to perform this action">
            Normal disabled
          </Button>
          <Button variant="icon" iconName="settings" disabled={true} disabledReason="Settings are locked" />
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function SelectItemExample() {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(null);

  return (
    <Container header={<Header variant="h2">Select - Item (Disabled Reason)</Header>}>
      <ScreenshotArea>
        <Select
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          options={[
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            {
              label: 'Disabled option',
              value: '3',
              disabled: true,
              disabledReason: 'This option is currently unavailable due to maintenance',
            },
            {
              label: 'Another disabled option',
              value: '4',
              disabled: true,
              disabledReason: 'Insufficient permissions to select this option',
            },
            { label: 'Option 5', value: '5' },
          ]}
          placeholder="Choose an option"
        />
      </ScreenshotArea>
    </Container>
  );
}

function MultiselectItemExample() {
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps.Options>([]);

  return (
    <Container header={<Header variant="h2">Multiselect - Item (Disabled Reason)</Header>}>
      <ScreenshotArea>
        <Multiselect
          selectedOptions={selectedOptions}
          onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
          options={[
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            {
              label: 'Disabled option',
              value: '3',
              disabled: true,
              disabledReason: 'This option is currently unavailable',
            },
            {
              label: 'Another disabled option',
              value: '4',
              disabled: true,
              disabledReason: 'Premium feature - upgrade required',
            },
            { label: 'Option 5', value: '5' },
            { label: 'Option 6', value: '6' },
          ]}
          placeholder="Choose options"
        />
      </ScreenshotArea>
    </Container>
  );
}

function TokenExample() {
  return (
    <Container header={<Header variant="h2">Token (Inline with Tooltip)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <Box color="text-status-info" fontSize="body-s">
            <strong>Note:</strong> Hover or focus on long tokens. Tooltip shows full text when truncated. Requires
            variant=&quot;inline&quot; and tooltipContent prop.
          </Box>
          <SpaceBetween direction="horizontal" size="xs">
            <div style={{ maxWidth: '200px' }}>
              <Token
                variant="inline"
                label="Very long label that will be truncated and show a tooltip on hover or focus"
                dismissLabel="Remove token"
                onDismiss={() => {}}
                tooltipContent="Very long label that will be truncated and show a tooltip on hover or focus"
              />
            </div>
            <div style={{ maxWidth: '180px' }}>
              <Token
                variant="inline"
                label="Another extremely long token label that demonstrates the overflow tooltip functionality when text exceeds container width"
                dismissLabel="Remove token"
                onDismiss={() => {}}
                tooltipContent="Another extremely long token label that demonstrates the overflow tooltip functionality when text exceeds container width"
              />
            </div>
          </SpaceBetween>
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function FileTokenGroupExample() {
  const [items, setItems] = useState<FileTokenGroupProps.Item[]>([
    {
      file: new File(
        ['content'],
        'my-extremely-long-document-name-final-version-reviewed-approved-ready-for-production-deployment.pdf',
        { type: 'application/pdf' }
      ),
    },
    {
      file: new File(
        ['content'],
        'very-long-filename-that-will-definitely-be-truncated-and-show-a-tooltip-when-you-hover-over-it-with-your-mouse-or-keyboard.docx',
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      ),
    },
    {
      file: new File(
        ['content'],
        'another-extremely-long-filename-that-demonstrates-tooltip-behavior-with-overflow-ellipsis-and-full-text-display-on-hover.xlsx',
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      ),
    },
  ]);

  return (
    <Container header={<Header variant="h2">FileTokenGroup - FileToken (Truncated Filename)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <Box color="text-status-info" fontSize="body-s">
            <strong>Note:</strong> FileTokenGroup automatically shows tooltips for truncated filenames. Hover over long
            filenames to see the full name in a tooltip.
          </Box>
          <div style={{ maxWidth: '500px' }}>
            <FileTokenGroup
              items={items}
              onDismiss={({ detail }) => {
                setItems(items.filter((_, index) => index !== detail.fileIndex));
              }}
              showFileSize={true}
              i18nStrings={{
                removeFileAriaLabel: index => `Remove file ${index + 1}`,
                formatFileSize: size => `${(size / 1024).toFixed(2)} KB`,
              }}
            />
          </div>
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function SegmentedControlExample() {
  const [selectedId, setSelectedId] = useState('option1');

  return (
    <Container header={<Header variant="h2">SegmentedControl - Segment (Disabled Reason)</Header>}>
      <ScreenshotArea>
        <SegmentedControl
          selectedId={selectedId}
          onChange={({ detail }) => setSelectedId(detail.selectedId)}
          options={[
            { id: 'option1', text: 'Option 1' },
            { id: 'option2', text: 'Option 2' },
            {
              id: 'option3',
              text: 'Option 3',
              disabled: true,
              disabledReason: 'This option is currently unavailable',
            },
            {
              id: 'option4',
              text: 'Option 4',
              disabled: true,
              disabledReason: 'Insufficient permissions to access this option',
            },
            { id: 'option5', text: 'Option 5' },
          ]}
        />
      </ScreenshotArea>
    </Container>
  );
}

function BreadcrumbGroupExample() {
  return (
    <Container header={<Header variant="h2">BreadcrumbGroup - Item (Truncated)</Header>}>
      <ScreenshotArea>
        <div style={{ maxWidth: '400px' }}>
          <BreadcrumbGroup
            items={[
              { text: 'Amazon service name', href: '#' },
              { text: '...', href: '#' },
              { text: 'ABCDEF', href: '#' },
              { text: 'ABCDEFGHIJsjbdkasbdhjabsjdha', href: '#' },
            ]}
          />
        </div>
      </ScreenshotArea>
    </Container>
  );
}

function SliderExample() {
  const [value1, setValue1] = useState(50);
  const [value2, setValue2] = useState(500);

  return (
    <Container header={<Header variant="h2">Slider (Value Tooltip)</Header>}>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <Slider
            value={value1}
            onChange={({ detail }) => setValue1(detail.value)}
            min={0}
            max={100}
            step={5}
            referenceValues={[25, 50, 75]}
            valueFormatter={value => `${value}%`}
            i18nStrings={{
              valueTextRange: (previousValue, value, nextValue) =>
                `Value: ${value}% (between ${previousValue} and ${nextValue})`,
            }}
          />
          <Slider
            value={value2}
            onChange={({ detail }) => setValue2(detail.value)}
            min={0}
            max={1000}
            step={50}
            valueFormatter={value => `$${value.toFixed(2)}`}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Container>
  );
}

function CalendarExample() {
  const [value, setValue] = useState('2024-01-15');

  return (
    <Container header={<Header variant="h2">Calendar - Grid (Date Disabled Reason)</Header>}>
      <ScreenshotArea>
        <Calendar
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          isDateEnabled={date => {
            const day = date.getDate();
            // Disable weekends and specific dates
            return day !== 10 && day !== 20 && date.getDay() !== 0 && date.getDay() !== 6;
          }}
          dateDisabledReason={date => {
            const day = date.getDate();
            if (date.getDay() === 0 || date.getDay() === 6) {
              return 'Weekends are not available';
            }
            if (day === 10) {
              return 'Public holiday - Office closed';
            }
            if (day === 20) {
              return 'Maintenance scheduled';
            }
            return '';
          }}
        />
      </ScreenshotArea>
    </Container>
  );
}

function DateRangePickerExample() {
  const [value, setValue] = useState<DateRangePickerProps.Value | null>(null);

  return (
    <Container header={<Header variant="h2">DateRangePicker - GridCell (Date Disabled Reason)</Header>}>
      <ScreenshotArea>
        <DateRangePicker
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          relativeOptions={[]}
          isValidRange={() => ({ valid: true })}
          i18nStrings={{
            todayAriaLabel: 'Today',
            nextMonthAriaLabel: 'Next month',
            previousMonthAriaLabel: 'Previous month',
            customRelativeRangeDurationLabel: 'Custom',
            customRelativeRangeDurationPlaceholder: 'Enter amount',
            customRelativeRangeUnitLabel: 'Unit',
            formatRelativeRange: () => '',
            formatUnit: () => '',
            dateTimeConstraintText: '',
            applyButtonLabel: 'Apply',
            cancelButtonLabel: 'Cancel',
            clearButtonLabel: 'Clear',
            relativeModeTitle: 'Relative range',
            absoluteModeTitle: 'Absolute range',
            relativeRangeSelectionHeading: 'Choose a range',
            startDateLabel: 'Start date',
            endDateLabel: 'End date',
            startTimeLabel: 'Start time',
            endTimeLabel: 'End time',
            renderSelectedAbsoluteRangeAriaLive: () => '',
          }}
          placeholder="Filter by date range"
          isDateEnabled={date => {
            const day = date.getDate();
            return day !== 5 && day !== 15 && date.getDay() !== 0 && date.getDay() !== 6;
          }}
          dateDisabledReason={date => {
            const day = date.getDate();
            if (date.getDay() === 0 || date.getDay() === 6) {
              return 'Weekends are not selectable';
            }
            if (day === 5) {
              return 'Team meeting day - unavailable';
            }
            if (day === 15) {
              return 'System maintenance window';
            }
            return '';
          }}
        />
      </ScreenshotArea>
    </Container>
  );
}

function TabsExample() {
  const [activeTabId, setActiveTabId] = useState('first');

  return (
    <Container header={<Header variant="h2">Tabs - TabHeaderBar (Disabled Reason)</Header>}>
      <ScreenshotArea>
        <Tabs
          activeTabId={activeTabId}
          onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
          tabs={[
            {
              id: 'first',
              label: 'First tab',
              content: 'First tab content',
            },
            {
              id: 'second',
              label: 'Second tab',
              content: 'Second tab content',
            },
            {
              id: 'third',
              label: 'Third tab',
              content: 'Third tab content',
              disabled: true,
              disabledReason: 'This tab is currently unavailable',
            },
            {
              id: 'fourth',
              label: 'Fourth tab',
              content: 'Fourth tab content',
              disabled: true,
              disabledReason: 'Premium feature - upgrade to access',
            },
            {
              id: 'fifth',
              label: 'Fifth tab',
              content: 'Fifth tab content',
            },
          ]}
        />
      </ScreenshotArea>
    </Container>
  );
}

/**
 * Note: AppLayout TriggerButton implementation uses tooltips internally but cannot
 * be properly demonstrated through the public API. Tooltips are enabled automatically
 * in visual refresh mode based on internal logic.
 * Source: src/app-layout/visual-refresh-toolbar/toolbar/trigger-button/index.tsx
 */
