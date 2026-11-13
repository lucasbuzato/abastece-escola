import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowRight,
  Copy,
  ExternalLink,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  Info,
} from "lucide-react";
import type { Delivery, Session, State } from "../types";
import { dateLabel, fullDate, kg, schoolMetrics, timeLabel } from "../model";
import { Dialog, Notice, ProductIcon, Status } from "./ui";
export type DialogKind =
  | "connect"
  | "revise"
  | "delivery"
  | "school"
  | "updates"
  | "cycle"
  | "workspace"
  | null;
interface Props {
  kind: DialogKind;
  state: State;
  session: Session;
  selectedId: string;
  inviteId: string;
  onInvite: (id: string) => void;
  onClose: () => void;
  onCommand: (type: string, payload?: Record<string, unknown>) => Promise<void>;
  onNewDemo: () => Promise<void>;
  onConnect: (id?: string) => void;
  busy: boolean;
  online: boolean;
  error: string;
  onFeedback: (message: string) => void;
}
export function WorkspaceDialogs({
  kind,
  state: s,
  session,
  selectedId,
  inviteId,
  onInvite,
  onClose,
  onCommand,
  onNewDemo,
  onConnect,
  busy,
  online,
  error,
  onFeedback,
}: Props) {
  const [qr, setQr] = useState(""),
    [qty, setQty] = useState(""),
    [note, setNote] = useState(""),
    [copyMessage, setCopyMessage] = useState("");
  const displayError =
    error ||
    (!online
      ? "Sem conexão. Consulte os dados salvos; as alterações precisam de conexão."
      : "");
  const invite = session.invites?.find((x) => x.id === inviteId),
    url = invite
      ? `${location.origin}/app/?room=${session.room}#access=${invite.token}`
      : "";
  useEffect(() => {
    let active = true;
    setQr("");
    if (url)
      QRCode.toDataURL(url, {
        margin: 2,
        width: 220,
        color: { dark: "#173C32", light: "#FFFFFF" },
      })
        .then((value) => {
          if (active) setQr(value);
        })
        .catch(() => {});
    return () => {
      active = false;
    };
  }, [url]);
  const d = s.deliveries.find((d) => d.id === selectedId),
    school = s.schools.find((x) => x.id === selectedId);
  const disabled = busy || !online;
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyMessage("Convite copiado. Abra-o no outro dispositivo ou no app.");
    } catch {
      setCopyMessage(
        "A cópia automática não está disponível. Selecione o convite no campo acima.",
      );
    }
  }
  if (!kind) return null;
  if (kind === "connect")
    return (
      <Dialog
        className="connection-dialog"
        title="Conectar aplicativo"
        onClose={onClose}
        error={displayError}
      >
        <p className="dialog-intro">
          Escolha quem vai usar o app. O convite abre o mesmo ambiente, com o
          acesso daquele participante.
        </p>
        {session.invites ? (
          <>
            <label className="field">
              Participante
              <select
                value={inviteId}
                onChange={(e) => onInvite(e.target.value)}
              >
                {session.invites
                  .filter((x) => x.role !== "coordinator")
                  .map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.role === "supplier" ? "Produtor" : "Escola"} · {x.name}
                    </option>
                  ))}
              </select>
            </label>
            <div className="invite-preview">
              {qr ? (
                <img
                  src={qr}
                  width={190}
                  height={190}
                  alt={`QR code de acesso de ${invite?.name}`}
                />
              ) : (
                <div className="qr-placeholder">Preparando QR code…</div>
              )}
              <div>
                <h3>{invite?.name}</h3>
                <p>
                  No celular, leia o QR code para abrir a demonstração no
                  navegador. No app Expo, cole o convite no campo de acesso.
                </p>
                <a
                  className="button primary"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir aplicativo
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
            <label className="field">
              Convite deste participante
              <input
                readOnly
                value={url}
                onFocus={(e) => e.currentTarget.select()}
              />
            </label>
            <button className="button secondary" onClick={copy}>
              <Copy size={16} />
              Copiar convite
            </button>
            {copyMessage && (
              <p className="copy-feedback" role="status">
                {copyMessage}
              </p>
            )}
            <p className="field-help">
              Compartilhe somente com quem vai testar este perfil. Criar outra
              demonstração no app gera dados separados.
            </p>
          </>
        ) : (
          <Notice title="Convites disponíveis no acesso original">
            Este navegador entrou por um convite e não possui os outros convites
            do ambiente. Use o navegador em que a demonstração foi criada para
            conectar participantes.
          </Notice>
        )}
      </Dialog>
    );
  if (kind === "revise")
    return (
      <Dialog
        className="revision-dialog"
        title="Preparar revisão do plano"
        onClose={onClose}
        error={displayError}
      >
        <p className="dialog-intro">
          O sistema redistribui a capacidade confirmada entre as demandas das
          escolas. Você confere o resultado antes da publicação.
        </p>
        <ol className="dialog-steps">
          <li>A versão {s.plan.version} fica preservada no histórico.</li>
          <li>Uma nova distribuição aparece para conferência.</li>
          <li>Os produtores precisam confirmar a nova versão.</li>
        </ol>
        <Notice title="Se faltar capacidade" tone="warning">
          A revisão pode ficar incompleta. A demanda sem cobertura permanece
          visível e impede a publicação.
        </Notice>
        <div className="dialog-actions">
          <button className="button secondary" onClick={onClose}>
            Voltar
          </button>
          <button
            className="button primary"
            disabled={disabled}
            onClick={() => onCommand("propose")}
          >
            {busy ? "Preparando…" : "Preparar revisão"}
            <ArrowRight size={17} />
          </button>
        </div>
      </Dialog>
    );
  if (kind === "delivery" && d)
    return (
      <Dialog
        className="delivery-dialog"
        title="Detalhes da entrega"
        onClose={onClose}
        error={displayError}
      >
        <div className="delivery-detail-title">
          <ProductIcon id={d.product} size={28} />
          <div>
            <h3>{s.products.find((p) => p.id === d.product)!.name}</h3>
            <p>
              {kg(d.qty)} kg previstos no plano · versão {s.plan.version}
            </p>
          </div>
          <Status status={d.status} />
        </div>
        <dl className="detail-list">
          <div>
            <dt>Produtor</dt>
            <dd>{s.suppliers.find((x) => x.id === d.supplier)!.name}</dd>
          </div>
          <div>
            <dt>Escola</dt>
            <dd>{s.schools.find((x) => x.id === d.school)!.name}</dd>
          </div>
          <div>
            <dt>Entrega prevista</dt>
            <dd>
              {fullDate(d.date)} · {d.time}
            </dd>
          </div>
        </dl>
        {d.receipt && (
          <section className="receipt-block">
            <h3>Conferência da escola</h3>
            <dl>
              <div>
                <dt>Recebido</dt>
                <dd>{kg(d.receipt.delivered)} kg</dd>
              </div>
              <div>
                <dt>Aceito</dt>
                <dd>{kg(d.receipt.accepted)} kg</dd>
              </div>
              <div>
                <dt>Rejeitado</dt>
                <dd>{kg(d.receipt.rejected)} kg</dd>
              </div>
              <div>
                <dt>Faltou na entrega</dt>
                <dd>
                  {kg(Math.round((d.qty - d.receipt.delivered) * 1000) / 1000)}{" "}
                  kg
                </dd>
              </div>
            </dl>
            {d.receipt.note && (
              <p>
                <strong>Observação:</strong> {d.receipt.note}
              </p>
            )}
          </section>
        )}
        {s.plan.status === "draft" && (
          <form
            className="adjust-form"
            onSubmit={(e) => {
              e.preventDefault();
              onCommand("allocate", { id: d.id, qty });
            }}
          >
            <h3>Ajustar distribuição</h3>
            <label className="field">
              Quantidade prevista em kg
              <input
                inputMode="decimal"
                value={qty}
                placeholder={String(d.qty)}
                onChange={(e) => setQty(e.target.value)}
                required
              />
            </label>
            <p className="field-help">
              O ajuste cria uma nova versão e renova as confirmações. Os limites
              de capacidade e de demanda continuam valendo.
            </p>
            <button
              className="button primary"
              disabled={disabled || qty.trim() === ""}
            >
              Salvar ajuste
            </button>
          </form>
        )}
        {d.resolution ? (
          <section className="resolution-block">
            <h3>
              <CheckCircle2 size={18} />
              Encaminhamento registrado
            </h3>
            <p>{d.resolution.note}</p>
          </section>
        ) : d.receipt &&
          (d.receipt.rejected > 0 || d.receipt.delivered < d.qty) ? (
          <form
            className="resolution-form"
            onSubmit={(e) => {
              e.preventDefault();
              onCommand("resolve", { id: d.id, note });
            }}
          >
            <label className="field">
              Encaminhamento da divergência
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                minLength={8}
                maxLength={400}
                required
                placeholder="Descreva a decisão e o próximo passo da equipe responsável."
              />
            </label>
            <p className="field-help">
              O registro documenta a decisão. Ele não altera a quantidade que a
              escola conferiu.
            </p>
            <button
              className="button primary"
              disabled={disabled || note.trim().length < 8}
            >
              Registrar encaminhamento
            </button>
          </form>
        ) : (
          !d.receipt && (
            <p className="field-help">
              A saída é registrada pelo produtor. A conferência é registrada
              pela escola, no aplicativo.
            </p>
          )
        )}
      </Dialog>
    );
  if (kind === "school" && school) {
    const m = schoolMetrics(s, school.id);
    return (
      <Dialog
        className="school-dialog"
        title={school.name}
        onClose={onClose}
        error={displayError}
      >
        <p className="dialog-intro">
          {kg(m.accepted)} kg aceitos de {kg(m.demand)} kg necessários.{" "}
          {m.received} de {m.count} entregas conferidas.
        </p>
        <div className="school-receipts">
          {s.deliveries
            .filter((d) => d.school === school.id && d.status !== "cancelled")
            .map((d) => (
              <article key={d.id}>
                <ProductIcon id={d.product} />
                <div>
                  <h3>{s.products.find((p) => p.id === d.product)!.name}</h3>
                  <p>{s.suppliers.find((p) => p.id === d.supplier)!.name}</p>
                  <p>
                    {kg(d.qty)} kg previstos
                    {d.receipt
                      ? ` · ${kg(d.receipt.accepted)} kg aceitos`
                      : ` · ${dateLabel(d.date)} às ${d.time}`}
                  </p>
                </div>
                <Status status={d.status} />
              </article>
            ))}
        </div>
        <button
          className="button secondary"
          onClick={() => onConnect(school.id)}
        >
          <Smartphone size={17} />
          Abrir acesso da escola
        </button>
      </Dialog>
    );
  }
  if (kind === "updates")
    return (
      <Dialog
        className="updates-dialog"
        title="Atualizações do ambiente"
        onClose={onClose}
      >
        <ol className="event-list">
          {s.events.slice(0, 12).map((e) => (
            <li key={e.id}>
              <span className="event-marker" />
              <div>
                <h3>{e.title}</h3>
                <p>{e.detail}</p>
                <span className="event-meta">
                  {e.actor} · {timeLabel(e.at)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </Dialog>
    );
  if (kind === "cycle")
    return (
      <Dialog
        className="cycle-dialog"
        title="Período do cenário"
        onClose={onClose}
      >
        <p className="dialog-intro">
          Este ambiente demonstra um único ciclo, de {fullDate(s.cycle.start)} a{" "}
          {fullDate(s.cycle.end)}. As entregas estão previstas para{" "}
          {fullDate(s.cycle.deliveryDate)}.
        </p>
        <div className="cycle-week" aria-label="Semana ilustrativa do ciclo">
          {["Seg 09", "Ter 10", "Qua 11", "Qui 12", "Sex 13"].map((day, i) => (
            <div key={day} className={i === 3 ? "delivery-day" : ""}>
              <span>{day.split(" ")[0]}</span>
              <strong>{day.split(" ")[1]}</strong>
              {i === 3 ? <Smartphone size={19} /> : <span>·</span>}
            </div>
          ))}
        </div>
        <dl className="detail-list">
          <div>
            <dt>Plano</dt>
            <dd>
              Versão {s.plan.version} ·{" "}
              {s.plan.status === "published" ? "publicado" : "em revisão"}
            </dd>
          </div>
          <div>
            <dt>Escopo</dt>
            <dd>
              {s.schools.length} escolas · {s.suppliers.length} produtores
            </dd>
          </div>
        </dl>
        <p>
          As datas fazem parte de um cenário fictício. Este protótipo não
          oferece seleção de outros períodos.
        </p>
      </Dialog>
    );
  if (kind === "workspace")
    return (
      <Dialog
        className="environment-dialog"
        title="Ambiente de demonstração"
        onClose={onClose}
        error={displayError}
      >
        <p className="dialog-intro">
          Escolas, pessoas e quantidades são fictícias. As alterações deste
          ambiente ficam disponíveis para quem recebeu os seus convites.
        </p>
        <button className="button primary" onClick={() => onConnect()}>
          <Smartphone size={17} />
          Conectar participantes
        </button>
        <div className="new-demo">
          <h3>Começar outro cenário</h3>
          <p>
            Uma nova demonstração começa com os dados iniciais. O ambiente atual
            permanece salvo, mas você precisará dos seus convites para voltar a
            acessá-lo.
          </p>
          <button
            className="button secondary"
            disabled={disabled}
            onClick={onNewDemo}
          >
            <RefreshCw size={17} />
            {busy ? "Criando…" : "Criar nova demonstração"}
          </button>
        </div>
      </Dialog>
    );
  return null;
}
