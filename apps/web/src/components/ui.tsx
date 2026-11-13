import { useEffect, useId, useRef, type ReactNode } from "react";
import {
  ArrowRight,
  Carrot,
  Banana,
  Check,
  Clock,
  Truck,
  X,
  Leaf,
  AlertTriangle,
  Info,
} from "lucide-react";
import type { Delivery, State } from "../types";
import { kg, dateLabel } from "../model";

export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        <Leaf size={26} strokeWidth={1.8} />
      </span>
      <span className="brand-word">
        abastece<span>escola</span>
      </span>
    </span>
  );
}
export function ProductIcon({ id, size = 20 }: { id: string; size?: number }) {
  const Icon = id === "banana" ? Banana : Carrot;
  return (
    <span className={"food-icon food-" + id}>
      <Icon size={size} strokeWidth={1.7} aria-hidden="true" />
    </span>
  );
}
const labels = {
  scheduled: "Agendada",
  dispatched: "A caminho",
  received: "Conferida",
  cancelled: "Cancelada",
};
export function Status({ status }: { status: Delivery["status"] }) {
  const Icon =
    status === "received" ? Check : status === "dispatched" ? Truck : Clock;
  return (
    <span className={"status status-" + status}>
      <Icon size={13} aria-hidden="true" />
      {labels[status]}
    </span>
  );
}
export function PanelTitle({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function Stat({
  label,
  value,
  detail,
  tone = "green",
}: {
  label: string;
  value: ReactNode;
  detail: ReactNode;
  tone?: string;
}) {
  return (
    <div className={"stat stat-" + tone}>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      <span className="stat-detail">{detail}</span>
    </div>
  );
}
export function Notice({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: "info" | "warning" | "error" | "success";
}) {
  const Icon = tone === "warning" || tone === "error" ? AlertTriangle : Info;
  return (
    <div className={"notice notice-" + tone}>
      <Icon size={20} aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <div className="notice-body">{children}</div>
      </div>
    </div>
  );
}
export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.max(0, Math.min(value, 100))}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: Math.max(0, Math.min(value, 100)) + "%" }} />
    </div>
  );
}
export function Dialog({
  title,
  onClose,
  children,
  error,
  className = "",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  error?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    id = useId();
  useEffect(() => {
    ref.current?.showModal();
    return () => ref.current?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={"dialog " + className}
      aria-labelledby={id}
      onCancel={onClose}
    >
      <div className="dialog-heading">
        <h2 id={id}>{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="Fechar janela"
          onClick={onClose}
        >
          <X size={22} />
        </button>
      </div>
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      {children}
    </dialog>
  );
}
export function DeliveryList({
  state,
  deliveries,
  onOpen,
  empty = "Nenhuma entrega corresponde aos filtros.",
}: {
  state: State;
  deliveries: Delivery[];
  onOpen: (id: string) => void;
  empty?: string;
}) {
  if (!deliveries.length)
    return (
      <div className="empty">
        <Truck size={30} aria-hidden="true" />
        <h3>Nenhuma entrega nesta lista</h3>
        <p>{empty}</p>
      </div>
    );
  const food = (d: Delivery) =>
    state.products.find((p) => p.id === d.product)!.name;
  const producer = (d: Delivery) =>
    state.suppliers.find((p) => p.id === d.supplier)!.name;
  const school = (d: Delivery) =>
    state.schools.find((p) => p.id === d.school)!.short;
  return (
    <>
      <div
        className="table-region delivery-desktop"
        role="region"
        aria-label="Entregas do ciclo"
        tabIndex={0}
      >
        <table className="data-table delivery-table">
          <thead>
            <tr>
              <th scope="col">Alimento / produtor</th>
              <th scope="col">Escola</th>
              <th scope="col">Previsto</th>
              <th scope="col">Entrega</th>
              <th scope="col">Situação</th>
              <th scope="col">
                <span className="sr-only">Detalhes</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id}>
                <th scope="row">
                  <div className="food-cell">
                    <ProductIcon id={d.product} />
                    <span>
                      {food(d)}
                      <small>{producer(d)}</small>
                    </span>
                  </div>
                </th>
                <td>{school(d)}</td>
                <td className="numeric">
                  {kg(d.qty)} kg
                  {d.receipt && (
                    <small>{kg(d.receipt.accepted)} kg aceitos</small>
                  )}
                </td>
                <td className="nowrap">
                  {dateLabel(d.date)}
                  <small>{d.time}</small>
                </td>
                <td>
                  <Status status={d.status} />
                </td>
                <td>
                  <button
                    className="icon-button row-open"
                    aria-label={`Detalhar ${food(d).toLowerCase()} para ${school(d)}`}
                    onClick={() => onOpen(d.id)}
                  >
                    <ArrowRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="delivery-mobile">
        {deliveries.map((d) => (
          <article key={d.id} className="delivery-item">
            <div className="delivery-item-heading">
              <ProductIcon id={d.product} />
              <div>
                <h3>{food(d)}</h3>
                <p>{producer(d)}</p>
              </div>
              <Status status={d.status} />
            </div>
            <dl>
              <div>
                <dt>Escola</dt>
                <dd>{school(d)}</dd>
              </div>
              <div>
                <dt>Previsto</dt>
                <dd>{kg(d.qty)} kg</dd>
              </div>
              <div>
                <dt>Entrega</dt>
                <dd>
                  {dateLabel(d.date)} · {d.time}
                </dd>
              </div>
              {d.receipt && (
                <div>
                  <dt>Aceito</dt>
                  <dd>{kg(d.receipt.accepted)} kg</dd>
                </div>
              )}
            </dl>
            <button className="text-button" onClick={() => onOpen(d.id)}>
              Detalhes da entrega
              <ArrowRight size={16} />
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
