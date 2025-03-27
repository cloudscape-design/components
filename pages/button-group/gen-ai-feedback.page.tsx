// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, Button, ButtonGroup, ButtonGroupProps, Header, SpaceBetween, StatusIndicator } from '~components';

// function IconButtonChanges() {
//   const [feedback, setFeedback] = useState<string>('');
//   const [feedbackSubmitting, setFeedbackSubmitting] = useState<string>('');

//   const items: ButtonGroupProps.ItemOrGroup[] = [
//     // {
//     //   type: 'group',
//     //   text: 'Vote',
//     //   items: [
//     //     {
//     //       type: 'icon-button',
//     //       id: 'helpful',
//     //       iconName: 'thumbs-up',
//     //       text: feedback === 'helpful' ? 'Helpful. Feedback submitted.' : 'Helpful'
//     //       disabled: feedback === 'not-helpful' || feedbackSubmitting === 'not-helpful',
//     //       disabledReason: 'Helpful. Unavailable after feedback is submitted.',
//     //       loading: feedbackSubmitting === 'helpful',
//     //       submitted: feedback === 'helpful',
//     //       popoverFeedback: feedbackSubmitting === 'helpful' ? 'Feedback sending' : 'Helpful. Feedback submitted.',
//     //       submittedIconName: 'thumbs-up-filled',
//     //     },
//     //     {
//     //       type: 'icon-button',
//     //       id: 'not-helpful',
//     //       iconName: 'thumbs-down',
//     //       text:
//     //         feedback.length === 0
//     //           ? 'Not helpful'
//     //           : feedback === 'not-helpful'
//     //             ? 'Not helpful. Feedback submitted.'
//     //             : 'Not helpful. Unavailable after feedback is submitted.',
//     //       disabled: feedback === 'helpful' || feedbackSubmitting === 'helpful',
//     //       loading: feedbackSubmitting === 'not-helpful',
//     //       submitted: feedback === 'not-helpful',
//     //       popoverFeedback:
//     //         feedbackSubmitting === 'not-helpful' ? 'Feedback sending' : 'Not helpful. Feedback submitted.',
//     //       submittedIconName: 'thumbs-down-filled',
//     //     },
//     //   ],
//     // },
//     // The default texts could be added to i18n provider
// {
//   id: 'feedback',
//   type: 'feedback-group',
//   thumbsUpText: 'Helpful',
//   thumbsDownText: 'Not helpful',
//   loading: feedbackSubmitting,
//   thumbsUpLoadingText: 'Feedback submitting',
//   thumbsDownLoadingText: 'Feedback submitting',
//   thumbsUpPopoverFeedback: 'Helpful. Feedback submitted.',
//   thumbsDownPopoverFeedback: 'Not helpful. Feedback submitted.',
//   thumbsUpNonSubmittedFeedbackText: 'Not helpful. Unavailable after feedback is submitted.',
//   thumbsDownNonSubmittedFeedbackText: 'Helpful. Unavailable after feedback is submitted.',
//   submitted: feedback,
// },
//     {
//       type: 'icon-button',
//       id: 'copy',
//       iconName: 'copy',
//       text: 'Copy',
//       popoverFeedback: <StatusIndicator type="success">Message copied</StatusIndicator>,
//     },
//   ];

//   return (
//     <SpaceBetween size="l">
//       <ButtonGroup
//         ariaLabel="Chat actions"
//         variant="icon"
//         items={items}
//         onItemClick={({ detail }) => {
//           if (detail.id === 'feedback') {
//             setFeedbackSubmitting(detail.feedbackType);

//             setTimeout(() => {
//               setFeedback(detail.id);
//               setFeedbackSubmitting('');
//             }, 2000);
//           }
//         }}
//       />

//       <Button
//         onClick={() => {
//           setFeedback('');
//           setFeedbackSubmitting('');
//         }}
//         disabled={true}
//       >
//         Reset
//       </Button>
//     </SpaceBetween>
//   );
// }

