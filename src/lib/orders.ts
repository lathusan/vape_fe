import { retailOrders, tradeOrders } from "./data";
import type { PortalRole } from "./portal";

export const slug = (id: string) => id.replace("#", "");
export const ordersFor = (role: PortalRole) => (role === "wholesaler" ? tradeOrders : retailOrders);
export const findOrder = (role: PortalRole, id: string) => ordersFor(role).find((o) => slug(o.id) === id);
