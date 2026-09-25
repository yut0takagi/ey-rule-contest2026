// slides/slides.md（Marp）の内容を、編集できる pptx として再現する生成スクリプト
//
// 使い方: npm run build:pptx   （出力先: dist/slides.pptx）
//
// 注意: スライドの文言はこのファイルに直接書いてある。slides.md を直したら、
//       このファイルの該当箇所も同じように直すこと（自動では同期されない）。
//
// 座標は Marp と同じ 1280x720px 基準で書き、LAYOUT_WIDE（13.333x7.5in, 96px/in）に換算する
const path = require('path');
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = '沈黙する選考から、育てる選考へ';

const FONT = 'Yu Gothic';
const C = { y: 'FFE600', dk: '2E2E38', dk2: '3A3A4A', gr: '747480', lg: 'C4C4CD', bg2: 'F4F4F7', w: 'FFFFFF', todo: 'D6453D', todoD: 'FF8A80' };
const P = (px) => px / 96;          // px -> inch
const F = (px) => +(px * 0.75).toFixed(1); // px -> pt

// ---------- rich text ----------
// **strong**  (明るい背景: 太字＋黄色マーカー / 暗い背景: 黄色の太字)
// __bold__    (太字のみ。暗い背景では白)
// [[accent]]  (黄色の太字)
// {{todo}}    (要記入の赤)
// \n          改行
function parse(str) {
  const re = /(\*\*[\s\S]+?\*\*|__[\s\S]+?__|\[\[[\s\S]+?\]\]|\{\{[\s\S]+?\}\})/g;
  const out = [];
  let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push({ t: str.slice(last, m.index), k: 'n' });
    const s = m[0];
    if (s.startsWith('**')) out.push({ t: s.slice(2, -2), k: 's' });
    else if (s.startsWith('__')) out.push({ t: s.slice(2, -2), k: 'b' });
    else if (s.startsWith('[[')) out.push({ t: s.slice(2, -2), k: 'a' });
    else out.push({ t: s.slice(2, -2), k: 't' });
    last = m.index + s.length;
  }
  if (last < str.length) out.push({ t: str.slice(last), k: 'n' });
  return out;
}
function plain(str) { return parse(str).map((r) => r.t).join(''); }

function runs(str, o) {
  // o: {size, color, bold, dark, bullet, paraAfter}
  const segs = parse(str);
  const res = [];
  segs.forEach((sg) => {
    const parts = sg.t.split('\n');
    parts.forEach((pt, i) => {
      const opt = { fontFace: FONT, fontSize: F(o.size), color: o.color, bold: !!o.bold };
      if (o.charSpacing) opt.charSpacing = o.charSpacing;
      if (sg.k === 's') { opt.bold = true; if (o.dark) opt.color = C.y; else opt.highlight = C.y; }
      if (sg.k === 'b') { opt.bold = true; if (o.dark) opt.color = C.w; }
      if (sg.k === 'a') { opt.bold = true; opt.color = C.y; }
      if (sg.k === 't') { opt.bold = true; opt.color = o.dark ? C.todoD : C.todo; }
      if (o.sizeMap && o.sizeMap[sg.k]) opt.fontSize = F(o.sizeMap[sg.k]);
      if (pt.length) res.push({ text: pt, options: opt });
      if (i < parts.length - 1) {
        if (res.length) res[res.length - 1].options.breakLine = true;
        else res.push({ text: '', options: { ...opt, breakLine: true } });
      }
    });
  });
  return res;
}

// 日本語テキストの高さ見積もり（px）
function measure(str, size, w, lh) {
  const paras = plain(str).split('\n');
  let lines = 0;
  paras.forEach((p) => {
    let u = 0;
    for (const ch of p) u += /[\x00-\x7F]/.test(ch) ? 0.6 : 1.07;
    lines += Math.max(1, Math.ceil((u * size * 1.1) / w - 0.02));
  });
  return lines * size * lh;
}

function T(slide, str, x, y, w, h, o = {}) {
  const size = o.size || 25;
  const opts = {
    x: P(x), y: P(y), w: P(w), h: P(h), margin: 0, isTextBox: true,
    valign: o.valign || 'top', align: o.align || 'left',
    lineSpacingMultiple: o.lh || 1.5, fit: 'none',
  };
  if (o.fill) opts.fill = { color: o.fill };
  if (o.inset) opts.margin = o.inset.map((v) => F(v));
  slide.addText(runs(str, { size, color: o.color || C.dk, bold: o.bold, dark: o.dark, charSpacing: o.cs, sizeMap: o.sizeMap }), opts);
}

function R(slide, x, y, w, h, color, line) {
  const o = { x: P(x), y: P(y), w: P(w), h: P(h), fill: { color } };
  o.line = line ? { color: line.color, width: line.width } : { type: 'none' };
  slide.addShape(pres.shapes.RECTANGLE, o);
}
function L(slide, x, y, w, color, width) {
  slide.addShape(pres.shapes.LINE, { x: P(x), y: P(y), w: P(w), h: 0, line: { color, width } });
}

// 箇条書き（項目ごとにテキストボックスを分け、行頭記号は小さな丸で描く）
function bullets(slide, items, x, y, w, h, o = {}) {
  const size = o.size || 16, lh = o.lh || 1.5, gap = o.gap || 4;
  const ind = size * 1.0;
  let cy = y;
  items.forEach((it) => {
    const ih = measure(it, size, w - ind, lh);
    const d = Math.max(4, size * 0.3);
    slide.addShape(pres.shapes.OVAL, { x: P(x + 2), y: P(cy + (size * lh) / 2 - d / 2), w: P(d), h: P(d), fill: { color: o.markColor || (o.dark ? C.y : C.gr) }, line: { type: 'none' } });
    T(slide, it, x + ind, cy, w - ind, ih + 4, { size, color: o.color || C.dk, dark: o.dark, lh });
    cy += ih + gap;
  });
  return cy - y;
}
function bulletsHeight(items, size, w, lh, gap) {
  return items.reduce((s, it) => s + measure(it, size, w - size * 1.0, lh) + (gap || 4), 0);
}

function tag(slide, text, x, y, o = {}) {
  const size = o.size || 14;
  let u = 0; for (const ch of text) u += /[\x00-\x7F]/.test(ch) ? 0.62 : 1.0;
  const w = u * size * 1.12 + 20;
  const h = size * 1.6;
  T(slide, text, x, y, w, h, { size, bold: true, color: o.color || C.dk, fill: o.fill || C.y, valign: 'middle', align: 'center', lh: 1.0, cs: 1 });
  return h;
}

