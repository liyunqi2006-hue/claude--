import { CalendarClock, Link2, Rocket, Smartphone, ShieldAlert, BadgeCheck } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";

const ICONS = [CalendarClock, Link2, Rocket, Smartphone, ShieldAlert, BadgeCheck] as const;

export default async function ServiceNotes() {
  const dict = await getDictionary();
  const notes = [
    dict.serviceNotes.notes.validity,
    dict.serviceNotes.notes.activation,
    dict.serviceNotes.notes.delivery,
    dict.serviceNotes.notes.mobile,
    dict.serviceNotes.notes.ban,
    dict.serviceNotes.notes.trust,
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">{dict.serviceNotes.title}</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note, i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={note.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 text-base font-semibold">{note.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{note.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
