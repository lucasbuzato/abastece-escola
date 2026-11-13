import { useId } from "react";

/** An edible garden drawn in the same flat, outlined language as the journey scene. */
export function BotanicalAccent({ className = "" }: { className?: string }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg className={"botanical-accent " + className} viewBox="0 0 360 480" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <path id={id + "-bean"} d="M0 0C-31-3-56-24-53-53C-27-57 3-32 0 0Z" />
        <path id={id + "-collard"} d="M0 0C-12-16-48-10-51-30C-76-32-83-55-69-71C-92-92-78-115-57-114C-55-142-29-150-11-130C8-151 36-140 34-113C64-111 69-84 51-69C73-46 48-23 29-27C26-7 10-10 0 0Z" />
      </defs>
      <g className="garden-beans" stroke="#123F35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path className="botanical-stem" d="M223 458C232 355 199 278 222 197C249 104 298 93 277 29M222 202C191 160 179 130 176 98M239 147C275 144 304 122 311 96" />
        <path d="M278 63C299 51 306 28 292 22C281 17 276 31 285 34M212 251C180 227 160 229 166 244C170 255 182 246 175 241" />
        <use href={"#" + id + "-bean"} className="botanical-leaf" transform="translate(229 181) rotate(4)" fill="#A8D195" />
        <use href={"#" + id + "-bean"} className="botanical-leaf" transform="translate(249 121) rotate(99) scale(.86)" fill="#D7F26A" />
        <use href={"#" + id + "-bean"} className="botanical-leaf" transform="translate(277 69) rotate(7) scale(.7)" fill="#66A77B" />
        <use href={"#" + id + "-bean"} className="botanical-leaf" transform="translate(177 115) rotate(-23) scale(.68)" fill="#66A77B" />
        <path d="M226 178L194 142M251 121L282 103M277 67L255 41M176 113L145 98" stroke="#286C50" strokeWidth="1.5" />
        <path d="M282 157C304 171 305 204 281 232C287 204 278 183 282 157Z" fill="#D7F26A" />
        <path d="M282 159L273 145M288 174C294 189 290 204 286 214" stroke="#286C50" strokeWidth="1.5" />
        <g fill="#FFD35B" strokeWidth="1.5"><path d="M310 95C292 92 296 77 307 82C311 66 325 75 319 85C334 85 328 101 317 96C313 110 300 105 310 95Z" /><circle cx="313" cy="90" r="3" fill="#123F35" /></g>
      </g>
      <g className="garden-greens" stroke="#123F35" strokeWidth="2.5" strokeLinejoin="round">
        <g className="botanical-leaf" transform="translate(200 391) rotate(-35) scale(1.23)">
          <use href={"#" + id + "-collard"} fill="#66A77B" />
          <path d="M0 10L-12-117M-3-17L-43-34M-6-43L-61-68M-8-68L-58-99M-4-29L24-49M-7-58L37-84M-10-88L17-111" stroke="#D7F26A" strokeWidth="1.6" />
        </g>
        <g className="botanical-leaf" transform="translate(228 412) rotate(30) scale(1.35)">
          <use href={"#" + id + "-collard"} fill="#286C50" />
          <path d="M0 10L-12-117M-3-17L-43-34M-6-43L-61-68M-8-68L-58-99M-4-29L24-49M-7-58L37-84M-10-88L17-111" stroke="#A8D195" strokeWidth="1.6" />
        </g>
        <g className="botanical-leaf" transform="translate(156 432) rotate(-66) scale(.94)">
          <use href={"#" + id + "-collard"} fill="#A8D195" />
          <path d="M0 12L-12-117M-3-17L-43-34M-6-43L-61-68M-8-68L-58-99M-4-29L24-49M-7-58L37-84M-10-88L17-111" stroke="#286C50" strokeWidth="1.6" />
        </g>
        <path d="M200 390L222 461M227 410L222 461M156 432L222 461" strokeWidth="4" />
      </g>
      <g className="garden-carrots" stroke="#123F35" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M286 371C269 382 290 441 308 462C311 433 315 377 299 372Z" fill="#F28D45" />
        <path d="M292 389L302 387M296 407L307 405M301 425L308 424" />
        <path d="M294 374C286 347 282 322 270 303M294 374C309 347 319 323 317 302M294 374L295 309" stroke="#286C50" strokeWidth="3" />
        <path d="M283 332L265 325M280 324L283 308M289 349L275 344M291 345L298 335M307 343L323 331M313 327L305 316M295 330L287 319M295 321L304 309" stroke="#286C50" strokeWidth="3" />
      </g>
      <g fill="#FFD35B" stroke="#123F35" strokeWidth="1.5"><path d="M87 221l3-9 3 9 9 3-9 3-3 9-3-9-9-3Z" /><circle cx="133" cy="190" r="3" /><circle cx="332" cy="267" r="3" /></g>
      <path d="M65 462C123 450 230 478 326 456" stroke="#123F35" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