// ---------- 共通の枠 ----------
let pageNo = 0;
function base(opts = {}) {
  const s = pres.addSlide();
  pageNo += 1;
  s.background = { color: opts.bg || C.w };
  if (opts.topBar === 'full') R(s, 0, 0, 1280, 12, C.y);
  else if (opts.topBar !== 'none') R(s, opts.barX || 80, 0, 72, 12, C.y);
  if (opts.page !== false) T(s, String(pageNo), 1140, 684, 100, 20, { size: 15, bold: true, color: C.gr, align: 'right' });
  if (opts.header) {
    T(s, 'APPENDIX　補足資料', 1240 - 190, 20, 190, 24, { size: 13, bold: true, color: C.y, fill: C.dk, align: 'center', valign: 'middle', lh: 1.0, cs: 2 });
  }
  return s;
}
function kicker(s, text, x, y, o = {}) {
  T(s, text, x, y, 1100, 24, { size: 16, bold: true, color: o.color || C.gr, cs: 3, lh: 1.2 });
}
function h2(s, text, x, y, o = {}) {
  const size = o.size || 36;
  T(s, text, x, y, o.w || 1120, o.h || size * 1.4, { size, bold: true, color: o.color || C.dk, lh: 1.3, dark: o.dark });
}
function src(s, text, x = 80, y = 674, w = 1060, size = 13) {
  T(s, text, x, y, w, 36, { size, color: C.gr, lh: 1.35 });
}

// 数字カード
function stat(s, x, y, w, h, o) {
  const hl = !!o.hl;
  R(s, x, y, w, h, hl ? C.dk : C.bg2);
  R(s, x, y, w, 6, hl ? C.y : C.dk);
  let cy = y + 22;
  if (o.num !== undefined) {
    const ns = o.numSize || 54;
    const numStr = o.num + (o.unit ? '' : '');
    const r = runs(numStr, { size: ns, color: hl ? C.y : C.dk, bold: true, dark: hl });
    if (o.unit) r.push({ text: o.unit, options: { fontFace: FONT, fontSize: F(22), bold: true, color: hl ? C.y : C.dk } });
    s.addText(r, { x: P(x + 20), y: P(cy), w: P(w - 40), h: P(ns * 1.15), margin: 0, isTextBox: true, valign: 'bottom', lineSpacingMultiple: 1.0 });
    cy += ns * 1.15 + 8;
  }
  if (o.lab) {
    const lh = measure(o.lab, o.labSize || 17, w - 40, 1.45);
    T(s, o.lab, x + 20, cy, w - 40, lh + 4, { size: o.labSize || 17, bold: true, color: hl ? C.w : C.dk, lh: 1.45, dark: hl });
    cy += lh + 2;
  }
  if (o.small) {
    const sh = measure(o.small, 14, w - 40, 1.45);
    T(s, o.small, x + 20, cy, w - 40, sh + 4, { size: 14, color: hl ? C.lg : C.gr, lh: 1.45, dark: hl });
  }
}
function statHeight(w, o) {
  let h = 22;
  if (o.num !== undefined) h += (o.numSize || 54) * 1.15 + 8;
  if (o.lab) h += measure(o.lab, o.labSize || 17, w - 40, 1.45) + 2;
  if (o.small) h += measure(o.small, 14, w - 40, 1.45);
  return h + 16;
}

// カード（番号・タグ・見出し・本文・経由）
function cardLayout(w, o, sz) {
  const pad = sz.pad;
  const iw = w - pad * 2;
  const parts = [];
  let h = sz.padTop;
  if (o.no) { parts.push(['no', h]); h += sz.no * 1.05 + 6; }
  if (o.tag) { parts.push(['tag', h]); h += sz.tag * 1.6 + 8; }
  if (o.h4) { const hh = measure(o.h4, sz.h4, iw, 1.4); parts.push(['h4', h, hh]); h += hh + 6; }
  (o.ps || []).forEach((p, i) => {
    const ph = measure(p, sz.p, iw, sz.plh);
    parts.push(['p' + i, h, ph, p]); h += ph + 6;
  });
  if (o.via) { h += 4; const vh = measure(o.via, sz.via, iw, 1.45); parts.push(['via', h, vh]); h += vh + 10; }
  return { h: h + sz.padBot, parts, iw };
}
function card(s, x, y, w, hFixed, o, sz) {
  const main = !!o.main;
  const lay = cardLayout(w, o, sz);
  const h = hFixed || lay.h;
  R(s, x, y, w, h, main ? C.dk : C.bg2);
  const ix = x + sz.pad;
  lay.parts.forEach((pp) => {
    const [k, oy, hh, text] = pp;
    if (k === 'no') T(s, o.no, ix, y + oy, lay.iw, sz.no * 1.1, { size: sz.no, bold: true, color: main ? C.y : C.dk, lh: 1.0 });
    else if (k === 'tag') tag(s, o.tag, ix, y + oy, { size: sz.tag });
    else if (k === 'h4') T(s, o.h4, ix, y + oy, lay.iw, hh + 4, { size: sz.h4, bold: true, color: main ? C.y : C.dk, lh: 1.4, dark: main });
    else if (k.startsWith('p')) T(s, text, ix, y + oy, lay.iw, hh + 4, { size: sz.p, color: main ? C.w : C.dk2, lh: sz.plh, dark: main });
    else if (k === 'via') {
      const vy = y + h - sz.padBot - 10 - hh;
      L(s, ix, vy - 6, lay.iw, main ? C.gr : C.lg, 0.75);
      T(s, o.via, ix, vy, lay.iw, hh + 4, { size: sz.via, color: main ? C.lg : C.gr, lh: 1.45, dark: main });
    }
  });
  return h;
}
const SZ_MAIN = { pad: 20, padTop: 20, padBot: 18, no: 40, tag: 14, h4: 21, p: 16, plh: 1.55, via: 14 };
const SZ_AP = { pad: 16, padTop: 14, padBot: 16, no: 32, tag: 13, h4: 17, p: 14, plh: 1.55, via: 13 };
const SZ_TIGHT = { pad: 16, padTop: 10, padBot: 12, no: 32, tag: 13, h4: 17, p: 14, plh: 1.5, via: 13 };

function cardRow(s, x, y, totalW, gap, cards, sz, eq = true) {
  const n = cards.length;
  const w = (totalW - gap * (n - 1)) / n;
  const hs = cards.map((c) => cardLayout(w, c, sz).h);
  const H = Math.max(...hs);
  cards.forEach((c, i) => card(s, x + i * (w + gap), y, w, eq ? H : null, c, sz));
  return H;
}

function band(s, text, x, y, w, o = {}) {
  const size = o.size || 23;
  const padX = o.padX || 26, padY = o.padY || 18;
  const th = o.textH || measure(text, size, w - padX * 2, 1.55);
  const h = th + padY * 2 + (o.extraH || 0);
  R(s, x, y, w, h, C.dk);
  if (o.render) o.render(x + padX, y + padY, w - padX * 2);
  else T(s, text, x + padX, y + padY, w - padX * 2, th + 4, { size, bold: true, color: C.w, lh: 1.55, dark: true });
  return h;
}

// 表
function table(s, header, rows, x, y, colW, o = {}) {
  const size = o.size || 14.5;
  const pad = o.pad || [6, 10];
  const border = { type: 'solid', pt: 0.75, color: C.lg };
  const none = { type: 'none' };
  const mk = (txt, isH, ri, ci) => {
    const cellOpts = {
      fill: { color: isH ? C.dk : (ri % 2 === 1 ? C.bg2 : C.w) },
      border: [none, none, isH ? none : border, none],
      margin: [F(pad[0]), F(pad[1]), F(pad[0]), F(pad[1])],
      valign: 'middle',
      align: o.align && o.align[ci] ? o.align[ci] : 'left',
    };
    const boldCol = o.boldCol !== undefined && o.boldCol === ci && !isH;
    return { text: runs(txt, { size, color: isH ? C.w : C.dk, bold: isH || boldCol }), options: cellOpts };
  };
  const data = [header.map((h, ci) => mk(h, true, -1, ci)), ...rows.map((r, ri) => r.map((c, ci) => mk(c, false, ri, ci)))];
  s.addTable(data, { x: P(x), y: P(y), w: P(colW.reduce((a, b) => a + b, 0)), colW: colW.map(P), fontFace: FONT, fontSize: F(size), lineSpacingMultiple: o.lh || 1.4, autoPage: false });
}

