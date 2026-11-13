import { useEffect, lazy, Suspense } from "react";
const Workspace = lazy(() => import("./App"));
import { PublicSite } from "./pages/PublicSite";
export default function Root() {
  const view = new URLSearchParams(location.search).get("view");
  const workspace =
    location.pathname.startsWith("/coordenacao") ||
    location.hash.includes("access=") ||
    (!!view && view !== "overview");
  useEffect(() => {
    if (workspace && !location.pathname.startsWith("/coordenacao"))
      history.replaceState(
        {},
        "",
        "/coordenacao" + location.search + location.hash,
      );
  }, []);
  return workspace ? (
    <Suspense
      fallback={
        <main className="loading-page">
          <h1>Abrindo a coordenação…</h1>
        </main>
      }
    >
      <Workspace />
    </Suspense>
  ) : (
    <PublicSite />
  );
}
