import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  School,
  Smartphone,
  Monitor,
  Check,
  Menu,
  Package,
  Pause,
  Play,
  ExternalLink,
  Truck,
  Sun,
  ClipboardCheck,
} from "lucide-react";
import { MotionConfig, useReducedMotion } from "motion/react";
import type { Session, Role } from "../types";
import { Brand, Dialog } from "../components/ui";
import { useSiteMotion } from "../hooks/useSiteMotion";
import { BotanicalAccent } from "../components/BotanicalAccent";
import { HarvestScene } from "../components/HarvestScene";
import { CapacityStory, JourneyStory } from "../components/VisualStory";
const FNDE =
  "https://www.gov.br/fnde/pt-br/acesso-a-informacao/acoes-e-programas/programas/pnae/agricultura-familiar-no-pnae";
const ARTICLE =
  "https://periodicos.ufnt.edu.br/index.php/campo/article/view/14676";
const roles = [
  {
    id: "coordinator",
    label: "Coordenação",
    caption: "Monte o plano e acompanhe a rede.",
    Icon: Monitor,
  },
  {
    id: "supplier",
    label: "Produtor",
    caption: "Confirme capacidade e saídas no app.",
    Icon: Leaf,
  },
  {
    id: "school",
    label: "Escola",
    caption: "Confira e registre os recebimentos.",
    Icon: School,
  },
] as const;
const faqs = [
  [
    "O que é o Abastece Escola?",
    "É uma proposta de coordenação do abastecimento escolar. Produtores informam capacidade, a coordenação organiza as entregas e as escolas conferem o recebimento. O aplicativo e a plataforma web compartilham os registros do mesmo ambiente.",
  ],
  [
    "O projeto já atende escolas reais?",
    "Ainda não. Esta é uma demonstração acadêmica funcional, com escolas, produtores e quantidades fictícios. As jornadas precisam ser validadas com participantes reais antes de um uso institucional.",
  ],
  [
    "Por que existem um site e um aplicativo?",
    "O aplicativo acompanha tarefas de campo e recebimento. A plataforma web permite comparar necessidades de várias escolas, revisar compromissos e consultar os resultados da rede. Cada plataforma atende uma etapa da mesma jornada.",
  ],
  [
    "O que acontece sem internet?",
    "No aplicativo, uma conferência pode ficar salva como pendente no aparelho. Ela só aparece para a coordenação depois de enviada. Capacidade, aceite do plano e saída precisam de conexão.",
  ],
  [
    "O sistema decide compras ou a qualidade dos alimentos?",
    "Essas decisões continuam com os responsáveis. A proposta registra compromissos e conferências; não substitui chamadas públicas, contratos, cardápios ou a avaliação sanitária.",
  ],
];
export function PublicSite() {
  const [paused, setPaused] = useState(false),
    [menu, setMenu] = useState(false),
    [busy, setBusy] = useState<Role | null>(null),
    [error, setError] = useState("");
  const reduced = useReducedMotion();
  const siteRoot = useRef<HTMLDivElement>(null);
  useSiteMotion(siteRoot, paused);
  useEffect(() => {
    document.title = "Abastece Escola · do campo à alimentação escolar";
  }, []);
  async function start(role: Role) {
    if (role === "coordinator") {
      location.assign("/coordenacao?view=overview");
      return;
    }
    if (busy) return;
    setBusy(role);
    setError("");
    try {
      let access: Session | null = null;
      try {
        access = JSON.parse(
          localStorage.getItem("abastece-coordinator-session-v1") || "null",
        );
      } catch {}
      if (!access?.invites) {
        const response = await fetch("/api/create", { method: "POST" });
        if (!response.ok)
          throw Error(
            "Não foi possível abrir a demonstração. Tente novamente.",
          );
        access = await response.json();
        try {
          localStorage.setItem(
            "abastece-coordinator-session-v1",
            JSON.stringify(access),
          );
        } catch {}
      }
      const actor = access!.invites!.find((x) => x.role === role);
      if (!actor)
        throw Error(
          "Acesso não encontrado neste ambiente. Abra a coordenação para criar os convites.",
        );
      location.assign("/app/?room=" + access!.room + "#access=" + actor.token);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível abrir o aplicativo.",
      );
      setBusy(null);
    }
  }
  const closeMenu = () => setMenu(false);
  function siteNav() {
    return (
      <>
        <a href="#problema" onClick={closeMenu}>
          O problema
        </a>
        <a href="#solucao" onClick={closeMenu}>
          A solução
        </a>
        <a href="#como-funciona" onClick={closeMenu}>
          Como funciona
        </a>
        <a href="#para-quem" onClick={closeMenu}>
          Para quem
        </a>
      </>
    );
  }
  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={siteRoot}
        className={"public-site " + (paused || reduced ? "motion-paused" : "")}
      >
        <a className="skip-link" href="#site-main">
          Ir para o conteúdo
        </a>
        <header className="site-header">
          <a href="/" aria-label="Abastece Escola — início">
            <Brand />
          </a>
          <nav aria-label="Seções do site">{siteNav()}</nav>
          <a className="coordination-button" href="/coordenacao?view=overview">
            <Monitor size={18} />
            <span>Área da coordenação</span>
            <ArrowUpRight size={16} />
          </a>
          <div className="site-header-actions">
            <button
              className="site-motion"
              aria-label={paused ? "Ativar movimento" : "Pausar movimento"}
              aria-pressed={paused}
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play size={17} /> : <Pause size={17} />}
            </button>
            <button
              className="site-menu-button"
              aria-label="Abrir menu do site"
              onClick={() => setMenu(true)}
            >
              <Menu size={23} />
            </button>
          </div>
        </header>
        <main id="site-main">
          <section className="site-hero site-container">
            <div className="hero-garden" aria-hidden="true">
              <svg className="garden-contours" viewBox="0 0 1440 640" preserveAspectRatio="none" fill="none">
                <path d="M760 640C780 420 1150 530 1440 280V640Z" fill="#E1EFDF" />
                <path d="M0 580C240 470 410 640 690 600S1140 425 1440 490V640H0Z" fill="#EDF5E7" />
                <g stroke="#B6D1B5" strokeWidth="1.2">
                  <path d="M810 640C900 500 1210 560 1440 350M860 640C940 530 1220 590 1440 390M930 640C1050 560 1270 595 1440 430" />
                  <path d="M0 601C180 522 300 600 440 622M0 622C140 559 260 611 330 640" />
                </g>
              </svg>
            </div>
            <div className="site-hero-copy">
              <h1 aria-label="A merenda começa antes do prato.">
                <span className="hero-line">A merenda </span>
                <span className="hero-line">
                  começa <em>antes</em>{" "}
                </span>
                <span className="hero-line">do prato.</span>
              </h1>
              <p>
                O Abastece Escola conecta produtores da agricultura familiar,
                coordenação e equipes escolares. Capacidade, entregas e
                recebimentos no mesmo plano.
              </p>
              <div className="site-hero-actions">
                <a className="site-button dark" href="#como-funciona">
                  Conheça o caminho
                  <ArrowRight size={19} />
                </a>
                <a href="#experimentar" className="site-text-link">
                  Experimentar a solução
                  <ArrowUpRight size={17} />
                </a>
              </div>
              <span className="site-academic-note">
                Conheça o protótipo com dados de exemplo.
              </span>
            </div>
            <div className="site-hero-visual">
              <div className="harvest-stamp">
                <Leaf size={20} />
                <span>
                  Quem planta.
                  <br />{" "}
                  Quem recebe.
                </span>
              </div>
              <div className="hero-postcard">
                <div className="postcard-top">
                  <span>Do campo ao refeitório</span>
                  <Sun size={21} />
                </div>
                <HarvestScene />
                <div className="postcard-bottom">
                  <span>
                    <Leaf size={15} />
                    Produzir
                  </span>
                  <ArrowRight size={16} />
                  <span>
                    <Monitor size={15} />
                    Planejar
                  </span>
                  <ArrowRight size={16} />
                  <span>
                    <School size={15} />
                    Receber
                  </span>
                </div>
              </div>
              <div className="hero-message">
                <span className="message-check">
                  <Check size={18} />
                </span>
                <div>
                  <strong>A quantidade mudou?</strong>
                  <span>A informação chega a quem planeja.</span>
                </div>
              </div>
              <div className="hero-proof-note">
                Um aplicativo. Uma plataforma web.
                <br />{" "}
                <strong>Os mesmos registros.</strong>
              </div>
            </div>
          </section>
          <div className="site-principles">
            <span>
              <Leaf size={23} />
              Agricultura familiar
            </span>
            <span>
              <Package size={23} />
              Compromissos visíveis
            </span>
            <span>
              <School size={23} />
              Conferência nas escolas
            </span>
          </div>
          <section id="problema" className="site-problem site-container">
            <div className="problem-intro">
            <div className="site-section-title">
              <h2>A colheita muda. <span className="heading-continuation">A necessidade da escola continua.</span></h2>
              <p>
                Uma quantidade menor afeta mais de uma entrega. Sem uma
                informação compartilhada, a diferença pode aparecer só na porta
                da escola.
              </p>
            </div>
            <BotanicalAccent className="problem-garden" />
            </div>
            <div className="problem-layout">
              <div className="problem-story">
                <div className="problem-note">
                  <span>Um exemplo simples de uma decisão complexa</span>
                  <h3>
                    Faltam 10 kg.
                    <br />{" "}
                    Quem precisa saber?
                  </h3>
                  <p>
                    O produtor, a coordenação e as escolas envolvidas. Mova a
                    capacidade ao lado e veja como uma mudança se espalha pela
                    distribuição.
                  </p>
                  <a href="#solucao" className="site-text-link">
                    É aqui que a solução entra
                    <ArrowRight size={18} />
                  </a>
                </div>
                <div className="research-footnote">
                  <span>O problema foi estudado.</span>
                  <p>
                    Oficinas com atores do PNAE de 15 municípios do Marajó
                    apontaram dificuldades de articulação e infraestrutura.
                  </p>
                  <a href={ARTICLE} target="_blank" rel="noreferrer">
                    Ler o estudo · contexto regional de 2018
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <CapacityStory />
            </div>
          </section>
          <section className="policy-section">
            <div className="site-container policy-layout">
              <div className="policy-donut">
                <svg
                  viewBox="0 0 220 220"
                  role="img"
                  aria-label="45 por cento dos recursos federais do PNAE destinados à agricultura familiar, segundo o FNDE"
                >
                  <circle
                    cx="110"
                    cy="110"
                    r="88"
                    fill="none"
                    stroke="#4D947B"
                    strokeWidth="27"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r="88"
                    fill="none"
                    className="policy-arc"
                    stroke="#FFD35B"
                    strokeWidth="27"
                    pathLength="100"
                    strokeDasharray="45 55"
                    transform="rotate(-90 110 110)"
                  />
                </svg>
                <div>
                  <strong>
                    45<span>%</span>
                  </strong>
                  <span>Agricultura familiar</span>
                </div>
              </div>
              <div className="policy-copy">
                <h2>O alimento da escola também fortalece o campo.</h2>
                <p>
                  Segundo o FNDE, ao menos 45% dos recursos federais do PNAE
                  devem ser destinados à compra de alimentos da agricultura
                  familiar.
                </p>
                <a href={FNDE} target="_blank" rel="noreferrer">
                  Fonte: FNDE · consulta em novembro de 2026
                  <ExternalLink size={15} />
                </a>
              </div>
              <div className="policy-side">
                <Leaf size={37} />
                <p>
                  O Abastece Escola atua no acompanhamento dos compromissos. As
                  compras seguem os processos oficiais.
                </p>
              </div>
            </div>
          </section>
          <section id="solucao" className="site-solution site-container">
            <div className="solution-photo">
              <img
                src="/images/colheita-pexels.jpg"
                width={1000}
                height={1497}
                loading="lazy"
                alt="Mão segurando uma cenoura recém-colhida, com uma plantação ao fundo."
              />
              <span className="photo-label">
                <Leaf size={17} />
                Tudo começa com quem produz.
              </span>
            </div>
            <div className="solution-copy">
              <h2>Um plano que chega às duas pontas.</h2>
              <p>
                Combine a entrega, acompanhe as mudanças e confira o resultado.
              </p>
              <ul className="solution-benefits">
                <li>
                  <span>01</span>
                  <div>
                    <h3>Capacidade conhecida</h3>
                    <p>O produtor informa o que consegue entregar.</p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <h3>Compromissos confirmados</h3>
                    <p>
                      A coordenação distribui. Os fornecedores conferem a
                      proposta.
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <h3>Recebimento registrado</h3>
                    <p>
                      A escola diferencia o previsto do que chegou e foi aceito.
                    </p>
                  </div>
                </li>
              </ul>
              <a className="site-button dark" href="#experimentar">
                Veja isso funcionando
                <ArrowRight size={18} />
              </a>
            </div>
          </section>
          <section id="como-funciona" className="site-how">
            <div className="site-container">
              <div className="site-section-title">
                <h2>Três participantes. <span className="heading-continuation">A mesma informação.</span></h2>
                <p>
                  Escolha uma etapa para acompanhar o caminho de uma entrega.
                </p>
              </div>
              <JourneyStory />
            </div>
          </section>
          <section id="para-quem" className="site-audiences site-container">
            <div className="audience-heading">
              <h2>Cada pessoa tem uma parte do caminho.</h2>
              <p>
                O estudante é o beneficiário. Quem produz, organiza e recebe
                precisa conseguir trabalhar junto.
              </p>
            </div>
            <div className="audience-grid">
              <article className="audience-card farmer">
                <div className="audience-card-top">
                  <Leaf size={35} />
                  <span>01</span>
                </div>
                <h3>
                  Produtores
                  <br />{" "}e cooperativas
                </h3>
                <p>Capacidade e entregas do ciclo, no aplicativo.</p>
                <div>
                  <Smartphone size={16} />
                  <span>No campo</span>
                </div>
              </article>
              <article className="audience-card planner">
                <div className="audience-card-top">
                  <Monitor size={35} />
                  <span>02</span>
                </div>
                <h3>
                  Coordenação
                  <br />{" "}
                  da alimentação escolar
                </h3>
                <p>A visão da rede para distribuir e acompanhar.</p>
                <div>
                  <Monitor size={16} />
                  <span>Na plataforma web</span>
                </div>
              </article>
              <article className="audience-card receiver">
                <div className="audience-card-top">
                  <School size={35} />
                  <span>03</span>
                </div>
                <h3>
                  Equipes
                  <br />{" "}
                  das escolas
                </h3>
                <p>Uma conferência clara para cada recebimento.</p>
                <div>
                  <ClipboardCheck size={16} />
                  <span>Na escola</span>
                </div>
              </article>
            </div>
          </section>
          <section id="experimentar" className="site-demo">
            <div className="site-container">
              <div className="demo-heading">
                <div>
                  <h2>Agora é com você. <span className="heading-continuation">Entre no cenário.</span></h2>
                </div>
                <div>
                  <p>
                    Teste o fluxo com dados fictícios. A coordenação e os
                    acessos de produtor e escola usam o mesmo ambiente neste
                    navegador.
                  </p>
                  <div className="demo-scope">
                    <span>3 escolas</span>
                    <span>2 produtores</span>
                    <span>130 kg necessários</span>
                  </div>
                </div>
              </div>
              <div className="demo-role-options">
                {roles.map((r) => (
                  <button
                    disabled={!!busy}
                    className={"demo-role demo-role-" + r.id}
                    key={r.id}
                    onClick={() => start(r.id)}
                  >
                    <r.Icon size={31} />
                    <strong className="demo-role-title">{r.label}</strong>
                    <p>{r.caption}</p>
                    <span>
                      {busy === r.id
                        ? "Abrindo acesso…"
                        : "Experimentar como " + r.label.toLowerCase()}
                      <ArrowRight size={18} />
                    </span>
                  </button>
                ))}
              </div>
              {error && (
                <p className="demo-error" role="alert">
                  {error}
                </p>
              )}
              <p className="demo-honesty">
                Demonstração acadêmica, sem instituições ou participantes reais.
                Não há cadastro nem contratação.
              </p>
            </div>
          </section>
          <section className="site-impact site-container">
            <div>
              <h2>A escola vê o que chega. <span className="heading-continuation">A rede vê o que falta.</span></h2>
              <p>
                A proposta se relaciona aos ODS 2 e 12. Os efeitos em
                alimentação e desperdício ainda precisam ser medidos em campo.
              </p>
            </div>
            <div className="impact-measures">
              <a
                href="https://brasil.un.org/pt-br/sdgs/2"
                target="_blank"
                rel="noreferrer"
              >
                <span className="impact-ods">2</span>
                <div>
                  <h3>Abastecimento escolar</h3>
                  <p>Quanto da necessidade foi recebido e aceito?</p>
                </div>
                <ArrowUpRight size={20} />
              </a>
              <a
                href="https://brasil.un.org/pt-br/sdgs/12"
                target="_blank"
                rel="noreferrer"
              >
                <span className="impact-ods">12</span>
                <div>
                  <h3>Diferenças e perdas</h3>
                  <p>O que faltou ou foi rejeitado na conferência?</p>
                </div>
                <ArrowUpRight size={20} />
              </a>
            </div>
          </section>
          <section className="site-faq site-container">
            <div>
              <h2>O que você precisa saber para começar.</h2>
            </div>
            <div>
              {faqs.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="site-last-call">
            <BotanicalAccent className="closing-foliage" />
            <div className="site-container">
              <Leaf size={50} />
              <h2>Do que o campo pode entregar ao que a escola recebe.</h2>
              <a href="#experimentar" className="site-button light">
                Conhecer na prática
                <ArrowRight size={19} />
              </a>
            </div>
          </section>
        </main>
        <footer className="site-footer site-container">
          <div>
            <a href="/" aria-label="Abastece Escola início">
              <Brand />
            </a>
            <p>
              Uma proposta de coordenação
              <br />{" "}
              para o abastecimento escolar.
            </p>
          </div>
          <div>
            <a href="#problema">O problema</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="/coordenacao?view=overview">
              Área da coordenação
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            <span>Projeto acadêmico CitizenTech.</span>
            <span>Dados demonstrativos identificados em cada exemplo.</span>
            <a
              className="photo-credit"
              href="https://www.pexels.com/photo/a-male-hand-holding-a-freshly-collected-carrot-from-soil-10041314/"
              target="_blank"
              rel="noreferrer"
            >
              Foto ilustrativa: Los Muertos Crew / Pexels
            </a>
          </div>
        </footer>
        {menu && (
          <Dialog
            title="Conheça o projeto"
            className="site-menu-dialog"
            onClose={closeMenu}
          >
            <nav>
              {siteNav()}
              <a href="#experimentar" onClick={closeMenu}>
                Experimentar a solução
                <ArrowRight size={18} />
              </a>
              <a href="/coordenacao?view=overview">
                Área da coordenação
                <ArrowUpRight size={18} />
              </a>
            </nav>
          </Dialog>
        )}
      </div>
    </MotionConfig>
  );
}
