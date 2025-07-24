import { MiniCalendar, MiniCalendarDay, MiniCalendarDays, MiniCalendarNavigation } from "./MiniCalenderProvider";


const Example = () => (
  <MiniCalendar>
    <MiniCalendarNavigation direction="prev" />
    <MiniCalendarDays>
      {(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
    </MiniCalendarDays>
    <MiniCalendarNavigation direction="next" />
  </MiniCalendar>
);
export default Example;