function label(s, text, x, y, size = 18) {
  T(s, '**' + text + '**', x, y, 600, size * 1.6, { size, bold: true, lh: 1.3 });
}
function note(s, text, x, y, w) {
  R(s, x, y, 6, 30, C.y);
  T(s, text, x + 18, y + 3, w - 18, 26, { size: 15, color: C.dk2, lh: 1.4 });
}

// =====================================================================
// 1. 表紙
{
  const s = base({ bg: C.dk, topBar: 'full', page: false });
  kicker(s, '第4回 学生ルール形成アイデアコンテスト', 80, 262, { color: C.lg });
  s.addText([
    { text: '沈黙する選考から、', options: { fontFace: FONT, fontSize: F(66), bold: true, color: C.w, breakLine: true } },
    { text: '育てる選考へ', options: { fontFace: FONT, fontSize: F(66), bold: true, color: C.y } },
  ], { x: P(80), y: P(292), w: P(1120), h: P(175), margin: 0, isTextBox: true, valign: 'top', lineSpacingMultiple: 1.2 });
  T(s, '就活を通して、学生の成長を最大化する', 80, 488, 1120, 40, { size: 28, bold: true, color: C.lg, lh: 1.3 });
  L(s, 80, 582, 1120, C.gr, 0.75);
  T(s, '{{【団体名】}}　{{【大学名】}}　{{【メンバー名】}}', 80, 598, 1120, 30, { size: 19, color: C.lg, dark: true, lh: 1.3 });
}

// 2. サマリー
{
  const s = base();
  kicker(s, 'SUMMARY', 80, 72);
  h2(s, 'サマリー', 80, 98);
  R(s, 80, 176, 10, 88, C.y);
  T(s, '目指すのは、**就活を通して学生の成長を最大化すること**。\nそのために、評価の理由が本人に返るルールをつくる。', 110, 178, 1090, 86, { size: 27, bold: true, lh: 1.5 });
  const Y = 290, H = 312;
  const cols = [
    { x: 80, w: 334, hd: '課題', h4: '評価されるのに、成長につながらない', li: ['学生は書類__12.4社__、面接は対面5.1社・Web7.6社で評価される', '企業の重視点と学生のアピールに__50pt超のずれ__', '理由に届く経路を持つ学生は__約8人に1人__'] },
    { x: 448, w: 384, main: true, hd: '提案：理由が返る就活', h4: '評価のたびに学べる仕組み', li: ['[[① 標準]]：結果と一緒に、全員に理由を返すのを当たり前にする', '[[② 形式]]：次に生かせる形で返す（項目ごとの評価）', '[[③ 誘因]]：ユースエール認定に追加', '[[④ 保護]]：学生側の利用ルール'] },
    { x: 866, w: 334, hd: '目指す姿', h4: '就活が、学生を育てる場になる', li: ['学生：評価→理由→修正→再挑戦を、受ける社数の分だけ回せる', '企業：選考基準がそろい、FBで再応募の意向が__4倍__', '社会：理由に届くかどうかが、お金で決まらなくなる'] },
  ];
  cols.forEach((c) => {
    R(s, c.x, Y, c.w, H, c.main ? C.dk : C.bg2);
    tag(s, c.hd, c.x + 20, Y + 18, { size: 14 });
    const hh = measure(c.h4, 21, c.w - 40, 1.4);
    T(s, c.h4, c.x + 20, Y + 54, c.w - 40, hh + 4, { size: 21, bold: true, color: c.main ? C.y : C.dk, lh: 1.4 });
    bullets(s, c.li, c.x + 20, Y + 54 + hh + 10, c.w - 40, H - (54 + hh + 20), { size: 16, lh: 1.5, dark: !!c.main, color: c.main ? C.w : C.dk, gap: 4 });
  });
  T(s, '→', 414, Y, 34, H, { size: 26, bold: true, color: C.gr, align: 'center', valign: 'middle', lh: 1 });
  T(s, '→', 832, Y, 34, H, { size: 26, bold: true, color: C.gr, align: 'center', valign: 'middle', lh: 1 });
  band(s, '要請と認定で広げ、[[3年目に国の指針で「標準」と明記]]する。新しい法律は作らない。', 80, 618, 1120, { size: 23, padY: 16 });
}

// 3. つかみ＋実録
{
  const s = base({ bg: C.dk, topBar: 'full' });
  kicker(s, '何十社受けても、なぜ落ちたのかは分からない', 80, 200, { color: C.lg });
  T(s, '「残念ながら\n今回は…」', 80, 232, 620, 175, { size: 70, bold: true, color: C.y, lh: 1.2 });
  T(s, '届くのは合否だけ。\n何が評価され、何が合わないと思われたのかを\n知らないまま、**次の選考に向かう**。', 80, 425, 620, 120, { size: 22, color: C.w, lh: 1.7, dark: true });
  s.addShape(pres.shapes.LINE, { x: P(724), y: P(190), w: 0, h: P(350), line: { color: C.gr, width: 0.75 } });
  kicker(s, 'OUR STORY　私たち3人の就活', 764, 205, { color: C.lg });
  const items = [['3人で受けた社数', false], ['不合格になった社数', false], ['理由が返ってきた社数', true]];
  items.forEach(([lab, yel], i) => {
    const yy = 243 + i * 98;
    s.addText([
      { text: '○', options: { fontFace: FONT, fontSize: F(50), bold: true, color: C.todoD } },
      { text: '社', options: { fontFace: FONT, fontSize: F(22), bold: true, color: yel ? C.y : C.w } },
    ], { x: P(764), y: P(yy), w: P(400), h: P(56), margin: 0, isTextBox: true, valign: 'bottom', lineSpacingMultiple: 1 });
    T(s, lab, 764, yy + 60, 400, 22, { size: 16, color: C.lg, lh: 1.2 });
  });
  s.addNotes('つかみ。メンバー自身の不合格メールの体験を一言添える。\n理由が分からなかったときにしたこと（体験記を読みあさった、ガクチカを書き直した、同じ内容で出し続けた等）を口頭で。\n右側の○には3人の実数を入れる。');
}

