import { prisma } from "@/lib/prisma";

export function findUserOrders(session: { id: string; email?: string | null }) {
  return prisma.order.findMany({
    where: {
      OR: [
        { userId: session.id },
        session.email ? { userId: null, contactEmail: session.email } : { id: "__never__" },
      ],
    },
    include: { product: true, fulfillment: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function findUserOrderByNo(
  session: { id: string; email?: string | null },
  orderNo: string,
) {
  const order = await prisma.order.findUnique({
    where: { orderNo },
    include: { product: true, fulfillment: true },
  });
  if (!order) return null;
  const owned =
    order.userId === session.id ||
    (order.userId === null && session.email && order.contactEmail === session.email);
  return owned ? order : null;
}
