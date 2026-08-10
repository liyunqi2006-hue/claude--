import { CalendarClock, Link2, Rocket, Smartphone, ShieldAlert, BadgeCheck } from "lucide-react";

const NOTES = [
  {
    icon: CalendarClock,
    title: "365 天有效期",
    desc: "订阅激活链接自代付完成之日起 365 天内有效，请提醒接收人及时激活。",
  },
  {
    icon: Link2,
    title: "激活方式",
    desc: "Anthropic 官方会发送一封含订阅激活链接的邮件，点击链接即可订阅绑定至账号。",
  },
  {
    icon: Rocket,
    title: "快速交付",
    desc: "付款成功后，我们会立即为您代付官方订单，激活链接通常会在 1 小时内发送至您的邮箱。",
  },
  {
    icon: Smartphone,
    title: "移动端订阅",
    desc: "如当前已通过 Apple / Google 订阅，请勿下单，需等订阅到期后再激活。",
  },
  {
    icon: ShieldAlert,
    title: "封号售后",
    desc: "本服务为纯代付性质，订阅一经官方开通，如账号被封禁亦不支持退款。",
  },
  {
    icon: BadgeCheck,
    title: "可信来源",
    desc: "每笔订单都使用真实的美国银行信用卡在 Anthropic 官网代付，且订阅激活链接由 Anthropic 官方直接发送至你的邮箱。",
  },
];

export default function ServiceNotes() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold">服务须知</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {NOTES.map((note) => (
          <div
            key={note.title}
            className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand dark:bg-brand/10">
              <note.icon size={20} />
            </div>
            <h3 className="mt-4 text-base font-semibold">{note.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{note.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