// 4. 課題01
{
  const s = base();
  kicker(s, 'PROBLEM 01', 80, 72);
  h2(s, '何十回も評価されるのに、基準は見えない', 80, 98);
  T(s, '26卒の学生が各選考プロセスを経験した社数の平均', 80, 170, 1120, 32, { size: 22, bold: true, lh: 1.4 });
  const w4 = (1120 - 48) / 4;
  const d4 = [['12.4', '書類提出', 'エントリーシートなど'], ['9.8', '適性検査', '筆記試験を含む'], ['5.1', '面接', '対面'], ['7.6', '面接', 'Web']];
  d4.forEach((d, i) => stat(s, 80 + i * (w4 + 16), 214, w4, 150, { num: d[0], unit: '社', lab: d[1], small: d[2] }));
  const w2 = (1120 - 16) / 2;
  stat(s, 80, 384, w2, 150, { num: '36.7', unit: '%', lab: '採用選考の基準を「知りたかった」' });
  stat(s, 80 + w2 + 16, 384, w2, 150, { num: '29.4', unit: '%', lab: '実際に「知ることができた」', small: '知りたかった割合を下回る数少ない項目の一つ', hl: true });
  src(s, '出典：リクルート就職みらい研究所『就職白書2026』図表37（各プロセスの実施者ベース）・図表39・40（学生n=1,326）');
  s.addNotes('締め：1人あたり十数回から数十回評価されるのに、合否の連絡に理由は書かれていない。\n補足（口頭で）：合否の連絡すら来ない企業もある。書類選考で29%、大企業の面接で23%（HR総研、2017年3月実施）。');
}

// 5. 課題02：ずれ
{
  const s = base();
  kicker(s, 'PROBLEM 02', 80, 72);
  h2(s, '見当違いの努力を、何十社分も繰り返している', 80, 98);
  R(s, 80, 200, 18, 12, C.dk);
  T(s, '企業が選考で重視する', 106, 196, 220, 22, { size: 16, bold: true, lh: 1.2 });
  R(s, 300, 200, 18, 12, C.y);
  T(s, '学生が面接でアピールした', 326, 196, 260, 22, { size: 16, bold: true, lh: 1.2 });
  const rows = [['今後の可能性', 71.0, 16.1, '−54.9pt', false], ['人柄', 93.8, 40.9, '−52.9pt', false], ['自社への熱意', 73.4, 20.6, '−52.8pt', false], ['アルバイト経験', 31.4, 46.1, '+14.7pt', true], ['趣味・特技', 7.0, 23.6, '+16.6pt', true]];
  const bx = 256, BW = 818;
  rows.forEach((r, i) => {
    const yy = 236 + i * 58;
    T(s, r[0], 80, yy, 160, 42, { size: 19, bold: true, align: 'right', valign: 'middle', lh: 1.2 });
    const b1 = BW * r[1] / 100, b2 = BW * r[2] / 100;
    T(s, r[1].toFixed(1) + '%', bx, yy, b1, 19, { size: 13, bold: true, color: C.w, fill: C.dk, valign: 'middle', lh: 1, inset: [0, 8, 0, 8] });
    T(s, r[2].toFixed(1) + '%', bx, yy + 23, b2, 19, { size: 13, bold: true, color: C.dk, fill: C.y, valign: 'middle', lh: 1, inset: [0, 8, 0, 8] });
    T(s, r[3], 1090, yy, 110, 42, { size: r[4] ? 19 : 23, bold: true, color: r[4] ? C.gr : C.dk, valign: 'middle', lh: 1.2 });
  });
  src(s, '出典：『就職白書2026』図表41（学生n=1,326）・図表110（企業n=1,182）。同じ項目リストでの比較。「アピールした」と「重視する」は同一の問いではない点に留意', 80, 660);
  s.addNotes('断定しすぎない。「同じ項目で比べると、これだけずれている」と言う。\n人柄は意識してアピールしなくても伝わるので、差のすべてが努力のずれではない。\n締め：評価が返ってこないから、学生はずれた方向に力を注ぎ続ける。');
}

// 6. 課題03＋再定義
{
  const s = base({ bg: C.dk, topBar: 'full' });
  kicker(s, 'PROBLEM 03 ／ REFRAME', 80, 72, { color: C.lg });
  s.addText([
    { text: '12.2', options: { fontFace: FONT, fontSize: F(96), bold: true, color: C.y } },
    { text: '%', options: { fontFace: FONT, fontSize: F(36), bold: true, color: C.y } },
  ], { x: P(80), y: P(172), w: P(489), h: P(110), margin: 0, isTextBox: true, valign: 'bottom', lineSpacingMultiple: 1 });
  T(s, '人材紹介会社に登録している学生。\n企業は不採用の理由を__エージェントには伝える__ことがある。\n理由に届く経路を持つのは、[[約8人に1人]]だけ。', 80, 294, 480, 140, { size: 19, color: C.lg, lh: 1.55, dark: true });
  T(s, 'これはマナーの問題ではない。\n日本の就活は**国内最大規模の\n「フィードバックのない評価」**だ。', 613, 112, 600, 165, { size: 36, bold: true, color: C.w, lh: 1.45, dark: true });
  T(s, '評価のたびに学べるはずの機会が、毎年何十万人分も捨てられている。\nずれを抱えたまま入社し、大卒の __33.8%__ が3年以内に離職している。\n→ __成長の機会の損失__であり、__情報の格差__の問題である。\n目指すのは、[[就活を通して学生の成長を最大化すること]]。', 613, 292, 590, 200, { size: 19, color: C.lg, lh: 1.7, dark: true });
  src(s, '出典：『就職白書2026』図表36／LHH就活エージェント「就活の不採用理由の聞き方」／厚生労働省「新規学卒就職者の離職状況（令和4年3月卒業者）」');
  s.addNotes('離職率とFB欠如の因果は示せていない。「ミスマッチの一つの表れ」として控えめに扱う。');
}

// 7. 提案
{
  const s = base();
  kicker(s, 'PROPOSAL', 80, 72);
  h2(s, '成長を最大化する「理由が返る就活」', 80, 98);
  const H = cardRow(s, 80, 188, 1120, 16, [
    { main: true, no: '01', tag: '標準', h4: '全員に、結果と一緒に返す', ps: ['頼まれたら返すのではなく、最初から返す。合格の理由も含む。'], via: '政府の就活に関する要請 → 職業安定法に基づく指針（厚労省）' },
    { no: '02', tag: '形式', h4: '次に生かせる形で返す', ps: ['何が届き、何が足りなかったかを項目ごとに返す。企業の負担と訴訟リスクを抑える。'], via: '大学側の申合せ＋定型フォーマットの共通化' },
    { no: '03', tag: '誘因', h4: '全員に返す企業を認定', ps: ['認定と就活サイトでの表示で、自発的に広げる。'], via: 'ユースエール認定の要件に追加' },
    { no: '04', tag: '保護', h4: '学生側の利用ルール', ps: ['SNSへの晒しや目的外の利用を禁止する。'], via: '応募時の同意事項のひな形' },
  ], SZ_MAIN);
  const by = 188 + H + 18;
  band(s, '', 80, by, 1120, {
    textH: 72, padY: 16,
    render: (x, y, w) => {
      T(s, '評価 → [[理由]] → 修正 → 再挑戦。この循環を、受ける社数の分だけ回せるようにする。', x, y, w, 36, { size: 23, bold: true, color: C.w, lh: 1.4, dark: true });
      T(s, '「求めた人だけ」ではなく「全員に標準で」。新しい法律は作らず、要請・認定・指針で当たり前にしていく。', x, y + 40, w, 30, { size: 18, bold: true, color: C.lg, lh: 1.4 });
    },
  });
  s.addNotes('②の定型フォーマットの例：「志望動機と当社の事業の一致」「経験の具体性」「当社の働き方との相性」などを、期待を上回る／期待どおり／期待に届かず の3段階で返す。');
}

