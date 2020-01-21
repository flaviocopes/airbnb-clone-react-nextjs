import { useState } from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { DateUtils } from 'react-day-picker'

import dateFnsFormat from 'date-fns/format'
import dateFnsParse from 'date-fns/parse'

const parseDate = (str, format, locale) => {
  const parsed = dateFnsParse(str, format, new Date(), { locale })
  return DateUtils.isDate(parsed) ? parsed : null
}

const formatDate = (date, format, locale) =>
  dateFnsFormat(date, format, { locale })

const format = 'dd MMM yyyy'

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const numberOfNightsBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate) //clone
  const end = new Date(endDate) //clone
  let dayCount = 0

  while (end > start) {
    dayCount++
    start.setDate(start.getDate() + 1)
  }

  return dayCount
}

export default ({ datesChanged, bookedDates }) => {
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(tomorrow)

  bookedDates = bookedDates.map(date => {
    return new Date(date)
  })

  return (
    <div className='date-range-picker-container'>
      <div>
        <label>From:</label>
        <DayPickerInput
          formatDate={formatDate}
          format={format}
          value={startDate}
          parseDate={parseDate}
          placeholder={`${dateFnsFormat(new Date(), format)}`}
          dayPickerProps={{
            modifiers: {
              disabled: [
                ...bookedDates,
                {
                  before: new Date()
                }
              ]
            }
          }}
          onDayChange={day => {
            setStartDate(day)
            const newEndDate = new Date(day)
            if (numberOfNightsBetweenDates(day, endDate) < 1) {
              newEndDate.setDate(newEndDate.getDate() + 1)
              setEndDate(newEndDate)
            }
            datesChanged(day, newEndDate)
          }}
        />
      </div>
      <div>
        <label>To:</label>
        <DayPickerInput
          formatDate={formatDate}
          format={format}
          value={endDate}
          parseDate={parseDate}
          placeholder={`${dateFnsFormat(new Date(), format)}`}
          dayPickerProps={{
            modifiers: {
              disabled: [
                startDate,
                ...bookedDates,
                {
                  before: startDate
                }
              ]
            }
          }}
          onDayChange={day => {
            setEndDate(day)
            datesChanged(startDate, day)
          }}
        />
      </div>
      <style jsx>{`
        .date-range-picker-container div {
          display: grid;
          border: 1px solid #ddd;
          grid-template-columns: 30% 70%;
          padding: 10px;
        }
        label {
          padding-top: 10px;
        }
      `}</style>
      <style jsx global>{`
        /* DayPicker styles */

        .DayPicker {
          display: inline-block;
          font-size: 1rem;
        }

        .DayPicker-wrapper {
          position: relative;

          flex-direction: row;
          padding-bottom: 1em;

          -webkit-user-select: none;

          -moz-user-select: none;

          -ms-user-select: none;

          user-select: none;
        }

        .DayPicker-Months {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }

        .DayPicker-Month {
          display: table;
          margin: 0 1em;
          margin-top: 1em;
          border-spacing: 0;
          border-collapse: collapse;

          -webkit-user-select: none;

          -moz-user-select: none;

          -ms-user-select: none;

          user-select: none;
        }

        .DayPicker-NavBar {
        }

        .DayPicker-NavButton {
          position: absolute;
          top: 1em;
          right: 1.5em;
          left: auto;

          display: inline-block;
          margin-top: 2px;
          width: 1.25em;
          height: 1.25em;
          background-position: center;
          background-size: 50%;
          background-repeat: no-repeat;
          color: #8b9898;
          cursor: pointer;
        }

        .DayPicker-NavButton:hover {
          opacity: 0.8;
        }

        .DayPicker-NavButton--prev {
          margin-right: 1.5em;
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAVVJREFUWAnN2G0KgjAYwPHpGfRkaZeqvgQaK+hY3SUHrk1YzNLay/OiEFp92I+/Mp2F2Mh2lLISWnflFjzH263RQjzMZ19wgs73ez0o1WmtW+dgA01VxrE3p6l2GLsnBy1VYQOtVSEH/atCCgqpQgKKqYIOiq2CBkqtggLKqQIKgqgCBjpJ2Y5CdJ+zrT9A7HHSTA1dxUdHgzCqJIEwq0SDsKsEg6iqBIEoq/wEcVRZBXFV+QJxV5mBtlDFB5VjYTaGZ2sf4R9PM7U9ZU+lLuaetPP/5Die3ToO1+u+MKtHs06qODB2zBnI/jBd4MPQm1VkY79Tb18gB+C62FdBFsZR6yeIo1YQiLJWMIiqVjQIu1YSCLNWFgijVjYIuhYYCKoWKAiiFgoopxYaKLUWOii2FgkophYp6F3r42W5A9s9OcgNvva8xQaysKXlFytoqdYmQH6tF3toSUo0INq9AAAAAElFTkSuQmCC');
        }

        .DayPicker-NavButton--next {
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAXRJREFUWAnN119ugjAcwPHWzJ1gnmxzB/BBE0n24m4xfNkTaOL7wOtsl3AXMMb+Vjaa1BG00N8fSEibPpAP3xAKKs2yjzTPH9RAjhEo9WzPr/Vm8zgE0+gXATAxxuxtqeJ9t5tIwv5AtQAApsfT6TPdbp+kUBcgVwvO51KqVhMkXKsVJFXrOkigVhCIs1Y4iKlWZxB1rX4gwlpRIIpa8SDkWmggrFq4IIRaJKCYWnSgnrXIQV1r8YD+1Vrn+bReagysIFfLABRt31v8oBu1xEBttfRbltmfjgEcWh9snUS2kNdBK6WN1vrOWxObWsz+fjxevsxmB1GQDfINWiev83nhaoiB/CoOU438oPrhXS0WpQ9xc1ZQWxWHqUYe0I0qrKCQKjygDlXIQV2r0IF6ViEBxVTBBSFUQQNhVYkHIVeJAtkNsbQ7c1LtzP6FsObhb2rCKv7NBIGoq4SDmKoEgTirXAcJVGkFSVVpgoSrXICGUMUH/QBZNSUy5XWUhwAAAABJRU5ErkJggg==');
        }

        .DayPicker-NavButton--interactionDisabled {
          display: none;
        }

        .DayPicker-Caption {
          display: table-caption;
          margin-bottom: 0.5em;
          padding: 0 0.5em;
          text-align: left;
        }

        .DayPicker-Caption > div {
          font-weight: 500;
          font-size: 1.15em;
        }

        .DayPicker-Weekdays {
          display: table-header-group;
          margin-top: 1em;
        }

        .DayPicker-WeekdaysRow {
          display: table-row;
        }

        .DayPicker-Weekday {
          display: table-cell;
          padding: 0.5em;
          color: #8b9898;
          text-align: center;
          font-size: 0.875em;
        }

        .DayPicker-Weekday abbr[title] {
          border-bottom: none;
          text-decoration: none;
        }

        .DayPicker-Body {
          display: table-row-group;
        }

        .DayPicker-Week {
          display: table-row;
        }

        .DayPicker-Day {
          display: table-cell;
          padding: 0.5em;
          border-radius: 50%;
          vertical-align: middle;
          text-align: center;
          cursor: pointer;
        }

        .DayPicker-WeekNumber {
          display: table-cell;
          padding: 0.5em;
          min-width: 1em;
          border-right: 1px solid #eaecec;
          color: #8b9898;
          vertical-align: middle;
          text-align: right;
          font-size: 0.75em;
          cursor: pointer;
        }

        .DayPicker--interactionDisabled .DayPicker-Day {
          cursor: default;
        }

        .DayPicker-Footer {
          padding-top: 0.5em;
        }

        .DayPicker-TodayButton {
          border: none;
          background-color: transparent;
          background-image: none;
          box-shadow: none;
          color: #4a90e2;
          font-size: 0.875em;
          cursor: pointer;
        }

        /* Default modifiers */

        .DayPicker-Day--today {
          color: #d0021b;
          font-weight: 700;
        }

        .DayPicker-Day--outside {
          color: #8b9898;
          cursor: default;
        }

        .DayPicker-Day--disabled {
          color: #dce0e0;
          cursor: default;
          /* background-color: #eff1f1; */
        }

        /* Example modifiers */

        .DayPicker-Day--sunday {
          background-color: #f7f8f8;
        }

        .DayPicker-Day--sunday:not(.DayPicker-Day--today) {
          color: #dce0e0;
        }

        .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
          position: relative;

          background-color: #4a90e2;
          color: #f0f8ff;
        }

        .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):hover {
          background-color: #51a0fa;
        }

        .DayPicker:not(.DayPicker--interactionDisabled)
          .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
          background-color: #f0f8ff;
        }

        /* DayPickerInput */

        .DayPickerInput {
          display: inline-block;
        }

        .DayPickerInput-OverlayWrapper {
          position: relative;
        }

        .DayPickerInput-Overlay {
          position: absolute;
          left: 0;
          z-index: 1;

          background: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        }

        .DayPickerInput input {
          width: 120px;
          padding: 10px;
          font-size: 16px;
        }
      `}</style>
    </div>
  )
}
