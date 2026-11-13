import {
  ArrowRight,
  ArrowUpRight,
  Smartphone,
  Leaf,
  School,
  Monitor,
  CheckCircle2,
} from "lucide-react";
import type { PageProps } from "../types";
import { metrics, kg, sum } from "../model";
import {
  ParticipantNetwork,
  CapacityStory,
  JourneyStory,
} from "../components/VisualStory";
const questions = [
  [
    "Como abrir o mesmo ambiente no aplicativo?",
    "Use Conectar aplicativo, escolha o participante e abra ou copie o convite. Criar outra demonstração no app gera um ambiente separado. Use os convites da coordenação para compartilhar os mesmos registros.",
  ],
  [
    "O que significa uma entrega conferida?",
    "A escola informou o total recebido e o rejeitado, com motivo. Aceito é recebido menos rejeitado. Uma conferência pode ter diferenças em relação ao plano; abra o detalhe para consultar os valores.",
  ],
  [
    "Como funciona sem conexão?",
    "O app mantém o último retrato e pode guardar uma conferência pendente no aparelho. Ela só aparece na coordenação após o envio. Ao recuperar a conexão, use Tentar sincronizar. Conflitos exigem revisão.",
  ],
  [
    "Por que uma revisão precisa de novos aceites?",
    "A distribuição muda quantidades ou destinos. Cada fornecedor confirma a versão atual antes da publicação. Se houver ajuste, os aceites anteriores deixam de valer.",
  ],
  [
    "Quais decisões continuam com as pessoas?",
    "Compras, contratos, cardápios, critérios sanitários e decisões sobre qualidade dos alimentos. O sistema registra os compromissos e as conferências; não substitui esses processos.",
  ],
];
export function Guide({ state: s, onNavigate, onConnect }: PageProps) {
  const m = metrics(s);
  return (
    <>
      <section className="visual-guide-heading">
        <div>
          <h2>Um mesmo plano. <span className="heading-continuation">Três responsabilidades.</span></h2>
          <p>
            Quem produz informa a capacidade. Quem coordena distribui. A escola
            confere. Escolha uma etapa abaixo para visualizar o caminho.
          </p>
        </div>
        <div className="guide-scene-number">
          {kg(m.demand)}
          <small>kg necessários neste ciclo</small>
        </div>
      </section>
      <ParticipantNetwork
        schoolCount={s.schools.length}
        supplierCount={s.suppliers.length}
      />
      <section aria-label="Papéis no abastecimento">
        <JourneyStory />
      </section>
      <div className="guide-live-numbers">
        <div>
          <School size={25} />
          <strong>{sum(s.schools, (x) => x.students)}</strong>
          <span>estudantes no cenário</span>
        </div>
        <div>
          <Leaf size={25} />
          <strong>{m.total}</strong>
          <span>entregas previstas</span>
        </div>
        <div>
          <CheckCircle2 size={25} />
          <strong>{kg(m.accepted)} kg</strong>
          <span>aceitos neste ambiente</span>
        </div>
      </div>
      <section className="visual-guide-balance">
        <div>
          <h2>Uma alteração na colheita muda a distribuição.</h2>
          <p>
            Mova a capacidade para ver o efeito sobre três escolas. Este exemplo
            explica a lógica; os registros do seu ambiente permanecem
            preservados.
          </p>
          <a className="site-text-link" href="/#problema">
            Conhecer o problema e as fontes
            <ArrowUpRight size={17} />
          </a>
        </div>
        <CapacityStory compact />
      </section>
      <section className="scenario-access">
        <div>
          <Smartphone size={32} />
          <h2>Teste em duas plataformas.</h2>
          <p>
            Abra um convite no app e acompanhe o efeito de uma ação na
            coordenação.
          </p>
        </div>
        <button className="site-button dark" onClick={() => onConnect()}>
          Conectar participante
          <ArrowRight size={18} />
        </button>
      </section>
      <section className="panel faq-section">
        <div className="panel-heading">
          <h2>Dúvidas durante o uso</h2>
        </div>
        {questions.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <div className="guide-ending">
        <a href="/" className="site-text-link">
          Voltar ao site do projeto
          <ArrowUpRight size={17} />
        </a>
        <button className="button primary" onClick={() => onNavigate("plan")}>
          Abrir planejamento
          <ArrowRight size={17} />
        </button>
      </div>
    </>
  );
}