// 8. 実現性
{
  const s = base();
  kicker(s, 'FEASIBILITY', 80, 72);
  h2(s, '企業の負担を増やさずに、全員に返せる', 80, 98);
  T(s, '理由は既にある。面接官が書いている評価シートを、学生に届く形に変えるだけ。', 80, 170, 1120, 32, { size: 22, bold: true, lh: 1.4 });
  const fl = [
    { x: 80, w: 335, tag: '今ある', h4: '面接官の評価シート', p: '選考のたびに、既に書かれている' },
    { x: 455, w: 369, tag: 'PROTOTYPE', h4: '定型FBを自動生成', p: '項目ごとの評価と、次に生かせる一言に変換する', main: true },
    { x: 864, w: 336, tag: '届く', h4: '全員に、結果と一緒に', p: '合否の通知と同時に送る' },
  ];
  fl.forEach((f) => {
    R(s, f.x, 214, f.w, 110, f.main ? C.dk : C.bg2);
    tag(s, f.tag, f.x + 20, 230, { size: 13 });
    T(s, f.h4, f.x + 20, 262, f.w - 40, 30, { size: 21, bold: true, color: f.main ? C.y : C.dk, lh: 1.3 });
    T(s, f.p, f.x + 20, 292, f.w - 40, 26, { size: 15, color: f.main ? C.w : C.dk, lh: 1.4 });
  });
  T(s, '→', 415, 214, 40, 110, { size: 26, bold: true, color: C.gr, align: 'center', valign: 'middle', lh: 1 });
  T(s, '→', 824, 214, 40, 110, { size: 26, bold: true, color: C.gr, align: 'center', valign: 'middle', lh: 1 });
  const w3 = (1120 - 32) / 3;
  [['秒', '1件あたりの生成時間', false], ['円', '1件あたりのコスト', false], ['円', '1万人の応募者に返す場合', true]].forEach((d, i) =>
    stat(s, 80 + i * (w3 + 16), 344, w3, 136, { num: '{{○}}', unit: d[0], lab: d[1], hl: d[2] }));
  src(s, '企業の負担・法的リスク・選考の質などへの懸念と回答、コスト試算の考え方は、Appendix（A1〜A12）にまとめた。');
  s.addNotes('情報系メンバーが担当。評価シートのサンプルを入力し、定型FBが出るところを見せる（スクリーンショットを差し込む）。\n採用に関わる人員数が課題の企業は38.2%（就職白書2026 図表111）。手間の懸念はここで先に潰す。');
}

// 9. 効果と広がり
{
  const s = base();
  kicker(s, 'IMPACT ／ GLOBAL', 80, 72);
  h2(s, '就活が、学生を育てる場になる', 80, 98);
  const w3 = (1120 - 32) / 3;
  const st = [
    { num: '成長が続く', numSize: 34, lab: '学生', small: '何十社分の評価が、すべて次の成長の材料になる。社会に出る前に、自分の強みと課題を知れる' },
    { num: '4', unit: '倍', lab: '企業', small: '建設的なFBを受けた候補者が再応募を考える可能性。候補者の94%がFBを望む。基準を言葉にすることで、選考基準もそろう（統一が課題の企業12.9%）' },
    { num: '格差をなくす', numSize: 34, lab: '社会', small: '理由に届くかどうかが、使えるサービスとお金で決まらなくなる', hl: true },
  ];
  const H = Math.max(...st.map((o) => statHeight(w3, o))) + 26;
  st.forEach((o, i) => stat(s, 80 + i * (w3 + 16), 180, w3, H, o));
  cardRow(s, 80, 180 + H + 18, 1120, 16, [
    { tag: '海外の動き', ps: ['__EU__：AI Act が、採用などの高リスクAIによる個別の決定について説明を受ける権利を定める（第86条）\n__韓国__：採用手続きの公正化に関する法律に、応募者へ採用の可否を知らせる規定 {{【要確認】}}'] },
    { main: true, tag: '日本発の展開', ps: ['理由を返す定型フォーマットを、人的資本の開示や採用の国際的な指標に提案する。AI選考が広がるほど、評価の中身を返すルールの必要性は高まる。'] },
  ], SZ_MAIN);
  src(s, '出典：LinkedIn Talent Solutions "Guide to rejecting candidates"／『就職白書2026』図表111');
}

// 10. 道筋と結び
{
  const s = base({ page: false });
  kicker(s, 'ROADMAP', 80, 146);
  h2(s, '実現までの道筋', 80, 172);
  const steps = [
    ['1年目', '政府の就活に関する要請に、FB提供を追加', '内閣官房・厚労省・文科省'],
    ['1年目', 'ユースエール認定に、FBを加点項目として追加', '厚労省'],
    ['2年目', '大学側の申合せと、学生側の利用ルールのひな形', '就職問題懇談会'],
    ['3年目', '指針に「結果と一緒に理由を返す」を標準として明記', '厚労省（労働政策審議会）'],
  ];
  const cw = 280, ly = 268;
  steps.forEach((st, i) => {
    const x = 80 + i * cw;
    R(s, x, ly, cw, 6, i === 3 ? C.y : C.lg);
    if (i === 3) s.addShape(pres.shapes.OVAL, { x: P(x - 4), y: P(ly - 13), w: P(32), h: P(32), fill: { color: C.dk } });
    s.addShape(pres.shapes.OVAL, { x: P(x), y: P(ly - 9), w: P(24), h: P(24), fill: { color: i === 3 ? C.y : C.dk }, line: { type: 'none' } });
    T(s, st[0], x, ly + 26, cw - 18, 22, { size: 15, bold: true, color: C.gr, cs: 2, lh: 1.2 });
    T(s, st[1], x, ly + 50, cw - 18, 58, { size: 19, bold: true, lh: 1.45 });
    T(s, st[2], x, ly + 112, cw - 18, 22, { size: 14, color: C.gr, lh: 1.3 });
  });
  R(s, 80, 440, 1120, 142, C.dk);
  T(s, '沈黙する選考から、育てる選考へ', 114, 470, 1050, 26, { size: 18, color: C.lg, cs: 2, lh: 1.2 });
  T(s, '就活を、学生が[[いちばん成長できる時間]]に。', 114, 504, 1050, 50, { size: 32, bold: true, color: C.w, lh: 1.3, dark: true });
}

