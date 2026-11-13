import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  School,
  Smartphone,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  Search,
  Truck,
  Users,
  Info,
} from "lucide-react";
import type { PageProps, State, Delivery } from "../types";
import {
  activeDeliveries,
  metrics,
  schoolMetrics,
  kg,
  sum,
  dateLabel,
  fullDate,
  timeLabel,
  downloadCsv,
  isDivergent,
} from "../model";
import {
  PanelTitle,
  Stat,
  Notice,
  Progress,
  ProductIcon,
  DeliveryList,
} from "../components/ui";
import { HarvestScene } from "../components/HarvestScene";

function ProductBalance({ state }: { state: State }) {
  return (
    <div
      className="table-region"
      role="region"
      aria-label="Demanda e fornecimento por alimento"
      tabIndex={0}
    >
      <table className="data-table balance-table">
        <thead>
          <tr>
            <th scope="col">Alimento</th>
            <th scope="col">Necessidade</th>
            <th scope="col">Capacidade</th>
            <th scope="col">No plano</th>
            <th scope="col">Aceito</th>
          </tr>
        </thead>
        <tbody>
          {state.products.map((p) => (
            <tr key={p.id}>
              <th scope="row">
                <div className="food-cell">
                  <ProductIcon id={p.id} />
                  {p.name}
                </div>
              </th>
              <td>
                {kg(
                  sum(
                    state.demands.filter((d) => d.product === p.id),
                    (d) => d.qty,
                  ),
                )}{" "}
                kg
              </td>
              <td>
                {kg(
                  sum(
                    state.capacities.filter((c) => c.product === p.id),
                    (c) => Math.min(c.qty, c.limit),
                  ),
                )}{" "}
                kg
              </td>
              <td>
                {kg(
                  sum(
                    activeDeliveries(state).filter((d) => d.product === p.id),
                    (d) => d.qty,
                  ),
                )}{" "}
                kg
              </td>
              <td>
                {kg(
                  sum(
                    activeDeliveries(state).filter((d) => d.product === p.id),
                    (d) => d.receipt?.accepted ?? 0,
                  ),
                )}{" "}
                kg
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function Overview(props: PageProps) {
  const { state: s, onNavigate, onDelivery } = props,
    m = metrics(s),
    students = sum(s.schools, (x) => x.students);
  return (
    <>
      <section className="workspace-hero" aria-labelledby="overview-hero-title">
        <div className="hero-copy">
          <h2 id="overview-hero-title">
            Planeje as entregas.
            <br />{" "}
            <span>Confira o que chega.</span>
          </h2>
          <p>
            Reúna a capacidade dos produtores, a necessidade das escolas e os
            recebimentos em um mesmo ciclo de abastecimento.
          </p>
          <div className="hero-actions">
            <button
              className="button primary"
              onClick={() => onNavigate("plan")}
            >
              Ver planejamento
              <ArrowRight size={18} />
            </button>
            <button className="text-button" onClick={() => onNavigate("guide")}>
              Como funciona
              <ArrowUpRight size={17} />
            </button>
          </div>
          <div className="hero-context">
            <span>{s.schools.length} escolas</span>
            <span>{s.suppliers.length} produtores</span>
            <span>{students} estudantes no cenário</span>
          </div>
        </div>
        <figure className="hero-figure">
          <HarvestScene />
          <figcaption>
            <span>Produção</span>
            <ArrowRight size={14} />
            <span>Entrega</span>
            <ArrowRight size={14} />
            <span>Escola</span>
          </figcaption>
        </figure>
      </section>
      <section className="stats" aria-label="Resumo do abastecimento">
        <Stat
          label="Necessidade das escolas"
          value={
            <>
              {kg(m.demand)}
              <small>kg</small>
            </>
          }
          detail="Somada para este ciclo"
        />
        <Stat
          label="Quantidade no plano"
          value={
            <>
              {kg(m.planned)}
              <small>kg</small>
            </>
          }
          detail={`${m.total} entregas previstas`}
          tone="blue"
        />
        <Stat
          label="Recebido e aceito"
          value={
            <>
              {kg(m.accepted)}
              <small>kg</small>
            </>
          }
          detail={`${m.coverage}% da necessidade total`}
          tone="green"
        />
        <Stat
          label="Conferências concluídas"
          value={
            <>
              {m.receivedCount}
              <small>de {m.total}</small>
            </>
          }
          detail={`${m.total - m.receivedCount} entregas a conferir`}
          tone="ochre"
        />
      </section>
      <section className="panel action-panel">
        <PanelTitle kicker="Próximo passo" title="O que precisa de atenção" />
        <div className="action-list">
          {m.shortage > 0 && (
            <div className="action-row warning">
              <span className="action-icon">
                <AlertTriangle size={21} />
              </span>
              <div>
                <h3>{kg(m.shortage)} kg comprometidos acima da capacidade</h3>
                <p>
                  O plano atribui a um ou mais produtores uma quantidade maior
                  do que podem entregar. Revise a distribuição antes das saídas.
                </p>
              </div>
              <button
                className="button secondary"
                onClick={() => onNavigate("plan")}
              >
                Revisar plano
                <ArrowRight size={16} />
              </button>
            </div>
          )}
          {s.plan.status === "draft" && (
            <div className="action-row">
              <span className="action-icon">
                <Clock size={21} />
              </span>
              <div>
                <h3>Versão {s.plan.version} ainda não publicada</h3>
                <p>
                  {m.pendingSuppliers.length
                    ? `${m.pendingSuppliers.map((p) => p.short).join(" e ")} precisam confirmar os compromissos no app.`
                    : "Os produtores confirmaram. Confira as quantidades e publique o plano."}
                </p>
              </div>
              <button
                className="button secondary"
                onClick={() => onNavigate("plan")}
              >
                Ver confirmações
                <ArrowRight size={16} />
              </button>
            </div>
          )}
          {m.unresolved.map((d) => (
            <div className="action-row divergence" key={d.id}>
              <span className="action-icon">
                <AlertTriangle size={21} />
              </span>
              <div>
                <h3>
                  Divergência em{" "}
                  {s.schools.find((x) => x.id === d.school)!.short}
                </h3>
                <p>
                  {s.products.find((x) => x.id === d.product)!.name}:{" "}
                  {kg(d.qty)} kg previstos, {kg(d.receipt!.delivered)} kg
                  recebidos e {kg(d.receipt!.rejected)} kg rejeitados. Falta
                  registrar o encaminhamento.
                </p>
              </div>
              <button
                className="button secondary"
                onClick={() => onDelivery(d.id)}
              >
                Analisar recebimento
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
          {m.shortage === 0 &&
            s.plan.status === "published" &&
            m.unresolved.length === 0 && (
              <div className="action-row">
                <span className="action-icon success">
                  <CheckCircle2 size={21} />
                </span>
                <div>
                  <h3>Plano publicado e sem divergências pendentes</h3>
                  <p>
                    {m.upcoming.length
                      ? `${m.upcoming.length} entregas ainda aguardam saída ou conferência. Acompanhe a agenda e os registros das escolas.`
                      : "Todas as entregas foram conferidas. Consulte o relatório para revisar o resultado do ciclo."}
                  </p>
                </div>
                <button
                  className="button secondary"
                  onClick={() =>
                    onNavigate(m.upcoming.length ? "deliveries" : "reports")
                  }
                >
                  {m.upcoming.length ? "Ver entregas" : "Ver relatório"}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
        </div>
      </section>
      <div className="overview-columns">
        <section className="panel">
          <PanelTitle
            kicker="Demanda e fornecimento"
            title="Balanço por alimento"
          >
            <button className="text-button" onClick={() => onNavigate("plan")}>
              Ver plano
              <ArrowRight size={16} />
            </button>
          </PanelTitle>
          <ProductBalance state={s} />
          <p className="panel-footnote">
            Capacidade é o que os produtores confirmaram. Estar no plano não
            significa que o alimento já foi recebido.
          </p>
        </section>
        <section className="cycle-panel">
          <h2>Da confirmação à escola</h2>
          <ol className="cycle-steps">
            <li className="done">
              <span>
                <Check size={15} />
              </span>
              <div>
                <strong>Demanda registrada</strong>
                <p>
                  {kg(m.demand)} kg para {s.schools.length} escolas.
                </p>
              </div>
            </li>
            <li className={s.plan.status === "published" ? "done" : ""}>
              <span>
                {s.plan.status === "published" ? <Check size={15} /> : 2}
              </span>
              <div>
                <strong>
                  Plano{" "}
                  {s.plan.status === "published" ? "publicado" : "em revisão"}
                </strong>
                <p>
                  Versão {s.plan.version}
                  {s.plan.status === "draft"
                    ? ` · ${m.pendingSuppliers.length} confirmações pendentes`
                    : " · compromissos confirmados"}
                  .
                </p>
              </div>
            </li>
            <li className={m.executing ? "done" : ""}>
              <span>{m.executing ? <Check size={15} /> : 3}</span>
              <div>
                <strong>Saída e transporte</strong>
                <p>O produtor registra a saída no app.</p>
              </div>
            </li>
            <li className={m.receivedCount === m.total ? "done" : ""}>
              <span>
                {m.receivedCount === m.total ? <Check size={15} /> : 4}
              </span>
              <div>
                <strong>Conferência na escola</strong>
                <p>
                  {m.receivedCount} de {m.total} entregas conferidas.
                </p>
              </div>
            </li>
          </ol>
        </section>
      </div>
      <section className="panel">
        <PanelTitle
          kicker={`Agenda · ${dateLabel(s.cycle.deliveryDate)}`}
          title="Entregas ainda não conferidas"
        >
          <button
            className="text-button"
            onClick={() => onNavigate("deliveries")}
          >
            Ver todas ({m.upcoming.length})<ArrowRight size={16} />
          </button>
        </PanelTitle>
        <DeliveryList
          state={s}
          deliveries={m.upcoming.slice(0, 4)}
          onOpen={onDelivery}
          empty="As entregas deste ciclo já foram conferidas. O resultado está no relatório."
        />
      </section>
      <section className="working-note">
        <div>
          <h2>Uma informação acompanha a outra.</h2>
          <p>
            O produtor confirma quanto pode fornecer. A coordenação distribui
            essa capacidade entre as escolas e publica uma versão acordada. A
            escola confere o que chegou. Cada mudança fica disponível para os
            outros participantes do mesmo ambiente.
          </p>
        </div>
        <button className="text-button" onClick={() => onNavigate("guide")}>
          Conhecer as responsabilidades
          <ArrowRight size={17} />
        </button>
      </section>
    </>
  );
}
export function Planning({
  state: s,
  onDelivery,
  onConnect,
  onRevise,
  onPublish,
  busy,
  online,
}: PageProps & {
  onRevise: () => void;
  onPublish: () => void;
  busy: boolean;
  online: boolean;
}) {
  const m = metrics(s),
    ready =
      m.shortage === 0 && m.uncovered === 0 && m.pendingSuppliers.length === 0;
  return (
    <>
      <div className="page-intro">
        <div>
          <span
            className={
              "plan-label " +
              (s.plan.status === "published" ? "published" : "draft")
            }
          >
            {s.plan.status === "published" ? (
              <CheckCircle2 size={16} />
            ) : (
              <Clock size={16} />
            )}{" "}
            {s.plan.status === "published"
              ? "Plano publicado"
              : "Revisão em andamento"}{" "}
            · versão {s.plan.version}
          </span>
          <h2>Distribuição para {fullDate(s.cycle.deliveryDate)}</h2>
          <p>
            Confira a capacidade por produtor e a necessidade de cada escola.
            Uma revisão renova os compromissos e exige confirmação dos
            fornecedores envolvidos.
          </p>
        </div>
        <button
          className="button primary"
          disabled={busy || !online || m.executing}
          onClick={onRevise}
        >
          <RefreshCw size={17} />
          Preparar revisão
        </button>
      </div>
      {m.executing && (
        <Notice title="Há entregas em execução">
          O plano foi preservado porque já há saídas ou recebimentos
          registrados. Trate as diferenças no detalhe de cada entrega.
        </Notice>
      )}
      {m.shortage > 0 && (
        <Notice
          tone="warning"
          title={`${kg(m.shortage)} kg acima da capacidade de produtores`}
        >
          {m.issues.map((c) => (
            <p key={c.supplier + c.product}>
              {s.suppliers.find((p) => p.id === c.supplier)!.name} ·{" "}
              {s.products.find((p) => p.id === c.product)!.name}:{" "}
              {kg(c.committed)} kg no plano para {kg(c.qty)} kg de capacidade
              confirmada.
            </p>
          ))}
        </Notice>
      )}
      <section className="panel">
        <PanelTitle
          kicker="Antes de distribuir"
          title="Necessidade e capacidade da rede"
        />
        <ProductBalance state={s} />
        <p className="panel-footnote">
          Uma sobra de outro alimento não compensa falta de cenoura ou banana. O
          planejamento considera cada produto separadamente.
        </p>
      </section>
      <section className="panel">
        <PanelTitle
          kicker="Confirmado pelo aplicativo"
          title="Capacidade por produtor"
        />
        <div className="capacity-rows">
          {s.capacities.map((c) => {
            const supplier = s.suppliers.find((p) => p.id === c.supplier)!,
              committed = sum(
                activeDeliveries(s).filter(
                  (d) => d.supplier === c.supplier && d.product === c.product,
                ),
                (d) => d.qty,
              );
            return (
              <div key={c.supplier + c.product} className="capacity-row">
                <ProductIcon id={c.product} />
                <div>
                  <h3>{supplier.name}</h3>
                  <p>
                    {s.products.find((p) => p.id === c.product)!.name} · limite
                    do cenário: {kg(c.limit)} kg
                  </p>
                </div>
                <dl>
                  <div>
                    <dt>Confirmado</dt>
                    <dd>{kg(c.qty)} kg</dd>
                  </div>
                  <div>
                    <dt>No plano</dt>
                    <dd className={committed > c.qty ? "text-error" : ""}>
                      {kg(committed)} kg
                    </dd>
                  </div>
                </dl>
                <button
                  className="text-button"
                  onClick={() => onConnect(supplier.id)}
                >
                  Abrir acesso
                  <ArrowUpRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
      <section className="panel">
        <PanelTitle
          kicker="Compromissos de fornecimento"
          title="Alimento, origem e destino"
        />
        <DeliveryList
          state={s}
          deliveries={activeDeliveries(s)}
          onOpen={onDelivery}
        />
        {s.plan.status === "draft" && (
          <div className="publish-section">
            <div>
              <h3>Antes de publicar</h3>
              <ul className="validation-list">
                <li className={m.uncovered === 0 ? "valid" : ""}>
                  {m.uncovered === 0 ? (
                    <Check size={17} />
                  ) : (
                    <AlertTriangle size={17} />
                  )}{" "}
                  {m.uncovered === 0
                    ? "Toda a demanda está distribuída"
                    : `${kg(m.uncovered)} kg de demanda sem distribuição`}
                </li>
                <li className={m.shortage === 0 ? "valid" : ""}>
                  {m.shortage === 0 ? (
                    <Check size={17} />
                  ) : (
                    <AlertTriangle size={17} />
                  )}{" "}
                  {m.shortage === 0
                    ? "Limites dos produtores respeitados"
                    : `${kg(m.shortage)} kg acima da capacidade confirmada`}
                </li>
                <li className={m.pendingSuppliers.length === 0 ? "valid" : ""}>
                  {m.pendingSuppliers.length === 0 ? (
                    <Check size={17} />
                  ) : (
                    <Clock size={17} />
                  )}{" "}
                  {m.pendingSuppliers.length === 0
                    ? "Todos os produtores confirmaram"
                    : `Aguardando ${m.pendingSuppliers.map((p) => p.short).join(" e ")}`}
                </li>
              </ul>
            </div>
            <div className="publish-action">
              <button
                className="button primary"
                disabled={busy || !online || !ready}
                onClick={onPublish}
              >
                {busy ? "Publicando…" : "Publicar plano"}
                <ArrowRight size={18} />
              </button>
              <p>
                {ready
                  ? "As agendas das escolas serão atualizadas após a publicação."
                  : "Complete as verificações ao lado para liberar a publicação."}
              </p>
            </div>
          </div>
        )}
      </section>
      <details className="help-details">
        <summary>O que acontece quando uma quantidade muda?</summary>
        <p>
          Atualizar capacidade não altera compromissos já publicados. A
          coordenação prepara uma revisão, verifica a distribuição e pede novas
          confirmações. Se já houver entregas em execução, o sistema preserva o
          plano e permite registrar encaminhamentos para as divergências.
        </p>
      </details>
    </>
  );
}
export function Deliveries(props: PageProps) {
  const { state: s, onDelivery } = props,
    [search, setSearch] = useState(""),
    [food, setFood] = useState("all"),
    [status, setStatus] = useState("all");
  const all = activeDeliveries(s),
    match = (d: Delivery, key: string) =>
      key === "all" ||
      (key === "divergent" && isDivergent(d)) ||
      d.status === key;
  const filtered = all.filter(
    (d) =>
      match(d, status) &&
      (food === "all" || d.product === food) &&
      `${s.schools.find((x) => x.id === d.school)!.name} ${s.suppliers.find((x) => x.id === d.supplier)!.name} ${s.products.find((x) => x.id === d.product)!.name}`
        .toLocaleLowerCase("pt-BR")
        .includes(search.toLocaleLowerCase("pt-BR")),
  );
  return (
    <>
      <div className="filter-toolbar">
        <label className="search-field">
          <Search size={19} />
          <span className="sr-only">Buscar escola, produtor ou alimento</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar escola, produtor ou alimento"
            type="search"
          />
        </label>
        <label className="filter-select">
          Alimento
          <select value={food} onChange={(e) => setFood(e.target.value)}>
            <option value="all">Todos</option>
            {s.products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="status-filters" aria-label="Filtrar situação">
        {[
          ["all", "Todas"],
          ["scheduled", "Agendadas"],
          ["dispatched", "A caminho"],
          ["received", "Conferidas"],
          ["divergent", "Com divergência"],
        ].map(([key, label]) => (
          <button
            key={key}
            aria-pressed={status === key}
            onClick={() => setStatus(key)}
          >
            {label}
            <span>{all.filter((d) => match(d, key)).length}</span>
          </button>
        ))}
      </div>
      <div className="results-heading">
        <p role="status">
          {filtered.length} de {all.length} entregas
          {search ? " · busca por “" + search + "”" : ""}
        </p>
        {(search || food !== "all" || status !== "all") && (
          <button
            className="text-button"
            onClick={() => {
              setSearch("");
              setFood("all");
              setStatus("all");
            }}
          >
            Limpar filtros
          </button>
        )}
      </div>
      <section className="panel">
        <DeliveryList state={s} deliveries={filtered} onOpen={onDelivery} />
      </section>
      <div className="status-explainer">
        <h2>Como ler a situação da entrega</h2>
        <dl>
          <div>
            <dt>
              <Clock size={17} />
              Agendada
            </dt>
            <dd>Está no plano e aguarda a saída registrada pelo produtor.</dd>
          </div>
          <div>
            <dt>
              <Truck size={17} />A caminho
            </dt>
            <dd>
              O produtor confirmou a saída. A escola ainda precisa conferir.
            </dd>
          </div>
          <div>
            <dt>
              <CheckCircle2 size={17} />
              Conferida
            </dt>
            <dd>A escola registrou recebido, aceito e eventual rejeição.</dd>
          </div>
        </dl>
        <p>
          Uma entrega conferida pode ter divergência. Abra o detalhe para ver
          quantidades, observação e encaminhamento.
        </p>
      </div>
    </>
  );
}
export function Schools({ state: s, onSchool, onConnect }: PageProps) {
  return (
    <>
      <div className="section-summary">
        <School size={24} />
        <p>
          <strong>
            {s.schools.length} escolas · {sum(s.schools, (x) => x.students)}{" "}
            estudantes no cenário.
          </strong>{" "}
          Os registros são fictícios. As necessidades deste ciclo foram
          definidas para demonstrar a distribuição; o sistema não calcula
          cardápios ou recomendações nutricionais.
        </p>
      </div>
      <div className="schools-grid">
        {s.schools.map((x, i) => {
          const m = schoolMetrics(s, x.id);
          return (
            <article className={"school-record record-" + i} key={x.id}>
              <div className="school-record-heading">
                <span className="school-avatar">{x.initials}</span>
                <span>{x.students} estudantes</span>
              </div>
              <h2>{x.name}</h2>
              <p>
                Recebimentos de {dateLabel(s.cycle.deliveryDate)} · {m.received}{" "}
                de {m.count} conferidos
              </p>
              <div className="school-total">
                <strong>
                  {kg(m.accepted)}
                  <small> / {kg(m.demand)} kg</small>
                </strong>
                <span>aceitos da necessidade do ciclo</span>
              </div>
              <Progress
                value={m.coverage}
                label={`Necessidade atendida de ${x.short}`}
              />
              <dl className="school-foods">
                {s.demands
                  .filter((d) => d.school === x.id)
                  .map((d) => (
                    <div key={d.product}>
                      <dt>
                        {s.products.find((p) => p.id === d.product)!.name}
                      </dt>
                      <dd>{kg(d.qty)} kg necessários</dd>
                    </div>
                  ))}
              </dl>
              <div className="record-actions">
                <button className="text-button" onClick={() => onSchool(x.id)}>
                  Ver recebimentos
                  <ArrowRight size={17} />
                </button>
                <button
                  className="icon-button"
                  onClick={() => onConnect(x.id)}
                  aria-label={`Conectar aplicativo da ${x.name}`}
                >
                  <Smartphone size={20} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <Notice title="Quem confere os alimentos?">
        A equipe responsável pelo recebimento em cada escola usa seu próprio
        acesso ao app. Ela registra as quantidades e as observações. Critérios
        sanitários e decisões de aceitação continuam com os profissionais
        responsáveis.
      </Notice>
    </>
  );
}
export function Suppliers({ state: s, onConnect }: PageProps) {
  return (
    <>
      <div className="section-summary">
        <Users size={24} />
        <p>
          <strong>Capacidade e compromisso são informações diferentes.</strong>{" "}
          O produtor informa quanto consegue fornecer no ciclo. A quantidade
          combinada com cada escola aparece no plano, depois da distribuição e
          das confirmações.
        </p>
      </div>
      <div className="supplier-records">
        {s.suppliers.map((p, i) => {
          const deliveries = activeDeliveries(s).filter(
              (d) => d.supplier === p.id,
            ),
            confirmed = s.plan.accepts[p.id] === s.plan.version;
          return (
            <article className={"supplier-record supplier-" + i} key={p.id}>
              <div className="supplier-identity">
                <span className="supplier-avatar">{p.initials}</span>
                <div>
                  <span className="record-context">{p.town}</span>
                  <h2>{p.name}</h2>
                  <p>{p.person} · representante fictício</p>
                </div>
                <span
                  className={
                    "plan-label " + (confirmed ? "published" : "draft")
                  }
                >
                  {confirmed ? <Check size={15} /> : <Clock size={15} />}{" "}
                  {confirmed
                    ? "Versão " + s.plan.version + " confirmada"
                    : "Confirmação pendente"}
                </span>
              </div>
              <div className="supplier-capacities">
                {s.capacities
                  .filter((c) => c.supplier === p.id)
                  .map((c) => (
                    <div key={c.product}>
                      <ProductIcon id={c.product} />
                      <span>
                        {s.products.find((x) => x.id === c.product)!.name}
                      </span>
                      <strong>{kg(c.qty)} kg</strong>
                      <small>de capacidade confirmada</small>
                    </div>
                  ))}
              </div>
              <div className="supplier-bottom">
                <p>
                  <strong>
                    {deliveries.length} entregas ·{" "}
                    {kg(sum(deliveries, (d) => d.qty))} kg no plano
                  </strong>
                  <span>
                    {deliveries.filter((d) => d.receipt).length} conferidas
                    pelas escolas
                  </span>
                </p>
                <button
                  className="button secondary"
                  onClick={() => onConnect(p.id)}
                >
                  <Smartphone size={17} />
                  Abrir acesso do produtor
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <section className="plain-section">
        <h2>Quando a produção muda</h2>
        <p>
          O produtor deve atualizar sua capacidade no app. A coordenação
          identifica o efeito sobre as escolas e verifica se é necessário
          revisar os compromissos. O sistema não seleciona fornecedores,
          substitui chamadas públicas ou firma contratos de compra.
        </p>
      </section>
    </>
  );
}
export function Reports({ state: s, onDelivery }: PageProps) {
  const m = metrics(s);
  const parts = [
    { label: "Aceito", value: m.accepted, cls: "accepted" },
    { label: "Rejeitado", value: m.rejected, cls: "rejected" },
    {
      label: "Faltante em entregas conferidas",
      value: m.missing,
      cls: "missing",
    },
    { label: "Aguardando conferência", value: m.waiting, cls: "waiting" },
  ];
  return (
    <>
      <section className="report-summary">
        <div>
          <span className="record-context">
            Resultado do ciclo · versão {s.plan.version}
          </span>
          <h2>{kg(m.accepted)} kg aceitos pelas escolas</h2>
          <p>
            {m.coverage}% da necessidade de {kg(m.demand)} kg. {m.receivedCount}{" "}
            de {m.total} entregas foram conferidas. As quantidades sem
            recebimento registrado continuam pendentes.
          </p>
        </div>
        <button className="button primary" onClick={() => downloadCsv(s)}>
          <Download size={18} />
          Baixar relatório CSV
        </button>
      </section>
      <section className="panel result-panel">
        <PanelTitle title="Destino das quantidades previstas" />
        <div className="result-track" aria-hidden="true">
          {parts
            .filter((p) => p.value > 0)
            .map((p) => (
              <span
                key={p.cls}
                className={p.cls}
                style={{
                  width: (m.planned ? (p.value / m.planned) * 100 : 0) + "%",
                }}
              />
            ))}
        </div>
        <dl className="result-legend">
          {parts.map((p) => (
            <div key={p.cls}>
              <dt>
                <i className={p.cls} />
                {p.label}
              </dt>
              <dd>
                {kg(p.value)} <small>kg</small>
              </dd>
            </div>
          ))}
        </dl>
        <p className="panel-footnote">
          A soma descreve os {kg(m.planned)} kg do plano. A falta em uma entrega
          conferida é a diferença entre o previsto e o recebido; rejeição é uma
          parcela do que efetivamente chegou.
        </p>
      </section>
      <section className="panel">
        <PanelTitle kicker="Por escola" title="Necessidade e conferência" />
        <div
          className="table-region"
          role="region"
          aria-label="Resultado por escola"
          tabIndex={0}
        >
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Escola</th>
                <th scope="col">Necessário</th>
                <th scope="col">Aceito</th>
                <th scope="col">Rejeitado</th>
                <th scope="col">Faltante*</th>
                <th scope="col">Conferidas</th>
              </tr>
            </thead>
            <tbody>
              {s.schools.map((x) => {
                const r = schoolMetrics(s, x.id);
                return (
                  <tr key={x.id}>
                    <th scope="row">{x.short}</th>
                    <td>{kg(r.demand)} kg</td>
                    <td>{kg(r.accepted)} kg</td>
                    <td>{kg(r.rejected)} kg</td>
                    <td>{kg(r.missing)} kg</td>
                    <td>
                      {r.received} / {r.count}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="panel-footnote">
          *Somente em entregas já conferidas. No CSV, campos de recebimento
          ficam vazios quando a entrega ainda não foi conferida.
        </p>
      </section>
      {m.unresolved.length > 0 && (
        <section className="panel">
          <PanelTitle title="Divergências sem encaminhamento" />
          <div className="action-list">
            {m.unresolved.map((d) => (
              <div className="action-row divergence" key={d.id}>
                <AlertTriangle size={20} />
                <div>
                  <h3>
                    {s.schools.find((x) => x.id === d.school)!.short} ·{" "}
                    {s.products.find((x) => x.id === d.product)!.name}
                  </h3>
                  <p>
                    {d.receipt!.note ||
                      "Diferença entre a quantidade prevista e a recebida."}
                  </p>
                </div>
                <button
                  className="text-button"
                  onClick={() => onDelivery(d.id)}
                >
                  Registrar encaminhamento
                  <ArrowRight size={17} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="panel">
        <PanelTitle
          kicker="Histórico de registros"
          title="O que mudou neste ambiente"
        />
        <ol className="event-list">
          {s.events.map((e) => (
            <li key={e.id}>
              <span className="event-marker" aria-hidden="true" />
              <div>
                <h3>{e.title}</h3>
                <p>{e.detail}</p>
                <span className="event-meta">
                  {e.actor} · {new Date(e.at).toLocaleDateString("pt-BR")} às{" "}
                  {timeLabel(e.at)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
