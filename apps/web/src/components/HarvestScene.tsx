import { useId } from "react";

/** All artwork stays inside the viewBox. Animated groups do not replace placement transforms. */
export function HarvestScene() {
  const clip = useId().replaceAll(":", "") + "-scene";
  return (
    <svg
      className="harvest-scene"
      viewBox="0 0 680 420"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Ilustração do caminho dos alimentos: uma propriedade rural, um veículo de entrega e uma escola."
    >
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="0" width="680" height="420" rx="20" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="680" height="420" fill="#DFF2F7" />
        <circle cx="535" cy="79" r="45" fill="#FFD35B" />
        <path
          className="scene-clouds"
          d="M385 67h53m-31-14h62M45 83h47m-25 14h47"
          stroke="#FFFFFF"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path d="M0 204Q137 112 287 184T680 161V420H0Z" fill="#A8D195" />
        <path d="M0 265Q153 154 337 247T680 217V420H0Z" fill="#66A77B" />
        <path d="M0 310Q160 245 296 307T680 280V420H0Z" fill="#286C50" />
        <g stroke="#D5E2E7" fill="none" strokeLinecap="round">
          <path d="M124 260V283L143 319" strokeWidth="17" />
          <path d="M530 271L534 296L546 319" strokeWidth="19" />
        </g>
        <ellipse cx="123" cy="265" rx="78" ry="6" fill="#123F35" opacity=".1" />
        <ellipse cx="530" cy="275" rx="75" ry="6" fill="#123F35" opacity=".1" />
        <path
          data-scene-part="road"
          d="M-30 363C90 317 190 315 280 326C340 334 400 340 460 334C550 327 610 300 710 264"
          stroke="#D5E2E7"
          strokeWidth="60"
          fill="none"
        />
        <path
          className="route-dashes"
          d="M-30 363C90 317 190 315 280 326C340 334 400 340 460 334C550 327 610 300 710 264"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="11 15"
          fill="none"
        />
        <g data-scene-part="farm" transform="translate(45 131)">
          <path d="m0 38 79-46 73 46v91H0Z" fill="#D9553A" />
          <path d="m-10 37 89-54 83 54-9 11-74-46-80 46Z" fill="#8B352B" />
          <path d="M56 68h45v61H56Z" fill="#FFFFFF" />
          <path d="M79 68v61M56 89h45" stroke="#8B352B" strokeWidth="3" />
          <path d="M18 64h23v24H18Zm96 0h20v24h-20Z" fill="#FFD35B" />
          <path
            d="M21 0v-29h18v17"
            stroke="#8B352B"
            strokeWidth="9"
            fill="none"
          />
        </g>
        <g stroke="#D7F26A" strokeWidth="2" fill="none">
          <path d="M10 284l80-22M10 294l90-24M10 304l100-26M10 314l80-21" />
        </g>
        <g transform="translate(231 186)" fill="#123F35">
          <path d="M0 75V11M0 44C-31 41-32 14-32 14S0 16 0 44M0 28C25 26 30 1 30 1S0 3 0 28" />
          <path d="M47 83V48M47 68C30 65 30 48 30 48S47 50 47 68M47 57c19-1 20-18 20-18S47 40 47 57" />
        </g>
        <g data-scene-part="school" transform="translate(462 130)">
          <path d="M0 30 68-10l69 40v111H0Z" fill="#FFFFFF" />
          <path
            d="m-12 31 80-48 81 48"
            stroke="#075E78"
            strokeWidth="11"
            strokeLinejoin="round"
            fill="none"
          />
          <rect x="53" y="87" width="31" height="54" fill="#075E78" />
          <g fill="#7CC4D5">
            <rect x="16" y="53" width="22" height="25" />
            <rect x="98" y="53" width="22" height="25" />
            <rect x="16" y="91" width="22" height="25" />
            <rect x="98" y="91" width="22" height="25" />
          </g>
          <path
            d="M67-10v-37h40v22H68"
            fill="#FFD35B"
            stroke="#075E78"
            strokeWidth="2"
          />
          <circle cx="68" cy="48" r="15" fill="#DFF2F7" />
          <path
            d="M68 39v10l6 3"
            stroke="#075E78"
            strokeWidth="2"
            fill="none"
          />
        </g>
        <g data-scene-part="vehicle" transform="translate(330 286)">
          <g className="delivery-van">
            <ellipse
              cx="9"
              cy="55"
              rx="69"
              ry="9"
              fill="#075E78"
              opacity=".12"
            />
            <path d="M-58 1h89v44h-89Z" fill="#075E78" />
            <path d="M31 14h25l25 23v8H31Z" fill="#147D94" />
            <path d="M38 20h16l14 13H38Z" fill="#B4E0EB" />
            <path d="M-57 39H79" stroke="#FFD35B" strokeWidth="4" />
            <circle cx="-35" cy="47" r="12" fill="#123F35" />
            <circle cx="58" cy="47" r="12" fill="#123F35" />
            <circle cx="-35" cy="47" r="5" fill="#FFFFFF" />
            <circle cx="58" cy="47" r="5" fill="#FFFFFF" />
            <path
              d="M-12 31V13m0 13c-13-1-13-12-13-12s13 0 13 12m0-6c12-1 13-12 13-12S-12 8-12 20"
              fill="#FFD35B"
            />
            <rect x="74" y="36" width="6" height="5" fill="#FFD35B" />
          </g>
        </g>
        <g fill="#FFD35B">
          <path d="m40 380 13-8 13 8-13 8Zm28 0 13-8 13 8-13 8Zm-14 16 13-8 13 8-13 8Z" />
        </g>
        <path d="M0 414H680" stroke="#123F35" strokeWidth="12" />
      </g>
    </svg>
  );
}