function SubmittedAPI() {
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<string>('');
  const [popoverFeedback, setPopoverFeedback] = useState<React.ReactNode>('Feedback sending');

  const items: ButtonGroupProps.ItemOrGroup[] = [
    {
      type: 'group',
      text: 'Vote',
      items: [
        {
          type: 'icon-button',
          id: 'helpful',
          iconName: feedback === 'helpful' ? 'thumbs-up-filled' : 'thumbs-up',
          text: feedback === 'helpful' ? 'Helpful. Feedback submitted.' : 'Helpful',
          disabled: feedback === 'not-helpful' || feedbackSubmitting === 'helpful',
          disabledReason: feedbackSubmitting.length ? '' : 'Helpful. Unavailable after feedback is submitted.',
          loading: feedbackSubmitting === 'helpful',
          popoverFeedback: popoverFeedback,
        },
        {
          type: 'icon-button',
          id: 'not-helpful',
          iconName: 'thumbs-down',
          text: feedback === 'not-helpful' ? 'Helpful. Feedback submitted.' : 'Not helpful',
          disabled: feedback === 'helpful' || feedbackSubmitting === 'not-helpful',
          disabledReason: 'Not helpful. Unavailable after feedback is submitted.',
          loading: feedbackSubmitting === 'not-helpful',
          // submitted: feedback === 'not-helpful',
          popoverFeedback: popoverFeedback,
          // submittedIconName: 'thumbs-down-filled',
        },
      ],
    },
    {
      type: 'icon-button',
      id: 'copy',
      iconName: 'copy',
      text: 'Copy',
      popoverFeedback: <StatusIndicator type="success">Message copied</StatusIndicator>,
    },
  ];

  return (
    <SpaceBetween size="l">
      <ButtonGroup
        ariaLabel="Chat actions"
        variant="icon"
        items={items}
        onItemClick={({ detail }) => {
          if (feedback.length) {
            setPopoverFeedback(
              `${feedback === 'helpful' ? 'Helpful' : 'Not helpful'}. Feedback submitted. Vote cannot be taken back.`
            );
            return;
          }
          setFeedbackSubmitting(detail.id);

          setTimeout(() => {
            setFeedback(detail.id);
            setFeedbackSubmitting('');
            setPopoverFeedback(<StatusIndicator type="success">Feedback sent</StatusIndicator>);
          }, 2000);
        }}
      />

      <Button
        onClick={() => {
          setFeedback('');
          setFeedbackSubmitting('');
        }}
      >
        Reset
      </Button>
    </SpaceBetween>
  );
}

// Replacing is annoying
// Do we keep the voteItems in a state? Then we'd need to update it in each loading and disabled state changes
// function WithIconIndicatorType() {
//   const [feedback, setFeedback] = useState<string>('');
//   const [feedbackSubmitting, setFeedbackSubmitting] = useState<string>('');

//   const voteItems: ButtonGroupProps.Item[] = ['helpful', 'not-helpful'].map(id => {
//     if (id === 'helpful') {
//       if (feedback === 'helpful') {
//         return {
//           type: 'icon-indicator',
//           id: 'helpful',
//           iconName: 'thumbs-up-filled',
//           text: 'Helpful. Feedback submitted.',
//         };
//       }

//       return {
//         type: 'icon-button',
//         id: 'helpful',
//         iconName: 'thumbs-up',
//         text: 'Helpful',
//         disabled: feedback === 'not-helpful',
//         loading: feedbackSubmitting === 'helpful',
//         popoverFeedback: 'Feedback sending',
//       };
//     }

//     if (feedback === 'not-helpful') {
//       return {
//         type: 'icon-indicator',
//         id: 'not-helpful',
//         iconName: 'thumbs-down-filled',
//         text: 'Not helpful. Feedback submitted.',
//       };
//     }

//     return {
//       type: 'icon-button',
//       id: 'not-helpful',
//       iconName: 'thumbs-down',
//       text: 'Not helpful',
//       disabled: feedback === 'helpful',
//       loading: feedbackSubmitting === 'not-helpful',
//       popoverFeedback: 'Feedback sending',
//     };
//   });

//   return (
//     <SpaceBetween size="l">
//       <ButtonGroup
//         ariaLabel="Chat actions"
//         variant="icon"
//         items={[
//           {
//             type: 'group',
//             text: 'Vote',
//             items: voteItems,
//           },
//           {
//             type: 'icon-button',
//             id: 'copy',
//             iconName: 'copy',
//             text: 'Copy',
//             popoverFeedback: <StatusIndicator type="success">Message copied</StatusIndicator>,
//           },
//         ]}
//         onItemClick={({ detail }) => {
//           setFeedbackSubmitting(detail.id);

//           setTimeout(() => {
//             setFeedback(detail.id);
//             setFeedbackSubmitting('');
//           }, 2000);
//         }}
//       />

//       <Button
//         onClick={() => {
//           setFeedback('');
//           setFeedbackSubmitting('');
//         }}
//       >
//         Reset
//       </Button>
//     </SpaceBetween>
//   );
// }

// function AfterFeedbackIconIndicator() {
//   const items: ButtonGroupProps.ItemOrGroup[] = [
//     {
//       type: 'group',
//       text: 'Vote',
//       items: [
//         {
//           type: 'icon-indicator',
//           id: 'helpful',
//           iconName: 'thumbs-up-filled',
//           text: 'Helpful. Feedback submitted.',
//         },
//         {
//           type: 'icon-toggle-button',
//           id: 'not-helpful',
//           iconName: 'thumbs-down',
//           pressedIconName: 'thumbs-down-filled',
//           text: 'Not helpful',
//           pressed: false,
//           disabled: true,
//         },
//       ],
//     },
//     {
//       type: 'icon-button',
//       id: 'copy',
//       iconName: 'copy',
//       text: 'Copy',
//       popoverFeedback: <StatusIndicator type="success">Message copied</StatusIndicator>,
//     },
//   ];