// =====================================================================
// 11. APPENDIX 表紙
{
  const s = base({ bg: C.y, topBar: 'none', page: false });
  T(s, 'ここから先は補足資料です（発表では扱いません）', 80, 122, 560, 38, { size: 18, bold: true, color: C.dk, cs: 2, valign: 'middle', align: 'center', lh: 1 });
  s.addShape(pres.shapes.RECTANGLE, { x: P(80), y: P(122), w: P(560), h: P(38), fill: { type: 'none' }, line: { color: C.dk, width: 1.5 } });
  T(s, 'APPENDIX', 74, 178, 1130, 160, { size: 150, bold: true, color: C.dk, lh: 1.0 });
  T(s, '想定される懸念への詳細な回答と、設計の詳細・根拠データ', 80, 350, 1120, 34, { size: 24, bold: true, color: C.dk, lh: 1.3 });
  R(s, 80, 404, 1120, 2, C.dk);
  const toc = ['懸念の一覧', '企業の負担：全員に返すと重いのでは', 'コスト試算の考え方', '段階的な導入計画', 'フィードバックの仕様', '自動生成の仕組みと安全策', '法的リスクの整理', '選考の質と学生への影響', '実効性の担保と成果指標（KPI）', '関係者ごとのメリットと働きかけ', '海外の制度', 'データの出典と読み方の注意'];
  toc.forEach((t, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 80 + col * 580, y = 422 + row * 32;
    s.addText([
      { text: 'A' + (i + 1) + '\t', options: { fontFace: FONT, fontSize: F(17), bold: true, color: C.dk } },
      { text: t, options: { fontFace: FONT, fontSize: F(17), color: C.dk } },
    ], { x: P(x), y: P(y), w: P(560), h: P(28), margin: 0, isTextBox: true, valign: 'middle', tabStops: [{ position: P(48), alignment: 'l' }] });
  });
}

// ---------- Appendix 共通 ----------
const AX = 64, AW = 1152;
function ap(k, title) {
  const s = base({ barX: AX, header: true });
  kicker(s, k, AX, 58);
  h2(s, title, AX, 84, { size: 30, w: AW });
  return s;
}

// A1
{
  const s = ap('APPENDIX A1', '懸念の一覧');
  table(s, ['#', '懸念', '答えの要点', '詳細'], [
    ['1', '全員に返すと、企業の負担が重い', '理由は既に評価シートにある。自動生成と段階導入で、1件あたりの手間をほぼなくす', 'A2・A3・A4'],
    ['2', '何をどこまで返すのかが曖昧', '選考段階ごとに返す項目と返さない項目を決めておく', 'A5'],
    ['3', 'AIが不適切な文章を作る', '生成は項目評価の言い換えに限る。表現チェックと人事の最終確認を挟む', 'A6'],
    ['4', '採用の自由を侵す', '採否には介入しない。判断の理由を返すことだけを求める', 'A7'],
    ['5', '差別訴訟や個人情報のトラブルが増える', '職務に関わる項目だけを返す。配点と自由記述は返さない', 'A7'],
    ['6', 'FBに合わせて対策され、選考が機能しなくなる', 'ずれが減るのは選考の目的にかなう。配点と合格ラインは返さない', 'A8'],
    ['7', '厳しいFBで学生が傷つく・SNSに晒される', '合格の理由も返し、伝え方の指針をつくる。利用ルールで晒しを禁じる', 'A8'],
    ['8', '形だけのFBになる／企業が参加しない', '認定審査でのサンプル確認と、段階を踏んだ普及。KPIで効果を測る', 'A9'],
    ['9', '就職エージェントなど既存の事業者が反発する', 'FBの活用支援という新しい役割がある。対立ではなく協力の関係にする', 'A10'],
  ], AX, 142, [40, 380, 620, 112], { align: { 3: 'center' } });
}

// A2
{
  const s = ap('APPENDIX A2', '企業の負担：全員に返すと重いのでは');
  const c = [
    { tag: '答え 1', h4: '新しく書く必要はない', ps: ['面接官は、選考のたびに評価シートを書いている。企業は、就職エージェントには不採用の理由を伝えることもある。理由は既に社内にあり、足りないのは学生に届ける仕組みだけ。'] },
    { main: true, tag: '答え 2', h4: '自動生成で、1件あたりの手間をほぼゼロにする', ps: ['評価シートから定型FBを自動でつくる（本編8ページ、A6）。人の作業は、送る前の確認だけにする。1件あたり {{○秒・○円}}（A3）。'] },
    { tag: '答え 3', h4: '段階的に広げる', ps: ['1年目は面接に進んだ応募者から始める。書類選考の段階では、3項目の評価だけを返す。運用が回ってから、対象と項目を広げる（A4）。'] },
    { tag: '答え 4', h4: '先に始めた企業が得をする', ps: ['ユースエール認定と就活サイトでの表示で、採用ブランドが上がる。建設的なFBを受けた候補者は、その企業への再応募を考える可能性が4倍になる。中小企業には、共通フォーマットと生成ツールを無償で提供する。'] },
  ];
  const h1 = cardRow(s, AX, 142, AW, 12, c.slice(0, 2), SZ_AP);
  const h2_ = cardRow(s, AX, 142 + h1 + 12, AW, 12, c.slice(2), SZ_AP);
  note(s, '採用に関わる人員の不足を課題に挙げる企業は38.2%。負担の懸念は最も強く出ると想定し、最初に答えを用意する。', AX, 142 + h1 + h2_ + 30, AW);
  src(s, '出典：『就職白書2026』図表111／LinkedIn Talent Solutions "Guide to rejecting candidates"／LHH就活エージェント「就活の不採用理由の聞き方」', AX, 676, 1060, 12);
}

// A3
{
  const s = ap('APPENDIX A3', 'コスト試算の考え方');
  const cw = (AW - 16) / 2;
  label(s, '試算式', AX, 142);
  T(s, '年間の追加コスト ＝ FBを返す件数 × 1件あたりの作業時間 × 担当者の時間単価 ＋ 生成ツールの利用料', AX, 176, cw, 56, { size: 18, lh: 1.55 });
  table(s, ['前提（例）', '手作業で書く場合', '自動生成＋確認の場合'], [
    ['FBを返す件数', '10,000件', '10,000件'],
    ['1件あたりの作業時間', '5分（仮定）', '{{○秒}}（確認のみ）'],
    ['必要な作業時間の合計', '約833時間', '{{○時間}}'],
    ['生成ツールの利用料', '―', '{{○円}}'],
  ], AX, 262, [200, 184, 184]);
  const rx = AX + cw + 16;
  label(s, '試算の読み方', rx, 142);
  const li = ['手作業の5分は、比較のための仮定の値。実際の値は企業へのヒアリングで置き換える', '自動生成の値は、試作で実測した数字を入れる', '件数は、大手企業の1年分の応募者を想定した規模。中小企業ではこの数分の1から数十分の1になる', '書類選考の段階は3項目だけを返すので、面接の段階より1件あたりの作業は軽い'];
  const bh = bulletsHeight(li, 15, cw, 1.5, 4);
  bullets(s, li, rx, 178, cw, bh + 10, { size: 15, lh: 1.5 });
  band(s, '伝えたいのは「手作業なら重いが、評価シートからの自動生成なら[[ほぼ確認の手間だけ]]になる」という差。', rx, 178 + bh + 20, cw, { size: 18, padX: 18, padY: 14 });
  s.addNotes('情報系メンバー：試作で、評価シート10件程度をサンプルとして生成時間と利用料を測る。1件あたりの値から1万件に掛け戻す。');
}

