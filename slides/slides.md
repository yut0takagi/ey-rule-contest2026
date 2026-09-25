---
marp: true
size: 16:9
paginate: true
lang: ja
title: 沈黙する選考から、育てる選考へ
style: |
  :root {
    --y: #FFE600;
    --dk: #2E2E38;
    --dk2: #3A3A4A;
    --gr: #747480;
    --lg: #C4C4CD;
    --bg2: #F4F4F7;
    --todo: #D6453D;
  }
  section {
    font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
    color: var(--dk);
    background: #fff;
    padding: 72px 80px 64px;
    font-size: 25px;
    line-height: 1.6;
    letter-spacing: 0.02em;
    display: flex; flex-direction: column; justify-content: flex-start;
  }
  section::before {
    content: ""; position: absolute; top: 0; left: 80px;
    width: 72px; height: 12px; background: var(--y);
  }
  section::after { color: var(--gr); font-size: 15px; font-weight: 600; right: 40px; bottom: 26px; }
  h1, h2, h3, h4 { color: var(--dk); font-weight: 800; letter-spacing: 0.01em; }
  h2 { font-size: 36px; line-height: 1.35; margin: 0 0 24px; }
  h3 { font-size: 24px; margin: 14px 0 8px; }
  h4 { font-size: 22px; margin: 6px 0 6px; }
  p { margin: 0 0 12px; }
  ul { margin: 0 0 12px; padding-left: 1.1em; }
  li { margin: 4px 0; }
  li::marker { color: var(--gr); }
  strong { font-weight: 800; background: linear-gradient(transparent 62%, var(--y) 62%); }
  em { font-style: normal; font-weight: 800; }
  .kicker {
    display: inline-block; font-size: 16px; font-weight: 700; letter-spacing: 0.18em;
    color: var(--gr); margin: 0 0 6px;
  }
  .lead-text { font-size: 22px; font-weight: 600; margin-bottom: 14px; }
  .src { position: absolute; bottom: 26px; left: 80px; right: 120px; font-size: 13px; color: var(--gr); line-height: 1.4; }
  .todo { color: var(--todo); font-weight: 700; }

  /* table */
  table { border-collapse: collapse; font-size: 19px; width: 100%; display: table; }
  th { background: var(--dk); color: #fff; font-weight: 700; text-align: left; padding: 9px 14px; border: none; }
  td { padding: 9px 14px; border: none; border-bottom: 1px solid var(--lg); background: #fff; }
  tr:nth-child(even) td { background: var(--bg2); }

  /* stat cards */
  .stats { display: grid; gap: 16px; margin: 6px 0 18px; }
  .c2 { grid-template-columns: repeat(2, 1fr); }
  .c3 { grid-template-columns: repeat(3, 1fr); }
  .c4 { grid-template-columns: repeat(4, 1fr); }
  .stat { background: var(--bg2); padding: 18px 20px 14px; border-top: 6px solid var(--dk); }
  .stat.hl { background: var(--dk); color: #fff; border-top-color: var(--y); }
  .num { font-size: 54px; font-weight: 800; line-height: 1; letter-spacing: -0.01em; }
  .num small { font-size: 22px; margin-left: 4px; font-weight: 700; }
  .stat.hl .num { color: var(--y); }
  .lab { font-size: 17px; margin-top: 8px; font-weight: 600; line-height: 1.45; }
  .stat .lab small { display: block; font-weight: 400; color: var(--gr); font-size: 14px; }
  .stat.hl .lab small { color: var(--lg); }

  /* cards */
  .cards { display: grid; gap: 16px; }
  .card { background: var(--bg2); padding: 20px 20px 16px; position: relative; }
  .card .no { font-size: 40px; font-weight: 800; line-height: 1; color: var(--dk); }
  .card .tag { display: inline-block; background: var(--y); color: var(--dk); font-size: 14px; font-weight: 800; padding: 2px 10px; margin: 8px 0 6px; letter-spacing: 0.1em; }
  .card h4 { font-size: 21px; line-height: 1.4; }
  .card p { font-size: 16px; color: var(--dk2); line-height: 1.55; margin: 0 0 6px; }
  .card .via { font-size: 14px; color: var(--gr); border-top: 1px solid var(--lg); padding-top: 8px; margin-top: 8px; line-height: 1.45; }
  .card.main { background: var(--dk); color: #fff; }
  .card.main .no, .card.main h4 { color: var(--y); }
  .card.main p { color: #fff; }
  .card.main .via { color: var(--lg); border-top-color: var(--gr); }

  /* bars */
  .legend { font-size: 16px; font-weight: 600; margin-bottom: 12px; display: flex; gap: 28px; }
  .legend i { display: inline-block; width: 18px; height: 12px; margin-right: 8px; vertical-align: 1px; }
  .bars { display: flex; flex-direction: column; gap: 11px; }
  .row { display: grid; grid-template-columns: 160px 1fr 110px; align-items: center; gap: 16px; }
  .row .lbl { font-size: 19px; font-weight: 700; text-align: right; }
  .track { display: flex; flex-direction: column; gap: 4px; }
  .bar { height: 19px; font-size: 13px; font-weight: 700; line-height: 19px; padding-left: 8px; white-space: nowrap; }
  .bar.co { background: var(--dk); color: #fff; }
  .bar.st { background: var(--y); color: var(--dk); }
  .row .gap { font-size: 23px; font-weight: 800; }
  .row .gap.plus { color: var(--gr); font-size: 19px; }

  /* timeline */
  .tl { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 14px; }
  .step { padding: 0 18px 0 0; border-top: 6px solid var(--lg); position: relative; }
  .step::before { content: ""; position: absolute; top: -15px; left: 0; width: 24px; height: 24px; background: var(--dk); border-radius: 50%; }
  .step.last { border-top-color: var(--y); }
  .step.last::before { background: var(--y); box-shadow: 0 0 0 4px var(--dk); }
  .step .when { font-size: 15px; font-weight: 800; letter-spacing: 0.15em; color: var(--gr); margin: 20px 0 6px; }
  .step h4 { font-size: 19px; line-height: 1.45; }
  .step .via { font-size: 14px; color: var(--gr); margin-top: 6px; }

  /* band */
  .band { background: var(--dk); color: #fff; padding: 18px 26px; font-size: 23px; font-weight: 700; line-height: 1.55; margin-top: 14px; }
  .band b { color: var(--y); }

  /* summary */
  .one { font-size: 27px; font-weight: 800; line-height: 1.5; border-left: 10px solid var(--y); padding: 4px 0 4px 20px; margin: 0 0 22px; }
  .sum { display: grid; grid-template-columns: 1fr 34px 1.15fr 34px 1fr; align-items: stretch; }
  .sum .col { background: var(--bg2); padding: 18px 20px; }
  .sum .col.main { background: var(--dk); color: #fff; }
  .sum .arrow { display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; color: var(--gr); }
  .sum .hd { display: inline-block; font-size: 14px; font-weight: 800; letter-spacing: 0.15em; background: var(--y); color: var(--dk); padding: 2px 10px; margin-bottom: 10px; }
  .sum h4 { font-size: 21px; margin: 0 0 8px; line-height: 1.4; }
  .sum .col.main h4 { color: var(--y); }
  .sum ul { font-size: 16px; line-height: 1.55; margin: 0; padding-left: 1em; }
  .sum .col.main li::marker { color: var(--y); }
  .sum b { font-weight: 800; }
  .sum .col.main b { color: var(--y); }

  /* dark slides */
  section.dark { background: var(--dk); color: #fff; }
  section.dark::before { width: 100%; left: 0; height: 12px; }
  section.dark h1, section.dark h2, section.dark h3, section.dark h4 { color: #fff; }
  section.dark strong { background: none; color: var(--y); }
  section.dark .kicker { color: var(--lg); }
  section.dark .todo { color: #FF8A80; }
  section.dark .src { color: var(--gr); }

  section.title { justify-content: flex-end; padding-bottom: 88px; }
  section.title h1 { font-size: 66px; line-height: 1.25; margin: 0 0 18px; }
  section.title h1 span { color: var(--y); }
  section.title .sub { font-size: 28px; font-weight: 700; color: var(--lg); margin-bottom: 44px; }
  section.title .meta { font-size: 19px; color: var(--lg); border-top: 1px solid var(--gr); padding-top: 18px; }

  section.hook { justify-content: center; }
  .hookgrid { display: grid; grid-template-columns: 1.25fr 1fr; gap: 48px; align-items: center; }
  .hookgrid .quote { font-size: 70px; font-weight: 800; color: var(--y); line-height: 1.2; margin: 10px 0 24px; }
  .hookgrid p { font-size: 22px; color: #fff; line-height: 1.7; }
  .story { border-left: 1px solid var(--gr); padding-left: 40px; }
  .story .kicker { margin-bottom: 14px; }
  .story .s { margin-bottom: 18px; }
  .story .s .n { font-size: 50px; font-weight: 800; color: #fff; line-height: 1; }
  .story .s .n small { font-size: 22px; margin-left: 4px; }
  .story .s.y .n { color: var(--y); }
  .story .s .l { font-size: 16px; color: var(--lg); margin-top: 4px; }

  section.roadmap { justify-content: center; }
  .t-a1 th:last-child, .t-a1 td:last-child { white-space: nowrap; width: 64px; text-align: center; }
  .t-a3 th:first-child, .t-a3 td:first-child { white-space: nowrap; font-weight: 700; }
  section.appxcover { background: var(--y); color: var(--dk); justify-content: center; }
  section.appxcover::before { display: none; }
  section.appxcover .kicker { color: var(--dk); font-size: 18px; border: 2px solid var(--dk); padding: 4px 14px; align-self: flex-start; }
  section.appxcover .appxtitle { font-size: 150px; font-weight: 800; line-height: 1; letter-spacing: 0.02em; margin: 18px 0 8px; }
  section.appxcover .appxsub { font-size: 24px; font-weight: 700; margin-bottom: 26px; }
  section.appxcover .toc { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 40px; font-size: 17px; border-top: 2px solid var(--dk); padding-top: 14px; }
  section.appxcover .toc b { display: inline-block; width: 44px; font-weight: 800; }
  header { left: auto; right: 40px; top: 20px; background: var(--dk); color: var(--y); font-size: 13px; font-weight: 800; letter-spacing: 0.15em; padding: 4px 12px; }
  section.ap { font-size: 18px; padding: 60px 64px 56px; line-height: 1.55; }
  section.ap::before { left: 64px; }
  section.ap h2 { font-size: 30px; margin: 0 0 16px; }
  section.ap table { font-size: 14.5px; }
  section.ap th, section.ap td { padding: 6px 10px; }
  section.ap .card { padding: 14px 16px 12px; }
  section.ap .card h4 { font-size: 17px; }
  section.ap .card p { font-size: 14px; }
  section.ap .cards { gap: 12px; }
  section.ap .fstep h4 { font-size: 16px; }
  section.ap .fstep p { font-size: 13px; }
  section.ap ul { font-size: 15px; }
  section.ap .src { left: 64px; font-size: 12px; }
  section.ap .tight td, section.ap .tight th { padding: 4px 10px; line-height: 1.4; }
  section.ap .cards.tight .card { padding: 10px 16px 8px; }
  section.ap .cards.tight { gap: 10px; }
  section.ap .note { font-size: 15px; color: var(--dk2); border-left: 6px solid var(--y); padding: 4px 0 4px 12px; margin-top: 12px; }
  section.appx h2 { font-size: 44px; margin-bottom: 26px; }
  section.appx .pts { font-size: 24px; color: var(--lg); line-height: 1.9; }
  .flow { display: grid; grid-template-columns: 1fr 40px 1.1fr 40px 1fr; align-items: stretch; margin: 4px 0 18px; }
  .fstep { background: var(--bg2); padding: 16px 20px; }
  .fstep.main { background: var(--dk); color: #fff; }
  .fstep .tag { display: inline-block; background: var(--y); color: var(--dk); font-size: 13px; font-weight: 800; padding: 2px 10px; letter-spacing: 0.1em; margin-bottom: 6px; }
  .fstep h4 { font-size: 21px; margin: 0 0 4px; }
  .fstep.main h4 { color: var(--y); }
  .fstep p { font-size: 15px; margin: 0; line-height: 1.5; }
  .farrow { display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; color: var(--gr); }
  section.reframe .grid2 { display: grid; grid-template-columns: 1fr 1.2fr; gap: 44px; align-items: center; }
  section.reframe .big { font-size: 96px; font-weight: 800; color: var(--y); line-height: 1; }
  section.reframe .big small { font-size: 36px; margin-left: 4px; }
  section.reframe .bigl { font-size: 19px; color: var(--lg); margin-top: 10px; line-height: 1.55; }
  section.reframe h2 { font-size: 36px; line-height: 1.45; margin: 0 0 18px; }
  section.reframe .pts { font-size: 19px; color: var(--lg); line-height: 1.7; }
  section.reframe .pts b { color: #fff; }
---

<!-- _class: dark title -->
<!-- _paginate: false -->

<div class="kicker">第4回 学生ルール形成アイデアコンテスト</div>

# 沈黙する選考から、<br><span>育てる選考へ</span>

<div class="sub">就活を通して、学生の成長を最大化する</div>

<div class="meta"><span class="todo">【団体名】</span>　<span class="todo">【大学名】</span>　<span class="todo">【メンバー名】</span></div>

---

<div class="kicker">SUMMARY</div>

## サマリー

<div class="one">目指すのは、<strong>就活を通して学生の成長を最大化すること</strong>。<br>そのために、評価の理由が本人に返るルールをつくる。</div>

<div class="sum">
<div class="col"><div class="hd">課題</div><h4>評価されるのに、成長につながらない</h4><ul>
<li>学生は書類<b>12.4社</b>、面接は対面5.1社・Web7.6社で評価される</li>
<li>企業の重視点と学生のアピールに<b>50pt超のずれ</b></li>
<li>理由に届く経路を持つ学生は<b>約8人に1人</b></li>
</ul></div>
<div class="arrow">→</div>
<div class="col main"><div class="hd">提案：理由が返る就活</div><h4>評価のたびに学べる仕組み</h4><ul>
<li><b>① 標準</b>：結果と一緒に、全員に理由を返すのを当たり前にする</li>
<li><b>② 形式</b>：次に生かせる形で返す（項目ごとの評価）</li>
<li><b>③ 誘因</b>：ユースエール認定に追加</li>
<li><b>④ 保護</b>：学生側の利用ルール</li>
</ul></div>
<div class="arrow">→</div>
<div class="col"><div class="hd">目指す姿</div><h4>就活が、学生を育てる場になる</h4><ul>
<li>学生：評価→理由→修正→再挑戦を、受ける社数の分だけ回せる</li>
<li>企業：選考基準がそろい、FBで再応募の意向が<b>4倍</b></li>
<li>社会：理由に届くかどうかが、お金で決まらなくなる</li>
</ul></div>
</div>

<div class="band">要請と認定で広げ、<b>3年目に国の指針で「標準」と明記</b>する。新しい法律は作らない。</div>

---

<!-- _class: dark hook -->

<div class="hookgrid">
<div>
<div class="kicker">何十社受けても、なぜ落ちたのかは分からない</div>
<div class="quote">「残念ながら<br>今回は…」</div>
<p>届くのは合否だけ。<br>何が評価され、何が合わないと思われたのかを<br>知らないまま、<strong>次の選考に向かう</strong>。</p>
</div>
<div class="story">
<div class="kicker">OUR STORY　私たち3人の就活</div>
<div class="s"><div class="n"><span class="todo">○</span><small>社</small></div><div class="l">3人で受けた社数</div></div>
<div class="s"><div class="n"><span class="todo">○</span><small>社</small></div><div class="l">不合格になった社数</div></div>
<div class="s y"><div class="n"><span class="todo">○</span><small>社</small></div><div class="l">理由が返ってきた社数</div></div>
</div>
</div>

<!--
つかみ。メンバー自身の不合格メールの体験を一言添える。
理由が分からなかったときにしたこと（体験記を読みあさった、ガクチカを書き直した、同じ内容で出し続けた等）を口頭で。
-->

---

<div class="kicker">PROBLEM 01</div>

## 何十回も評価されるのに、基準は見えない

<div class="lead-text">26卒の学生が各選考プロセスを経験した社数の平均</div>

<div class="stats c4">
<div class="stat"><div class="num">12.4<small>社</small></div><div class="lab">書類提出<small>エントリーシートなど</small></div></div>
<div class="stat"><div class="num">9.8<small>社</small></div><div class="lab">適性検査<small>筆記試験を含む</small></div></div>
<div class="stat"><div class="num">5.1<small>社</small></div><div class="lab">面接<small>対面</small></div></div>
<div class="stat"><div class="num">7.6<small>社</small></div><div class="lab">面接<small>Web</small></div></div>
</div>

<div class="stats c2">
<div class="stat"><div class="num">36.7<small>%</small></div><div class="lab">採用選考の基準を「知りたかった」</div></div>
<div class="stat hl"><div class="num">29.4<small>%</small></div><div class="lab">実際に「知ることができた」<small>知りたかった割合を下回る数少ない項目の一つ</small></div></div>
</div>

<div class="src">出典：リクルート就職みらい研究所『就職白書2026』図表37（各プロセスの実施者ベース）・図表39・40（学生n=1,326）</div>

<!--
締め：1人あたり十数回から数十回評価されるのに、合否の連絡に理由は書かれていない。
補足（口頭で）：合否の連絡すら来ない企業もある。書類選考で29%、大企業の面接で23%（HR総研、2017年3月実施）。
-->

---

<div class="kicker">PROBLEM 02</div>

## 見当違いの努力を、何十社分も繰り返している

<div class="legend"><span><i style="background:#2E2E38"></i>企業が選考で重視する</span><span><i style="background:#FFE600"></i>学生が面接でアピールした</span></div>

<div class="bars">
<div class="row"><div class="lbl">今後の可能性</div><div class="track"><div class="bar co" style="width:71%">71.0%</div><div class="bar st" style="width:16.1%">16.1%</div></div><div class="gap">−54.9pt</div></div>
<div class="row"><div class="lbl">人柄</div><div class="track"><div class="bar co" style="width:93.8%">93.8%</div><div class="bar st" style="width:40.9%">40.9%</div></div><div class="gap">−52.9pt</div></div>
<div class="row"><div class="lbl">自社への熱意</div><div class="track"><div class="bar co" style="width:73.4%">73.4%</div><div class="bar st" style="width:20.6%">20.6%</div></div><div class="gap">−52.8pt</div></div>
<div class="row"><div class="lbl">アルバイト経験</div><div class="track"><div class="bar co" style="width:31.4%">31.4%</div><div class="bar st" style="width:46.1%">46.1%</div></div><div class="gap plus">+14.7pt</div></div>
<div class="row"><div class="lbl">趣味・特技</div><div class="track"><div class="bar co" style="width:7%">7.0%</div><div class="bar st" style="width:23.6%">23.6%</div></div><div class="gap plus">+16.6pt</div></div>
</div>

<div class="src">出典：『就職白書2026』図表41（学生n=1,326）・図表110（企業n=1,182）。同じ項目リストでの比較。「アピールした」と「重視する」は同一の問いではない点に留意</div>

<!--
断定しすぎない。「同じ項目で比べると、これだけずれている」と言う。
人柄は意識してアピールしなくても伝わるので、差のすべてが努力のずれではない。
締め：評価が返ってこないから、学生はずれた方向に力を注ぎ続ける。
-->

---

<!-- _class: dark reframe -->

<div class="kicker">PROBLEM 03 ／ REFRAME</div>

<div class="grid2">
<div>
<div class="big">12.2<small>%</small></div>
<div class="bigl">人材紹介会社に登録している学生。<br>企業は不採用の理由を<b style="color:#fff">エージェントには伝える</b>ことがある。<br>理由に届く経路を持つのは、<b style="color:#FFE600">約8人に1人</b>だけ。</div>
</div>
<div>
<h2>これはマナーの問題ではない。<br>日本の就活は<strong>国内最大規模の<br>「フィードバックのない評価」</strong>だ。</h2>
<div class="pts">
評価のたびに学べるはずの機会が、毎年何十万人分も捨てられている。<br>
ずれを抱えたまま入社し、大卒の <b>33.8%</b> が3年以内に離職している。<br>
→ <b>成長の機会の損失</b>であり、<b>情報の格差</b>の問題である。<br>
目指すのは、<b style="color:#FFE600">就活を通して学生の成長を最大化すること</b>。
</div>
</div>
</div>

<div class="src">出典：『就職白書2026』図表36／LHH就活エージェント「就活の不採用理由の聞き方」／厚生労働省「新規学卒就職者の離職状況（令和4年3月卒業者）」</div>

<!--
離職率とFB欠如の因果は示せていない。「ミスマッチの一つの表れ」として控えめに扱う。
-->

---

<div class="kicker">PROPOSAL</div>

## 成長を最大化する「理由が返る就活」

<div class="cards c4">
<div class="card main"><div class="no">01</div><div class="tag">標準</div><h4>全員に、結果と一緒に返す</h4><p>頼まれたら返すのではなく、最初から返す。合格の理由も含む。</p><div class="via">政府の就活に関する要請 → 職業安定法に基づく指針（厚労省）</div></div>
<div class="card"><div class="no">02</div><div class="tag">形式</div><h4>次に生かせる形で返す</h4><p>何が届き、何が足りなかったかを項目ごとに返す。企業の負担と訴訟リスクを抑える。</p><div class="via">大学側の申合せ＋定型フォーマットの共通化</div></div>
<div class="card"><div class="no">03</div><div class="tag">誘因</div><h4>全員に返す企業を認定</h4><p>認定と就活サイトでの表示で、自発的に広げる。</p><div class="via">ユースエール認定の要件に追加</div></div>
<div class="card"><div class="no">04</div><div class="tag">保護</div><h4>学生側の利用ルール</h4><p>SNSへの晒しや目的外の利用を禁止する。</p><div class="via">応募時の同意事項のひな形</div></div>
</div>

<div class="band">評価 → <b>理由</b> → 修正 → 再挑戦。この循環を、受ける社数の分だけ回せるようにする。<br><span style="font-size:18px;color:#C4C4CD">「求めた人だけ」ではなく「全員に標準で」。新しい法律は作らず、要請・認定・指針で当たり前にしていく。</span></div>

<!--
②の定型フォーマットの例：「志望動機と当社の事業の一致」「経験の具体性」「当社の働き方との相性」などを、期待を上回る／期待どおり／期待に届かず の3段階で返す。
-->

---

<div class="kicker">FEASIBILITY</div>

## 企業の負担を増やさずに、全員に返せる

<div class="lead-text">理由は既にある。面接官が書いている評価シートを、学生に届く形に変えるだけ。</div>

<div class="flow">
<div class="fstep"><div class="tag">今ある</div><h4>面接官の評価シート</h4><p>選考のたびに、既に書かれている</p></div>
<div class="farrow">→</div>
<div class="fstep main"><div class="tag">PROTOTYPE</div><h4>定型FBを自動生成</h4><p>項目ごとの評価と、次に生かせる一言に変換する</p></div>
<div class="farrow">→</div>
<div class="fstep"><div class="tag">届く</div><h4>全員に、結果と一緒に</h4><p>合否の通知と同時に送る</p></div>
</div>

<div class="stats c3">
<div class="stat"><div class="num"><span class="todo">○</span><small>秒</small></div><div class="lab">1件あたりの生成時間</div></div>
<div class="stat"><div class="num"><span class="todo">○</span><small>円</small></div><div class="lab">1件あたりのコスト</div></div>
<div class="stat hl"><div class="num"><span class="todo">○</span><small>円</small></div><div class="lab">1万人の応募者に返す場合</div></div>
</div>

<div class="src">企業の負担・法的リスク・選考の質などへの懸念と回答、コスト試算の考え方は、Appendix（A1〜A12）にまとめた。</div>

<!--
情報系メンバーが担当。評価シートのサンプルを入力し、定型FBが出るところを見せる（スクリーンショットを差し込む）。
採用に関わる人員数が課題の企業は38.2%（就職白書2026 図表111）。手間の懸念はここで先に潰す。
-->

---

<div class="kicker">IMPACT ／ GLOBAL</div>

## 就活が、学生を育てる場になる

<div class="stats c3">
<div class="stat"><div class="num" style="font-size:34px;line-height:1.3">成長が続く</div><div class="lab">学生<small>何十社分の評価が、すべて次の成長の材料になる。社会に出る前に、自分の強みと課題を知れる</small></div></div>
<div class="stat"><div class="num">4<small>倍</small></div><div class="lab">企業<small>建設的なFBを受けた候補者が再応募を考える可能性。候補者の94%がFBを望む。基準を言葉にすることで、選考基準もそろう（統一が課題の企業12.9%）</small></div></div>
<div class="stat hl"><div class="num" style="font-size:34px;line-height:1.3">格差をなくす</div><div class="lab">社会<small>理由に届くかどうかが、使えるサービスとお金で決まらなくなる</small></div></div>
</div>

<div class="cards c2">
<div class="card"><div class="tag">海外の動き</div><p><b>EU</b>：AI Act が、採用などの高リスクAIによる個別の決定について説明を受ける権利を定める（第86条）<br><b>韓国</b>：採用手続きの公正化に関する法律に、応募者へ採用の可否を知らせる規定 <span class="todo">【要確認】</span></p></div>
<div class="card main"><div class="tag">日本発の展開</div><p>理由を返す定型フォーマットを、人的資本の開示や採用の国際的な指標に提案する。AI選考が広がるほど、評価の中身を返すルールの必要性は高まる。</p></div>
</div>

<div class="src">出典：LinkedIn Talent Solutions "Guide to rejecting candidates"／『就職白書2026』図表111</div>

---

<!-- _paginate: false -->
<!-- _class: roadmap -->

<div class="kicker">ROADMAP</div>

## 実現までの道筋

<div class="tl">
<div class="step"><div class="when">1年目</div><h4>政府の就活に関する要請に、FB提供を追加</h4><div class="via">内閣官房・厚労省・文科省</div></div>
<div class="step"><div class="when">1年目</div><h4>ユースエール認定に、FBを加点項目として追加</h4><div class="via">厚労省</div></div>
<div class="step"><div class="when">2年目</div><h4>大学側の申合せと、学生側の利用ルールのひな形</h4><div class="via">就職問題懇談会</div></div>
<div class="step last"><div class="when">3年目</div><h4>指針に「結果と一緒に理由を返す」を標準として明記</h4><div class="via">厚労省（労働政策審議会）</div></div>
</div>

<div class="band" style="margin-top:36px; padding:30px 34px">
<div style="font-size:18px;color:#C4C4CD;letter-spacing:0.12em;margin-bottom:6px">沈黙する選考から、育てる選考へ</div>
<div style="font-size:32px">就活を、学生が<b>いちばん成長できる時間</b>に。</div>
</div>

---

<!-- _class: appxcover -->
<!-- _paginate: false -->

<div class="kicker">ここから先は補足資料です（発表では扱いません）</div>

<div class="appxtitle">APPENDIX</div>

<div class="appxsub">想定される懸念への詳細な回答と、設計の詳細・根拠データ</div>

<div class="toc">
<div><b>A1</b>懸念の一覧</div>
<div><b>A2</b>企業の負担：全員に返すと重いのでは</div>
<div><b>A3</b>コスト試算の考え方</div>
<div><b>A4</b>段階的な導入計画</div>
<div><b>A5</b>フィードバックの仕様</div>
<div><b>A6</b>自動生成の仕組みと安全策</div>
<div><b>A7</b>法的リスクの整理</div>
<div><b>A8</b>選考の質と学生への影響</div>
<div><b>A9</b>実効性の担保と成果指標（KPI）</div>
<div><b>A10</b>関係者ごとのメリットと働きかけ</div>
<div><b>A11</b>海外の制度</div>
<div><b>A12</b>データの出典と読み方の注意</div>
</div>

---

<!-- class: ap -->
<!-- header: APPENDIX　補足資料 -->

<div class="kicker">APPENDIX A1</div>

## 懸念の一覧

<div class="t-a1">

| # | 懸念 | 答えの要点 | 詳細 |
|---|---|---|---|
| 1 | 全員に返すと、企業の負担が重い | 理由は既に評価シートにある。自動生成と段階導入で、1件あたりの手間をほぼなくす | A2・A3・A4 |
| 2 | 何をどこまで返すのかが曖昧 | 選考段階ごとに返す項目と返さない項目を決めておく | A5 |
| 3 | AIが不適切な文章を作る | 生成は項目評価の言い換えに限る。表現チェックと人事の最終確認を挟む | A6 |
| 4 | 採用の自由を侵す | 採否には介入しない。判断の理由を返すことだけを求める | A7 |
| 5 | 差別訴訟や個人情報のトラブルが増える | 職務に関わる項目だけを返す。配点と自由記述は返さない | A7 |
| 6 | FBに合わせて対策され、選考が機能しなくなる | ずれが減るのは選考の目的にかなう。配点と合格ラインは返さない | A8 |
| 7 | 厳しいFBで学生が傷つく・SNSに晒される | 合格の理由も返し、伝え方の指針をつくる。利用ルールで晒しを禁じる | A8 |
| 8 | 形だけのFBになる／企業が参加しない | 認定審査でのサンプル確認と、段階を踏んだ普及。KPIで効果を測る | A9 |
| 9 | 就職エージェントなど既存の事業者が反発する | FBの活用支援という新しい役割がある。対立ではなく協力の関係にする | A10 |

</div>

---

<div class="kicker">APPENDIX A2</div>

## 企業の負担：全員に返すと重いのでは

<div class="cards c2">
<div class="card"><div class="tag">答え 1</div><h4>新しく書く必要はない</h4><p>面接官は、選考のたびに評価シートを書いている。企業は、就職エージェントには不採用の理由を伝えることもある。理由は既に社内にあり、足りないのは学生に届ける仕組みだけ。</p></div>
<div class="card main"><div class="tag">答え 2</div><h4>自動生成で、1件あたりの手間をほぼゼロにする</h4><p>評価シートから定型FBを自動でつくる（本編8ページ、A6）。人の作業は、送る前の確認だけにする。1件あたり <span class="todo">○秒・○円</span>（A3）。</p></div>
<div class="card"><div class="tag">答え 3</div><h4>段階的に広げる</h4><p>1年目は面接に進んだ応募者から始める。書類選考の段階では、3項目の評価だけを返す。運用が回ってから、対象と項目を広げる（A4）。</p></div>
<div class="card"><div class="tag">答え 4</div><h4>先に始めた企業が得をする</h4><p>ユースエール認定と就活サイトでの表示で、採用ブランドが上がる。建設的なFBを受けた候補者は、その企業への再応募を考える可能性が4倍になる。中小企業には、共通フォーマットと生成ツールを無償で提供する。</p></div>
</div>

<div class="note">採用に関わる人員の不足を課題に挙げる企業は38.2%。負担の懸念は最も強く出ると想定し、最初に答えを用意する。</div>

<div class="src">出典：『就職白書2026』図表111／LinkedIn Talent Solutions "Guide to rejecting candidates"／LHH就活エージェント「就活の不採用理由の聞き方」</div>

---

<div class="kicker">APPENDIX A3</div>

## コスト試算の考え方

<div class="cards" style="grid-template-columns: 1fr 1fr; align-items: start;">
<div>

**試算式**

年間の追加コスト ＝ FBを返す件数 × 1件あたりの作業時間 × 担当者の時間単価 ＋ 生成ツールの利用料

| 前提（例） | 手作業で書く場合 | 自動生成＋確認の場合 |
|---|---|---|
| FBを返す件数 | 10,000件 | 10,000件 |
| 1件あたりの作業時間 | 5分（仮定） | <span class="todo">○秒</span>（確認のみ） |
| 必要な作業時間の合計 | 約833時間 | <span class="todo">○時間</span> |
| 生成ツールの利用料 | ― | <span class="todo">○円</span> |

</div>
<div>

**試算の読み方**

- 手作業の5分は、比較のための仮定の値。実際の値は企業へのヒアリングで置き換える
- 自動生成の値は、試作で実測した数字を入れる
- 件数は、大手企業の1年分の応募者を想定した規模。中小企業ではこの数分の1から数十分の1になる
- 書類選考の段階は3項目だけを返すので、面接の段階より1件あたりの作業は軽い

<div class="band" style="font-size:18px;padding:14px 18px">伝えたいのは「手作業なら重いが、評価シートからの自動生成なら<b>ほぼ確認の手間だけ</b>になる」という差。</div>

</div>
</div>

<!--
情報系メンバー：試作で、評価シート10件程度をサンプルとして生成時間と利用料を測る。1件あたりの値から1万件に掛け戻す。
-->

---

<div class="kicker">APPENDIX A4</div>

## 段階的な導入計画

| 時期 | 対象の企業 | 対象の選考段階 | 返す内容 | 主な手段 |
|---|---|---|---|---|
| 1年目 | 賛同する企業（先行導入） | 面接に進んだ応募者 | 5項目の評価＋次に生かせる一言 | 政府の就活に関する要請、ユースエール認定での加点 |
| 2年目 | 認定企業・経済団体の会員企業に拡大 | 面接＋書類選考 | 書類は3項目、面接は5項目＋一言 | 大学側の申合せ、共通フォーマットの公開、生成ツールの無償提供 |
| 3年目 | すべての新卒採用企業（標準として明記） | すべての選考段階 | 段階ごとの標準項目 | 職業安定法に基づく指針に「結果と一緒に理由を返す」を標準として明記 |
| 4年目以降 | 中途採用にも拡大を検討 | ― | ― | 効果検証（A9）の結果をもとに判断 |

<div class="cards c3" style="margin-top:14px">
<div class="card"><h4>面接から始める理由</h4><p>面接の評価シートは内容が豊かで、FBにしたときの学生の価値が大きい。対象の人数も書類選考より少ない。</p></div>
<div class="card"><h4>書類は3項目に絞る理由</h4><p>応募者の数が最も多い段階なので、企業の負担を抑える。3項目でも「何が足りなかったか」の方向は分かる。</p></div>
<div class="card"><h4>義務ではなく「標準」にする理由</h4><p>強制すると反発で形だけのFBになりやすい。先行企業の実績を見せ、当たり前にしていく。</p></div>
</div>

---

<div class="kicker">APPENDIX A5</div>

## フィードバックの仕様

<div class="cards" style="grid-template-columns: 1.1fr 1fr; align-items: start;">
<div>

**選考段階ごとの標準項目（例）**

| 段階 | 項目 | 評価 |
|---|---|---|
| 書類 | 志望動機と当社の事業の一致 | 3段階 |
| 書類 | 経験の具体性 | 3段階 |
| 書類 | 文章の分かりやすさ | 3段階 |
| 面接 | 上の3項目＋対話での伝わり方 | 3段階 |
| 面接 | 当社の働き方との相性 | 3段階 |
| 面接 | 次に生かせる一言 | 定型文から選択＋短い補足 |

3段階は「期待を上回る／期待どおり／期待に届かず」。

</div>
<div>

**返すもの**
- 項目ごとの3段階評価
- 評価が高かった点（合格の場合も必ず返す）
- 次に生かせる一言

**返さないもの**
- 配点、合計点、合格ライン
- 他の応募者との比較や順位
- 面接官個人の名前や自由記述のメモ
- 職務に関係のない事項（出身地や家族など）

**届け方**
- 合否の通知と同時に、採用サイトのマイページかメールで送る
- 保存期間は、その年度の就活が終わるまで

</div>
</div>

---

<div class="kicker">APPENDIX A6</div>

## 自動生成の仕組みと安全策

<div class="flow" style="grid-template-columns: 1fr 28px 1fr 28px 1fr 28px 1fr 28px 1fr;">
<div class="fstep"><div class="tag">1</div><h4>評価シート</h4><p>面接官が選考中に記入する（今と同じ）</p></div>
<div class="farrow">→</div>
<div class="fstep"><div class="tag">2</div><h4>項目への対応づけ</h4><p>社内の評価項目を標準項目に対応させる</p></div>
<div class="farrow">→</div>
<div class="fstep main"><div class="tag">3</div><h4>文章の生成</h4><p>項目評価を、次に生かせる言葉に言い換える</p></div>
<div class="farrow">→</div>
<div class="fstep"><div class="tag">4</div><h4>チェック</h4><p>表現の自動チェックと、人事の最終確認</p></div>
<div class="farrow">→</div>
<div class="fstep"><div class="tag">5</div><h4>送付</h4><p>合否の通知と同時に届ける</p></div>
</div>

| リスク | 安全策 |
|---|---|
| AIが、評価シートにない内容を作ってしまう | 生成は、項目評価と評価シートの記述の言い換えに限る。新しい評価はさせない |
| 人格を否定する表現や、差別につながる表現が出る | 禁止表現の自動チェックを通し、引っかかったものは人が書き直す |
| 職務に関係のない事項が混ざる | 出身地や家族など、公正採用選考で聞かない事項を入力の段階で除く |
| 学生の個人情報が外部に出る | 企業の社内環境で動かせる形にする。外部サービスを使う場合は、学習に使われない設定にする |
| 責任の所在があいまいになる | 送る前に人事が確認する。FBの内容の責任は企業が持つ |

---

<div class="kicker">APPENDIX A7</div>

## 法的リスクの整理

<div class="t-a3">

| 論点 | 懸念 | 答え | 関係する制度 |
|---|---|---|---|
| 採用の自由 | 企業には、誰を採用するかを決める自由がある | 採否の判断には一切介入しない。求めるのは、判断の理由を返すことだけ | 三菱樹脂事件の最高裁判決（1973年） |
| 差別訴訟 | 理由を返すと、不当な差別だと争われる材料になる | 返すのは職務に関わる評価項目だけ。自由記述、配点、他の応募者との比較は返さない。職務に関わる項目で評価していることを示せるので、企業の説明責任を果たす手段にもなる | 公正採用選考の考え方（厚労省） |
| 個人情報 | 評価の情報をどこまで本人に出してよいか | 返す範囲をA5の仕様で決めておく。本人への開示の考え方と整合させる <span class="todo">【開示の例外規定との関係を要確認】</span> | 個人情報保護法（保有個人データの開示）、職業安定法の個人情報の規定 |
| 強制力 | 義務にすると、企業の反発が大きい | 新しい法律は作らない。要請と認定で広げ、3年目に指針で「標準」と明記する | 職業安定法に基づく指針 |
| 情報の拡散 | FBが外部に出回る | 応募時の同意事項に、SNSへの投稿や目的外の利用の禁止を入れる。違反時の扱いも決めておく | 応募時の同意事項（ひな形を用意） |

</div>

<!--
条文番号は資料に書く前に最新の法令で確認する。
-->

---

<div class="kicker">APPENDIX A8</div>

## 選考の質と学生への影響

<div class="cards c2 tight">
<div class="card"><div class="tag">懸念</div><h4>学生がFBに合わせて対策する</h4><p>評価項目が知られると、学生が「受かる答え」を用意するようになり、選考で本来の姿が見えなくなる。</p></div>
<div class="card main"><div class="tag">答え</div><h4>ずれが減ることは、選考の目的にかなう</h4><p>企業が重視する点と学生のアピールには、50pt以上のずれがある項目がある（本編5ページ）。企業が見たいものを学生が理解し、それを伸ばそうとすることは、成長そのもの。配点と合格ラインは返さないので、判断は企業の手に残る。</p></div>
<div class="card"><div class="tag">懸念</div><h4>厳しいFBで、学生が傷つく</h4><p>不合格の理由を何度も突きつけられて、自信をなくす学生が出る。</p></div>
<div class="card main"><div class="tag">答え</div><h4>合格の理由も返し、伝え方をそろえる</h4><p>評価が高かった点も必ず返す。人格ではなく項目への評価として伝える指針をつくる。大学のキャリアセンターと組んで、FBを受け取った後に相談できる場を用意する。</p></div>
<div class="card"><div class="tag">懸念</div><h4>FBの内容に納得できない学生が、企業に抗議する</h4><p>理由を知ったことで、かえってトラブルが増える。</p></div>
<div class="card main"><div class="tag">答え</div><h4>FBは結論の変更を求める材料にしない</h4><p>応募時の同意事項に、FBは次の就活に生かすためのものであり、合否の再審査の対象ではないと明記する。</p></div>
</div>

---

<div class="kicker">APPENDIX A9</div>

## 実効性の担保と成果指標（KPI）

<div class="cards" style="grid-template-columns: 1fr 1fr; align-items: start;">
<div>

**形だけにしない仕組み**

| 懸念 | 仕組み | 担い手 |
|---|---|---|
| 全員に「期待どおり」と返す | 認定審査で、実際に返したFBのサンプルを確認する | 厚労省 |
| 企業ごとに質がばらばら | 共通フォーマットと、良い例・悪い例の手引きを公開する | 厚労省・大学 |
| 企業が参加しない | 要請 → 認定での加点 → 指針で標準と明記、と段階を踏む | 内閣官房・厚労省 |
| 大学が動かない | 大学側の申合せに入れ、キャリアセンターが活用を支援する | 就職問題懇談会 |

</div>
<div>

**成果指標（KPI）**

| 指標 | 何を見るか |
|---|---|
| FB提供率 | 選考を受けた応募者のうち、理由を受け取った割合 |
| 役立ち度 | FBが次の選考に役立ったと答えた学生の割合 |
| 基準の理解度 | 「採用選考の基準を知ることができた」学生の割合（本編4ページの29.4%を改善） |
| 再応募・好感度 | FBを受けた学生の、その企業への印象と再応募の意向 |
| 早期離職率 | 導入企業の、新卒3年以内の離職率の推移 |

</div>
</div>

<div class="note">「基準の理解度」は『就職白書』と同じ問いで毎年追えるので、導入前後の比較ができる。</div>

---

<div class="kicker">APPENDIX A10</div>

## 関係者ごとのメリットと働きかけ

| 関係者 | メリット | 懸念 | 働きかけ方 |
|---|---|---|---|
| 学生 | 評価のたびに学べる。理由に届くかどうかがお金で決まらない | 厳しいFBへの不安 | 合格の理由も返す。キャリアセンターでの相談 |
| 企業 | 選考基準がそろう。採用ブランドが上がる。ミスマッチが減る | 手間と法的リスク | 自動生成ツール、段階導入、認定での加点（A2〜A7） |
| 大学 | キャリア支援の質が上がる。学生の成長を測れる | 支援の負担が増える | 申合せへの追加。FBを使った面談の手引き |
| 国（厚労省・文科省・内閣官房） | 若者の早期離職を減らす。人材育成の政策と合う | 企業の反発 | 要請と認定から始め、実績をもとに指針へ |
| 就活サイト | FBを出す企業の表示で、サイトの価値が上がる | 表示の運用の手間 | 表示項目の共通化 |
| 就職エージェント | FBを読み解き、次の対策につなげる支援という新しい役割 | 理由を知れるという独自の価値が薄れる | FBを前提にした支援の形を一緒に考える |
| 経済団体 | 会員企業の採用ブランドが上がる | 会員企業の負担 | 先行導入企業の事例の共有 |

---

<div class="kicker">APPENDIX A11</div>

## 海外の制度

| 国・地域 | 制度 | 内容 | この提案との関係 |
|---|---|---|---|
| EU | AI Act 第86条 | 採用などの高リスクAIによる個別の決定について、説明を受ける権利を定める | AIを使った選考では、理由の説明が国際的な流れになっている |
| EU | GDPR 第22条・第15条 | 自動化された決定に服さない権利や、そのロジックについて意味のある情報を得る権利を定める | 評価の中身を本人に返すという考え方の土台 |
| 韓国 | 採用手続きの公正化に関する法律 | 応募者に採用の可否を知らせる規定がある <span class="todo">【対象の企業規模と義務の強さを要確認】</span> | 近い国の採用ルールの先例 |
| 民間 | LinkedIn の調査 | 候補者の94%が面接後のFBを望み、建設的なFBを受けると再応募を考える可能性が4倍になる | 企業にとってのメリットの根拠 |

<div class="note">日本の提案の特徴は、AIの利用に限らず「すべての選考で、結果と一緒に理由を返す」を標準にする点。AI選考の規制より一歩先の、成長のための仕組みとして打ち出せる。</div>

---

<div class="kicker">APPENDIX A12</div>

## データの出典と読み方の注意

<div class="tight">

| 本編の数字 | 値 | 出典 | 読み方の注意 |
|---|---|---|---|
| 各選考プロセスの平均社数 | 書類12.4社、適性検査9.8社、面接 対面5.1社・Web7.6社 | 『就職白書2026』図表37（26卒、学生n=1,326） | そのプロセスを経験した学生だけの平均 |
| 採用選考の基準を知りたかった／知れた | 36.7%／29.4% | 同 図表39・40 | 複数回答 |
| 企業の重視点と学生のアピールのずれ | 人柄 93.8%／40.9% ほか | 同 図表110（企業n=1,182）・図表41 | 「重視する」と「アピールした」は別の問い。人柄は意識しなくても伝わる |
| 人材紹介会社に登録している学生 | 12.2% | 同 図表36 | 「約8人に1人」は、理由に届く経路の目安として使っている |
| 企業はエージェントに理由を伝えることがある | ― | LHH就活エージェントの解説記事 | 事業者の説明であり、割合のデータではない |
| 大卒の3年以内離職率 | 33.8% | 厚労省（令和4年3月卒） | FBの欠如との因果関係は示せていない |
| 採用人員の不足・選考基準の統一が課題 | 38.2%／12.9% | 『就職白書2026』図表111 | 複数回答 |
| FBを望む候補者／再応募の可能性 | 94%／4倍 | LinkedIn Talent Solutions | 海外の調査。日本の新卒採用にそのまま当てはまるとは限らない |
| 合否を連絡しない企業（口頭の補足） | 書類29%、大企業の面接23% | HR総研（2017年3月実施） | 古い調査なので背景として使う |

</div>
