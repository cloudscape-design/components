// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, {
  // useContext,
  useState,
} from 'react';

import {
  Box,
  // Checkbox,
  DateRangePicker,
  DateRangePickerProps,
  FormField,
  Link,
} from '~components';

// import AppContext from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import {
  // applyDisabledReason,
  // checkIfDisabled,
  // DateRangePickerDemoContext,
  // dateRangePickerDemoDefaults,
  // DisabledDate,
  // generateI18nStrings,
  // generatePlaceholder,
  // generateRelativeOptions,
  i18nStrings,
  isValid,
  relativeOptions,
} from './common';

export default function DatePickerScenario() {
  const [value, setValue] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: '2018-01-09T12:34:56Z',
    endDate: '2018-01-19T15:30:00Z',
  });

  return (
    <Box padding="s">
      <h1>Date range picker with selected date</h1>
      <Link id="focus-dismiss-helper">Focusable element before the date range picker</Link>
      <br />
      <br />
      <ScreenshotArea>
        <FormField label="Date Range Picker field">
          <DateRangePicker
            value={value}
            locale={'en-GB'}
            i18nStrings={i18nStrings}
            timeOffset={0}
            placeholder={'Filter by a date and time range'}
            onChange={e => setValue(e.detail.value)}
            relativeOptions={relativeOptions}
            isValidRange={isValid}
            customRelativeRangeUnits={['second', 'minute', 'hour']}
            dateOnly={true}
            absoluteFormat="long-localized"
          />
        </FormField>
        <br />
        <br />
        <div style={{ blockSize: 500 }} />
      </ScreenshotArea>
    </Box>
  );
}

// export default function DatePickerScenario() {
//   const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerDemoContext);
//   const [value, setValue] = useState<DateRangePickerProps['value']>({
//     type: 'absolute',
//     startDate: '2018-01-09T12:34:56Z',
//     endDate: '2018-01-19T15:30:00Z',
//   });

//   const monthOnly = false;
//   const dateOnly = urlParams.dateOnly ?? true;
//   const disabledDates =
//     (urlParams.disabledDates as DisabledDate) ?? (dateRangePickerDemoDefaults.disabledDates as DisabledDate);
//   const withDisabledReason = urlParams.withDisabledReason ?? dateRangePickerDemoDefaults.withDisabledReason;

//   return (
//     <Box padding="s">
//       <h1>Date range picker with selected date</h1>
//       <Link id="focus-dismiss-helper">Focusable element before the date range picker</Link>
//       <br />
//       <label>
//         Disabled dates{' '}
//         <select
//           value={disabledDates}
//           onChange={event =>
//             setUrlParams({
//               disabledDates: event.currentTarget.value as DisabledDate,
//             })
//           }
//         >
//           <option value="none">None (Default)</option>
//           <option value="all">All</option>
//           <option value="only-even">Only even</option>
//           <option value="middle-of-page">Middle of {monthOnly ? 'year' : 'month'}</option>
//           <option value="end-of-page">End of {monthOnly ? 'year' : 'month'}</option>
//           <option value="start-of-page">Start of {monthOnly ? 'year' : 'month'}</option>
//           <option value="overlapping-pages">Overlapping {monthOnly ? 'years' : 'months'}</option>
//         </select>
//       </label>
//       <Checkbox
//         checked={withDisabledReason}
//         onChange={({ detail }) => setUrlParams({ withDisabledReason: detail.checked })}
//       >
//         Disabled reasons
//       </Checkbox>
//       <Checkbox
//         disabled={monthOnly}
//         checked={dateOnly}
//         onChange={({ detail }) => setUrlParams({ dateOnly: detail.checked })}
//       >
//         Date-only
//       </Checkbox>
//       <br />
//       <ScreenshotArea>
//         <FormField label="Date Range Picker field">
//           <DateRangePicker
//             value={value}
//             locale={'en-GB'}
//             i18nStrings={generateI18nStrings(dateOnly, monthOnly)}
//             timeOffset={0}
//             placeholder={generatePlaceholder(dateOnly, monthOnly)}
//             onChange={e => setValue(e.detail.value)}
//             relativeOptions={generateRelativeOptions(dateOnly, monthOnly)}
//             isValidRange={isValid}
//             customRelativeRangeUnits={['second', 'minute', 'hour']}
//             dateOnly={dateOnly}
//             absoluteFormat="long-localized"
//             isDateEnabled={(date: Date) => checkIfDisabled(date, disabledDates, monthOnly)}
//             dateDisabledReason={(date: Date) => applyDisabledReason(withDisabledReason, date, disabledDates, monthOnly)}
//           />
//         </FormField>
//         <br />
//         <br />
//         <div style={{ blockSize: 500 }} />
//       </ScreenshotArea>
//     </Box>
//   );
// }
