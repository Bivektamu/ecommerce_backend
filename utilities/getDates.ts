const now = new Date()
const currentYear = (now).getUTCFullYear()

const currentMonth = (now).getUTCMonth()

const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

export const previousMonthStartDate = new Date(Date.UTC(previousYear, previousMonth, 1))
export const previousMonthEndDate = new Date(Date.UTC(previousYear, previousMonth + 1, 0))

export const currentMonthStartDate = new Date(Date.UTC(currentYear, currentMonth, 1))
export const currentMonthEndDate = new Date(Date.UTC(currentYear, currentMonth, now.getDate(), 23, 59, 59, 999))

let startDate

if (currentMonth >= 7) {
    startDate = new Date(currentYear, 7, 1)
}
else {
    startDate = new Date(currentYear - 1, 7, 1)
}
export const startFiscalDate = startDate
export const endFiscalDate = new Date()