// A4
{
  const s = ap('APPENDIX A4', '段階的な導入計画');
  table(s, ['時期', '対象の企業', '対象の選考段階', '返す内容', '主な手段'], [
    ['1年目', '賛同する企業（先行導入）', '面接に進んだ応募者', '5項目の評価＋次に生かせる一言', '政府の就活に関する要請、ユースエール認定での加点'],
    ['2年目', '認定企業・経済団体の会員企業に拡大', '面接＋書類選考', '書類は3項目、面接は5項目＋一言', '大学側の申合せ、共通フォーマットの公開、生成ツールの無償提供'],
    ['3年目', 'すべての新卒採用企業（標準として明記）', 'すべての選考段階', '段階ごとの標準項目', '職業安定法に基づく指針に「結果と一緒に理由を返す」を標準として明記'],
    ['4年目以降', '中途採用にも拡大を検討', '―', '―', '効果検証（A9）の結果をもとに判断'],
  ], AX, 142, [100, 250, 180, 250, 372], { boldCol: 0 });
  cardRow(s, AX, 390, AW, 12, [
    { h4: '面接から始める理由', ps: ['面接の評価シートは内容が豊かで、FBにしたときの学生の価値が大きい。対象の人数も書類選考より少ない。'] },
    { h4: '書類は3項目に絞る理由', ps: ['応募者の数が最も多い段階なので、企業の負担を抑える。3項目でも「何が足りなかったか」の方向は分かる。'] },
    { h4: '義務ではなく「標準」にする理由', ps: ['強制すると反発で形だけのFBになりやすい。先行企業の実績を見せ、当たり前にしていく。'] },
  ], SZ_AP);
}

// A5
{
  const s = ap('APPENDIX A5', 'フィードバックの仕様');
  const lw = 600, rx = AX + lw + 24, rw = AW - lw - 24;
  label(s, '選考段階ごとの標準項目（例）', AX, 142);
  table(s, ['段階', '項目', '評価'], [
    ['書類', '志望動機と当社の事業の一致', '3段階'],
    ['書類', '経験の具体性', '3段階'],
    ['書類', '文章の分かりやすさ', '3段階'],
    ['面接', '上の3項目＋対話での伝わり方', '3段階'],
    ['面接', '当社の働き方との相性', '3段階'],
    ['面接', '次に生かせる一言', '定型文から選択＋短い補足'],
  ], AX, 176, [80, 300, 220]);
  T(s, '3段階は「期待を上回る／期待どおり／期待に届かず」。', AX, 452, lw, 28, { size: 16, lh: 1.4 });
  let y = 142;
  const sec = [['返すもの', ['項目ごとの3段階評価', '評価が高かった点（合格の場合も必ず返す）', '次に生かせる一言']],
    ['返さないもの', ['配点、合計点、合格ライン', '他の応募者との比較や順位', '面接官個人の名前や自由記述のメモ', '職務に関係のない事項（出身地や家族など）']],
    ['届け方', ['合否の通知と同時に、採用サイトのマイページかメールで送る', '保存期間は、その年度の就活が終わるまで']]];
  sec.forEach(([hd, li]) => {
    label(s, hd, rx, y);
    const bh = bulletsHeight(li, 15, rw, 1.5, 3);
    bullets(s, li, rx, y + 32, rw, bh + 6, { size: 15, lh: 1.5, gap: 3 });
    y += 32 + bh + 16;
  });
}

// A6
{
  const s = ap('APPENDIX A6', '自動生成の仕組みと安全策');
  const fw = (AW - 4 * 28) / 5;
  const fl = [['1', '評価シート', '面接官が選考中に記入する（今と同じ）'], ['2', '項目への対応づけ', '社内の評価項目を標準項目に対応させる'], ['3', '文章の生成', '項目評価を、次に生かせる言葉に言い換える'], ['4', 'チェック', '表現の自動チェックと、人事の最終確認'], ['5', '送付', '合否の通知と同時に届ける']];
  fl.forEach((f, i) => {
    const x = AX + i * (fw + 28), main = i === 2;
    R(s, x, 142, fw, 120, main ? C.dk : C.bg2);
    tag(s, f[0], x + 16, 156, { size: 13 });
    T(s, f[1], x + 16, 186, fw - 32, 24, { size: 16, bold: true, color: main ? C.y : C.dk, lh: 1.3 });
    T(s, f[2], x + 16, 212, fw - 32, 44, { size: 13, color: main ? C.w : C.dk, lh: 1.5 });
    if (i < 4) T(s, '→', x + fw, 142, 28, 120, { size: 22, bold: true, color: C.gr, align: 'center', valign: 'middle', lh: 1 });
  });
  table(s, ['リスク', '安全策'], [
    ['AIが、評価シートにない内容を作ってしまう', '生成は、項目評価と評価シートの記述の言い換えに限る。新しい評価はさせない'],
    ['人格を否定する表現や、差別につながる表現が出る', '禁止表現の自動チェックを通し、引っかかったものは人が書き直す'],
    ['職務に関係のない事項が混ざる', '出身地や家族など、公正採用選考で聞かない事項を入力の段階で除く'],
    ['学生の個人情報が外部に出る', '企業の社内環境で動かせる形にする。外部サービスを使う場合は、学習に使われない設定にする'],
    ['責任の所在があいまいになる', '送る前に人事が確認する。FBの内容の責任は企業が持つ'],
  ], AX, 282, [420, 732]);
}

// A7
{
  const s = ap('APPENDIX A7', '法的リスクの整理');
  table(s, ['論点', '懸念', '答え', '関係する制度'], [
    ['採用の自由', '企業には、誰を採用するかを決める自由がある', '採否の判断には一切介入しない。求めるのは、判断の理由を返すことだけ', '三菱樹脂事件の最高裁判決（1973年）'],
    ['差別訴訟', '理由を返すと、不当な差別だと争われる材料になる', '返すのは職務に関わる評価項目だけ。自由記述、配点、他の応募者との比較は返さない。職務に関わる項目で評価していることを示せるので、企業の説明責任を果たす手段にもなる', '公正採用選考の考え方（厚労省）'],
    ['個人情報', '評価の情報をどこまで本人に出してよいか', '返す範囲をA5の仕様で決めておく。本人への開示の考え方と整合させる {{【開示の例外規定との関係を要確認】}}', '個人情報保護法（保有個人データの開示）、職業安定法の個人情報の規定'],
    ['強制力', '義務にすると、企業の反発が大きい', '新しい法律は作らない。要請と認定で広げ、3年目に指針で「標準」と明記する', '職業安定法に基づく指針'],
    ['情報の拡散', 'FBが外部に出回る', '応募時の同意事項に、SNSへの投稿や目的外の利用の禁止を入れる。違反時の扱いも決めておく', '応募時の同意事項（ひな形を用意）'],
  ], AX, 142, [110, 250, 490, 302], { boldCol: 0 });
  s.addNotes('条文番号は資料に書く前に最新の法令で確認する。');
}

