export type View =
  | "overview"
  | "plan"
  | "deliveries"
  | "schools"
  | "suppliers"
  | "reports"
  | "guide";
export type Role = "coordinator" | "supplier" | "school";
export interface Actor {
  role: Role;
  id: string;
  name: string;
}
export interface Invite extends Actor {
  token: string;
}
export interface Session {
  room: string;
  token: string;
  invites?: Invite[];
}
export interface School {
  id: string;
  name: string;
  short: string;
  students: number;
  initials: string;
  color: string;
}
export interface Supplier {
  id: string;
  name: string;
  person: string;
  short: string;
  initials: string;
  town: string;
  color: string;
}
export interface Product {
  id: string;
  name: string;
  icon: string;
  color: string;
}
export interface Capacity {
  supplier: string;
  product: string;
  qty: number;
  limit: number;
}
export interface Delivery {
  id: string;
  supplier: string;
  school: string;
  product: string;
  qty: number;
  status: "scheduled" | "dispatched" | "received" | "cancelled";
  date: string;
  time: string;
  receipt?: {
    delivered: number;
    accepted: number;
    rejected: number;
    note: string;
    at: string;
  };
  resolution?: { note: string; at: string };
  dispatchedAt?: string;
}
export interface State {
  name: string;
  demo: boolean;
  cycle: {
    id: string;
    label: string;
    start: string;
    end: string;
    deliveryDate: string;
  };
  schools: School[];
  suppliers: Supplier[];
  products: Product[];
  capacities: Capacity[];
  demands: { school: string; product: string; qty: number }[];
  plan: {
    version: number;
    status: "draft" | "published";
    accepts: Record<string, number>;
  };
  deliveries: Delivery[];
  events: {
    id: string;
    title: string;
    detail: string;
    at: string;
    actor: string;
  }[];
}
export interface Snapshot {
  state: State;
  revision: number;
  actor: Actor;
}
export interface PageProps {
  state: State;
  onNavigate: (view: View) => void;
  onDelivery: (id: string) => void;
  onSchool: (id: string) => void;
  onConnect: (id?: string) => void;
}
