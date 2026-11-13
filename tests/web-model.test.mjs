import test from "node:test";
import assert from "node:assert/strict";
import { createState, transition } from "../packages/domain/index.mjs";
import {
  metrics,
  schoolMetrics,
  csvFor,
  normalizeView,
} from "../apps/web/src/model.ts";
const coord = { role: "coordinator", id: "coord", name: "Coordenação" },
  p1 = { role: "supplier", id: "p1", name: "Sítio Bom Jardim" },
  p2 = { role: "supplier", id: "p2", name: "Cooperativa Raízes" },
  school = { role: "school", id: "s1", name: "E.M. Vila Esperança" };
function change(s, actor, type, payload = {}) {
  return transition(s, actor, {
    operationId: crypto.randomUUID(),
    type,
    payload,
  }).state;
}
function ready() {
  let s = change(createState(), p1, "capacity", {
    product: "cenoura",
    qty: 50,
  });
  s = change(s, coord, "propose");
  s = change(s, p1, "accept", { version: s.plan.version });
  s = change(s, p2, "accept", { version: s.plan.version });
  return change(s, coord, "publish");
}
test("agenda exclui conferidas e relatório distingue falta, rejeição e espera", () => {
  let s = ready();
  const d = s.deliveries.find(
    (d) => d.school === "s1" && d.product === "cenoura",
  );
  s = change(s, p1, "dispatch", { id: d.id });
  s = change(s, school, "receive", {
    id: d.id,
    delivered: 29,
    rejected: 1,
    note: "Um kg danificado",
  });
  const m = metrics(s);
  assert.equal(m.accepted, 28);
  assert.equal(m.delivered, 29);
  assert.equal(m.rejected, 1);
  assert.equal(m.missing, 1);
  assert.equal(m.waiting, 100);
  assert.equal(m.coverage, 22);
  assert.equal(m.unresolved.length, 1);
  assert.ok(!m.upcoming.some((x) => x.id === d.id));
  assert.equal(m.accepted + m.rejected + m.missing + m.waiting, m.planned);
  const unit = schoolMetrics(s, "s1");
  assert.equal(unit.accepted, 28);
  assert.equal(unit.demand, 54);
  assert.equal(unit.received, 1);
  assert.equal(unit.missing, 1);
  s = change(s, coord, "resolve", {
    id: d.id,
    note: "Reposição será alinhada com os responsáveis.",
  });
  assert.equal(metrics(s).unresolved.length, 0);
  assert.equal(metrics(s).accepted, 28);
});
test("capacidade agregada não oculta compromisso acima da capacidade individual", () => {
  const s = createState();
  s.capacities.find((c) => c.supplier === "p1" && c.product === "cenoura").qty =
    50;
  assert.equal(metrics(s).shortage, 10);
  assert.equal(metrics(s).uncovered, 0);
});
test("CSV distingue zero conferido de recebimento ainda não registrado", () => {
  const s = ready();
  const csv = csvFor(s);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.ok(csv.includes('"Recebido kg"'));
  assert.ok(csv.split("\r\n")[1].endsWith(';"";"";"";""'));
});
test("URLs desconhecidas e propriedades de protótipo não geram páginas vazias", () => {
  assert.equal(normalizeView("constructor"), "overview");
  assert.equal(normalizeView("__proto__"), "overview");
  assert.equal(normalizeView("unknown"), "overview");
  assert.equal(normalizeView("about"), "guide");
  assert.equal(normalizeView("schools"), "schools");
});