//   return <ButtonGroup ariaLabel="Chat actions" variant="icon" items={items} />;
// }

// function PopoverFeedback() {
//   const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | 'none'>('none');
//   const [isHelpfulFeedbackSubmitting, setIsHelpfulFeedbackSubmitting] = useState(false);
//   const [isNotHelpfulFeedbackSubmitting, setIsNotHelpfulFeedbackSubmitting] = useState(false);
//   const buttonGroupRef = useRef<ButtonGroupProps.Ref>(null);

//   // Idea is to show an indicator instead of button when feedback is submitted (would we add this to also icon-button?)
//   // If we add API to icon-toggle-button it would create a lot of different combinations (submitted + disabled / submitted + loading, etc.)
//   // Another idea is to create a new type that will have less API, customers would need to replace the icon-toggle-button item that is submitted with the new type
//   // Implement prototype with approaches and compare; new type vs only new API (to both icon-toggle-button and icon-button)
//   // What about the non-submitted feedback?
//   // Current issues with the approach below; conditional rendering and a lot of APIs
//   // Problem: Icon indicator needs to have the same stylings as the button
//   // - Move the common stylings of button to a different file?
//   const items: ButtonGroupProps.ItemOrGroup[] = [
//     {
//       type: 'group',
//       text: 'Vote',
//       items: [
//         {
//           type: 'icon-toggle-button',
//           id: 'helpful',
//           iconName: 'thumbs-up',
//           pressedIconName: 'thumbs-up-filled',
//           text: feedback === 'helpful' ? 'Helpful. Feedback submitted.' : 'Helpful',
//           pressed: feedback === 'helpful',
//           disabled: feedback === 'not-helpful',
//           loading: isHelpfulFeedbackSubmitting,
//           popoverFeedback: 'Feedback sending',
//           pressedPopoverFeedback: <StatusIndicator type="success">Feedback sent</StatusIndicator>,
//         },
//         {
//           type: 'icon-toggle-button',
//           id: 'not-helpful',
//           iconName: 'thumbs-down',
//           pressedIconName: 'thumbs-down-filled',
//           text: 'Not helpful',
//           pressed: feedback === 'not-helpful',
//           disabled: feedback === 'helpful',
//           loading: isNotHelpfulFeedbackSubmitting,
//           popoverFeedback: isNotHelpfulFeedbackSubmitting ? (
//             'Feedback sending'
//           ) : (
//             <StatusIndicator type="error">An error occured. Please retry.</StatusIndicator>
//           ),
//         },
//       ],
//     },
//     {
//       type: 'icon-button',
//       id: 'copy',
//       iconName: 'copy',
//       text: 'Copy',
//       popoverFeedback: <StatusIndicator type="success">Message copied</StatusIndicator>,
//     },
//   ];

//   return (
//     <SpaceBetween size="l">
//       <ButtonGroup
//         ref={buttonGroupRef}
//         ariaLabel="Chat actions"
//         variant="icon"
//         items={items}
//         onItemClick={({ detail }) => {
//           if (detail.pressed) {
//             if (detail.id === 'helpful') {
//               setIsHelpfulFeedbackSubmitting(true);

//               setTimeout(() => {
//                 setFeedback('helpful');
//                 setIsHelpfulFeedbackSubmitting(false);
//               }, 2000);
//             } else {
//               setIsNotHelpfulFeedbackSubmitting(true);

//               setTimeout(() => {
//                 setIsNotHelpfulFeedbackSubmitting(false);
//                 buttonGroupRef.current?.focus('not-helpful');
//               }, 2000);
//             }
//           }
//         }}
//       />

//       <Button
//         onClick={() => {
//           setFeedback('none');
//           setIsHelpfulFeedbackSubmitting(false);
//           setIsNotHelpfulFeedbackSubmitting(false);
//         }}
//       >
//         Reset
//       </Button>
//     </SpaceBetween>
//   );
// }

export default function ButtonGroupPage() {
  return (
    <Box margin={'m'}>
      <SpaceBetween size="m">
        {/* <Header variant="h1">Gen-AI feedback</Header>

        <Header variant="h1">Popover</Header>
        <PopoverFeedback />

        <Header variant="h1">Icon indicator button group</Header>
        <AfterFeedbackIconIndicator />
        <WithIconIndicatorType /> */}

        <Header variant="h1">Icon indicator with submitted</Header>
        <SubmittedAPI />

        {/* <Header variant="h1">Icon button changes with submitted</Header>
        <IconButtonChanges /> */}
      </SpaceBetween>
    </Box>
  );
}
