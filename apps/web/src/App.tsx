import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import {
  LayoutDashboard,
  CalendarDays,
  Truck,
  School,
  Users,
  ChartNoAxesCombined,
  BookOpen,
  Smartphone,
  ArrowRight,
  Pause,
  Play,
  Bell,
  Menu,
  RefreshCw,
  WifiOff,
  Info,
  X,
} from "lucide-react";
import type { Session, Snapshot, View } from "./types";
import { dateLabel, normalizeView, timeLabel, viewNames } from "./model";
import { Brand, Dialog } from "./components/ui";
import {
  WorkspaceDialogs,
  type DialogKind,
} from "./components/WorkspaceDialogs";
import {
  Overview,
  Planning,
  Deliveries,
  Schools,
  Suppliers,
  Reports,
} from "./pages/WorkspacePages";
import { Guide } from "./pages/Guide";
const KEY = "abastece-coordinator-session-v1";
const navigation = [
  ["overview", "Visão geral", LayoutDashboard],
  ["plan", "Planejamento", CalendarDays],
  ["deliveries", "Entregas", Truck],
  ["schools", "Escolas", School],
  ["suppliers", "Produtores", Users],
  ["reports", "Relatório do ciclo", ChartNoAxesCombined],
] as const;
const descriptions: Record<View, string> = {
  overview: "Necessidades, compromissos e recebimentos da rede em um só lugar.",
  plan: "Compare o que as escolas precisam com o que cada produtor pode fornecer.",
  deliveries:
    "Acompanhe a saída, a conferência e as diferenças registradas em cada entrega.",
  schools: "Consulte a necessidade e os recebimentos de cada unidade escolar.",
  suppliers:
    "Confira capacidades, compromissos e confirmações dos fornecedores.",
  reports:
    "Veja as quantidades conferidas, investigue diferenças e exporte os registros.",
  guide:
    "Entenda o problema, os papéis de cada participante e como testar a solução.",
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null),
    [snap, setSnap] = useState<Snapshot | null>(null);
  const [view, setView] = useState<View>(() =>
    normalizeView(new URLSearchParams(location.search).get("view")),
  );
  const [busy, setBusy] = useState(false),
    [online, setOnline] = useState(true),
    [error, setError] = useState(""),
    [toast, setToast] = useState(""),
    [updated, setUpdated] = useState("");
  const [dialog, setDialog] = useState<DialogKind>(null),
    [selectedId, setSelectedId] = useState(""),
    [inviteId, setInviteId] = useState(""),
    [mobileNav, setMobileNav] = useState(false),
    [paused, setPaused] = useState(false);
  const reduced = useReducedMotion(),
    sessionRef = useRef<Session | null>(null),
    snapshotRef = useRef<Snapshot | null>(null),
    heading = useRef<HTMLHeadingElement>(null),
    hasNavigated = useRef(false);
  sessionRef.current = session;
  snapshotRef.current = snap;
  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const incoming = new URLSearchParams(location.hash.slice(1));
        let restored: Session | null = null;
        if (incoming.get("access")) {
          restored = {
            room: new URLSearchParams(location.search).get("room") || "",
            token: incoming.get("access")!,
          };
          history.replaceState({}, "", location.pathname + "?view=" + view);
        } else {
          try {
            restored = JSON.parse(localStorage.getItem(KEY) || "null");
          } catch {}
        }
        if (!restored?.room || !restored?.token) {
          const response = await fetch("/api/create", { method: "POST" });
          if (!response.ok)
            throw Error(
              "Não foi possível criar o ambiente. Verifique a conexão e tente novamente.",
            );
          restored = await response.json();
        }
        if (active && restored) {
          try {
            localStorage.setItem(KEY, JSON.stringify(restored));
          } catch {}
          setSession(restored);
        }
      } catch (e) {
        if (active)
          setError(
            e instanceof Error
              ? e.message
              : "Não foi possível abrir o ambiente.",
          );
      }
    };
    init();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const onBack = () => {
      hasNavigated.current = true;
      setView(normalizeView(new URLSearchParams(location.search).get("view")));
      setDialog(null);
      setMobileNav(false);
    };
    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, []);
  useEffect(() => {
    document.title = viewNames[view] + " · Abastece Escola";
    if (hasNavigated.current && snap)
      heading.current?.focus({ preventScroll: true });
  }, [view, !!snap]);
  async function refresh(access: Session | null = sessionRef.current) {
    if (!access) return;
    try {
      const response = await fetch(
        "/api/snapshot?room=" + encodeURIComponent(access.room),
        { headers: { authorization: "Bearer " + access.token } },
      );
      const body = await response.json();
      if (!response.ok)
        throw Error(body.error || "Não foi possível consultar os dados.");
      if (sessionRef.current?.token !== access.token) return;
      if (body.actor.role !== "coordinator") {
        location.replace(
          "/app/?room=" + access.room + "#access=" + access.token,
        );
        return;
      }
      setSnap((current) =>
        !current || body.revision >= current.revision ? body : current,
      );
      setOnline(true);
      setUpdated(new Date().toISOString());
    } catch (e) {
      if (sessionRef.current?.token === access.token) {
        setOnline(false);
        if (!snapshotRef.current)
          setError(
            e instanceof Error
              ? e.message
              : "O serviço de dados não respondeu.",
          );
      }
    }
  }
  useEffect(() => {
    if (!session) return;
    refresh(session);
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") refresh(session);
    }, 1800);
    const onFocus = () => refresh(session);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [session]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 6500);
    return () => clearTimeout(timeout);
  }, [toast]);
  function navigate(next: View) {
    if (next !== view) {
      history.pushState({}, "", "/coordenacao?view=" + next);
      hasNavigated.current = true;
      setView(next);
    }
    setMobileNav(false);
    setDialog(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function open(kind: DialogKind, id = "") {
    setError("");
    setSelectedId(id);
    setDialog(kind);
    setMobileNav(false);
  }
  function connect(id?: string) {
    setInviteId(
      id || session?.invites?.find((x) => x.role === "supplier")?.id || "",
    );
    open("connect");
  }
  async function command(type: string, payload: Record<string, unknown> = {}) {
    if (!session || !snap || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + session.token,
        },
        body: JSON.stringify({
          room: session.room,
          revision: snap.revision,
          operationId: crypto.randomUUID(),
          type,
          payload,
        }),
      });
      const body = await response.json();
      if (!response.ok)
        throw Error(body.error || "A alteração não foi concluída.");
      setSnap((current) =>
        !current || body.revision >= current.revision ? body : current,
      );
      setUpdated(new Date().toISOString());
      setOnline(true);
      setDialog(null);
      setToast(
        type === "publish"
          ? "Plano publicado. As agendas das escolas foram atualizadas."
          : type === "propose"
            ? "Revisão preparada. Os produtores precisam confirmar a nova versão no app."
            : type === "resolve"
              ? "Encaminhamento registrado no recebimento."
              : "Distribuição ajustada. Os produtores precisam confirmar a nova versão.",
      );
    } catch (e) {
      await refresh();
      setError(
        e instanceof Error ? e.message : "Não foi possível salvar a alteração.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function createDemo() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/create", { method: "POST" });
      if (!response.ok)
        throw Error("Não foi possível criar a demonstração. Tente novamente.");
      const access: Session = await response.json();
      try {
        localStorage.setItem(KEY, JSON.stringify(access));
      } catch {}
      setSnap(null);
      setSession(access);
      setDialog(null);
      setToast("Nova demonstração criada. O ambiente anterior foi preservado.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível criar o ambiente.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (!snap || !session)
    return (
      <div className="loading-page">
        <Brand />
        <main>
          <span className="eyebrow">Coordenação do abastecimento escolar</span>
          <h1>
            {error
              ? "Não foi possível abrir o ambiente"
              : "Carregando o abastecimento…"}
          </h1>
          <p>
            {error ||
              "Consultando as necessidades das escolas e os registros deste ciclo."}
          </p>
          {error && (
            <div className="loading-actions">
              <button
                className="button primary"
                onClick={() => {
                  setError("");
                  session ? refresh() : location.reload();
                }}
              >
                Tentar novamente
              </button>
              <button
                className="button secondary"
                disabled={busy}
                onClick={createDemo}
              >
                Criar nova demonstração
              </button>
            </div>
          )}
        </main>
        <p className="loading-disclaimer">
          Projeto acadêmico · escolas e dados fictícios
        </p>
      </div>
    );
  const s = snap.state;
  const props = {
    state: s,
    onNavigate: navigate,
    onDelivery: (id: string) => open("delivery", id),
    onSchool: (id: string) => open("school", id),
    onConnect: connect,
  };
  function nav() {
    return (
      <>
        <a
          className="brand-link"
          href="/coordenacao?view=overview"
          onClick={(e) => {
            e.preventDefault();
            navigate("overview");
          }}
          aria-label="Abastece Escola — visão geral"
        >
          <Brand />
        </a>
        <div className="workspace-name">
          <span className="workspace-symbol">
            <School size={21} />
          </span>
          <div>
            <strong>{s.name}</strong>
            <span>Coordenação escolar</span>
          </div>
        </div>
        <nav className="workspace-navigation" aria-label="Navegação principal">
          {navigation.map(([id, label, Icon]) => (
            <a
              key={id}
              href={"/coordenacao?view=" + id}
              aria-current={view === id ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigate(id);
              }}
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>
        <div className="sidebar-utilities">
          <button
            className={
              view === "guide" ? "utility-link current" : "utility-link"
            }
            onClick={() => navigate("guide")}
          >
            <BookOpen size={19} />
            Como usar este ambiente
          </button>
          <div className="app-access">
            <Smartphone size={25} />
            <h2>Produtores e escolas no aplicativo</h2>
            <p>
              Abra um convite para acompanhar os mesmos registros em outro
              dispositivo.
            </p>
            <button onClick={() => connect()}>
              Conectar aplicativo
              <ArrowRight size={16} />
            </button>
          </div>
          <button className="account-access" onClick={() => open("workspace")}>
            <span>CO</span>
            <div>
              <strong>Coordenação</strong>
              <small>Gerenciar demonstração</small>
            </div>
          </button>
        </div>
      </>
    );
  }
  return (
    <MotionConfig reducedMotion="user">
      <div
        className={"app-layout " + (paused || reduced ? "motion-paused" : "")}
      >
        <a className="skip-link" href="#main">
          Ir para o conteúdo
        </a>
        <aside className="sidebar">{nav()}</aside>
        <div className="main-layout">
          <header className="topbar">
            <div className="topbar-context">
              <button
                className="icon-button mobile-menu"
                aria-label="Abrir menu de navegação"
                onClick={() => setMobileNav(true)}
              >
                <Menu size={22} />
              </button>
              <span className="topbar-title">{s.name}</span>
              <span className="topbar-divider">/</span>
              <span className="topbar-section">
                {view === "guide" ? "Guia do projeto" : viewNames[view]}
              </span>
            </div>
            <div className="topbar-actions">
              <span className={"sync-label " + (!online ? "offline" : "")}>
                <i />
                {online ? "Dados atualizados" : "Sem conexão"}
              </span>
              <button
                className="icon-button refresh-button"
                aria-label="Atualizar dados"
                onClick={() => refresh()}
                title={
                  updated
                    ? "Última consulta às " + timeLabel(updated)
                    : "Atualizar dados"
                }
              >
                <RefreshCw size={18} />
              </button>
              <button
                className="icon-button motion-button"
                onClick={() => setPaused(!paused)}
                aria-label={
                  paused
                    ? "Ativar animações ambiente"
                    : "Pausar animações ambiente"
                }
                aria-pressed={paused}
              >
                {paused ? <Play size={18} /> : <Pause size={18} />}
              </button>
              <button
                className="icon-button"
                aria-label="Ver atualizações do ambiente"
                onClick={() => open("updates")}
              >
                <Bell size={19} />
              </button>
            </div>
          </header>
          <div className="demo-banner">
            <Info size={15} />
            <span>
              Demonstração acadêmica. Escolas, produtores e quantidades são
              fictícios.
            </span>
            <button onClick={() => navigate("guide")}>
              Entender o cenário
              <ArrowRight size={14} />
            </button>
          </div>
          <main id="main" className="page-content" tabIndex={-1}>
            <div className="page-heading">
              <div>
                <h1 ref={heading} tabIndex={-1}>
                  {viewNames[view]}
                </h1>
                <p>{descriptions[view]}</p>
              </div>
              <button className="period-button" onClick={() => open("cycle")}>
                <CalendarDays size={18} />
                <span>
                  {dateLabel(s.cycle.start)} — {dateLabel(s.cycle.end)}, 2026
                </span>
                <Info size={15} />
              </button>
            </div>
            {!online && (
              <div className="connection-notice" role="status">
                <WifiOff size={20} />
                <span>
                  Sem conexão com o serviço. Você está vendo a última consulta.
                  As alterações precisam de conexão.
                </span>
                <button onClick={() => refresh()} className="text-button">
                  Tentar atualizar
                </button>
              </div>
            )}
            {error && !dialog && (
              <div className="form-error page-error" role="alert">
                <span>{error}</span>
                <button
                  className="icon-button"
                  aria-label="Dispensar erro"
                  onClick={() => setError("")}
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                className="page-sections"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.12 }}
              >
                {view === "overview" && <Overview {...props} />}{" "}
                {view === "plan" && (
                  <Planning
                    {...props}
                    onRevise={() => open("revise")}
                    onPublish={() => command("publish")}
                    busy={busy}
                    online={online}
                  />
                )}{" "}
                {view === "deliveries" && <Deliveries {...props} />}{" "}
                {view === "schools" && <Schools {...props} />}{" "}
                {view === "suppliers" && <Suppliers {...props} />}{" "}
                {view === "reports" && <Reports {...props} />}{" "}
                {view === "guide" && <Guide {...props} />}
              </motion.div>
            </AnimatePresence>
            <footer className="page-footer">
              <div>
                <Brand />
                <p>Planejamento e conferência do abastecimento escolar.</p>
              </div>
              <div>
                <a href="/" className="workspace-site-link">
                  Site do projeto ↗
                </a>
                <button onClick={() => navigate("guide")}>Como usar</button>
                <button onClick={() => connect()}>Acessar aplicativo</button>
                <span>Projeto acadêmico · {s.name}</span>
              </div>
            </footer>
          </main>
        </div>
        {mobileNav && (
          <Dialog
            title="Navegação"
            className="navigation-dialog"
            onClose={() => setMobileNav(false)}
          >
            <div className="mobile-navigation-content">{nav()}</div>
          </Dialog>
        )}
        {dialog && (
          <WorkspaceDialogs
            key={dialog + selectedId}
            kind={dialog}
            state={s}
            session={session}
            selectedId={selectedId}
            inviteId={inviteId}
            onInvite={setInviteId}
            onClose={() => {
              setDialog(null);
              setError("");
            }}
            onCommand={command}
            onNewDemo={createDemo}
            onConnect={connect}
            busy={busy}
            online={online}
            error={error}
            onFeedback={setToast}
          />
        )}{" "}
        {toast && (
          <div className="toast" role="status">
            <span>{toast}</span>
            <button
              className="icon-button"
              aria-label="Fechar confirmação"
              onClick={() => setToast("")}
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
