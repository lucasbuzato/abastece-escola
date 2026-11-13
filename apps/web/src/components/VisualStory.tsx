import { useStageMotion } from "../hooks/useSiteMotion";
import { useState, useRef } from "react";
import {
  ArrowRight,
  Check,
  Carrot,
  School,
  Smartphone,
  Monitor,
  Package,
  Truck,
  ClipboardCheck,
  Leaf,
} from "lucide-react";

export function CapacityStory({ compact = false }: { compact?: boolean }) {
  const [capacity, setCapacity] = useState(60),
    needs = [30, 25, 15];
  let remaining = capacity;
  const allocations = needs.map((n) => {
    const assigned = Math.min(n, remaining);
    remaining -= assigned;
    return assigned;
  });
  return (
    <div className={"capacity-story " + (compact ? "compact" : "")}>
      <div className="simulation-top">
        <span>
          <Carrot size={18} />
          Cenoura · exemplo interativo
        </span>
        <span>3 escolas</span>
      </div>
      <div className="simulation-numbers">
        <div>
          <span>As escolas precisam</span>
          <strong>
            70<small>kg</small>
          </strong>
        </div>
        <ArrowRight size={26} />
        <div>
          <span>O campo confirmou</span>
          <strong>
            {capacity}
            <small>kg</small>
          </strong>
        </div>
      </div>
      <label className="capacity-slider">
        Mova a capacidade confirmada
        <input
          type="range"
          min={40}
          max={80}
          step={5}
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          aria-label="Capacidade confirmada de cenoura em quilogramas"
          aria-valuetext={`${capacity} quilogramas`}
        />
        <span>
          <span>40 kg</span>
          <span>80 kg</span>
        </span>
      </label>
      <div className="simulation-schools">
        {needs.map((need, i) => (
          <div key={i}>
            <div>
              <span>
                {["Vila Esperança", "Caminho do Sol", "Jardim das Flores"][i]}
              </span>
              <strong>
                {allocations[i]} / {need} kg
              </strong>
            </div>
            <div className="school-allocation-track">
              <span style={{ width: (allocations[i] / need) * 100 + "%" }} />
            </div>
          </div>
        ))}
      </div>
      <div
        className={"simulation-result " + (capacity >= 70 ? "covered" : "")}
        role="status"
      >
        <span>{capacity < 70 ? "!" : <Check size={18} />}</span>
        <p>
          {capacity < 70 ? (
            <>
              <strong>{70 - capacity} kg sem cobertura.</strong> A mudança
              precisa ser tratada antes da entrega.
            </>
          ) : (
            <>
              <strong>Necessidade coberta neste exemplo.</strong> O próximo
              passo é confirmar os compromissos.
            </>
          )}
        </p>
      </div>
      <p className="simulation-caption">
        Simulação ilustrativa. Não altera os registros da demonstração.
      </p>
    </div>
  );
}
const stages = [
  {
    label: "Quem produz",
    Icon: Leaf,
    title: "O produtor informa o que consegue entregar.",
    text: "A quantidade disponível deixa de ficar em uma conversa isolada e passa a compor o planejamento.",
    action: "Confirmar capacidade no aplicativo",
    color: "farmer",
  },
  {
    label: "Quem coordena",
    Icon: Monitor,
    title: "A coordenação combina a distribuição.",
    text: "Cada escola tem uma necessidade. A proposta só é publicada com capacidade e confirmação dos produtores.",
    action: "Revisar e publicar na plataforma web",
    color: "planner",
  },
  {
    label: "Quem recebe",
    Icon: School,
    title: "A escola registra o que realmente chegou.",
    text: "Recebido, aceito e rejeitado ficam separados. A coordenação acompanha a conferência e trata diferenças.",
    action: "Conferir a entrega no aplicativo",
    color: "receiver",
  },
];
export function JourneyStory() {
  const root = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0),
    item = stages[stage];
  useStageMotion(root, stage);
  return (
    <div ref={root} className={"journey-story story-" + item.color}>
      <div
        className="journey-switcher"
        aria-label="Conheça o papel de cada participante"
      >
        {stages.map((s, i) => (
          <button
            key={s.label}
            aria-pressed={stage === i}
            onClick={() => setStage(i)}
          >
            <span className="journey-step-number">0{i + 1}</span>
            <s.Icon size={24} />
            <span>{s.label}</span>
            {i < 2 && <ArrowRight className="journey-next" size={20} />}
          </button>
        ))}
      </div>
      <div className="journey-story-body">
        <div className="journey-story-copy">
          <div
            className="journey-progress"
            role="progressbar"
            aria-label="Etapa do fluxo"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={stage + 1}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className={i <= stage ? "reached" : ""} />
            ))}
          </div>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <span className="story-action">
            <Check size={16} />
            {item.action}
          </span>
        </div>
        <div
          className="journey-preview"
          aria-label="Representação visual do fluxo"
        >
          {stage === 0 ? (
            <div className="story-phone">
              <div className="phone-camera" />
              <div className="phone-top">
                <Leaf size={20} />
                <span>Minha colheita</span>
              </div>
              <span className="phone-overline">Sítio Bom Jardim</span>
              <div className="phone-food">
                <Carrot size={34} />
                <span>Cenoura</span>
              </div>
              <strong className="phone-quantity">
                50<small>kg</small>
              </strong>
              <span className="phone-capacity-label">
                disponíveis para o ciclo
              </span>
              <div className="phone-confirmed">
                <Check size={17} />
                Capacidade confirmada
              </div>
              <div className="phone-bottom">
                <Leaf size={18} />
                <Truck size={18} />
                <ClipboardCheck size={18} />
              </div>
            </div>
          ) : stage === 1 ? (
            <div className="story-planning">
              <div className="planning-top">
                <Monitor size={20} />
                <span>Distribuição da cenoura</span>
                <strong>70 kg</strong>
              </div>
              {[
                ["Vila Esperança", "30"],
                ["Caminho do Sol", "25"],
                ["Jardim das Flores", "15"],
              ].map(([school, qty]) => (
                <div className="planning-row" key={school}>
                  <School size={20} />
                  <span>{school}</span>
                  <strong>{qty} kg</strong>
                </div>
              ))}
              <div className="planning-accepts">
                <span>
                  <Check size={15} />
                  Bom Jardim
                </span>
                <span>
                  <Check size={15} />
                  Raízes
                </span>
              </div>
              <div className="planning-published">
                <Check size={17} />
                Versão confirmada pelos produtores
              </div>
            </div>
          ) : (
            <div className="story-receipt">
              <div className="receipt-preview-top">
                <ClipboardCheck size={25} />
                <span>Conferência da cenoura</span>
              </div>
              {[
                { title: "Previsto", qty: 30, kind: "planned" },
                { title: "Recebido", qty: 29, kind: "arrived" },
                { title: "Aceito", qty: 28, kind: "accepted" },
              ].map((r) => (
                <div className={"receipt-preview-row " + r.kind} key={r.title}>
                  <div>
                    <span>{r.title}</span>
                    <strong>{r.qty} kg</strong>
                  </div>
                  <div className="receipt-preview-bar">
                    <span style={{ width: (r.qty / 30) * 100 + "%" }} />
                  </div>
                </div>
              ))}
              <div className="receipt-preview-notes">
                <span>1 kg faltante</span>
                <span>1 kg rejeitado</span>
              </div>
            </div>
          )}
          <p className="story-example-label">Exemplo ilustrativo do fluxo</p>
        </div>
      </div>
    </div>
  );
}
export function ParticipantNetwork({
  schoolCount = 3,
  supplierCount = 2,
}: {
  schoolCount?: number;
  supplierCount?: number;
}) {
  return (
    <div className="participant-network">
      <div className="network-node network-farmer">
        <div className="network-icon">
          <Leaf size={32} />
        </div>
        <strong>{supplierCount} produtores</strong>
        <span>Confirmam capacidade</span>
      </div>
      <ArrowRight className="network-arrow" size={26} />
      <div className="network-node network-planner">
        <div className="network-icon">
          <Monitor size={32} />
        </div>
        <strong>Uma coordenação</strong>
        <span>Organiza os compromissos</span>
      </div>
      <ArrowRight className="network-arrow" size={26} />
      <div className="network-node network-school">
        <div className="network-icon">
          <School size={32} />
        </div>
        <strong>{schoolCount} escolas</strong>
        <span>Conferem as entregas</span>
      </div>
    </div>
  );
}
