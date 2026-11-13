import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Scoped animations restore their original DOM state when paused or unmounted. */
export function useSiteMotion(
  root: RefObject<HTMLDivElement | null>,
  paused: boolean,
) {
  useLayoutEffect(() => {
    if (!root.current || paused) return;
    let alive = true;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 960px)",
        },
        ({ conditions }) => {
          if (!conditions?.motion) return;
          const container = root.current!;
          const select = gsap.utils.selector(container);
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          intro
            .from(select(".hero-line"), {
              y: 32,
              opacity: 0,
              stagger: 0.11,
              duration: 0.75,
            })
            .from(
              select(".site-hero-copy > p"),
              { y: 16, opacity: 0, duration: 0.65 },
              0.25,
            )
            .from(
              select(".site-hero-actions"),
              { y: 12, opacity: 0, duration: 0.55 },
              0.4,
            )
            .from(
              select(".hero-postcard"),
              { y: 40, rotation: -1, opacity: 0, duration: 0.95 },
              0.1,
            )
            .from(
              select(".harvest-stamp"),
              {
                scale: 0.82,
                rotation: 2,
                opacity: 0,
                duration: 0.55,
                ease: "back.out(1.25)",
              },
              0.65,
            )
            .from(
              select(".hero-message"),
              { y: 15, opacity: 0, duration: 0.6 },
              0.75,
            );
          // Suspension stays within 1.2 SVG units. The vehicle never leaves the road.
          const ambient = gsap.timeline({
            repeat: -1,
            yoyo: true,
            paused: true,
          });
          ambient
            .to(
              select(".site-hero .delivery-van"),
              { y: 1.2, duration: 0.8, ease: "sine.inOut" },
              0,
            )
            .to(
              select(".site-hero .scene-clouds"),
              { x: 8, duration: 4, ease: "sine.inOut" },
              0,
            );
          ScrollTrigger.create({
            trigger: container.querySelector(".site-hero"),
            start: "top bottom",
            end: "bottom top",
            onEnter: () => ambient.play(),
            onEnterBack: () => ambient.play(),
            onLeave: () => ambient.pause(),
            onLeaveBack: () => ambient.pause(),
          });
          gsap.utils
            .toArray<HTMLElement>(
              ".site-section-title h2,.solution-copy h2,.audience-heading h2,.demo-heading h2,.site-impact h2,.site-faq h2",
              container,
            )
            .forEach((title) => {
              if (title.getBoundingClientRect().bottom < 0) return;
              gsap.from(title, {
                y: conditions.desktop ? 28 : 16,
                duration: 0.65,
                ease: "power2.out",
                scrollTrigger: { trigger: title, start: "top 90%", once: true },
              });
            });
          for (const group of gsap.utils.toArray<HTMLElement>(
            ".site-principles,.audience-grid,.demo-role-options",
            container,
          )) {
            gsap.from(group.children, {
              y: conditions.desktop ? 24 : 12,
              duration: 0.65,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: { trigger: group, start: "top 92%", once: true },
            });
          }
          for (const plant of gsap.utils.toArray<SVGSVGElement>(
            ".botanical-accent",
            container,
          )) {
            if (!plant.getBoundingClientRect().height) continue;
            const stem = plant.querySelector(".botanical-stem"),
              leaves = plant.querySelectorAll(".botanical-leaf");
            const grow = gsap.timeline({
              scrollTrigger: { trigger: plant, start: "top 95%", once: true },
            });
            if (stem)
              grow.fromTo(
                stem,
                {
                  attr: {
                    pathLength: 100,
                    "stroke-dasharray": "100 100",
                    "stroke-dashoffset": 100,
                  },
                },
                {
                  attr: { "stroke-dashoffset": 0 },
                  duration: 1.1,
                  ease: "power2.out",
                },
              );
            if (leaves.length)
              grow.from(
                leaves,
                {
                  scale: 0.82,
                  rotation: -4,
                  transformOrigin: "50% 100%",
                  stagger: 0.035,
                  duration: 0.7,
                  ease: "power2.out",
                },
                0.2,
              );
          }
          const arc = container.querySelector(".policy-donut .policy-arc");
          if (arc)
            gsap.fromTo(
              arc,
              { attr: { "stroke-dasharray": "0 100" } },
              {
                attr: { "stroke-dasharray": "45 55" },
                duration: 1.2,
                ease: "power2.inOut",
                scrollTrigger: {
                  trigger: arc.closest(".policy-donut"),
                  start: "top 85%",
                  once: true,
                },
              },
            );
          const photo = container.querySelector(".solution-photo img");
          if (photo)
            gsap.fromTo(
              photo,
              { clipPath: "inset(0% 0% 100% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.1,
                ease: "power3.inOut",
                scrollTrigger: { trigger: photo, start: "top 85%", once: true },
              },
            );
        },
        root,
      );
    }, root);
    document.fonts.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });
    return () => {
      alive = false;
      media.revert();
      context.revert();
    };
  }, [root, paused]);
}

/** A stage change animates its explanation, while the selected step remains readable. */
export function useStageMotion(
  root: RefObject<HTMLDivElement | null>,
  stage: number,
) {
  useLayoutEffect(() => {
    const node = root.current;
    if (
      !node ||
      node.closest(".motion-paused") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".journey-story-copy h3,.journey-story-copy > p,.story-action",
        { y: 12, opacity: 0.55 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.045, ease: "power2.out" },
      );
      gsap.fromTo(
        ".journey-preview > div",
        { y: 18, scale: 0.97, opacity: 0.6 },
        { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" },
      );
      const receiptBars = node.querySelectorAll(".receipt-preview-bar > span");
      if (receiptBars.length)
        gsap.fromTo(
          receiptBars,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        );
    }, node);
    return () => context.revert();
  }, [root, stage]);
}
