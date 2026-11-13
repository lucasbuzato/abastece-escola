import type { State, Delivery, View } from "./types";
export const kg = (n: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(n);
export const sum = <T>(items: T[], value: (item: T) => number) =>
  Math.round(items.reduce((n, item) => n + value(item), 0) * 1000) / 1000;
export const activeDeliveries = (s: State) =>
  s.deliveries.filter((d) => d.status !== "cancelled");
export const isDivergent = (d: Delivery) =>
  !!d.receipt && (d.receipt.rejected > 0 || d.receipt.delivered < d.qty);
export const dateLabel = (date: string) =>
  new Date(date + "T12:00:00")
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", "");
export const fullDate = (date: string) =>
  new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
export const timeLabel = (date: string) =>
  new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
export const viewNames: Record<View, string> = {
  overview: "Visão geral",
  plan: "Planejamento",
  deliveries: "Entregas",
  schools: "Escolas",
  suppliers: "Produtores",
  reports: "Relatório do ciclo",
  guide: "Entenda o cenário",
};
export const normalizeView = (v: string | null): View =>
  v === "about"
    ? "guide"
    : v && Object.hasOwn(viewNames, v)
      ? (v as View)
      : "overview";
export function metrics(s: State) {
  const deliveries = activeDeliveries(s),
    received = deliveries.filter((d) => d.receipt);
  const demand = sum(s.demands, (d) => d.qty),
    planned = sum(deliveries, (d) => d.qty);
  const accepted = sum(received, (d) => d.receipt!.accepted),
    rejected = sum(received, (d) => d.receipt!.rejected);
  const delivered = sum(received, (d) => d.receipt!.delivered),
    missing = sum(received, (d) => d.qty - d.receipt!.delivered);
  const waiting = sum(
    deliveries.filter((d) => !d.receipt),
    (d) => d.qty,
  );
  const issues = s.capacities.flatMap((c) => {
    const committed = sum(
      deliveries.filter(
        (d) => d.supplier === c.supplier && d.product === c.product,
      ),
      (d) => d.qty,
    );
    return committed > Math.min(c.qty, c.limit)
      ? [
          {
            ...c,
            committed,
            shortage:
              Math.round((committed - Math.min(c.qty, c.limit)) * 1000) / 1000,
          },
        ]
      : [];
  });
  const unmet = s.demands.flatMap((n) => {
    const allocated = sum(
      deliveries.filter(
        (d) => d.school === n.school && d.product === n.product,
      ),
      (d) => d.qty,
    );
    return allocated < n.qty ? [{ ...n, missing: n.qty - allocated }] : [];
  });
  const assigned = [
    ...new Set(deliveries.filter((d) => d.qty > 0).map((d) => d.supplier)),
  ];
  const pendingSuppliers = s.suppliers.filter(
    (p) => assigned.includes(p.id) && s.plan.accepts[p.id] !== s.plan.version,
  );
  return {
    demand,
    planned,
    accepted,
    delivered,
    rejected,
    missing,
    waiting,
    issues,
    unmet,
    pendingSuppliers,
    shortage: sum(issues, (c) => c.shortage),
    uncovered: sum(unmet, (n) => n.missing),
    receivedCount: received.length,
    total: deliveries.length,
    coverage: demand ? Math.round((accepted / demand) * 100) : 0,
    unresolved: deliveries.filter((d) => isDivergent(d) && !d.resolution),
    upcoming: deliveries
      .filter((d) => d.status === "scheduled" || d.status === "dispatched")
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    executing: deliveries.some(
      (d) => d.status === "dispatched" || d.status === "received",
    ),
  };
}
export function schoolMetrics(s: State, id: string) {
  const deliveries = activeDeliveries(s).filter((d) => d.school === id);
  const demand = sum(
      s.demands.filter((d) => d.school === id),
      (d) => d.qty,
    ),
    accepted = sum(deliveries, (d) => d.receipt?.accepted ?? 0);
  return {
    demand,
    accepted,
    planned: sum(deliveries, (d) => d.qty),
    delivered: sum(deliveries, (d) => d.receipt?.delivered ?? 0),
    rejected: sum(deliveries, (d) => d.receipt?.rejected ?? 0),
    missing: sum(
      deliveries.filter((d) => d.receipt),
      (d) => d.qty - d.receipt!.delivered,
    ),
    coverage: demand ? Math.round((accepted / demand) * 100) : 0,
    count: deliveries.length,
    received: deliveries.filter((d) => d.receipt).length,
  };
}
export function csvFor(s: State) {
  const rows: (string | number)[][] = [
    [
      "Escola",
      "Produtor",
      "Alimento",
      "Situação",
      "Previsto kg",
      "Recebido kg",
      "Aceito kg",
      "Rejeitado kg",
      "Faltante na conferência kg",
    ],
  ];
  for (const d of activeDeliveries(s))
    rows.push([
      s.schools.find((x) => x.id === d.school)!.name,
      s.suppliers.find((x) => x.id === d.supplier)!.name,
      s.products.find((x) => x.id === d.product)!.name,
      {
        scheduled: "Agendada",
        dispatched: "A caminho",
        received: "Conferida",
        cancelled: "Cancelada",
      }[d.status],
      d.qty,
      d.receipt?.delivered ?? "",
      d.receipt?.accepted ?? "",
      d.receipt?.rejected ?? "",
      d.receipt ? Math.round((d.qty - d.receipt.delivered) * 1000) / 1000 : "",
    ]);
  return (
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map((value) => '"' + String(value).replaceAll('"', '""') + '"')
          .join(";"),
      )
      .join("\r\n")
  );
}
export function downloadCsv(s: State) {
  const url = URL.createObjectURL(
    new Blob([csvFor(s)], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "abastece-escola-" + s.cycle.id + ".csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