// A8
{
  const s = ap('APPENDIX A8', '選考の質と学生への影響');
  const pairs = [
    [{ tag: '懸念', h4: '学生がFBに合わせて対策する', ps: ['評価項目が知られると、学生が「受かる答え」を用意するようになり、選考で本来の姿が見えなくなる。'] },
      { main: true, tag: '答え', h4: 'ずれが減ることは、選考の目的にかなう', ps: ['企業が重視する点と学生のアピールには、50pt以上のずれがある項目がある（本編5ページ）。企業が見たいものを学生が理解し、それを伸ばそうとすることは、成長そのもの。配点と合格ラインは返さないので、判断は企業の手に残る。'] }],
    [{ tag: '懸念', h4: '厳しいFBで、学生が傷つく', ps: ['不合格の理由を何度も突きつけられて、自信をなくす学生が出る。'] },
      { main: true, tag: '答え', h4: '合格の理由も返し、伝え方をそろえる', ps: ['評価が高かった点も必ず返す。人格ではなく項目への評価として伝える指針をつくる。大学のキャリアセンターと組んで、FBを受け取った後に相談できる場を用意する。'] }],
    [{ tag: '懸念', h4: 'FBの内容に納得できない学生が、企業に抗議する', ps: ['理由を知ったことで、かえってトラブルが増える。'] },
      { main: true, tag: '答え', h4: 'FBは結論の変更を求める材料にしない', ps: ['応募時の同意事項に、FBは次の就活に生かすためのものであり、合否の再審査の対象ではないと明記する。'] }],
  ];
  let y = 140;
  pairs.forEach((pr) => { y += cardRow(s, AX, y, AW, 12, pr, SZ_TIGHT) + 10; });
}

// A9
{
  const s = ap('APPENDIX A9', '実効性の担保と成果指標（KPI）');
  const cw = (AW - 16) / 2;
  label(s, '形だけにしない仕組み', AX, 142);
  table(s, ['懸念', '仕組み', '担い手'], [
    ['全員に「期待どおり」と返す', '認定審査で、実際に返したFBのサンプルを確認する', '厚労省'],
    ['企業ごとに質がばらばら', '共通フォーマットと、良い例・悪い例の手引きを公開する', '厚労省・大学'],
    ['企業が参加しない', '要請 → 認定での加点 → 指針で標準と明記、と段階を踏む', '内閣官房・厚労省'],
    ['大学が動かない', '大学側の申合せに入れ、キャリアセンターが活用を支援する', '就職問題懇談会'],
  ], AX, 176, [150, 280, 138]);
  const rx = AX + cw + 16;
  label(s, '成果指標（KPI）', rx, 142);
  table(s, ['指標', '何を見るか'], [
    ['FB提供率', '選考を受けた応募者のうち、理由を受け取った割合'],
    ['役立ち度', 'FBが次の選考に役立ったと答えた学生の割合'],
    ['基準の理解度', '「採用選考の基準を知ることができた」学生の割合（本編4ページの29.4%を改善）'],
    ['再応募・好感度', 'FBを受けた学生の、その企業への印象と再応募の意向'],
    ['早期離職率', '導入企業の、新卒3年以内の離職率の推移'],
  ], rx, 176, [130, 438], { boldCol: 0 });
  note(s, '「基準の理解度」は『就職白書』と同じ問いで毎年追えるので、導入前後の比較ができる。', AX, 520, AW);
}

// A10
{
  const s = ap('APPENDIX A10', '関係者ごとのメリットと働きかけ');
  table(s, ['関係者', 'メリット', '懸念', '働きかけ方'], [
    ['学生', '評価のたびに学べる。理由に届くかどうかがお金で決まらない', '厳しいFBへの不安', '合格の理由も返す。キャリアセンターでの相談'],
    ['企業', '選考基準がそろう。採用ブランドが上がる。ミスマッチが減る', '手間と法的リスク', '自動生成ツール、段階導入、認定での加点（A2〜A7）'],
    ['大学', 'キャリア支援の質が上がる。学生の成長を測れる', '支援の負担が増える', '申合せへの追加。FBを使った面談の手引き'],
    ['国（厚労省・文科省・内閣官房）', '若者の早期離職を減らす。人材育成の政策と合う', '企業の反発', '要請と認定から始め、実績をもとに指針へ'],
    ['就活サイト', 'FBを出す企業の表示で、サイトの価値が上がる', '表示の運用の手間', '表示項目の共通化'],
    ['就職エージェント', 'FBを読み解き、次の対策につなげる支援という新しい役割', '理由を知れるという独自の価値が薄れる', 'FBを前提にした支援の形を一緒に考える'],
    ['経済団体', '会員企業の採用ブランドが上がる', '会員企業の負担', '先行導入企業の事例の共有'],
  ], AX, 142, [190, 360, 240, 362], { boldCol: 0 });
}

// A11
{
  const s = ap('APPENDIX A11', '海外の制度');
  table(s, ['国・地域', '制度', '内容', 'この提案との関係'], [
    ['EU', 'AI Act 第86条', '採用などの高リスクAIによる個別の決定について、説明を受ける権利を定める', 'AIを使った選考では、理由の説明が国際的な流れになっている'],
    ['EU', 'GDPR 第22条・第15条', '自動化された決定に服さない権利や、そのロジックについて意味のある情報を得る権利を定める', '評価の中身を本人に返すという考え方の土台'],
    ['韓国', '採用手続きの公正化に関する法律', '応募者に採用の可否を知らせる規定がある {{【対象の企業規模と義務の強さを要確認】}}', '近い国の採用ルールの先例'],
    ['民間', 'LinkedIn の調査', '候補者の94%が面接後のFBを望み、建設的なFBを受けると再応募を考える可能性が4倍になる', '企業にとってのメリットの根拠'],
  ], AX, 142, [100, 220, 460, 372], { boldCol: 0 });
  note(s, '日本の提案の特徴は、AIの利用に限らず「すべての選考で、結果と一緒に理由を返す」を標準にする点。AI選考の規制より一歩先の、成長のための仕組みとして打ち出せる。', AX, 440, AW);
}

// A12
{
  const s = ap('APPENDIX A12', 'データの出典と読み方の注意');
  table(s, ['本編の数字', '値', '出典', '読み方の注意'], [
    ['各選考プロセスの平均社数', '書類12.4社、適性検査9.8社、面接 対面5.1社・Web7.6社', '『就職白書2026』図表37（26卒、学生n=1,326）', 'そのプロセスを経験した学生だけの平均'],
    ['採用選考の基準を知りたかった／知れた', '36.7%／29.4%', '同 図表39・40', '複数回答'],
    ['企業の重視点と学生のアピールのずれ', '人柄 93.8%／40.9% ほか', '同 図表110（企業n=1,182）・図表41', '「重視する」と「アピールした」は別の問い。人柄は意識しなくても伝わる'],
    ['人材紹介会社に登録している学生', '12.2%', '同 図表36', '「約8人に1人」は、理由に届く経路の目安として使っている'],
    ['企業はエージェントに理由を伝えることがある', '―', 'LHH就活エージェントの解説記事', '事業者の説明であり、割合のデータではない'],
    ['大卒の3年以内離職率', '33.8%', '厚労省（令和4年3月卒）', 'FBの欠如との因果関係は示せていない'],
    ['採用人員の不足・選考基準の統一が課題', '38.2%／12.9%', '『就職白書2026』図表111', '複数回答'],
    ['FBを望む候補者／再応募の可能性', '94%／4倍', 'LinkedIn Talent Solutions', '海外の調査。日本の新卒採用にそのまま当てはまるとは限らない'],
    ['合否を連絡しない企業（口頭の補足）', '書類29%、大企業の面接23%', 'HR総研（2017年3月実施）', '古い調査なので背景として使う'],
  ], AX, 138, [250, 290, 290, 322], { size: 13.5, pad: [4, 10], lh: 1.3 });
}

pres.writeFile({ fileName: process.argv[2] || path.join(__dirname, '..', 'dist', 'slides.pptx') }).then((f) => console.log('wrote', f));
