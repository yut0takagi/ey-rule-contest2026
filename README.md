# 沈黙する選考から、育てる選考へ

**就活を通して、学生の成長を最大化する。そのために、選考の理由が本人に返るルールをつくる。**

EYストラテジー・アンド・コンサルティング主催「[第4回 学生ルール形成アイデアコンテスト](https://www.ey.com/ja_jp/services/consulting/strategic-impact/rule-formation-idea-contest-for-student)」への応募資料です。

- 資料（PDF）：[dist/slides.pdf](dist/slides.pdf)
- 資料（編集できる pptx）：[dist/slides.pptx](dist/slides.pptx)

## 提案の概要

| | 内容 |
|---|---|
| 課題 | 学生は何十社もの選考で評価される。それなのに届くのは合否だけで、何が評価され、何が足りなかったのかは分からない。理由を知る経路を持つのは、就職エージェントを使う一部の学生に限られる |
| 提案 | **理由が返る就活**。選考結果と一緒に、全員に理由を返すことを標準にする。①全員に返す ②次に生かせる形で返す ③返す企業を認定する ④学生側の利用ルールを決める、の4つのルールで構成する |
| 目指す姿 | 評価 → 理由 → 修正 → 再挑戦の循環を、受ける社数の分だけ回せる就活。就活を、学生がいちばん成長できる時間にする |
| 実現の道筋 | 1年目に政府の要請と認定制度で始め、3年目に国の指針で「標準」と明記する。新しい法律は作らない |

資料は本編10枚と Appendix 13枚です。Appendix には、想定される懸念への回答、コスト試算、導入計画、フィードバックの仕様、法的リスク、データの出典をまとめています。

## ファイル構成

```
.
├── slides/
│   └── slides.md          資料の原稿（Marp）。内容の正本
├── scripts/
│   └── build-pptx.js      pptx を生成するスクリプト
├── dist/
│   ├── slides.pdf         書き出した PDF（提出用）
│   └── slides.pptx        書き出した pptx（編集用）
├── package.json           ビルド用のコマンド
└── LICENSE
```

## ビルド方法

Node.js（v20 以上）と Google Chrome が必要です。Chrome は Marp が PDF を書き出すときに使います。

```bash
npm install          # 初回のみ
npm run build        # PDF と pptx をまとめて書き出す
npm run build:pdf    # PDF だけ
npm run build:pptx   # pptx だけ
npm run preview      # ブラウザでプレビューしながら編集する
```

PDF の書き出しが途中で止まることがあります。その場合は、もう一度実行してください。

## 編集するときの注意

- **内容の正本は `slides/slides.md` です。** 文言やデータを直すときは、まずここを直します。
- **pptx の文言は `scripts/build-pptx.js` に直接書いてあります。** slides.md を直しても、pptx には自動では反映されません。スクリプトの該当箇所も同じように直してから、`npm run build:pptx` を実行してください。
- 手作業で pptx を直した場合は、slides.md との差分が生まれます。どちらを正本にするかは、チームで決めてください。
- 赤字の【】は、提出前に埋める箇所です。
  - 表紙：団体名、大学名、メンバー名
  - 本編3ページ：3人の就活の実数
  - 本編8ページと Appendix A2・A3：試作の実測値（時間・コスト）
  - Appendix A7・A11：法令の確認

## データの出典

主な出典は次のとおりです。本編の全数字の出典と、読むときの注意は Appendix A12 にまとめています。

- リクルート就職みらい研究所『[就職白書2026](https://shushokumirai.recruit.co.jp/white_paper_article/20260220002/)』
- 厚生労働省「新規学卒就職者の離職状況（令和4年3月卒業者）」
- HR総研「2018年新卒採用動向調査」（2017年3月実施）
- LinkedIn Talent Solutions "[Guide to rejecting candidates](https://business.linkedin.com/talent-solutions/recruiting-tips/rejecting-candidates-guide)"

## 免責事項

- この資料は学生チームによる応募作品です。EY およびコンテストの主催者とは関係がなく、その見解を示すものではありません。
- 配色は応募先のコンテストに合わせて選んだもので、EY のロゴや商標は使っていません。
- 法令や制度についての記述には、確認中の箇所があります（資料中に「要確認」と記載）。

## ライセンス

All rights reserved。詳しくは [LICENSE](LICENSE) を参照してください。
