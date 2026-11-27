import { ArrowRight, BookmarkPlus, CalendarClock, Columns3 } from 'lucide-react';

const steps = [
  {
    icon: BookmarkPlus,
    number: '01',
    title: 'Save an opportunity',
    description: 'Add a link from wherever you find it, before the moment passes.',
  },
  {
    icon: Columns3,
    number: '02',
    title: 'See the whole picture',
    description: 'Keep every role, note, and referral in a clear personal pipeline.',
  },
  {
    icon: CalendarClock,
    number: '03',
    title: 'Take the next step',
    description: 'Follow up at the right time and keep momentum through every stage.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full px-6 py-24 border-t border-(--border-subtle)">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-xl mb-12">
          <p className="text-xs text-(--accent-primary) uppercase tracking-widest font-semibold mb-3">
            A simple rhythm
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
            Less admin. More thoughtful action.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map(({ icon: Icon, number, title, description }, index) => (
            <div
              key={number}
              className="relative border border-(--border-subtle) bg-(--bg-surface) p-6 rounded-md"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-9 h-9 rounded-sm bg-(--accent-primary-bg) text-(--accent-primary) flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-(--text-muted)">{number}</span>
              </div>
              <h3 className="text-base font-semibold text-(--text-primary)">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">{description}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-4 top-11 w-8 h-8 p-2 rounded-full border border-(--border-subtle) bg-(--bg-app) text-(--text-muted) z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
