import type { Icon } from "@/island/kit";
import type { PropAnim, PropKind } from "@/island/props";
import type { Face, Pose, VillagerOpts } from "@/island/villager";

/**
 * 每章一段小島情境劇。台詞依原書改寫，原書沒寫的結果不補；
 * 非原書內容的台詞會標 supplement，畫面上顯示「導讀補充」。
 * 座標：x 左右、z 前後（正值靠近鏡頭），turn 以角度表示，0 為面向鏡頭。
 */

type PupOpts = { fur: number; patch?: number; size?: number; pointyEars?: boolean };
export type CastMember =
  | { kind: "villager"; name: string; opts: VillagerOpts }
  | { kind: "pup"; name: string; opts: PupOpts };

export type ActorSetup = {
  id: string;
  cast: CastMember;
  at: [number, number];
  turn?: number | string;
  pose?: Pose;
  face?: Face;
  hidden?: boolean;
  on?: string;
  /** 長椅上左右的位置 */
  slot?: number;
};
export type PropSetup = {
  id: string;
  kind: PropKind;
  at: [number, number, number];
  turn?: number;
  scale?: number;
  hidden?: boolean;
  label?: string;
  anim?: PropAnim;
};
export type ActorChange = {
  pose?: Pose;
  face?: Face;
  icon?: Icon;
  to?: [number, number];
  turn?: number | string;
  hold?: string | null;
  holdL?: string | null;
  on?: string | null;
  slot?: number;
  show?: boolean;
};
export type PropChange = {
  show?: boolean;
  to?: [number, number, number];
  turn?: number;
  anim?: PropAnim | "none";
};
export type Sky = "day" | "dusk" | "night";
export type Beat = {
  who: string;
  text: string;
  supplement?: boolean;
  act?: Record<string, ActorChange>;
  props?: Record<string, PropChange>;
  cam?: [number, number, number?];
  sky?: Sky;
};
export type SceneScript = {
  chapter: string;
  title: string;
  seed: number;
  sky?: Sky;
  cam?: [number, number, number?];
  trees?: [number, number][];
  actors: ActorSetup[];
  props: PropSetup[];
  beats: Beat[];
};

export const NARRATOR = "書裡說";
export const ASK = "換你想想";

/* ---------- 角色（原創動物村民，非任天堂角色） ---------- */
const v = (name: string, opts: VillagerOpts): CastMember => ({ kind: "villager", name, opts });
const AUTHOR = v("妮可", { species: "bunny", fur: 0xfff4ec, shirt: 0xf7a8b8, pants: 0x8fb8e8, flower: 0xffd65c, accent: 0xffe1e8 });
const YOU = v("你", { species: "cat", fur: 0xf6c88f, shirt: 0x8fdcc0, pants: 0x6c8fc7, accent: 0xfff1dc });
const ROOMMATE = v("室友", { species: "sheep", fur: 0xfffaf0, shirt: 0x7cc4ef, pants: 0x7a5a40, accent: 0x8a7a70 });
const KOBE: CastMember = { kind: "pup", name: "科比", opts: { fur: 0x3a302c, patch: 0xffffff, size: 0.95 } };
const MAX: CastMember = { kind: "pup", name: "麥克斯", opts: { fur: 0xc08a52, patch: 0x5a4030, size: 1.05, pointyEars: true } };
const MARTHA = v("瑪莎", { species: "mouse", fur: 0xd9d2cc, shirt: 0xffd65c, pants: 0x6f6aa8 });

/* ---------- 共用片段 ---------- */
const BACK_TREES: [number, number][] = [[-3.7, -2.1], [3.8, -1.9], [-2.4, -3.5], [2.6, -3.4], [0.2, -4.0]];

