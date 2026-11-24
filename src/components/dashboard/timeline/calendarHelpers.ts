export const CALENDAR_MONTHS = [
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
  'December',
];

export function formatDateIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDateIso(str: string): Date | null {
  if (!str) return null;
  const parts = str.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function formatHumanDate(str: string): string {
  const parsed = parseDateIso(str);
  if (!parsed) return str;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export interface CalendarDay {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export function getCalendarDays(year: number, month: number, todayStr: string): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDayNum = daysInPrevMonth - i;
    const d = new Date(year, month - 1, prevDayNum);
    const dateStr = formatDateIso(d);
    days.push({
      date: dateStr,
      dayNumber: prevDayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isFuture: dateStr > todayStr,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const m = String(month + 1).padStart(2, '0');
    const day = String(i).padStart(2, '0');
    const dateStr = `${year}-${m}-${day}`;
    days.push({
      date: dateStr,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isFuture: dateStr > todayStr,
    });
  }

  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    const dateStr = formatDateIso(d);
    days.push({
      date: dateStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isFuture: dateStr > todayStr,
    });
  }

  return days;
}

export type PresetKey = 'all' | 'today' | '7d' | '14d' | '30d';

export function getPresetRange(type: PresetKey): { startDate: string; endDate: string } {
  const now = new Date();
  const today = formatDateIso(now);

  if (type === 'all') {
    return { startDate: '', endDate: '' };
  }
  if (type === 'today') {
    return { startDate: today, endDate: today };
  }
  if (type === '7d') {
    const d = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    return { startDate: formatDateIso(d), endDate: today };
  }
  if (type === '14d') {
    const d = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000);
    return { startDate: formatDateIso(d), endDate: today };
  }
  if (type === '30d') {
    const d = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
    return { startDate: formatDateIso(d), endDate: today };
  }

  return { startDate: '', endDate: '' };
}

export function calcPopoverPosition(
  anchorEl?: HTMLElement | null,
  fallbackRect?: DOMRect | null
): { top: number; left: number; isUp: boolean } {
  if (typeof window === 'undefined') return { top: 0, left: 8, isUp: false };
  const r = anchorEl?.getBoundingClientRect() || fallbackRect;
  if (!r) return { top: 0, left: 8, isUp: false };
  const isUp = window.innerHeight - r.bottom < 340 && r.top > 340;
  return {
    top: isUp ? r.top - 6 : r.bottom + 6,
    left: Math.max(8, Math.min(r.right - 288, window.innerWidth - 296)),
    isUp,
  };
}
