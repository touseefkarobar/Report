import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const StatTile = ({ label, value, accent }) => (
  <div className="rounded-2xl bg-slate-900/70 p-6 shadow-elevated ring-1 ring-slate-800">
    <p className="text-sm font-medium text-slate-400">{label}</p>
    <p className={`mt-2 text-3xl font-semibold tracking-tight ${accent}`}>{value}</p>
  </div>
);

const TogglePill = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200
      ${
        active
          ? 'border-primary-500 bg-primary-600/20 text-primary-200 shadow-elevated'
          : 'border-slate-700 bg-slate-900/40 text-slate-400 hover:border-primary-500/50 hover:text-primary-200'
      }`}
  >
    {label}
  </button>
);

const HolidayBadge = ({ date, onRemove }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1 text-sm text-slate-200">
    {dayjs(date).format('DD MMM')}
    <button
      type="button"
      onClick={() => onRemove(date)}
      className="rounded-full bg-slate-800/80 p-1 text-xs text-slate-400 transition hover:bg-red-500/20 hover:text-red-300"
      aria-label={`Remove ${date}`}
    >
      ✕
    </button>
  </span>
);

const formatNumber = (value) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);

function useWorkingCalendar({ weekendDays, holidays, dailyTargetHours }) {
  return useMemo(() => {
    const today = dayjs();
    const startOfMonth = today.startOf('month');
    const endOfMonth = today.endOf('month');

    let workingDaysThisMonth = 0;
    let workingDaysUntilToday = 0;

    for (let date = startOfMonth; date.isBefore(endOfMonth) || date.isSame(endOfMonth, 'day'); date = date.add(1, 'day')) {
      const isWeekend = weekendDays.includes(date.day());
      const isHoliday = holidays.includes(date.format('YYYY-MM-DD'));
      if (isWeekend || isHoliday) continue;

      workingDaysThisMonth += 1;
      if (date.isBefore(today, 'day') || date.isSame(today, 'day')) {
        workingDaysUntilToday += 1;
      }
    }

    const totalTargetHours = workingDaysThisMonth * dailyTargetHours;
    const expectedHoursByToday = workingDaysUntilToday * dailyTargetHours;

    return {
      totalWorkingDays: workingDaysThisMonth,
      workingDaysToDate: workingDaysUntilToday,
      totalTargetHours,
      expectedHoursByToday,
    };
  }, [weekendDays, holidays, dailyTargetHours]);
}

function App() {
  const [weekendDays, setWeekendDays] = useState([0, 6]);
  const [dailyTargetHours, setDailyTargetHours] = useState(8);
  const [holidayInput, setHolidayInput] = useState('');
  const [holidays, setHolidays] = useState([]);
  const [loggedHours, setLoggedHours] = useState('');

  const { totalWorkingDays, workingDaysToDate, totalTargetHours, expectedHoursByToday } = useWorkingCalendar({
    weekendDays,
    holidays,
    dailyTargetHours,
  });

  const parsedLoggedHours = parseFloat(loggedHours) || 0;
  const hourDelta = parsedLoggedHours - expectedHoursByToday;
  const hoursStatusLabel = hourDelta >= 0 ? 'Advanced hours' : 'Remaining hours';
  const hoursStatusValue = Math.abs(hourDelta);

  const handleToggleWeekend = (dayIndex) => {
    setWeekendDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((day) => day !== dayIndex)
        : [...prev, dayIndex].sort((a, b) => a - b)
    );
  };

  const handleAddHoliday = () => {
    if (!holidayInput) return;
    const formatted = dayjs(holidayInput).format('YYYY-MM-DD');
    if (!formatted || formatted === 'Invalid Date') return;
    setHolidays((prev) => (prev.includes(formatted) ? prev : [...prev, formatted].sort()));
    setHolidayInput('');
  };

  const handleRemoveHoliday = (date) => {
    setHolidays((prev) => prev.filter((item) => item !== date));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-6xl flex-col gap-2 px-6 pb-10 pt-16 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
            Productivity Companion
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Work Hours Intelligence Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-400">
            Configure your calendar in seconds and stay on top of your progress. View smart projections for
            working days, targeted hours, and real-time balance on a beautifully modern interface.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 pb-20">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatTile label="Total working days" value={formatNumber(totalWorkingDays)} accent="text-primary-200" />
          <StatTile label="Targeted hours this month" value={`${formatNumber(totalTargetHours)} h`} accent="text-emerald-200" />
          <StatTile label="Working days so far" value={formatNumber(workingDaysToDate)} accent="text-sky-200" />
          <StatTile
            label="Expected hours to date"
            value={`${formatNumber(expectedHoursByToday)} h`}
            accent="text-rose-200"
          />
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-8 shadow-elevated">
            <div>
              <h2 className="text-xl font-semibold text-white">Calendar configuration</h2>
              <p className="mt-1 text-sm text-slate-400">
                Select your weekend days, preferred daily target, and mark upcoming holidays to personalise the
                insights above.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wide text-slate-400">Weekend days</h3>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
                  {WEEKDAY_LABELS.map((label, index) => (
                    <TogglePill
                      key={label}
                      label={label}
                      active={weekendDays.includes(index)}
                      onClick={() => handleToggleWeekend(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-400">Target hours per working day</span>
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={dailyTargetHours}
                    onChange={(event) => setDailyTargetHours(Number(event.target.value) || 0)}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-400">Add holiday</span>
                  <div className="flex gap-3">
                    <input
                      type="date"
                      value={holidayInput}
                      onChange={(event) => setHolidayInput(event.target.value)}
                      className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
                    />
                    <button
                      type="button"
                      onClick={handleAddHoliday}
                      className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition hover:bg-primary-500"
                    >
                      Add
                    </button>
                  </div>
                </label>
              </div>

              {holidays.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {holidays.map((date) => (
                    <HolidayBadge key={date} date={date} onRemove={handleRemoveHoliday} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No holidays added yet.</p>
              )}
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-elevated">
            <div>
              <h2 className="text-xl font-semibold text-white">Real-time effort tracking</h2>
              <p className="mt-1 text-sm text-slate-400">
                Enter your logged hours to instantly understand how far ahead or behind you are from the
                expectations.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-400">Logged hours this month</span>
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={loggedHours}
                  onChange={(event) => setLoggedHours(event.target.value)}
                  placeholder="e.g. 96"
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-lg text-white outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
                />
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <p className="text-sm uppercase tracking-wide text-slate-400">{hoursStatusLabel}</p>
                <p className="mt-3 text-4xl font-semibold text-white">
                  {formatNumber(hoursStatusValue)} <span className="text-lg text-slate-400">hours</span>
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  You are {hourDelta >= 0 ? 'ahead of' : 'behind'} the expected schedule of {formatNumber(expectedHoursByToday)} hours.
                </p>
              </div>

              <div className="rounded-2xl bg-primary-600/10 p-6 text-sm text-primary-100">
                <p className="font-medium text-primary-200">Productivity note</p>
                <p className="mt-1 text-primary-100/80">
                  Consider batching focus work on longer working streaks and keep holidays updated to maintain
                  accurate projections.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 pb-12">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800/70 bg-slate-950/40 p-6 text-center text-xs text-slate-500">
          Crafted with Tailwind CSS & React · Stay balanced and inspired ✨
        </div>
      </footer>
    </div>
  );
}

export default App;