export const islandScenes: SceneScript[] = [
  /* 導言：刷牙與廚房門 */
  {
    chapter: "intro",
    title: "改用另一隻手刷牙",
    seed: 11,
    cam: [-0.4, 0.2],
    actors: [
      { id: "you", cast: YOU, at: [-1.3, 0.2], turn: -90 },
      { id: "nicole", cast: AUTHOR, at: [3.4, 1.4], turn: -90 },
      { id: "mate", cast: ROOMMATE, at: [2.0, 0.2], turn: 90, pose: "hold" },
    ],
    props: [
      { id: "sink", kind: "sink", at: [-2.05, 0, 0.2], turn: 90 },
      { id: "brush", kind: "toothbrush", at: [-1.95, 0.9, 0.5] },
      { id: "stove", kind: "stove", at: [2.75, 0, 0.2], turn: -90 },
      { id: "house", kind: "cottage", at: [3.0, 0, -2.4], turn: -20 },
    ],
    beats: [
      { who: NARRATOR, text: "每天早上刷牙，你大概想都不用想，就刷完了。", cam: [-1.4, 0.2, 0.75], act: { you: { pose: "brush", hold: "brush" } } },
      { who: NARRATOR, text: "假設你習慣用右手。現在，換左手試試看。", act: { you: { pose: "brushL", hold: null, holdL: "brush", face: "worried", icon: "sweat" } } },
      { who: "你", text: "好彆扭……每一下都要想著才做得到。", act: { you: { pose: "brushL", face: "worried", icon: "dots" } } },
      { who: NARRATOR, text: "到了隔天早上，手又自己換回右手了。", act: { you: { pose: "brush", holdL: null, hold: "brush", face: "surprised", icon: "!" } } },
      { who: "妮可", text: "我也請室友做飯時關上廚房的門，說了好幾次。", cam: [1.2, 0.3, 0.8], act: { you: { pose: "idle", hold: null, face: "smile" }, nicole: { to: [0.8, 0.5], turn: 55, pose: "talk" } } },
      { who: "室友", text: "啊！又忘了！", act: { mate: { turn: "nicole", face: "surprised", icon: "!", pose: "idle" } } },
      { who: "妮可", text: "他們不是壞人。做飯早就是一套自動流程，新規則還插不進去。", act: { nicole: { face: "smile", pose: "shrug" }, mate: { face: "smile", icon: "sweat" } } },
      { who: NARRATOR, text: "熟悉的動作走的是大腦省力的老路。想換新做法，得先注意到它，再多練幾次。", cam: [0, 0.2, 1], act: { you: { turn: 0, icon: "bulb" }, nicole: { turn: 0 }, mate: { turn: 0 } } },
    ],
  },

  /* 1.1 打破循環：作業與科比 */
  {
    chapter: "break-cycle",
    title: "交作業與嘆氣的科比",
    seed: 21,
    cam: [-1.2, 0],
    actors: [
      { id: "nicole", cast: AUTHOR, at: [-1.5, 0.2], turn: -90, on: "chair", pose: "write", face: "worried" },
      { id: "kobe", cast: KOBE, at: [2.3, 0.9], turn: -70, pose: "lie" },
    ],
    props: [
      { id: "desk", kind: "desk", at: [-2.15, 0, 0.2], turn: 90 },
      { id: "chair", kind: "chair", at: [-1.55, 0, 0.2], turn: -90 },
      { id: "papers", kind: "papers", at: [-2.15, 0.68, 0.2], turn: 90 },
      { id: "bench", kind: "bench", at: [1.2, 0, 0.2] },
    ],
    beats: [
      { who: "妮可", text: "讀大學時，每到交作業的日子，我都快崩潰。", cam: [-1.7, 0.2, 0.72], act: { nicole: { icon: "sweat" } } },
      { who: NARRATOR, text: "壓力一來，身體就拉起警報：心跳變快、呼吸變淺、腦袋只想著那件事。", act: { nicole: { pose: "nervous", icon: "!" } } },
      { who: "妮可", text: "讀碩士以後，我把繳交日當成一個機會：把事情做得更有條理。", act: { nicole: { pose: "write", face: "smile", icon: "bulb" } } },
      { who: NARRATOR, text: "同一件事，換個方式看待，壓力的意思也跟著變了。", act: { nicole: { face: "happy", icon: "sparkle" } } },
      { who: NARRATOR, text: "後來，作者發現自己常常在嘆氣。", cam: [1.6, 0.4, 0.8], act: { nicole: { on: null, to: [1.2, 0.3], pose: "sit", face: "calm", turn: 0 }, kobe: { pose: "lie" } } },
      { who: "妮可", text: "呼——", act: { nicole: { on: "bench", pose: "sigh", icon: "dots" } } },
      { who: NARRATOR, text: "每次她一嘆氣，邊境牧羊犬科比就顯得很不安。", act: { kobe: { pose: "nervous", turn: "nicole", icon: "sweat" } } },
      { who: NARRATOR, text: "嘆氣能讓肺部擴張到最大，其實是身體在替自己調節。", act: { nicole: { pose: "sit", face: "calm", icon: "heart" }, kobe: { pose: "sit", icon: "?" } } },
      { who: NARRATOR, text: "現在科比知道了：她嘆氣只是在調節，不是出事了。", act: { kobe: { to: [1.9, 0.8], turn: "nicole", pose: "sit", face: "happy", icon: "heart" }, nicole: { pose: "pet", face: "happy" } } },
    ],
  },

  /* 1.2 負面偏見：誤點與小得意 */
  {
    chapter: "negative-bias",
    title: "誤點四分鐘與小得意",
    seed: 31,
    cam: [-1.3, -0.4],
    actors: [
      { id: "mate", cast: ROOMMATE, at: [-1.5, 0.2], turn: -60, pose: "nervous" },
      { id: "nicole", cast: AUTHOR, at: [1.4, 0.75], turn: -90, on: "chairA" },
      { id: "client", cast: v("客戶", { species: "bear", fur: 0xc79a6b, shirt: 0xee6b5d, pants: 0x4f73ad }), at: [2.9, 0.75], turn: 90, on: "chairB", face: "neutral" },
    ],
    props: [
      { id: "rails", kind: "rails", at: [-1.4, 0, -1.4] },
      { id: "train", kind: "train", at: [-6.5, 0, -1.4], hidden: true },
      { id: "sign", kind: "sign", at: [-3.0, 0, -0.5], label: "誤點 4 分", hidden: true },
      { id: "table", kind: "table", at: [2.15, 0, 0.75] },
      { id: "chairA", kind: "chair", at: [1.45, 0, 0.75], turn: 90 },
      { id: "chairB", kind: "chair", at: [2.85, 0, 0.75], turn: -90 },
      { id: "mugA", kind: "mug", at: [1.95, 0.68, 0.7] },
      { id: "mugB", kind: "mug", at: [2.35, 0.68, 0.85] },
    ],
    beats: [
      { who: NARRATOR, text: "那天早上，作者的室友在月台等車。", cam: [-1.4, -0.4, 0.8], act: { mate: { icon: "dots" } } },
      { who: "室友", text: "火車晚點了 4 分鐘……", props: { sign: { show: true } }, act: { mate: { turn: "sign", face: "sour", icon: "anger" } } },
      { who: "室友", text: "……然後，一整天下來愈來愈糟。", sky: "dusk", props: { train: { show: true, to: [-1.4, 0, -1.4] } }, act: { mate: { turn: 0, pose: "sigh", face: "sad", icon: "gloom" } } },
      { who: NARRATOR, text: "大腦天生容易緊抓壞事，同一天裡的好事，常常就這樣溜走。", act: { mate: { pose: "sad" } } },
      { who: "妮可", text: "這星期，你碰到哪些小得意和大得意？", sky: "day", cam: [2.1, 0.6, 0.72], act: { nicole: { pose: "talk" } } },
      { who: "客戶", text: "嗯……沒什麼好事耶。", act: { nicole: { pose: "sit" }, client: { pose: "shrug", icon: "dots" } } },
      { who: "客戶", text: "啊，對喔……我怎麼沒想到！", act: { client: { pose: "sit", face: "happy", icon: "bulb" } } },
      { who: NARRATOR, text: "刻意回想今天的小勝利，是在幫大腦把注意力分一點給好事。", act: { nicole: { face: "happy", icon: "sparkle" }, client: { icon: "heart" } } },
    ],
  },

  /* 1.3 思想的力量：檸檬與喬許 */
  {
    chapter: "thought-power",
    title: "咬一口檸檬",
    seed: 41,
    cam: [-1.2, 0.3],
    actors: [
      { id: "you", cast: YOU, at: [-1.3, 0.5], turn: 10 },
      { id: "josh", cast: v("喬許", { species: "dog", fur: 0xe8c99b, shirt: 0x4f73ad, pants: 0x7a5a40, accent: 0x9a6a45 }), at: [1.6, 0.4], turn: -30 },
      { id: "pal", cast: v("朋友", { species: "bear", fur: 0xa77852, shirt: 0xf6a04d, pants: 0x6f6aa8 }), at: [2.7, -0.3], turn: -60 },
    ],
    props: [
      { id: "lemon", kind: "lemon", at: [-1.8, 0.68, -0.2], hidden: true },
      { id: "lemons", kind: "lemons", at: [-1.9, 0.68, -0.35] },
      { id: "table", kind: "table", at: [-1.9, 0, -0.35] },
    ],
    beats: [
      { who: NARRATOR, text: "想像一個炎熱的夏日。你手上有一顆冰涼、亮黃色的檸檬。", sky: "day", cam: [-1.4, 0.4, 0.68], act: { you: { pose: "hold", hold: "lemon", show: true } }, props: { lemon: { show: true } } },
      { who: NARRATOR, text: "咬一大口。酸酸的汁沿著下巴流下來。", act: { you: { pose: "eat", face: "sour", icon: "sweat" } } },
      { who: NARRATOR, text: "流口水了嗎？", act: { you: { pose: "hold", face: "surprised", icon: "!" } } },
      { who: NARRATOR, text: "光是想像，身體就有反應。腦中的念頭，身體會當真。", act: { you: { face: "smile", icon: "bulb" } } },
      { who: "喬許", text: "我賺得沒老婆多啦，她遲早會發現我是個失敗者，然後離開我。", cam: [2.1, 0.1, 0.72], act: { you: { pose: "idle", hold: null }, josh: { pose: "giggle", turn: "pal" }, pal: { pose: "giggle", icon: "note" } }, props: { lemon: { show: false } } },
      { who: NARRATOR, text: "喬許只是在說笑。可是同一句話說久了，就成了他相信的故事。", act: { josh: { pose: "sad", face: "sad", icon: "gloom", turn: 0 }, pal: { pose: "idle", face: "worried" } } },
      { who: NARRATOR, text: "後來他愈少說這些負面的話，自尊就一點一點挺了起來。", act: { josh: { pose: "cheer", face: "happy", icon: "sparkle" }, pal: { face: "happy", icon: "heart" } } },
    ],
  },

  /* 1.4 悄悄展開的常態：薩曼莎 */
  {
    chapter: "creeping-normality",
    title: "薩曼莎與建築夢",
    seed: 51,
    cam: [0, 0.3],
    actors: [
      { id: "dad", cast: v("爸爸", { species: "bear", fur: 0xb48a62, shirt: 0x4f73ad, pants: 0x4a3a30 }), at: [-1.9, -0.3], turn: 55 },
      { id: "mom", cast: v("媽媽", { species: "bear", fur: 0xd6b38c, shirt: 0xee6b5d, pants: 0x7a5a40, flower: 0xffffff }), at: [-1.5, 0.6], turn: 55 },
      { id: "sam", cast: v("薩曼莎", { species: "cat", fur: 0xf2a65a, shirt: 0xc5b3ef, pants: 0xf7a8b8 }), at: [0.3, 0.5], turn: -55 },
      { id: "martha", cast: MARTHA, at: [1.3, -0.1], turn: -55 },
    ],
    props: [
      { id: "house", kind: "houseModel", at: [0.6, 0, 1.0], hidden: true },
      { id: "book", kind: "book", at: [1.7, 0, 0.4], hidden: true },
      { id: "stage", kind: "stage", at: [2.4, 0, -1.6] },
    ],
    beats: [
      { who: NARRATOR, text: "薩曼莎和姊妹瑪莎小時候，父母常在別人面前這樣介紹她們。", cam: [-0.4, 0.2, 0.9] },
      { who: "爸爸", text: "薩曼莎將來會是職業舞者，她很有運動天分。", act: { dad: { pose: "point", turn: "sam" }, sam: { icon: "!" } } },
      { who: "媽媽", text: "瑪莎比較聰明，更適合繼續念書。", props: { book: { show: true } }, act: { dad: { pose: "idle" }, mom: { pose: "talk", turn: "martha" }, martha: { pose: "hold", hold: "book", icon: "sparkle" } } },
      { who: "薩曼莎", text: "可是……我也想念建築系。", props: { house: { show: true } }, act: { mom: { pose: "idle" }, sam: { pose: "hold", hold: "house", turn: "dad", face: "worried", icon: "heart" } } },
      { who: NARRATOR, text: "每次她說出自己的感受，父母就把它否定回去。", act: { dad: { pose: "shake", face: "neutral" }, mom: { pose: "shrug" }, sam: { pose: "sad", hold: null, face: "sad", icon: "gloom" } }, props: { house: { show: false } } },
      { who: NARRATOR, text: "說久了，這就成了家裡的常態。後來，薩曼莎真的成了舞者。", cam: [1.4, -0.9, 0.85], act: { dad: { pose: "idle" }, mom: { pose: "idle" }, martha: { pose: "idle", hold: null }, sam: { to: [2.4, -1.6], turn: 0, pose: "dance", face: "neutral" } }, props: { book: { show: false } } },
      { who: NARRATOR, text: "她的家人不是壞人。只是同一種對待一直發生，大家就把它當成正常。", cam: [0, 0, 1], act: { sam: { pose: "idle", icon: "dots" }, dad: { turn: 0 }, mom: { turn: 0 }, martha: { turn: 0 } } },
    ],
  },

  /* 1.5 確認偏誤：吧檯與寶藍色 BMW */
  {
    chapter: "confirmation-bias",
    title: "吧檯的笑聲與寶藍色的車",
    seed: 61,
    cam: [-0.3, 0],
    actors: [
      { id: "caro", cast: v("卡洛琳", { species: "sheep", fur: 0xfffaf0, shirt: 0xf6a04d, pants: 0x4f73ad, accent: 0x6a5a50 }), at: [-2.2, 0.2], turn: 60, on: "stoolA" },
      { id: "lucia", cast: v("露西亞", { species: "cat", fur: 0x4a3a30, shirt: 0x8fdcc0, pants: 0xee6b5d, accent: 0xfff1dc }), at: [-1.4, 0.4], turn: 60, on: "stoolB" },
      { id: "tom", cast: v("湯姆", { species: "dog", fur: 0xf0d9b5, shirt: 0xffd65c, pants: 0x4f73ad, accent: 0x9a6a45 }), at: [1.3, 0.1], turn: -70 },
      { id: "pal", cast: v("朋友", { species: "mouse", fur: 0xbfb9b0, shirt: 0x7cc4ef, pants: 0x4a3a30 }), at: [2.2, -0.3], turn: -60 },
      { id: "you", cast: YOU, at: [0, 2.0], turn: 0, hidden: true },
    ],
    props: [
      { id: "bar", kind: "bar", at: [-1.8, 0, -0.8] },
      { id: "stoolA", kind: "stool", at: [-2.2, 0, 0.1] },
      { id: "stoolB", kind: "stool", at: [-1.4, 0, 0.3] },
      { id: "car1", kind: "car", at: [-6, 0, 3.0], hidden: true },
      { id: "car2", kind: "car", at: [6, 0, 3.6], turn: 180, hidden: true },
    ],
    beats: [
      { who: "卡洛琳", text: "別馬上看過去喔，但吧檯那邊那個傢伙，很可愛。", cam: [-0.6, 0, 0.85], act: { caro: { pose: "whisper", turn: "lucia" } } },
      { who: NARRATOR, text: "露西亞瞄了一眼，兩個人咯咯笑了起來。", act: { caro: { pose: "giggle", face: "happy" }, lucia: { pose: "giggle", face: "happy", turn: "tom", icon: "heart" } } },
      { who: "湯姆", text: "她們是在笑我臉上沾了什麼東西嗎？", act: { tom: { pose: "nervous", face: "worried", turn: "pal", icon: "sweat" }, pal: { turn: "tom", icon: "?" } } },
      { who: NARRATOR, text: "同一陣笑聲，湯姆聽成了嘲笑。心裡先相信什麼，眼睛就容易找到什麼。", act: { caro: { pose: "sit" }, lucia: { pose: "sit" }, tom: { pose: "sad", icon: "gloom" } } },
      { who: NARRATOR, text: "再換個情境：你本來覺得寶藍色的 BMW 很獨特。", cam: [0, 1.6, 0.85], act: { you: { show: true, pose: "think", icon: "think" }, tom: { pose: "idle" } } },
      { who: NARRATOR, text: "可是一決定要買，街上到處都是它。", props: { car1: { show: true, anim: "driveBy" } }, act: { you: { pose: "point", turn: -90, face: "surprised", icon: "!" } } },
      { who: "你", text: "又一台！怎麼突然這麼多？", props: { car2: { show: true, anim: "driveBy" } }, act: { you: { turn: 90, face: "surprised", icon: "?" } } },
      { who: NARRATOR, text: "車沒有變多。是大腦的注意力篩選器（網狀活化系統），把你覺得重要的東西挑了出來。", act: { you: { pose: "idle", turn: 0, face: "smile", icon: "bulb" } } },
    ],
  },

  /* 1.6 失去與悲傷：醫學院與芭蕾 */
  {
    chapter: "loss-grief",
    title: "沒有走成的那條路",
    seed: 71,
    cam: [-1, 0],
    actors: [
      { id: "nicole", cast: AUTHOR, at: [-1.6, 0.6], turn: 20 },
      { id: "friend", cast: v("好友", { species: "sheep", fur: 0xfffaf0, shirt: 0xc5b3ef, pants: 0x4a3a30, accent: 0x7a6a60 }), at: [-0.5, 0.9], turn: -70, hidden: true },
    ],
    props: [
      { id: "mailbox", kind: "mailbox", at: [-2.4, 0, -0.2] },
      { id: "letters", kind: "letters", at: [-1.15, 0, 0.1], hidden: true },
      { id: "bed", kind: "bed", at: [1.6, 0, -0.6] },
      { id: "lamp", kind: "nightstand", at: [2.5, 0, -1.2] },
      { id: "stage", kind: "stage", at: [0.3, 0, 1.0], hidden: true },
    ],
    beats: [
      { who: NARRATOR, text: "作者 11 歲那年，父親過世了。她承諾要去學醫。", sky: "dusk", cam: [-1.8, 0.2, 0.75], act: { nicole: { pose: "think", face: "calm", icon: "heart" } } },
      { who: NARRATOR, text: "她申請醫學院，被拒絕了十一次。", props: { letters: { show: true, anim: "stagger" } }, act: { nicole: { pose: "sad", face: "sad", icon: "gloom" } } },
      { who: NARRATOR, text: "某天晚上，她躺在床上，忽然明白：自己心裡其實沒那麼想當醫生。", sky: "night", cam: [1.6, -0.4, 0.75], act: { nicole: { to: [1.6, 0.5], on: "bed", pose: "lie", face: "calm", icon: "bulb" } } },
      { who: NARRATOR, text: "她失去的不只是一個機會，也是一個原本以為會到來的未來。", act: { nicole: { icon: "gloom" } } },
      { who: NARRATOR, text: "和好友絕交，也讓她非常痛苦。悲傷不只發生在有人離世的時候。", sky: "dusk", cam: [-0.6, 0.5, 0.85], act: { nicole: { on: null, to: [-1.4, 0.8], pose: "sad", face: "sad", turn: 90 }, friend: { show: true, to: [-0.2, 1.2] } } },
      { who: NARRATOR, text: "好友漸漸走遠。失去一段友誼，同樣需要時間哀悼。", act: { friend: { to: [2.8, 2.6], turn: 120 }, nicole: { pose: "sigh", icon: "dots" } } },
      { who: NARRATOR, text: "24 歲那年，她重新開始學芭蕾。", sky: "day", cam: [0.3, 0.8, 0.75], props: { stage: { show: true } }, act: { friend: { show: false }, nicole: { to: [0.3, 1.0], pose: "dance", face: "happy", icon: "note", turn: 0 } } },
    ],
  },

  /* 1.7 神經工具包：網球課 */
  {
    chapter: "neurotoolkit",
    title: "網球課上的妮可",
    seed: 81,
    cam: [0, 0],
    trees: [[-3.7, -2.4], [3.8, -2.2], [-3.4, 2.4]],
    actors: [
      { id: "nicole", cast: AUTHOR, at: [-1.6, 0.4], turn: 90 },
      { id: "coach", cast: v("教練", { species: "bear", fur: 0x8a6a4a, shirt: 0xffffff, pants: 0xee6b5d, cap: 0xee6b5d }), at: [1.7, 0.2], turn: -90 },
    ],
    props: [
      { id: "net", kind: "net", at: [0, 0, 0.2] },
      { id: "racket", kind: "racket", at: [-1.3, 0, 0.9] },
      { id: "ball", kind: "ball", at: [1.2, 0.5, 0.3] },
      { id: "hoop", kind: "hoop", at: [3.3, 0, -1.6], turn: -40, hidden: true },
    ],
    beats: [
      { who: NARRATOR, text: "作者開始上網球課。每一球都得想：站哪裡、怎麼揮拍、往哪裡打。", act: { nicole: { pose: "think", hold: "racket", icon: "think" } } },
      { who: "教練", text: "拜託，妮可！", props: { ball: { anim: "rally" } }, act: { coach: { pose: "point", face: "surprised", icon: "!" }, nicole: { pose: "swing", face: "worried", icon: "sweat" } } },
      { who: "妮可", text: "（科比・布萊恩青少年時期，每天要投籃 1,000 次……）", cam: [1.6, -0.6, 0.85], props: { hoop: { show: true }, ball: { anim: "none", to: [1.2, 0.05, 0.6] } }, act: { coach: { pose: "idle", face: "smile" }, nicole: { pose: "think", face: "neutral", icon: "think" } } },
      { who: NARRATOR, text: "她知道，反覆練到某個階段，動作就會自動完成。", cam: [0, 0, 1], props: { ball: { anim: "rally" } }, act: { nicole: { pose: "swing", face: "smile", icon: "bulb" } } },
      { who: NARRATOR, text: "賈德醫生提醒：與其責怪自己，不如分析是什麼觸發了你。", act: { nicole: { pose: "idle", icon: "dots" }, coach: { pose: "nod" } } },
      { who: NARRATOR, text: "再替每一次小勝利慶祝一下。這會活化大腦的獎勵中樞，幫新行為站穩。", props: { ball: { anim: "none", to: [0.6, 0.05, 1.2] } }, act: { nicole: { pose: "cheer", face: "happy", icon: "star" }, coach: { pose: "cheer", face: "happy" } } },
    ],
  },

  /* 2.0 重組潛意識：學開車 */
  {
    chapter: "subconscious",
    title: "第一次學開車",
    seed: 91,
    cam: [0, 0.4],
    actors: [{ id: "you", cast: YOU, at: [0, 0.5], on: "car", pose: "drive" }],
    props: [
      { id: "car", kind: "car", at: [0, 0, 0.5], turn: -35 },
      { id: "sign", kind: "sign", at: [2.4, 0, -0.6], label: "駕訓班" },
    ],
    beats: [
      { who: NARRATOR, text: "我們大部分的時候，都是靠潛意識在運作，像開了自動駕駛。", cam: [0, 0.4, 0.8], act: { you: { icon: "dots" } } },
      { who: NARRATOR, text: "第一次學開車時，你一直盯著後視鏡、留意盲點，每個動作都要想。", act: { you: { face: "worried", icon: "think" } } },
      { who: "你", text: "後視鏡、盲點……現在要踩哪一個踏板？", act: { you: { face: "surprised", icon: "sweat" } } },
      { who: NARRATOR, text: "重複夠多次以後，該踩哪個踏板，腳自己就知道了。", act: { you: { face: "happy", icon: "note" } } },
      { who: NARRATOR, text: "習慣和行為也一樣，是被預先編程的。好消息是，它們可以改寫。", act: { you: { face: "smile", icon: "sparkle" } } },
    ],
  },

  /* 2.1 擱下手機 */
  {
    chapter: "phone",
    title: "醒來的第一眼",
    seed: 101,
    cam: [0, -0.2],
    actors: [{ id: "you", cast: YOU, at: [0, -0.3], turn: 0, on: "bed", pose: "lie", face: "sleep" }],
    props: [
      { id: "bed", kind: "bed", at: [0, 0, -0.4] },
      { id: "stand", kind: "nightstand", at: [0.85, 0, -1.1] },
      { id: "phone", kind: "phone", at: [0.85, 0.55, -1.05] },
      { id: "badges", kind: "badges", at: [0, 0, -0.4], hidden: true },
    ],
    beats: [
      { who: NARRATOR, text: "剛醒來時，大腦還慢吞吞、很放鬆，也特別容易受暗示。", sky: "dusk", act: { you: { icon: "zzz" } } },
      { who: NARRATOR, text: "很多人醒來第一件事，就是滑手機。", sky: "day", props: { badges: { show: true, anim: "float" } }, act: { you: { pose: "sit", face: "neutral", hold: "phone", icon: "!" } } },
      { who: "你", text: "大家怎麼都過得比我好……", act: { you: { pose: "phone", face: "sad", icon: "gloom" } } },
      { who: NARRATOR, text: "來一次「春季大掃除」：取消追蹤那些讓你忍不住比較的帳號。", props: { badges: { show: false } }, act: { you: { pose: "phone", face: "smile", icon: "sparkle" } } },
      { who: NARRATOR, text: "醒來後的第一眼留給自己，而不是別人的動態。", props: { phone: { to: [0.85, 0.55, -1.05] } }, act: { you: { hold: null, pose: "sit", face: "calm", icon: "heart" } } },
    ],
  },

  /* 2.2 視覺化：彩排晨跑 */
  {
    chapter: "visualization",
    title: "彩排明天的晨跑",
    seed: 111,
    cam: [-0.6, -0.2],
    actors: [{ id: "you", cast: YOU, at: [-1, -0.3], turn: 0, on: "bed", pose: "sit", face: "calm" }],
    props: [
      { id: "bed", kind: "bed", at: [-1, 0, -0.4] },
      { id: "stand", kind: "nightstand", at: [-1.9, 0, -1.1] },
      { id: "alarm", kind: "alarm", at: [-1.9, 0.53, -1.0] },
      { id: "house", kind: "cottage", at: [2.4, 0, -1.6], turn: -30 },
    ],
    beats: [
      { who: NARRATOR, text: "睡前，先在腦中彩排明天的晨跑。", sky: "night", act: { you: { pose: "think", icon: "think" } } },
      { who: NARRATOR, text: "想像鬧鐘響了。你沒有按貪睡。", props: { alarm: { anim: "shake" } }, act: { you: { icon: "!" } } },
      { who: NARRATOR, text: "也彩排那一刻：好累，好想再多睡一下。", props: { alarm: { anim: "none" } }, act: { you: { face: "sleep", icon: "zzz" } } },
      { who: "你", text: "起床、穿衣服、戴耳機、選音樂、打開門。", act: { you: { face: "smile", icon: "note" } } },
      { who: NARRATOR, text: "到了早上，要真的去做。", sky: "day", props: { alarm: { anim: "shake" } }, act: { you: { pose: "lie", face: "sleep", icon: "zzz" } } },
      { who: "你", text: "……好，起床！", props: { alarm: { anim: "none" } }, act: { you: { on: null, to: [0.2, 0.6], pose: "cheer", face: "happy", icon: "!" } } },
      { who: NARRATOR, text: "想像能幫你準備好，但取代不了真正走出門的那一步。", cam: [1, 0.6, 0.9], act: { you: { to: [2.6, 1.6], pose: "run", face: "happy", icon: "sparkle" } } },
    ],
  },

  /* 2.3 重複 */
  {
    chapter: "repetition",
    title: "第五天的小芽",
    seed: 121,
    cam: [0, 0.2],
    actors: [
      { id: "you", cast: YOU, at: [-0.7, 0.4], turn: 90 },
      { id: "buddy", cast: v("同伴", { species: "bear", fur: 0xc79a6b, shirt: 0xffd65c, pants: 0x4f73ad }), at: [3.3, 1.8], turn: -90, hidden: true },
    ],
    props: [
      { id: "sprout", kind: "sprout", at: [0.3, 0, 0.3] },
      { id: "bloom", kind: "bloom", at: [0.3, 0, 0.3], hidden: true },
      { id: "can", kind: "can", at: [-0.3, 0.1, 0.9] },
      { id: "sign1", kind: "sign", at: [-2.2, 0, -0.8], label: "第 1 天" },
      { id: "sign5", kind: "sign", at: [-2.2, 0, -0.8], label: "第 5～7 天", hidden: true },
      { id: "note", kind: "notebook", at: [-1.3, 0.05, 1.2], hidden: true },
    ],
    beats: [
      { who: NARRATOR, text: "新習慣的頭幾天，通常都很順利。", act: { you: { pose: "water", hold: "can", face: "happy", icon: "note" } } },
      { who: NARRATOR, text: "到了第五到七天，大腦會想回到原本的自動模式。", props: { sign1: { show: false }, sign5: { show: true }, sprout: { anim: "sway" } }, act: { you: { hold: null, to: [-1.6, 0.6], pose: "idle", face: "neutral", turn: 200, icon: "?" } } },
      { who: "你", text: "咦？我今天是不是忘了什麼？", act: { you: { turn: 60, pose: "think", icon: "think" } } },
      { who: NARRATOR, text: "所以要先替自己安排提醒：每天的提醒，加上寫下今天的意向。", props: { note: { show: true } }, act: { you: { pose: "write", hold: "note", face: "smile", icon: "bulb" } } },
      { who: NARRATOR, text: "冥想、找個同伴、跟朋友或教練聯絡、寫日記，也都有幫助。", cam: [0.6, 0.6, 1], props: { note: { show: false } }, act: { you: { hold: null, pose: "wave", turn: "buddy" }, buddy: { show: true, to: [1.3, 1.2], pose: "wave", face: "happy" } } },
      { who: NARRATOR, text: "一起放電的神經元，會彼此連結。", props: { sprout: { show: false }, bloom: { show: true, anim: "grow" } }, act: { you: { to: [-0.4, 0.5], turn: 90, pose: "water", hold: "can", face: "happy", icon: "heart" }, buddy: { pose: "cheer", icon: "star" } } },
    ],
  },

  /* 2.4 騰出空間：健身房的硬幣 */
  {
    chapter: "make-space",
    title: "販賣機只收硬幣",
    seed: 131,
    cam: [0, -0.2],
    actors: [
      { id: "nicole", cast: AUTHOR, at: [-2.6, 1.4], turn: 60 },
      { id: "clerk", cast: v("接待員", { species: "sheep", fur: 0xfffaf0, shirt: 0x8fdcc0, pants: 0x4a3a30, accent: 0x5a4a40 }), at: [1.8, -0.4], turn: -90 },
    ],
    props: [
      { id: "sign", kind: "sign", at: [-3.0, 0, 0.1], turn: 30, label: "？？？" },
      { id: "desk", kind: "reception", at: [1.1, 0, -0.4], turn: 90 },
      { id: "vending", kind: "vending", at: [-1.6, 0, -1.0] },
      { id: "bike", kind: "bike", at: [3.0, 0, 1.2], turn: -30 },
      { id: "board", kind: "board", at: [2.2, 0, -1.9], label: "單車課 3 分鐘後", hidden: true },
      { id: "coin", kind: "coin", at: [0.7, 1.05, -0.5], hidden: true },
    ],
    beats: [
      { who: NARRATOR, text: "2023 年 5 月，作者搬到新的國家。路標是看不懂的新語言，連開車換檔都要苦思。", cam: [-2.4, 0.8, 0.75], act: { nicole: { turn: "sign", pose: "think", face: "worried", icon: "?" } } },
      { who: NARRATOR, text: "某天在健身房，離動感單車課只剩 3 分鐘，她想先買瓶水。", cam: [-0.4, -0.4, 1], props: { board: { show: true } }, act: { nicole: { to: [-1.6, -0.1], turn: 180, pose: "idle", face: "smile" } } },
      { who: "接待員", text: "那台販賣機只收硬幣喔。", act: { nicole: { turn: "clerk", face: "surprised", icon: "!" }, clerk: { pose: "point" } } },
      { who: NARRATOR, text: "熟悉的慌張湧上來。她按下了「暫停」。", act: { clerk: { pose: "idle" }, nicole: { pose: "pause", face: "calm", icon: "pause" } } },
      { who: "妮可", text: "我們有沒有可能，一起替這件事找個解決辦法？", cam: [0.9, -0.3, 0.75], act: { nicole: { to: [0.25, -0.3], turn: 55, pose: "talk", face: "smile" } } },
      { who: "妮可", text: "或許妳可以先借我收銀機裡的硬幣，記下這筆帳，我明天再還妳？", act: { nicole: { pose: "point" }, clerk: { pose: "think", icon: "think" } } },
      { who: NARRATOR, text: "書裡沒寫最後怎麼了。重點在她發現：觸發和反應之間的空間，正變得愈來愈大。", cam: [0, -0.2, 1], act: { nicole: { pose: "idle", turn: 0, face: "happy", icon: "sparkle" }, clerk: { pose: "idle", icon: "dots" } } },
    ],
  },

  /* 2.5 突破界限：大道與土路 */
  {
    chapter: "boundaries",
    title: "舊大道與新土路",
    seed: 141,
    cam: [0, 0],
    trees: [[-3.8, -1.6], [3.9, -1.4], [-3.2, -3.0], [3.0, -3.2]],
    actors: [{ id: "you", cast: YOU, at: [-1.1, 1.6], turn: 180 }],
    props: [
      { id: "road", kind: "road", at: [-1.1, 0, 1.4] },
      { id: "dirt", kind: "dirt", at: [1.2, 0, 1.4] },
      { id: "tiles", kind: "tiles", at: [1.2, 0, 1.4], hidden: true },
      { id: "flowers", kind: "newFlowers", at: [1.2, 0, 1.4], hidden: true },
    ],
    beats: [
      { who: NARRATOR, text: "舊習慣像一條漂亮的混凝土大道：有路燈，還有花壇。", act: { you: { to: [-1.1, -0.6], pose: "walk", face: "happy", icon: "note" } } },
      { who: NARRATOR, text: "新習慣是一條土路，走起來比較吃力。", act: { you: { to: [1.2, 1.4], turn: 180, pose: "idle", face: "worried", icon: "sweat" } } },
      { who: NARRATOR, text: "每走一次，就像替它鋪上一塊混凝土、種下一朵花。", props: { tiles: { show: true, anim: "stagger" }, flowers: { show: true, anim: "stagger" } }, act: { you: { to: [1.2, -0.8], face: "smile", icon: "sparkle" } } },
      { who: NARRATOR, text: "累的時候，腳會自己走回舊路。", sky: "dusk", act: { you: { to: [-1.1, 0.6], face: "sleep", icon: "zzz" } } },
      { who: NARRATOR, text: "不必責怪自己。紀律比一時的動機可靠，睡飽也很重要。", sky: "day", act: { you: { to: [1.2, 0.4], turn: 0, face: "happy", pose: "cheer", icon: "star" } } },
    ],
  },

  /* 2.6 策略與挫折：菲爾普斯 */
  {
    chapter: "strategy",
    title: "護目鏡進水的那一場",
    seed: 151,
    cam: [0, -0.4],
    actors: [
      { id: "phelps", cast: v("菲爾普斯", { species: "dog", fur: 0xd8b98a, shirt: 0x4f73ad, pants: 0x4f73ad, cap: 0x4f73ad }), at: [-2.1, 0.5], turn: 60 },
      { id: "you", cast: YOU, at: [2.6, 2.0], turn: -60, hidden: true },
    ],
    props: [
      { id: "pool", kind: "pool", at: [0, 0, -0.9] },
      { id: "goggles", kind: "goggles", at: [0, 0, 0], hidden: true },
      { id: "medal", kind: "medal", at: [0, 0, 0], hidden: true },
      { id: "shelf", kind: "shelf", at: [3.3, 0, 1.4], turn: -90, hidden: true },
    ],
    beats: [
      { who: NARRATOR, text: "菲爾普斯會先想好：希望比賽怎麼進行、不希望它怎麼進行，以及它可能怎麼進行。", act: { phelps: { pose: "think", icon: "think" } } },
      { who: NARRATOR, text: "2008 年的 200 公尺蝶泳，他的護目鏡進水了。", props: { goggles: { show: true } }, act: { phelps: { to: [-1.0, -0.9], pose: "swim", face: "surprised", icon: "!" } } },
      { who: NARRATOR, text: "他幾乎看不見，就這樣盲游了 175 公尺。", act: { phelps: { to: [0.7, -0.9], pose: "swim", face: "neutral", icon: "dots" } } },
      { who: NARRATOR, text: "他知道轉身前要划幾下。這一段，他早就練過了。", act: { phelps: { to: [-0.9, -0.9], pose: "swim", face: "calm", icon: "bulb" } } },
      { who: NARRATOR, text: "最後，他拿下金牌，還打破了世界紀錄。", props: { goggles: { show: false }, medal: { show: true } }, act: { phelps: { to: [-1.6, 0.5], pose: "cheer", hold: "medal", face: "happy", icon: "star", turn: 0 } } },
      { who: NARRATOR, text: "書裡另一個建議：把新習慣放在舊習慣旁邊。例如把營養補充品，擺在水壺、牙刷或冰箱旁。", cam: [1.8, 1.2, 0.8], props: { shelf: { show: true } }, act: { phelps: { pose: "idle" }, you: { show: true, to: [2.3, 1.5], turn: 70, pose: "point", icon: "bulb" } } },
    ],
  },

  /* 2.7 跨越恐懼：麥克斯 */
  {
    chapter: "fear",
    title: "怕人的麥克斯",
    seed: 161,
    cam: [0, 0.2],
    actors: [
      { id: "nicole", cast: AUTHOR, at: [-1.3, 0.6], turn: 30 },
      { id: "max", cast: MAX, at: [-0.5, 0.9], turn: 70 },
      { id: "walker", cast: v("路人", { species: "mouse", fur: 0xd9d2cc, shirt: 0xf6a04d, pants: 0x4a3a30 }), at: [3.6, 1.6], turn: -90 },
      { id: "walker2", cast: v("路人", { species: "sheep", fur: 0xfffaf0, shirt: 0xc5b3ef, pants: 0x4f73ad, accent: 0x6a5a50 }), at: [3.6, -1.2], turn: -90, hidden: true },
    ],
    props: [
      { id: "bench", kind: "bench", at: [-1.6, 0, -0.6] },
      { id: "treat", kind: "treat", at: [0, 0, 0], hidden: true },
    ],
    beats: [
      { who: NARRATOR, text: "麥克斯是馬利諾犬和德國牧羊犬的混種。牠怕人，也怕其他狗。", act: { max: { pose: "nervous", icon: "sweat" } } },
      { who: NARRATOR, text: "只要有人靠得太近，牠就想把對方趕走。", act: { walker: { to: [0.7, 1.1], pose: "walk", icon: "!" }, max: { pose: "bark", face: "angry", icon: "anger" } } },
      { who: NARRATOR, text: "於是作者帶牠坐在一旁，遠遠看著人們經過。", cam: [0, -0.2, 1], act: { walker: { to: [-3.6, 2.6], pose: "walk" }, nicole: { to: [-1.6, -0.4], on: "bench", pose: "sit", turn: 0 }, max: { to: [-0.7, -0.2], turn: 0, pose: "sit", face: "neutral" } } },
      { who: NARRATOR, text: "當麥克斯不理路人、轉頭看她，她就給牠一塊零食。", props: { treat: { show: true } }, act: { walker2: { show: true, to: [-3.4, -1.0], pose: "walk" }, max: { turn: "nicole", face: "happy", icon: "heart" }, nicole: { pose: "pet", hold: "treat", face: "happy" } } },
      { who: NARRATOR, text: "一點一點，把腳尖伸進未知的領域。", props: { treat: { show: false } }, act: { nicole: { pose: "sit", hold: null }, max: { pose: "sit", face: "smile", turn: 0, icon: "sparkle" } } },
      { who: NARRATOR, text: "這是作者訓練狗狗的經驗，用來說明逐步接觸的概念，不是給人的治療程序。", supplement: true, act: { max: { pose: "lie" } } },
    ],
  },

  /* 3.1 心靈韌性 */
  {
    chapter: "resilience",
    title: "訓練與恢復",
    seed: 171,
    cam: [0, 0],
    actors: [
      { id: "you", cast: YOU, at: [-1.8, 0.6], turn: 20 },
      { id: "nicole", cast: AUTHOR, at: [3.4, 2.0], turn: -90, hidden: true },
    ],
    props: [
      { id: "bell", kind: "dumbbell", at: [-1.4, 0.1, 1.0] },
      { id: "tub", kind: "tub", at: [0.4, 0, -0.9] },
      { id: "sauna", kind: "sauna", at: [2.2, 0, -1.4], anim: "steam" },
      { id: "hammock", kind: "hammock", at: [1.4, 0, 1.0] },
    ],
    beats: [
      { who: NARRATOR, text: "運動員要持續訓練，才會愈來愈強。", act: { you: { pose: "lift", hold: "bell", face: "smile", icon: "sweat" } } },
      { who: NARRATOR, text: "但如果一直加量、從不休息，反而會累垮或受傷。", act: { you: { pose: "sigh", face: "sad", icon: "gloom" } } },
      { who: NARRATOR, text: "有些壓力是我們自願選擇的：運動、呼吸練習、冷水浴、桑拿。", cam: [1, -0.6, 0.9], act: { you: { hold: null, to: [-0.4, -0.8], turn: 90, pose: "idle", face: "surprised", icon: "!" } } },
      { who: NARRATOR, text: "挑戰過後，也要安排恢復，身體才準備得好迎接下一次。", cam: [0.8, 0.6, 0.9], act: { you: { to: [1.5, 1.0], on: "hammock", pose: "lie", face: "calm", icon: "zzz" } } },
      { who: NARRATOR, text: "人也需要彼此。受兒童精神病學家布魯斯・培理的工作啟發，作者寫下：「愛創造了我們。」", cam: [1.4, 1.2, 0.85], act: { you: { on: null, to: [1.2, 1.9], pose: "hug", turn: 90, face: "happy", icon: "heart" }, nicole: { show: true, to: [2.0, 1.9], turn: -90, pose: "hug", face: "happy" } } },
    ],
  },

  /* 3.2 成長型心態：瑪莎與杜維克 */
  {
    chapter: "growth",
    title: "被誇聰明的瑪莎",
    seed: 181,
    cam: [-1.2, 0],
    actors: [
      { id: "martha", cast: MARTHA, at: [-1.6, 0.2], turn: -90, on: "chair" },
      { id: "therapist", cast: v("治療師", { species: "sheep", fur: 0xfffaf0, shirt: 0x8fdcc0, pants: 0x7a5a40, accent: 0x5a4a40 }), at: [-3.2, 1.2], turn: 60, hidden: true },
      { id: "a", cast: v("學生甲", { species: "mouse", fur: 0xcfc6bd, shirt: 0xffd65c, pants: 0x4f73ad }), at: [1.15, 0.45], turn: 25, hidden: true },
      { id: "b", cast: v("學生乙", { species: "mouse", fur: 0xa79a8c, shirt: 0x7cc4ef, pants: 0x4a3a30 }), at: [2.85, 0.45], turn: -25, hidden: true },
      { id: "res", cast: v("研究人員", { species: "bear", fur: 0xb48a62, shirt: 0xffffff, pants: 0x4a3a30 }), at: [2.0, -0.55], turn: 0, hidden: true },
    ],
    props: [
      { id: "desk", kind: "desk", at: [-2.3, 0, 0.2], turn: 90 },
      { id: "chair", kind: "chair", at: [-1.7, 0, 0.2], turn: -90 },
      { id: "laptop", kind: "laptop", at: [-2.3, 0.68, 0.2], turn: 90 },
      { id: "easy", kind: "blockSmall", at: [1.15, 0, 1.15], hidden: true },
      { id: "hard", kind: "blockBig", at: [2.85, 0, 1.15], hidden: true },
    ],
    beats: [
      { who: NARRATOR, text: "瑪莎從小就一直被稱讚聰明。", cam: [-1.8, 0.2, 0.72], act: { martha: { icon: "sparkle", face: "happy" } } },
      { who: NARRATOR, text: "她讀完美術碩士，進了數位行銷公司，卻非常害怕失敗，怕別人懷疑她不夠聰明。", act: { martha: { pose: "write", face: "worried", icon: "sweat" } } },
      { who: NARRATOR, text: "她去看治療師，學著把「我是誰」和「我做得好不好」分開。", cam: [-1.4, 0.6, 0.8], act: { martha: { turn: 30, pose: "sit", face: "calm", icon: "bulb" }, therapist: { show: true, to: [-0.7, -0.5], turn: "martha", pose: "talk" } } },
      { who: NARRATOR, text: "心理學家杜維克做過一個研究：學生做完題目後，收到不同的稱讚。", cam: [2.0, 0.6, 0.85], act: { therapist: { pose: "idle" }, a: { show: true }, b: { show: true }, res: { show: true } } },
      { who: "研究人員", text: "你真聰明！", act: { res: { turn: "a", pose: "point" }, a: { face: "happy", icon: "star" } } },
      { who: "研究人員", text: "你一定在解決這些問題上，付出了很大的努力。", act: { res: { turn: "b", pose: "nod" }, b: { face: "happy", icon: "heart" } } },
      { who: NARRATOR, text: "下一輪，被誇聰明的學生挑了比較簡單的題目；被誇努力的學生，挑了更難的。", props: { easy: { show: true }, hard: { show: true } }, act: { res: { pose: "idle", turn: 0 }, a: { pose: "hold", face: "worried", icon: "sweat" }, b: { pose: "cheer", face: "happy", icon: "sparkle" } } },
    ],
  },

  /* 3.3 肌肉與大腦：第二區 */
  {
    chapter: "muscles",
    title: "遛狗也算運動",
    seed: 191,
    cam: [0, 0.4],
    actors: [
      { id: "nicole", cast: AUTHOR, at: [-2.4, 1.6], turn: 90 },
      { id: "kobe", cast: KOBE, at: [-1.6, 1.9], turn: 90 },
      { id: "pal", cast: v("朋友", { species: "bear", fur: 0xc79a6b, shirt: 0xf6a04d, pants: 0x4f73ad }), at: [-2.6, 0.8], turn: 90 },
    ],
    props: [
      { id: "fence", kind: "fence", at: [-1.2, 0, -1.6] },
      { id: "bench", kind: "bench", at: [2.6, 0, -0.6], turn: -30 },
    ],
    beats: [
      { who: NARRATOR, text: "運動不必每次都拚到上氣不接下氣。", act: { nicole: { icon: "note" } } },
      { who: NARRATOR, text: "所謂第二區，是一邊運動、一邊還能聊天的強度。", act: { nicole: { to: [-0.4, 1.4], pose: "walk", turn: "pal" }, pal: { to: [-0.6, 0.6], pose: "walk" }, kobe: { to: [0.4, 1.7], pose: "walk" } } },
      { who: "妮可", text: "我的第二區，就是遛狗，或在平路上騎車。", act: { nicole: { pose: "talk", face: "happy" }, pal: { turn: "nicole", pose: "nod" }, kobe: { pose: "sit", turn: "nicole", face: "happy" } } },
      { who: NARRATOR, text: "走路、跑步、騎車時，風景一路往後退，人也比較能從問題裡退一步看。", cam: [0.8, 0.6, 1], act: { nicole: { to: [1.6, 1.4], pose: "walk", turn: 90, icon: "sparkle" }, pal: { to: [1.4, 0.6], pose: "walk" }, kobe: { to: [2.4, 1.7], pose: "run", icon: "heart" } } },
      { who: NARRATOR, text: "選一種你願意一直做下去的活動，而不是勉強撐過去的那種。", act: { nicole: { turn: 0, pose: "wave", face: "happy" }, pal: { turn: 0, pose: "wave" }, kobe: { turn: 0, pose: "sit" } } },
    ],
  },

  /* 3.4 睡眠 */
  {
    chapter: "sleep",
    title: "鑰匙又忘了帶",
    seed: 201,
    cam: [-0.4, 0],
    actors: [{ id: "you", cast: YOU, at: [-1.6, 0.8], turn: 20 }],
    props: [
      { id: "table", kind: "table", at: [-1.6, 0, -0.3] },
      { id: "book", kind: "book", at: [-1.6, 0.68, -0.3], hidden: true },
      { id: "keys", kind: "keys", at: [-1.4, 0.69, -0.1] },
      { id: "house", kind: "cottage", at: [1.0, 0, -1.6] },
      { id: "bed", kind: "bed", at: [2.5, 0, 0.5], turn: -90 },
      { id: "stars", kind: "stars", at: [2.4, 0, 0.5], hidden: true, anim: "orbit" },
    ],
    beats: [
      { who: NARRATOR, text: "如果你正在學一種新語言，可能會發現自己比平常更累。", props: { book: { show: true } }, act: { you: { pose: "hold", hold: "book", face: "worried", icon: "sweat" } } },
      { who: "你", text: "咦？我的鑰匙呢？", props: { book: { show: false } }, act: { you: { hold: null, to: [1.3, -0.5], turn: 180, pose: "think", face: "surprised", icon: "?" } } },
      { who: NARRATOR, text: "這很正常。你睡覺時，大腦會形成新的突觸連結，把白天學的東西穩定下來。", sky: "night", cam: [2.2, 0.4, 0.8], props: { stars: { show: true } }, act: { you: { to: [2.4, 0.5], on: "bed", pose: "lie", face: "sleep", icon: "zzz" } } },
      { who: NARRATOR, text: "睡不好，就容易掉回舊模式：一直反芻、動不動就煩躁。", props: { stars: { show: false } }, act: { you: { pose: "sit", face: "angry", icon: "anger" } } },
      { who: NARRATOR, text: "睡眠是讓改變站穩的頭號工具，記得把它也排進計畫裡。", sky: "day", act: { you: { on: null, to: [1.4, 1.4], turn: 0, pose: "cheer", face: "happy", icon: "sparkle" } } },
    ],
  },

  /* 3.5 多巴胺：到達謬誤與蹺蹺板 */
  {
    chapter: "dopamine",
    title: "到達謬誤與蹺蹺板",
    seed: 211,
    cam: [-0.8, 0],
    actors: [
      { id: "nicole", cast: AUTHOR, at: [-1.8, 0.3], turn: 0, on: "scale" },
      { id: "you", cast: YOU, at: [1.0, 1.4], turn: 0, on: "bench", pose: "sit" },
    ],
    props: [
      { id: "scale", kind: "scale", at: [-1.8, 0, 0.3] },
      { id: "board", kind: "board", at: [-2.4, 0, -1.2], label: "到達謬誤", hidden: true },
      { id: "seesaw", kind: "seesaw", at: [1.6, 0, -0.6] },
      { id: "bench", kind: "bench", at: [1.0, 0, 1.2] },
      { id: "phone", kind: "phone", at: [0.4, 0.55, 1.25] },
    ],
    beats: [
      { who: "妮可", text: "以前我以為，體重到了某個數字，我就會愛上自己的身體。", cam: [-1.8, 0.2, 0.75], act: { nicole: { pose: "think", icon: "think" } } },
      { who: NARRATOR, text: "塔爾・班夏哈把這叫作「到達謬誤」：以為到了目標，快樂就會一直留下來。", props: { board: { show: true } }, act: { nicole: { pose: "idle", icon: "bulb" } } },
      { who: NARRATOR, text: "她問 IG 上的粉絲，最常見的例子是：減肥、學業成績、工作成就、金錢。", act: { nicole: { pose: "shrug", face: "neutral", icon: "dots" } } },
      { who: NARRATOR, text: "安娜・蘭布克用蹺蹺板形容多巴胺：再看一集、再吃一塊巧克力，就一直往同一邊壓。", cam: [1.3, 0.4, 0.85], props: { seesaw: { anim: "tilt" } }, act: { you: { pose: "phone", hold: "phone", face: "neutral", icon: "!" } } },
      { who: NARRATOR, text: "放下手機，無聊地坐一會兒，蹺蹺板就能慢慢回正。還可以做做白日夢。", props: { seesaw: { anim: "none" }, phone: { to: [0.4, 0.55, 1.25] } }, act: { you: { hold: null, pose: "sit", face: "calm", icon: "heart" } } },
    ],
  },

  /* 3.6 自我信賴：出版社來信 */
  {
    chapter: "self-trust",
    title: "那封出版社的信",
    seed: 221,
    cam: [-0.6, 0],
    actors: [
      { id: "nicole", cast: AUTHOR, at: [-1.6, 0.2], turn: -90, on: "chair" },
      { id: "sis", cast: v("姊姊", { species: "bunny", fur: 0xe8d3c0, shirt: 0x7cc4ef, pants: 0x4a3a30, accent: 0xf5d5d5 }), at: [-0.6, 0.6], turn: -70 },
    ],
    props: [
      { id: "desk", kind: "desk", at: [-2.3, 0, 0.2], turn: 90 },
      { id: "chair", kind: "chair", at: [-1.7, 0, 0.2], turn: -90 },
      { id: "laptop", kind: "laptop", at: [-2.3, 0.68, 0.2], turn: 90 },
      { id: "alarm", kind: "alarm", at: [2.2, 0, -0.6], hidden: true },
    ],
    beats: [
      { who: "姊姊", text: "妳會想要坐下來看這一封的。", cam: [-1.2, 0, 0.75], act: { sis: { pose: "point", face: "happy", icon: "!" } } },
      { who: NARRATOR, text: "是出版社寄來的邀約。", act: { sis: { pose: "idle" }, nicole: { face: "surprised", icon: "!" } } },
      { who: NARRATOR, text: "她很快樂、很興奮，同時也很平靜。", act: { nicole: { turn: 0, face: "happy", icon: "heart" }, sis: { pose: "cheer", face: "happy", icon: "note" } } },
      { who: "妮可", text: "如果這次不成功，下次就會成功。", act: { nicole: { face: "calm", icon: "sparkle" }, sis: { pose: "idle" } } },
      { who: NARRATOR, text: "這份自我信賴，是靠說到做到建立的：她說要早上 6 點起床跑步，就真的去跑。", sky: "dusk", cam: [1.2, 0.6, 0.9], props: { alarm: { show: true, anim: "shake" } }, act: { nicole: { on: null, to: [1.6, 1.2], turn: 90, pose: "run", face: "happy", icon: "star" } } },
      { who: NARRATOR, text: "自我信賴，就是這樣一次又一次累積起來的。", sky: "day", props: { alarm: { anim: "none" } }, act: { nicole: { pose: "cheer", turn: 0, icon: "sparkle" } } },
    ],
  },

  /* 尾聲 */
  {
    chapter: "closing",
    title: "夕陽下的小島",
    seed: 231,
    cam: [0, 0.4],
    actors: [
      { id: "nicole", cast: AUTHOR, at: [-1.0, 0.8], turn: 20 },
      { id: "you", cast: YOU, at: [0.8, 0.9], turn: -20 },
      { id: "kobe", cast: KOBE, at: [0, 1.6], turn: 0, pose: "sit" },
    ],
    props: [
      { id: "bench", kind: "bench", at: [0, 0, -0.6] },
      { id: "bloom", kind: "bloom", at: [-2.4, 0, 0.6] },
      { id: "bloom2", kind: "bloom", at: [2.4, 0, 0.4] },
    ],
    beats: [
      { who: NARRATOR, text: "每個人的大腦圖譜，都是獨一無二的。", act: { nicole: { icon: "sparkle" }, you: { icon: "sparkle" }, kobe: { icon: "heart" } } },
      { who: NARRATOR, text: "這些獨特之處，是偶然得來，還是刻意造就？兩者都有。", act: { nicole: { pose: "think", icon: "think" }, you: { pose: "think", icon: "?" } } },
      { who: NARRATOR, text: "跟自己握個手，許下承諾。勇氣，是承認自己害怕，仍然往前走。", act: { nicole: { pose: "idle" }, you: { pose: "shake", turn: "nicole", face: "happy", icon: "star" } } },
      { who: NARRATOR, text: "寬恕那些曾經「編程」我們的人，然後替自己的下一步負起責任。", act: { you: { pose: "nod", turn: -20 }, nicole: { pose: "nod", face: "calm", icon: "heart" } } },
      { who: NARRATOR, text: "也不必和時間賽跑。", sky: "dusk", act: { nicole: { to: [-0.4, -0.4], on: "bench", slot: -0.36, pose: "sit", face: "calm" }, you: { to: [0.4, -0.4], on: "bench", slot: 0.36, pose: "sit", face: "calm" }, kobe: { to: [0, 0.4], pose: "lie", turn: 0 } } },
      { who: "妮可", text: "勇於創造你自己吧。", act: { nicole: { pose: "wave", face: "happy", icon: "heart" }, you: { face: "happy", icon: "sparkle" } } },
    ],
  },
];

export const sceneByChapter = Object.fromEntries(islandScenes.map(s => [s.chapter, s]));
