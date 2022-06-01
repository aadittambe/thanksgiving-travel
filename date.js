// https://github.com/d3/d3-time-format#locales
const apStyle = d3.timeFormatLocale({
    dateTime: '%x, %X',
    date: '%b %e, %Y',
    periods: ['a.m.', 'p.m.'],
    days: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    shortDays: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
    months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    shortMonths: [
        'Jan.',
        'Feb.',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug.',
        'Sept.',
        'Oct.',
        'Nov.',
        'Dec.'
    ]
})

let formatDateMonth = apStyle.format('%b %e');
let formatMonth = apStyle.format('%b');