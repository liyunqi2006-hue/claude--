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
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-bold text-neutral-900 dark:text-white">
          {dict.serviceNotes.title}
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note, i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={note.title}
              className="group rounded-3xl border-2 border-neutral-200 bg-white p-8 transition-all duration-500 hover:border-[#7e22ce] hover:shadow-xl hover:-translate-y-1 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 text-[#7e22ce] transition-all duration-500 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#2a5298] group-hover:to-[#7e22ce] group-hover:text-white dark:from-blue-950 dark:to-purple-950">
                <Icon size={24} strokeWidth={2} />
              </div>
              <h3 className="mt-6 text-lg font-bold text-neutral-900 dark:text-white">
                {note.title}
              </h3>
              <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-400">
                {note.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
