import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text as NativeText,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Animated,
  StyleSheet,
  Platform,
  AppState,
  AccessibilityInfo,
  Linking,
  Share,
  ActivityIndicator,
  KeyboardAvoidingView,
  useWindowDimensions,
} from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path, Circle, Rect, Line, G } from "react-native-svg";
type Session = { room: string; token: string; invites?: any[]; base: string };
const C = {
  green: "#105B42",
  text: "#123F35",
  muted: "#48685F",
  bg: "#F3F8F6",
  lime: "#D7F26A",
  line: "#BCD1CA",
  amber: "#8c6928",
};
const fmt = (n: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(n);
const op = () =>
  Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
const PUBLIC_API = "https://abastece-escola.vercel.app";
function defaultBase() {
  if (Platform.OS === "web") {
    const l = (globalThis as any).location;
    return l.hostname === "localhost" || l.hostname === "127.0.0.1"
      ? `http://${l.hostname}:4181`
      : l.origin;
  }
  return process.env.EXPO_PUBLIC_API_URL || PUBLIC_API;
}
function Icon({
  name,
  size = 22,
  color = C.green,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const paths: Record<string, string> = {
    leaf: "M12 22V10M12 15C2 15 2 5 2 5s10-1 10 10M12 10C21 10 22 1 22 1s-10 0-10 9",
    home: "m3 10 9-7 9 7v11h-6v-8H9v8H3Z",
    box: "m3 7 9-4 9 4-9 4Zm0 0v11l9 4 9-4V7M12 11v11",
    truck:
      "M1 5h13v12H1ZM14 9h5l4 5v3h-9M5 17a2 2 0 1 0 .1 0M18 17a2 2 0 1 0 .1 0",
    check: "m5 12 4 4L20 5",
    arrow: "M4 12h16m-6-6 6 6-6 6",
    back: "M20 12H4m6-6-6 6 6 6",
    clock: "M12 7v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
    calendar: "M4 5h16v16H4ZM8 2v6m8-6v6M4 10h16",
    user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 22v-3a8 8 0 0 1 16 0v3",
    school: "m2 9 10-7 10 7M4 8v14h16V8M10 22v-7h4v7M8 10h1m6 0h1M12 2v7",
    carrot: "m7 7 10 3-14 12ZM14 7l3-5m0 8 5-2m-8-1 6-5",
    banana: "M20 3C18 14 10 20 3 15c1 9 18 10 19-10Zm-1 0 2-1",
    alert: "m12 2 11 20H1ZM12 9v5m0 3v1",
    close: "m5 5 14 14M19 5 5 19",
    link: "m10 14 4-4M8 16l-2 2a4 4 0 0 1-5-5l5-5a4 4 0 0 1 5 0m2 3a4 4 0 0 0 5 0l5-5a4 4 0 0 0-5-5l-2 2",
    refresh: "M20 7a9 9 0 1 0 0 10M20 2v6h-6",
    wifi: "M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0m-4 4h.01",
    copy: "M8 8h14v14H8ZM3 16H1V1h15v2",
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(Platform.OS !== "web"
        ? { accessibilityElementsHidden: true }
        : { "aria-hidden": true })}
    >
      <Path d={paths[name] || paths.leaf} />
    </Svg>
  );
}
function Garden() {
  return (
    <Svg
      width="100%"
      height={175}
      viewBox="0 0 400 200"
      {...(Platform.OS !== "web"
        ? { accessibilityElementsHidden: true }
        : { "aria-hidden": true })}
    >
      <Rect width={400} height={200} fill="#DFF2F7" />
      <Circle cx={330} cy={37} r={24} fill="#FFD35B" />
      <Path d="M0 98Q80 32 178 92T400 72V200H0Z" fill="#A8D195" />
      <Path d="M0 132Q105 62 215 121T400 108V200H0Z" fill="#66A77B" />
      <Path d="M0 177Q100 118 205 161T400 145V200H0Z" fill="#286C50" />
      <Path
        d="M72 127L80 149M327 129L329 154"
        stroke="#D5E2E7"
        strokeWidth={11}
      />
      <Path
        d="M-10 176C75 140 142 147 216 163S330 176 415 134"
        stroke="#D5E2E7"
        strokeWidth={33}
        fill="none"
      />
      <Path
        d="M-10 176C75 140 142 147 216 163S330 176 415 134"
        stroke="#FFFFFF"
        strokeWidth={1.5}
        strokeDasharray="7 9"
        fill="none"
      />
      <G x={35} y={63}>
        <Path d="M0 25L35 0L70 25V68H0Z" fill="#DC5136" />
        <Path
          d="M-5 25L35-3L75 25"
          fill="none"
          stroke="#8A3021"
          strokeWidth={6}
        />
        <Rect x={27} y={37} width={20} height={31} fill="#FFFFFF" />
        <Path d="M37 37V68M27 50H47" stroke="#8A3021" strokeWidth={1.5} />
        <Rect x={9} y={35} width={11} height={13} fill="#FFD35B" />
      </G>
      <G x={294} y={65}>
        <Path d="M0 22L32 3L64 22V67H0Z" fill="#FFFFFF" />
        <Path
          d="M-4 22L32 0L68 22"
          fill="none"
          stroke="#075E78"
          strokeWidth={6}
        />
        <Rect x={25} y={43} width={15} height={24} fill="#075E78" />
        <Path d="M8 31H18V42H8ZM47 31H57V42H47Z" fill="#7CC4D5" />
        <Circle cx={32} cy={29} r={7} fill="#DFF2F7" />
        <Path d="M32 24V29L36 31" stroke="#075E78" strokeWidth={1.5} />
      </G>
      <G x={186} y={148}>
        <Path d="M0 0H35V19H0ZM35 6H46L56 16V19H35Z" fill="#075E78" />
        <Path d="M39 9H45L51 15H39Z" fill="#DFF2F7" />
        <Path d="M2 17H55" stroke="#FFD35B" strokeWidth={2} />
        <Circle cx={10} cy={20} r={5} fill="#123F35" />
        <Circle cx={46} cy={20} r={5} fill="#123F35" />
        <Circle cx={10} cy={20} r={2} fill="#FFFFFF" />
        <Circle cx={46} cy={20} r={2} fill="#FFFFFF" />
      </G>
      <G stroke="#123F35" strokeWidth={1.5} fill="#D7F26A">
        <Path d="M128 138V97M128 124C108 123 107 105 107 105C124 104 128 114 128 124ZM128 113C145 111 147 93 147 93C129 96 128 104 128 113Z" />
        <Path d="M28 192V178M28 184C17 184 16 174 16 174C25 174 28 178 28 184ZM28 184C38 181 41 173 41 173C31 174 28 177 28 184Z" />
      </G>
    </Svg>
  );
}
function Btn({
  label,
  onPress,
  secondary = false,
  disabled = false,
  icon = "arrow",
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        st.button,
        secondary && st.secondary,
        pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] },
        disabled && { opacity: 0.45 },
      ]}
    >
      <Text style={[st.buttonText, secondary && { color: C.green }]}>
        {label}
      </Text>
      <Icon name={icon} size={18} color={secondary ? C.green : "#fff"} />
    </Pressable>
  );
}
function Text({ style, ...props }: React.ComponentProps<typeof NativeText>) {
  const flat = StyleSheet.flatten(style) || {};
  const family =
    flat.fontFamily ||
    (Number(flat.fontWeight || 400) >= 500
      ? "SourceSemiBold"
      : "SourceRegular");
  return (
    <NativeText
      {...props}
      style={[
        { fontFamily: family, color: C.text },
        style,
        { fontFamily: family, fontWeight: "normal" },
      ]}
    />
  );
}
export default function App() {
  const [loaded, error] = useFonts({
    Bricolage: require("@expo-google-fonts/bricolage-grotesque/600SemiBold/BricolageGrotesque_600SemiBold.ttf"),
    SourceRegular: require("@expo-google-fonts/source-sans-3/400Regular/SourceSans3_400Regular.ttf"),
    SourceSemiBold: require("@expo-google-fonts/source-sans-3/600SemiBold/SourceSans3_600SemiBold.ttf"),
  });
  if (!loaded && !error)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: C.bg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={C.green} />
      </View>
    );
  return <Application />;
}
function Application() {
  const [session, setSession] = useState<Session | null>(null),
    [snap, setSnap] = useState<any>(null),
    [tab, setTab] = useState("home"),
    [error, setError] = useState(""),
    [toast, setToast] = useState(""),
    [busy, setBusy] = useState(false),
    [online, setOnline] = useState(true),
    [sheet, setSheet] = useState(""),
    [selected, setSelected] = useState<any>(null),
    [value, setValue] = useState(""),
    [reject, setReject] = useState("0"),
    [note, setNote] = useState(""),
    [inviteInput, setInviteInput] = useState(""),
    [queue, setQueue] = useState<any>(null),
    [reduce, setReduce] = useState(false),
    [ready, setReady] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;
  const current = useRef<any>(null);
  current.current = { snap, session };
  const { width } = useWindowDimensions();
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduce,
    );
    const init = async () => {
      try {
        const l = (globalThis as any).location;
        let loaded = null;
        if (Platform.OS === "web" && l?.hash.includes("access=")) {
          const hash = new URLSearchParams(l.hash.slice(1));
          loaded = {
            base: defaultBase(),
            room: new URLSearchParams(l.search).get("room") || "",
            token: hash.get("access"),
          };
          (globalThis as any).history.replaceState({}, "", l.pathname);
        } else {
          loaded = JSON.parse(
            (await AsyncStorage.getItem("abastece-mobile-session")) || "null",
          );
        }
        if (loaded) setSession(loaded);
        const q = JSON.parse(
          (await AsyncStorage.getItem("abastece-pending-receipt")) || "null",
        );
        setQueue(q);
      } catch {
        setError(
          "Não foi possível recuperar o acesso salvo. Cole seu convite novamente.",
        );
      }
      setReady(true);
    };
    init();
    return () => listener.remove();
  }, []);
  useEffect(() => {
    if (!session) return;
    AsyncStorage.setItem("abastece-mobile-session", JSON.stringify(session));
    refresh(session);
    const timer = setInterval(() => {
      if (AppState.currentState === "active") refresh(session);
    }, 1800);
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh(session);
    });
    return () => {
      clearInterval(timer);
      listener.remove();
    };
  }, [session]);
  useEffect(() => {
    if (reduce) {
      fade.setValue(1);
      return;
    }
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 240,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [tab, reduce]);
  useEffect(() => {
    if (!toast) return;
    AccessibilityInfo.announceForAccessibility(toast);
    const t = setTimeout(() => setToast(""), 6000);
    return () => clearTimeout(t);
  }, [toast]);
  async function refresh(se = session) {
    if (!se) return;
    try {
      const r = await fetch(`${se.base}/api/snapshot?room=${se.room}`, {
        headers: { authorization: `Bearer ${se.token}` },
      });
      const b = await r.json();
      if (!r.ok) throw Object.assign(Error(b.error), { status: r.status });
      if (
        current.current.session?.room !== se.room ||
        current.current.session?.token !== se.token
      )
        return;
      if (current.current.snap?.revision > b.revision) return;
      setSnap(b);
      setOnline(true);
      await AsyncStorage.setItem(
        "abastece-last-snapshot",
        JSON.stringify({
          room: se.room,
          token: se.token,
          actor: b.actor,
          state: b.state,
          revision: b.revision,
        }),
      );
    } catch (e: any) {
      setOnline(false);
      if (!current.current.snap) {
        const cached = JSON.parse(
          (await AsyncStorage.getItem("abastece-last-snapshot")) || "null",
        );
        if (cached?.room === se.room && cached?.token === se.token)
          setSnap(cached);
        else setError(e.message || "Sem conexão. Tente novamente.");
      }
    }
  }
  async function createDemo() {
    setBusy(true);
    try {
      const base = defaultBase();
      const r = await fetch(base + "/api/create", { method: "POST" });
      if (!r.ok) throw Error("Não foi possível criar a demonstração.");
      const b = await r.json();
      const actor = b.invites.find((i: any) => i.id === "p1");
      setSession({
        base,
        room: b.room,
        token: actor.token,
        invites: b.invites,
      });
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function openInvite() {
    try {
      const url = new URL(inviteInput.trim());
      const token = new URLSearchParams(url.hash.slice(1)).get("access");
      const room = url.searchParams.get("room");
      if (!token || !room)
        throw Error("Cole o convite completo compartilhado pela coordenação.");
      if (
        url.protocol !== "https:" &&
        !(
          url.protocol === "http:" &&
          /^(localhost|127\.0\.0\.1|192\.168\.)/.test(url.hostname)
        )
      )
        throw Error("O convite precisa usar uma conexão segura.");
      setSnap(null);
      setSession({ base: url.origin, room, token });
      setSheet("");
      setError("");
    } catch (e: any) {
      setError(e.message || "Convite inválido.");
    }
  }
  async function send(type: string, payload: any = {}, fromQueue?: any) {
    if (!session || !snap) return;
    setBusy(true);
    setError("");
    const command = fromQueue?.command || {
      room: session.room,
      revision: snap.revision,
      operationId: op(),
      type,
      payload,
    };
    try {
      const r = await fetch(session.base + "/api/command", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(command),
      });
      const b = await r.json();
      if (!r.ok) throw Object.assign(Error(b.error), { status: r.status });
      setSnap(b);
      setOnline(true);
      setSheet("");
      if (type === "receive") {
        setQueue(null);
        await AsyncStorage.removeItem("abastece-pending-receipt");
      }
      setToast(
        type === "capacity"
          ? "Quantidade confirmada. A coordenação já pode acompanhar."
          : type === "accept"
            ? "Proposta confirmada. Seu compromisso está registrado."
            : type === "dispatch"
              ? "Saída registrada. A escola já foi avisada."
              : "Recebimento sincronizado com a coordenação.",
      );
    } catch (e: any) {
      if (!e.status && type === "receive" && !fromQueue) {
        const q = { room: session.room, token: session.token, command };
        setQueue(q);
        await AsyncStorage.setItem(
          "abastece-pending-receipt",
          JSON.stringify(q),
        );
        setSheet("");
        setToast("Conferência salva neste aparelho. Pendente de envio.");
        setOnline(false);
      } else {
        setError(e.message || "Não foi possível enviar.");
        if (e.status === 409) refresh();
      }
    } finally {
      setBusy(false);
    }
  }
  async function replay() {
    if (!queue || !session) return;
    if (queue.room !== session.room || queue.token !== session.token) {
      setError(
        "Há uma anotação pendente de outro acesso. Entre pelo convite original para revisar.",
      );
      return;
    }
    await send("receive", {}, queue);
  }
  async function discardPending() {
    await AsyncStorage.removeItem("abastece-pending-receipt");
    setQueue(null);
    setError("");
    setToast(
      "Anotação local descartada. O registro do servidor foi preservado.",
    );
  }
  const close = () => {
    setSheet("");
    setError("");
  };
  const heroTitle =
    snap?.actor.role === "supplier"
      ? "Sua próxima\nentrega."
      : "Confira o que\nchegou.";
  const isSupplier = snap?.actor.role === "supplier";
  const s = snap?.state;
  const supplier = s?.suppliers.find((p: any) => p.id === snap.actor.id);
  const school = s?.schools.find((p: any) => p.id === snap.actor.id);
  const list = s?.deliveries || [];
  const total = list.reduce((n: number, d: any) => n + d.qty, 0),
    done = list.filter((d: any) => d.status === "received").length;
  const canAccept =
    isSupplier &&
    s?.plan.status === "draft" &&
    s?.plan.accepts[snap.actor.id] !== s?.plan.version;
  const ownUrl = (actor: any) =>
    `${session!.base}${actor.role === "coordinator" ? "/coordenacao" : "/app/"}?room=${session!.room}#access=${actor.token}`;
  const openDelivery = (d: any) => {
    setSelected(d);
    setValue(String(d.qty));
    setReject("0");
    setNote("");
    setSheet("delivery");
  };
  if (!ready)
    return (
      <View style={st.center}>
        <ActivityIndicator color={C.green} />
      </View>
    );
  if (!session || !snap)
    return (
      <View style={st.screen}>
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={[st.welcome, { minHeight: "100%" }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={st.logo}>
            <Icon name="leaf" size={33} />
            <View>
              <Text style={st.logoName}>abastece</Text>
              <Text style={st.logoSub}>ESCOLA</Text>
            </View>
          </View>
          <View style={st.welcomeArt}>
            <Garden />
          </View>
          <Text accessibilityRole="header" style={st.welcomeTitle}>
            Sua entrega, do plano à escola.
          </Text>
          <Text style={st.welcomeText}>
            Produtores confirmam quantidades e registram saídas. Escolas
            conferem o que chegou. Os registros aparecem na coordenação.
          </Text>
          <View style={st.welcomeBox}>
            <Text style={st.welcomeBoxTitle}>Recebeu um convite?</Text>
            <TextInput
              accessibilityLabel="Convite de acesso"
              placeholder="Cole aqui o convite da coordenação"
              value={inviteInput}
              onChangeText={setInviteInput}
              autoCapitalize="none"
              placeholderTextColor={C.muted}
              style={st.input}
            />
            <Btn label="Entrar com convite" onPress={openInvite} />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={createDemo}
            disabled={busy}
            style={st.demoButton}
          >
            <Text style={st.demoText}>
              {busy
                ? "Preparando demonstração…"
                : "Conhecer com dados de exemplo"}
            </Text>
            <Icon name="arrow" size={16} />
          </Pressable>
          {session && !snap && (
            <Text style={st.muted}>Carregando as entregas do seu acesso…</Text>
          )}
          {error ? (
            <Text accessibilityRole="alert" style={st.error}>
              {error}
            </Text>
          ) : null}
          <Text style={st.welcomeFooter}>
            Projeto acadêmico · dados fictícios
          </Text>
        </ScrollView>
      </View>
    );
  return (
    <View style={st.screen}>
      <StatusBar style="dark" />
      <View style={st.mobileContainer}>
        <View style={st.header}>
          <View style={st.logo}>
            <Icon name="leaf" size={28} />
            <View>
              <Text style={st.logoName}>abastece</Text>
              <Text style={st.logoSub}>ESCOLA</Text>
            </View>
          </View>
          <Pressable
            style={st.profileButton}
            accessibilityLabel="Abrir acesso e informações"
            accessibilityRole="button"
            onPress={() => setTab("account")}
          >
            <Text style={st.profileText}>
              {isSupplier ? supplier?.initials : school?.initials || "CO"}
            </Text>
          </Pressable>
        </View>
        <View style={st.connectionBar}>
          <View
            style={[
              st.connectionDot,
              !online && { backgroundColor: "#bc8c44" },
            ]}
          />
          <Text style={st.connectionText}>
            {online
              ? "Conectado à Rede do Vale"
              : "Sem conexão · dados da última atualização"}
          </Text>
          <Text style={st.cycleSmall}>Ciclo 24</Text>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={st.content}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              opacity: fade,
              transform: [
                {
                  translateY: fade.interpolate({
                    inputRange: [0, 1],
                    outputRange: reduce ? [0, 0] : [9, 0],
                  }),
                },
              ],
            }}
          >
            {error ? (
              <View accessibilityRole="alert" style={st.errorBox}>
                <Icon name="alert" size={18} color="#985b34" />
                <Text style={st.error}>{error}</Text>
              </View>
            ) : null}
            {queue && (
              <View style={st.pendingBox}>
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <Icon name="clock" size={20} color={C.amber} />
                  <Text style={st.pendingTitle}>
                    Conferência pendente de envio
                  </Text>
                </View>
                <Text style={st.pendingText}>
                  Sua anotação está salva neste aparelho. Envie ao recuperar a
                  conexão.
                </Text>
                <Btn
                  label="Tentar sincronizar"
                  onPress={replay}
                  disabled={busy}
                  secondary
                  icon="refresh"
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={discardPending}
                  style={{ paddingVertical: 14 }}
                >
                  <Text style={st.smallLink}>
                    Descartar somente a anotação local
                  </Text>
                </Pressable>
              </View>
            )}
            {tab === "home" && (
              <>
                <Text style={st.greeting}>
                  Olá,{" "}
                  {isSupplier
                    ? supplier?.person.split(" ")[0]
                    : "equipe da escola"}{" "}
                </Text>
                <View style={st.hero}>
                  <View style={st.heroText}>
                    <Text accessibilityRole="header" style={st.heroTitle}>
                      {heroTitle}
                    </Text>
                    <Text style={st.heroSubtitle}>
                      {isSupplier
                        ? "Informe sua capacidade e acompanhe os compromissos com as escolas."
                        : "Compare o previsto com o recebido e registre as diferenças."}
                    </Text>
                  </View>
                  <View style={st.garden}>
                    <Garden />
                  </View>
                </View>
                <View style={st.miniStats}>
                  <View style={st.miniStat}>
                    <Icon name={isSupplier ? "box" : "school"} size={20} />
                    <Text style={st.miniNumber}>
                      {fmt(total)}
                      <Text style={st.numberUnit}> kg</Text>
                    </Text>
                    <Text style={st.miniLabel}>previstos neste ciclo</Text>
                  </View>
                  <View style={st.statDivider} />
                  <View style={st.miniStat}>
                    <Icon name="check" size={20} />
                    <Text style={st.miniNumber}>
                      {done}
                      <Text style={st.numberUnit}> de {list.length}</Text>
                    </Text>
                    <Text style={st.miniLabel}>entregas conferidas</Text>
                  </View>
                </View>
                {canAccept && (
                  <View style={st.proposalCard}>
                    <View style={st.proposalIcon}>
                      <Icon name="calendar" size={24} />
                    </View>
                    <Text style={st.proposalTitle}>
                      Um novo plano para confirmar
                    </Text>
                    <Text style={st.proposalText}>
                      A coordenação preparou a versão {s.plan.version}. Confira
                      quantidades e destinos antes de aceitar.
                    </Text>
                    <Btn
                      label="Conferir proposta"
                      onPress={() => setSheet("proposal")}
                    />
                  </View>
                )}
                <View style={st.sectionHeading}>
                  <Text accessibilityRole="header" style={st.sectionTitle}>
                    Na sua agenda
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setTab("deliveries")}
                    style={st.smallButton}
                  >
                    <Text style={st.smallLink}>Ver todas</Text>
                    <Icon name="arrow" size={15} />
                  </Pressable>
                </View>
                {list
                  .filter((d: any) => d.status !== "received")
                  .slice(0, 3)
                  .map((d: any) => delivery(d))}
                {list.every((d: any) => d.status === "received") && (
                  <View style={st.tip}>
                    <Icon name="check" />
                    <Text style={st.tipText}>
                      Todas as entregas foram conferidas. Consulte o histórico
                      para ver os registros.
                    </Text>
                  </View>
                )}
                <View style={st.communityCard}>
                  <Icon name="leaf" size={24} />
                  <View style={{ flex: 1 }}>
                    <Text style={st.communityTitle}>
                      O mesmo plano na coordenação
                    </Text>
                    <Text style={st.communityText}>
                      As quantidades confirmadas e os recebimentos ficam
                      disponíveis para quem organiza este ciclo.
                    </Text>
                  </View>
                </View>
              </>
            )}
            {tab === "deliveries" && (
              <>
                <Text accessibilityRole="header" style={st.pageTitle}>
                  Suas entregas
                </Text>
                <Text style={st.pageSubtitle}>
                  12 de novembro · {list.length} entregas no ciclo
                </Text>
                {list.map((d: any) => delivery(d))}
              </>
            )}
            {tab === "capacity" && isSupplier && (
              <>
                <Text accessibilityRole="header" style={st.pageTitle}>
                  Sua colheita
                </Text>
                <Text style={st.pageSubtitle}>
                  Confirme o que você consegue entregar. A coordenação acompanha
                  as mesmas quantidades.
                </Text>
                {s.capacities.map((c: any) => (
                  <View style={st.capacityCard} key={c.product}>
                    <View style={st.capacityTop}>
                      <View
                        style={[
                          st.foodIcon,
                          {
                            backgroundColor:
                              c.product === "banana" ? "#FFF1BE" : "#FFE2DA",
                          },
                        ]}
                      >
                        <Icon
                          name={c.product === "banana" ? "banana" : "carrot"}
                          size={25}
                          color={c.product === "banana" ? "#795015" : "#8A3021"}
                        />
                      </View>
                      <Text style={st.capacityTitle}>
                        {s.products.find((p: any) => p.id === c.product).name}
                      </Text>
                      <View style={st.confirmedPill}>
                        <Text style={st.confirmedText}>Confirmado</Text>
                      </View>
                    </View>
                    <Text style={st.capacityNumber}>
                      {fmt(c.qty)}
                      <Text style={st.capacityUnit}> kg</Text>
                    </Text>
                    <Text style={st.capacityDescription}>
                      Disponíveis para o ciclo 24
                    </Text>
                    <View style={st.capacityFoot}>
                      <Text style={st.capacityLimit}>
                        Limite no cenário: {fmt(c.limit)} kg
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Atualizar quantidade de ${c.product}`}
                        onPress={() => {
                          setSelected(c);
                          setValue(String(c.qty));
                          setSheet("capacity");
                        }}
                        style={st.smallButton}
                      >
                        <Text style={st.smallLink}>Atualizar</Text>
                        <Icon name="arrow" size={16} />
                      </Pressable>
                    </View>
                  </View>
                ))}
                <View style={st.tip}>
                  <Icon name="alert" size={20} />
                  <Text style={st.tipText}>
                    Mudou a quantidade? Avise por aqui. A coordenação poderá
                    reorganizar o plano antes da saída.
                  </Text>
                </View>
              </>
            )}
            {tab === "history" && (
              <>
                <Text accessibilityRole="header" style={st.pageTitle}>
                  Seu histórico
                </Text>
                <Text style={st.pageSubtitle}>
                  Confirmações, mudanças e recebimentos.
                </Text>
                {s.events.map((e: any) => (
                  <View style={st.event} key={e.id}>
                    <View style={st.eventIcon}>
                      <Icon name="check" size={16} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={st.eventTitle}>{e.title}</Text>
                      <Text style={st.eventText}>{e.detail}</Text>
                      <Text style={st.eventTime}>
                        {new Date(e.at).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {e.actor}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
            {tab === "account" && (
              <>
                <Text accessibilityRole="header" style={st.pageTitle}>
                  Seu acesso
                </Text>
                <View style={st.accountCard}>
                  <View style={st.accountAvatar}>
                    <Icon name={isSupplier ? "leaf" : "school"} size={34} />
                  </View>
                  <Text style={st.accountName}>{snap.actor.name}</Text>
                  <Text style={st.accountRole}>
                    {isSupplier
                      ? "Produtor de agricultura familiar"
                      : "Responsável pelo recebimento"}
                  </Text>
                  <View style={st.demoPill}>
                    <Text style={st.demoPillText}>
                      Dados fictícios · Projeto acadêmico
                    </Text>
                  </View>
                </View>
                {session.invites && (
                  <>
                    <Text style={st.sectionTitle}>Explorar a integração</Text>
                    <Text style={st.pageSubtitle}>
                      Troque de perfil dentro do mesmo cenário ou abra a
                      coordenação para ver o efeito das ações.
                    </Text>
                    {session.invites
                      .filter((x: any) => x.role !== "coordinator")
                      .map((i: any) => (
                        <Pressable
                          key={i.id}
                          style={st.accessRow}
                          accessibilityRole="button"
                          onPress={() => {
                            setSession({ ...session, token: i.token });
                            setSnap(null);
                            setTab("home");
                          }}
                        >
                          <Icon
                            name={i.role === "supplier" ? "leaf" : "school"}
                            size={22}
                          />
                          <Text style={st.accessName}>{i.name}</Text>
                          <Icon name="arrow" size={17} />
                        </Pressable>
                      ))}
                    <Btn
                      label="Abrir coordenação na web"
                      secondary
                      icon="link"
                      onPress={() =>
                        Linking.openURL(
                          ownUrl(
                            session.invites!.find(
                              (i) => i.role === "coordinator",
                            ),
                          ),
                        )
                      }
                    />
                  </>
                )}
                <Text style={[st.sectionTitle, { marginTop: 25 }]}>
                  Outro convite
                </Text>
                <TextInput
                  accessibilityLabel="Novo convite de acesso"
                  value={inviteInput}
                  onChangeText={setInviteInput}
                  placeholder="Cole o convite completo"
                  autoCapitalize="none"
                  placeholderTextColor={C.muted}
                  style={st.input}
                />
                <Btn
                  label="Entrar com outro convite"
                  onPress={openInvite}
                  secondary
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={async () => {
                    await AsyncStorage.removeItem("abastece-mobile-session");
                    await AsyncStorage.removeItem("abastece-last-snapshot");
                    setSession(null);
                    setSnap(null);
                    setTab("home");
                  }}
                  style={st.logout}
                >
                  <Text style={st.smallLink}>Sair deste acesso</Text>
                </Pressable>
                <Text style={st.disclaimer}>
                  O aplicativo coordena compromissos e registra conferências. As
                  decisões de compra e de segurança alimentar pertencem às
                  pessoas responsáveis.
                </Text>
              </>
            )}
          </Animated.View>
          <Text style={st.footer}>
            Demonstração acadêmica · dados fictícios
          </Text>
        </ScrollView>
        <View style={st.bottomNav}>
          {(isSupplier
            ? [
                ["home", "Início", "home"],
                ["capacity", "Colheita", "leaf"],
                ["deliveries", "Entregas", "truck"],
                ["history", "Histórico", "clock"],
              ]
            : [
                ["home", "Início", "home"],
                ["deliveries", "Entregas", "box"],
                ["history", "Histórico", "clock"],
                ["account", "Acesso", "user"],
              ]
          ).map(([id, label, icon]) => (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === id }}
              accessibilityLabel={label}
              onPress={() => {
                setTab(id);
                setError("");
              }}
              style={st.navItem}
            >
              <View style={[st.navIcon, tab === id && st.navIconActive]}>
                <Icon
                  name={icon}
                  size={21}
                  color={tab === id ? C.green : "#48685F"}
                />
              </View>
              <Text style={[st.navText, tab === id && st.navTextActive]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
        {!!toast && (
          <View style={st.toast} accessibilityLiveRegion="polite">
            <Icon name="check" size={19} color={C.lime} />
            <Text style={st.toastText}>{toast}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar confirmação"
              onPress={() => setToast("")}
              style={{
                padding: 6,
                minWidth: 44,
                minHeight: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="close" size={17} color={C.lime} />
            </Pressable>
          </View>
        )}
        <Modal
          visible={!!sheet}
          transparent
          animationType={reduce ? "none" : "slide"}
          onRequestClose={close}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={st.modalBackdrop}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={close}
              accessibilityLabel="Fechar detalhes"
            />
            <View
              style={[st.sheet, { maxWidth: width > 600 ? 500 : undefined }]}
              accessibilityViewIsModal
            >
              <View style={st.sheetHandle} />
              <View style={st.sheetTop}>
                <Text accessibilityRole="header" style={st.sheetTitle}>
                  {sheet === "capacity"
                    ? "Atualizar sua colheita"
                    : sheet === "proposal"
                      ? "Confira os compromissos"
                      : "Detalhes da entrega"}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar janela"
                  onPress={close}
                  style={st.closeButton}
                >
                  <Icon name="close" size={21} />
                </Pressable>
              </View>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {error ? (
                  <Text accessibilityRole="alert" style={st.error}>
                    {error}
                  </Text>
                ) : null}
                {sheet === "capacity" && selected && (
                  <>
                    <Text style={st.sheetIntro}>
                      {
                        s.products.find((p: any) => p.id === selected.product)
                          .name
                      }{" "}
                      · ciclo 24
                    </Text>
                    <Text style={st.fieldLabel}>
                      Quanto você consegue entregar em kg?
                    </Text>
                    <TextInput
                      accessibilityLabel="Quantidade disponível em quilogramas"
                      autoFocus
                      keyboardType="decimal-pad"
                      value={value}
                      onChangeText={setValue}
                      style={st.bigInput}
                    />
                    <Text style={st.inputHelp}>
                      Limite operacional do cenário: {fmt(selected.limit)} kg. A
                      alteração será enviada para a coordenação.
                    </Text>
                    <Btn
                      label={busy ? "Confirmando…" : "Confirmar quantidade"}
                      disabled={busy || !online}
                      onPress={() =>
                        send("capacity", {
                          product: selected.product,
                          qty: value,
                        })
                      }
                    />
                  </>
                )}
                {sheet === "proposal" && (
                  <>
                    <Text style={st.sheetIntro}>
                      Versão {s.plan.version} · confira alimento, escola e
                      quantidade antes de confirmar.
                    </Text>
                    {list.map((d: any) => (
                      <View key={d.id} style={st.proposalLine}>
                        <Icon
                          name={d.product === "banana" ? "banana" : "carrot"}
                          size={22}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={st.deliveryProduct}>
                            {
                              s.products.find((p: any) => p.id === d.product)
                                .name
                            }
                          </Text>
                          <Text style={st.deliveryMeta}>
                            {
                              s.schools.find((x: any) => x.id === d.school)
                                .short
                            }
                          </Text>
                        </View>
                        <Text style={st.proposalQty}>{fmt(d.qty)} kg</Text>
                      </View>
                    ))}
                    <Text style={st.inputHelp}>
                      Ao confirmar, você registra que pode atender estes
                      compromissos. Uma mudança posterior poderá exigir nova
                      confirmação.
                    </Text>
                    <Btn
                      label={busy ? "Confirmando…" : "Confirmar proposta"}
                      disabled={busy || !online}
                      onPress={() =>
                        send("accept", { version: s.plan.version })
                      }
                    />
                  </>
                )}
                {sheet === "delivery" && selected && (
                  <>
                    <View style={st.deliveryDetailHero}>
                      <Icon
                        name={
                          selected.product === "banana" ? "banana" : "carrot"
                        }
                        size={35}
                      />
                      <View>
                        <Text style={st.deliveryDetailProduct}>
                          {
                            s.products.find(
                              (p: any) => p.id === selected.product,
                            ).name
                          }
                        </Text>
                        <Text style={st.deliveryMeta}>
                          {fmt(selected.qty)} kg previstos
                        </Text>
                      </View>
                    </View>
                    <View style={st.detailRow}>
                      <Text style={st.detailLabel}>
                        {isSupplier ? "Destino" : "Origem"}
                      </Text>
                      <Text style={st.detailValue}>
                        {isSupplier
                          ? s.schools.find((x: any) => x.id === selected.school)
                              .short
                          : s.suppliers.find(
                              (x: any) => x.id === selected.supplier,
                            ).short}
                      </Text>
                    </View>
                    <View style={st.detailRow}>
                      <Text style={st.detailLabel}>Entrega</Text>
                      <Text style={st.detailValue}>
                        12 de novembro · {selected.time}
                      </Text>
                    </View>
                    <View style={st.detailRow}>
                      <Text style={st.detailLabel}>Situação</Text>
                      <Text style={st.detailValue}>
                        {
                          {
                            scheduled: "Agendada",
                            dispatched: "A caminho",
                            received: "Conferida",
                          }[selected.status as "scheduled"]
                        }
                      </Text>
                    </View>
                    {isSupplier && selected.status === "scheduled" && (
                      <>
                        <Text style={st.inputHelp}>
                          Confirme a saída quando a mercadoria estiver pronta
                          para seguir à escola. Esta ação precisa de conexão.
                        </Text>
                        <Btn
                          label={
                            busy ? "Registrando…" : "Confirmar saída da entrega"
                          }
                          onPress={() => send("dispatch", { id: selected.id })}
                          disabled={busy || !online}
                          icon="truck"
                        />
                      </>
                    )}
                    {!isSupplier && selected.status === "dispatched" && (
                      <>
                        <Text style={st.fieldLabel}>
                          Quantidade recebida em kg
                        </Text>
                        <TextInput
                          accessibilityLabel="Quantidade recebida em quilogramas"
                          keyboardType="decimal-pad"
                          value={value}
                          onChangeText={setValue}
                          placeholderTextColor={C.muted}
                          style={st.input}
                        />
                        <Text style={st.fieldLabel}>
                          Quantidade rejeitada em kg
                        </Text>
                        <TextInput
                          accessibilityLabel="Quantidade rejeitada em quilogramas"
                          keyboardType="decimal-pad"
                          value={reject}
                          onChangeText={setReject}
                          placeholderTextColor={C.muted}
                          style={st.input}
                        />
                        <Text style={st.fieldLabel}>Motivo ou observação</Text>
                        <TextInput
                          accessibilityLabel="Motivo da rejeição ou observação"
                          multiline
                          value={note}
                          onChangeText={setNote}
                          placeholder="Descreva a conferência"
                          style={[
                            st.input,
                            { minHeight: 75, textAlignVertical: "top" },
                          ]}
                        />
                        <View style={st.tip}>
                          <Icon name="check" />
                          <Text style={st.tipText}>
                            Aceito:{" "}
                            {fmt(
                              Math.max(
                                0,
                                Number(value.replace(",", ".")) -
                                  Number(reject.replace(",", ".")),
                              ) || 0,
                            )}{" "}
                            kg. Rejeitado: {reject || "0"} kg.
                          </Text>
                        </View>
                        <Text style={st.inputHelp}>
                          A coordenação verá o que foi aceito. Sem conexão, a
                          anotação ficará pendente neste aparelho.
                        </Text>
                        <Btn
                          label={
                            busy
                              ? "Registrando…"
                              : online
                                ? "Confirmar recebimento"
                                : "Salvar conferência pendente"
                          }
                          disabled={busy}
                          onPress={() =>
                            send("receive", {
                              id: selected.id,
                              delivered: value,
                              rejected: reject,
                              note,
                            })
                          }
                          icon="check"
                        />
                      </>
                    )}
                    {selected.status === "received" && (
                      <View style={st.receiptCard}>
                        <Icon name="check" size={24} />
                        <Text style={st.receiptTitle}>
                          Conferência concluída
                        </Text>
                        <Text style={st.receiptText}>
                          {fmt(selected.receipt.accepted)} kg aceitos ·{" "}
                          {fmt(selected.receipt.rejected)} kg rejeitados
                        </Text>
                        {selected.receipt.note ? (
                          <Text style={st.receiptText}>
                            {selected.receipt.note}
                          </Text>
                        ) : null}
                      </View>
                    )}
                    {!isSupplier && selected.status === "scheduled" && (
                      <Text style={st.inputHelp}>
                        Aguarde o produtor registrar a saída antes de conferir a
                        mercadoria. A agenda será atualizada automaticamente.
                      </Text>
                    )}
                  </>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </View>
  );
  function delivery(d: any) {
    return (
      <Pressable
        key={d.id}
        accessibilityRole="button"
        accessibilityLabel={`${s.products.find((p: any) => p.id === d.product).name}, ${fmt(d.qty)} quilogramas, ${isSupplier ? s.schools.find((x: any) => x.id === d.school).short : s.suppliers.find((x: any) => x.id === d.supplier).short}, ${d.status === "scheduled" ? "agendada" : d.status === "dispatched" ? "a caminho" : "conferida"}. Ver detalhes.`}
        onPress={() => openDelivery(d)}
        style={({ pressed }) => [
          st.deliveryCard,
          pressed && { backgroundColor: "#f0f4e5" },
        ]}
      >
        <View style={st.deliveryTop}>
          <View
            style={[
              st.foodIcon,
              {
                backgroundColor: d.product === "banana" ? "#FFF1BE" : "#FFE2DA",
              },
            ]}
          >
            <Icon
              name={d.product === "banana" ? "banana" : "carrot"}
              size={22}
              color={d.product === "banana" ? "#795015" : "#8A3021"}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={st.deliveryProduct}>
              {s.products.find((p: any) => p.id === d.product).name}
            </Text>
            <Text style={st.deliveryMeta}>
              {isSupplier
                ? s.schools.find((x: any) => x.id === d.school).short
                : s.suppliers.find((x: any) => x.id === d.supplier).short}
            </Text>
          </View>
          <Text style={st.deliveryQty}>
            {fmt(d.qty)}
            <Text style={st.qtyUnit}> kg</Text>
          </Text>
        </View>
        <View style={st.deliveryBottom}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Icon name="clock" size={13} color="#7e8d70" />
            <Text style={st.deliveryTime}>12 nov · {d.time}</Text>
          </View>
          <View
            style={[
              st.status,
              d.status === "dispatched" && { backgroundColor: "#e5edf2" },
              d.status === "received" && { backgroundColor: "#e7efda" },
            ]}
          >
            <View
              style={[
                st.statusDot,
                d.status === "received" && { backgroundColor: "#6a8e48" },
                d.status === "dispatched" && { backgroundColor: "#6e91a4" },
              ]}
            />
            <Text style={st.statusText}>
              {
                {
                  scheduled: "Agendada",
                  dispatched: "A caminho",
                  received: "Conferida",
                }[d.status as "scheduled"]
              }
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }
}
const serif = "Bricolage";
const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.bg,
  },
  mobileContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    backgroundColor: C.bg,
  },
  header: {
    paddingTop: 25,
    paddingHorizontal: 25,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { flexDirection: "row", alignItems: "center", gap: 7 },
  logoName: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: -1.2,
    color: C.green,
  },
  logoSub: {
    fontSize: 14,
    letterSpacing: 4.6,
    color: C.green,
    marginTop: 1,
    fontWeight: "500",
  },
  profileButton: {
    width: 41,
    height: 41,
    borderRadius: 30,
    backgroundColor: "#D7F26A",
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: { fontSize: 14, fontWeight: "600", color: "#48685F" },
  connectionBar: {
    marginHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  connectionDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#799f56",
  },
  connectionText: { fontSize: 14, color: "#48685F", flex: 1 },
  cycleSmall: { fontSize: 14, letterSpacing: 1.1, color: "#48685F" },
  content: { paddingHorizontal: 25, paddingTop: 22, paddingBottom: 20 },
  greeting: {
    fontSize: 15,
    color: "#48685F",
    fontWeight: "500",
    marginBottom: 19,
  },
  hero: {
    minHeight: 239,
    padding: 22,
    paddingBottom: 100,
    borderRadius: 15,
    backgroundColor: "#E8F6C7",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#BCD1CA",
  },
  heroText: { zIndex: 1 },
  label: {
    fontSize: 14,
    letterSpacing: 1.8,
    fontWeight: "600",
    color: "#48685F",
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: serif,
    fontSize: 35,
    lineHeight: 37,
    color: C.green,
    letterSpacing: -1.2,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#48685F",
    marginTop: 12,
  },
  garden: {
    position: "absolute",
    bottom: -12,
    right: -28,
    width: "100%",
    maxWidth: 400,
  },
  miniStats: {
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: C.line,
    paddingVertical: 19,
    marginTop: 17,
    marginBottom: 26,
  },
  miniStat: { flex: 1, paddingHorizontal: 21 },
  miniNumber: {
    fontSize: 29,
    color: C.green,
    letterSpacing: -1,
    marginTop: 9,
    fontWeight: "500",
  },
  numberUnit: {
    fontSize: 13,
    color: "#48685F",
    fontWeight: "400",
    letterSpacing: 0,
  },
  miniLabel: { fontSize: 14, color: "#48685F", marginTop: 5 },
  statDivider: { width: 1, backgroundColor: C.line, marginVertical: 4 },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 19,
    color: C.green,
    fontWeight: "500",
    letterSpacing: -0.6,
  },
  smallButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  smallLink: { fontSize: 14, color: "#105B42", fontWeight: "500" },
  deliveryCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 11,
    padding: 16,
    marginBottom: 12,
  },
  deliveryTop: { flexDirection: "row", gap: 11, alignItems: "center" },
  foodIcon: {
    width: 40,
    height: 40,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryProduct: { fontSize: 14, fontWeight: "500", color: C.green },
  deliveryMeta: { fontSize: 14, color: "#48685F", marginTop: 5 },
  deliveryQty: {
    fontSize: 22,
    color: C.green,
    fontWeight: "500",
    letterSpacing: -0.7,
  },
  qtyUnit: {
    fontSize: 14,
    fontWeight: "400",
    color: "#48685F",
    letterSpacing: 0,
  },
  deliveryBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#BCD1CA",
    paddingTop: 12,
    marginTop: 14,
  },
  deliveryTime: { fontSize: 14, color: "#48685F" },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#FFF1BE",
    borderRadius: 5,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#a08343",
  },
  statusText: { fontSize: 14, fontWeight: "500", color: "#48685F" },
  communityCard: {
    backgroundColor: "#DFF2F7",
    borderRadius: 10,
    padding: 18,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginTop: 14,
  },
  communityTitle: { fontSize: 14, color: "#105B42", fontWeight: "500" },
  communityText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#48685F",
    marginTop: 5,
  },
  bottomNav: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: C.line,
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 10,
  },
  navItem: {
    flex: 1,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navIcon: {
    width: 48,
    height: 29,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  navIconActive: { backgroundColor: "#D7F26A" },
  navText: { fontSize: 14, color: "#48685F" },
  navTextActive: { color: C.green, fontWeight: "600" },
  footer: {
    fontSize: 14,
    letterSpacing: 1.1,
    textAlign: "center",
    color: "#48685F",
    marginVertical: 26,
    lineHeight: 21,
  },
  pageTitle: {
    fontFamily: serif,
    fontSize: 38,
    color: C.green,
    letterSpacing: -1.1,
    marginBottom: 9,
  },
  pageSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: C.muted,
    marginBottom: 22,
  },
  capacityCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: C.line,
    padding: 20,
    borderRadius: 12,
    marginBottom: 17,
  },
  capacityTop: { flexDirection: "row", gap: 10, alignItems: "center" },
  capacityTitle: { fontSize: 17, fontWeight: "500", color: C.green, flex: 1 },
  confirmedPill: { backgroundColor: "#E8F6C7", padding: 6, borderRadius: 4 },
  confirmedText: { fontSize: 14, color: "#48685F" },
  capacityNumber: {
    fontSize: 47,
    fontWeight: "400",
    color: C.green,
    letterSpacing: -2,
    marginTop: 23,
  },
  capacityUnit: {
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: 0,
    color: "#48685F",
  },
  capacityDescription: { fontSize: 14, color: "#48685F", marginTop: 4 },
  capacityFoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: C.line,
    marginTop: 20,
    paddingTop: 6,
  },
  capacityLimit: { fontSize: 14, color: "#48685F" },
  tip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 17,
    backgroundColor: "#E8F6C7",
    borderRadius: 10,
  },
  tipText: { flex: 1, fontSize: 14, lineHeight: 21, color: "#48685F" },
  proposalCard: {
    backgroundColor: "#075E78",
    borderRadius: 12,
    padding: 21,
    marginBottom: 25,
  },
  proposalIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.lime,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  proposalTitle: {
    fontSize: 19,
    lineHeight: 24,
    color: "#FFFFFF",
    fontWeight: "500",
    letterSpacing: -0.6,
  },
  proposalText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#DFF2F7",
    marginTop: 9,
    marginBottom: 17,
  },
  button: {
    minHeight: 48,
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: C.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  secondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BCD1CA",
  },
  buttonText: { color: "#fff", fontWeight: "500", fontSize: 14 },
  proposalLine: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  proposalQty: { fontSize: 18, color: C.green },
  event: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  eventIcon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#E8F6C7",
    alignItems: "center",
    justifyContent: "center",
  },
  eventTitle: { fontSize: 13, fontWeight: "500", color: C.green },
  eventText: { fontSize: 14, lineHeight: 21, color: C.muted, marginTop: 6 },
  eventTime: { fontSize: 14, color: "#48685F", marginTop: 9 },
  accountCard: {
    alignItems: "center",
    padding: 25,
    backgroundColor: "#DFF2F7",
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 13,
    marginBottom: 28,
  },
  accountAvatar: {
    width: 68,
    height: 68,
    backgroundColor: "#D7F26A",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  accountName: {
    fontFamily: serif,
    fontSize: 29,
    color: C.green,
    textAlign: "center",
  },
  accountRole: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    marginTop: 7,
  },
  demoPill: {
    backgroundColor: "#E8F6C7",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 19,
  },
  demoPillText: { fontSize: 14, color: "#48685F" },
  accessRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  accessName: { flex: 1, fontSize: 14, color: C.green },
  input: {
    borderWidth: 1,
    borderColor: "#BCD1CA",
    backgroundColor: "white",
    borderRadius: 7,
    minHeight: 49,
    padding: 13,
    fontSize: 13,
    color: C.green,
    marginVertical: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: C.green,
    marginTop: 15,
  },
  bigInput: {
    borderWidth: 1,
    borderColor: "#105B42",
    borderRadius: 9,
    padding: 18,
    fontSize: 36,
    color: C.green,
    marginVertical: 15,
    backgroundColor: "white",
  },
  inputHelp: {
    fontSize: 14,
    lineHeight: 21,
    color: C.muted,
    marginBottom: 23,
    marginTop: 10,
  },
  logout: { alignItems: "center", padding: 25 },
  disclaimer: { fontSize: 14, lineHeight: 21, color: "#48685F", marginTop: 10 },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#172e23a6",
    alignItems: "center",
  },
  sheet: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: Platform.OS === "web" ? 15 : 25,
  },
  sheetHandle: {
    height: 4,
    width: 35,
    borderRadius: 4,
    backgroundColor: "#BCD1CA",
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 21,
    fontWeight: "500",
    color: C.green,
    flex: 1,
    letterSpacing: -0.6,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetIntro: {
    fontSize: 14,
    lineHeight: 20,
    color: C.muted,
    marginBottom: 12,
  },
  deliveryDetailHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    backgroundColor: "#FFF1BE",
    borderRadius: 11,
    marginBottom: 15,
  },
  deliveryDetailProduct: { fontSize: 25, fontFamily: serif, color: C.green },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  detailLabel: { fontSize: 14, color: C.muted },
  detailValue: {
    fontSize: 14,
    color: C.green,
    textAlign: "right",
    maxWidth: "70%",
  },
  receiptCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#E8F6C7",
    alignItems: "center",
  },
  receiptTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: C.green,
    marginTop: 10,
  },
  receiptText: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },
  toast: {
    position: "absolute",
    bottom: Platform.OS === "web" ? 95 : 117,
    left: 16,
    right: 16,
    backgroundColor: "#105B42",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    shadowColor: "#17361c",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  toastText: { flex: 1, color: "white", fontSize: 14, lineHeight: 21 },
  error: { color: "#8A3021", fontSize: 14, lineHeight: 21 },
  errorBox: {
    padding: 15,
    backgroundColor: "#FFE2DA",
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    gap: 8,
  },
  pendingBox: {
    padding: 18,
    backgroundColor: "#FFF1BE",
    borderWidth: 1,
    borderColor: "#D5B768",
    borderRadius: 11,
    marginBottom: 20,
  },
  pendingTitle: { fontSize: 13, color: C.amber, fontWeight: "500", flex: 1 },
  pendingText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#795015",
    marginVertical: 11,
  },
  welcome: {
    paddingHorizontal: 28,
    paddingTop: 38,
    paddingBottom: 25,
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
  },
  welcomeArt: {
    marginTop: 30,
    backgroundColor: "#DFF2F7",
    borderRadius: 15,
    overflow: "hidden",
  },
  welcomeTitle: {
    fontSize: 36,
    fontFamily: serif,
    lineHeight: 40,
    color: C.green,
    letterSpacing: -1.1,
    marginTop: 28,
  },
  welcomeText: {
    fontSize: 13,
    lineHeight: 22,
    color: C.muted,
    marginTop: 15,
    marginBottom: 24,
  },
  welcomeBox: {
    backgroundColor: "#fff",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: C.line,
    padding: 20,
  },
  welcomeBoxTitle: { fontSize: 17, color: C.green, fontWeight: "500" },
  demoButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 22,
    minHeight: 48,
  },
  demoText: { fontSize: 14, color: C.green, fontWeight: "500" },
  welcomeFooter: {
    fontSize: 14,
    color: "#48685F",
    letterSpacing: 1.2,
    textAlign: "center",
    marginTop: 20,
  },
  muted: { fontSize: 14, color: C.muted, textAlign: "center", marginTop: 10 },
});

const st = {
  ...baseStyles,
  ...StyleSheet.create({
    logoName: { ...baseStyles.logoName, fontFamily: serif, fontSize: 27 },
    logoSub: { ...baseStyles.logoSub, fontSize: 11, letterSpacing: 3 },
    header: {
      ...baseStyles.header,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: "#FFFFFF",
      borderBottomWidth: 1,
      borderColor: C.line,
    },
    profileButton: {
      ...baseStyles.profileButton,
      width: 48,
      height: 48,
      borderWidth: 1,
      borderColor: C.green,
    },
    connectionBar: {
      ...baseStyles.connectionBar,
      marginHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 12,
    },
    content: { ...baseStyles.content, paddingHorizontal: 20 },
    hero: {
      ...baseStyles.hero,
      minHeight: 0,
      padding: 22,
      paddingBottom: 0,
      backgroundColor: "#E8F6C7",
      borderColor: C.green,
      borderWidth: 1.5,
      borderRadius: 18,
    },
    heroTitle: {
      ...baseStyles.heroTitle,
      fontSize: 34,
      lineHeight: 36,
      fontFamily: serif,
    },
    heroSubtitle: {
      ...baseStyles.heroSubtitle,
      fontSize: 16,
      lineHeight: 23,
      maxWidth: 360,
    },
    garden: {
      ...baseStyles.garden,
      position: "relative",
      bottom: 0,
      right: 0,
      width: "100%",
      marginTop: 18,
    },
    miniStats: {
      ...baseStyles.miniStats,
      borderRadius: 15,
      borderColor: C.green,
    },
    miniStat: { ...baseStyles.miniStat, paddingHorizontal: 16 },
    miniNumber: { ...baseStyles.miniNumber, fontFamily: serif, fontSize: 32 },
    miniLabel: { ...baseStyles.miniLabel, lineHeight: 20 },
    sectionTitle: {
      ...baseStyles.sectionTitle,
      fontFamily: serif,
      fontSize: 21,
      lineHeight: 26,
    },
    pageTitle: { ...baseStyles.pageTitle, fontSize: 34, lineHeight: 39 },
    pageSubtitle: { ...baseStyles.pageSubtitle, fontSize: 16, lineHeight: 23 },
    deliveryCard: {
      ...baseStyles.deliveryCard,
      borderRadius: 15,
      borderColor: C.line,
      padding: 18,
      borderLeftWidth: 4,
      borderLeftColor: C.green,
    },
    deliveryProduct: {
      ...baseStyles.deliveryProduct,
      fontSize: 18,
      fontFamily: serif,
    },
    deliveryMeta: { ...baseStyles.deliveryMeta, fontSize: 15, lineHeight: 20 },
    deliveryQty: { ...baseStyles.deliveryQty, fontFamily: serif, fontSize: 26 },
    deliveryBottom: { ...baseStyles.deliveryBottom, flexWrap: "wrap", gap: 10 },
    status: { ...baseStyles.status, minHeight: 32 },
    button: {
      ...baseStyles.button,
      minHeight: 52,
      borderRadius: 10,
      paddingVertical: 14,
    },
    buttonText: { ...baseStyles.buttonText, fontSize: 16, flexShrink: 1 },
    bottomNav: { ...baseStyles.bottomNav, paddingBottom: 12, paddingTop: 8 },
    navText: { ...baseStyles.navText, fontSize: 13 },
    navIcon: { ...baseStyles.navIcon, width: 54, height: 32 },
    capacityTitle: {
      ...baseStyles.capacityTitle,
      fontFamily: serif,
      fontSize: 22,
    },
    capacityNumber: { ...baseStyles.capacityNumber, fontFamily: serif },
    capacityFoot: { ...baseStyles.capacityFoot, flexWrap: "wrap", gap: 10 },
    capacityLimit: { ...baseStyles.capacityLimit, flexShrink: 1 },
    input: {
      ...baseStyles.input,
      fontFamily: "SourceRegular",
      fontSize: 17,
      minHeight: 54,
    },
    bigInput: { ...baseStyles.bigInput, fontFamily: serif },
    sheet: {
      ...baseStyles.sheet,
      paddingHorizontal: 22,
      borderWidth: 1.5,
      borderColor: C.green,
    },
    sheetTop: {
      ...baseStyles.sheetTop,
      borderBottomWidth: 1,
      borderColor: C.line,
      paddingBottom: 15,
    },
    sheetTitle: {
      ...baseStyles.sheetTitle,
      fontFamily: serif,
      fontSize: 25,
      lineHeight: 29,
    },
    sheetIntro: { ...baseStyles.sheetIntro, fontSize: 16, lineHeight: 23 },
    accountName: { ...baseStyles.accountName, fontSize: 28, lineHeight: 34 },
    welcome: { ...baseStyles.welcome, paddingHorizontal: 22 },
    welcomeTitle: { ...baseStyles.welcomeTitle, fontSize: 37, lineHeight: 41 },
    welcomeText: { ...baseStyles.welcomeText, fontSize: 17, lineHeight: 25 },
    welcomeArt: {
      ...baseStyles.welcomeArt,
      borderWidth: 1.5,
      borderColor: C.green,
    },
    welcomeBox: {
      ...baseStyles.welcomeBox,
      borderColor: C.green,
      borderRadius: 15,
    },
    welcomeBoxTitle: {
      ...baseStyles.welcomeBoxTitle,
      fontFamily: serif,
      fontSize: 22,
    },
    footer: { ...baseStyles.footer, letterSpacing: 0, lineHeight: 20 },
    welcomeFooter: {
      ...baseStyles.welcomeFooter,
      letterSpacing: 0,
      lineHeight: 20,
    },
    toastText: { ...baseStyles.toastText, fontSize: 15, lineHeight: 21 },
    error: { ...baseStyles.error, flexShrink: 1, fontSize: 15, lineHeight: 22 },
    detailValue: {
      ...baseStyles.detailValue,
      flexShrink: 1,
      fontSize: 16,
      lineHeight: 22,
    },
    detailLabel: { ...baseStyles.detailLabel, fontSize: 15, lineHeight: 22 },
    communityText: { ...baseStyles.communityText, lineHeight: 22 },
    tipText: { ...baseStyles.tipText, fontSize: 15, lineHeight: 22 },
  }),
};
