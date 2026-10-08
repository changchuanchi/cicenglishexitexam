// 组装「学生考试操作图文说明」单一自含 HTML（图片以 base64 内嵌，方便单档上传 GitHub Pages）
const fs = require('fs');
const path = require('path');

const OPT = path.join(__dirname, 'opt');
// 跨平台：预设读写「本资料夹的上一层」，专案搬到哪都不必改路径
const PROJECT = path.resolve(__dirname, '..');
const LOGO = path.join(PROJECT, 'dpu logo.png');
// GUIDE_OUT：改版还没上线前，可先输出到别处预览
const OUT = process.env.GUIDE_OUT || path.join(PROJECT, 'guide.html');

const jpg = n => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(OPT, n + '.jpg')).toString('base64');
const logo = 'data:image/png;base64,' + fs.readFileSync(LOGO).toString('base64');

const shot = (name, cap) => `
      <figure class="shot">
        <img src="${jpg(name)}" alt="${cap}">
        <figcaption>${cap}</figcaption>
      </figure>`;

const step = (n, title, body, figures) => `
    <section class="step" id="step${n}">
      <div class="step-head">
        <span class="step-num">${n}</span>
        <h2>${title}</h2>
      </div>
      <div class="step-body">
        ${body}
      </div>
      ${figures}
    </section>`;

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<title>英文毕业考试 — 学生操作说明</title>
<style>
  /* Hallmark · genre: modern-minimal · macrostructure: Long Document（图文说明，步骤真有先后，故保留编号）· design-system: design.md · designed-as-app
   * theme: custom · accent: #691BFF（品牌色，锁定）· display: Geist 600 · body: Geist 400 ＋ 系统中文 · mono: Geist Mono（步骤号、数字）
   * pre-emit critique: P4 H4 E4 S4 R5 V3 · 2026-10-08
   */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { overflow-x: clip; }
  :root {
    /* ── 色彩：锚定 DPU 品牌紫 #691BFF（色相 292°），所有中性色都带一点紫色调 ──
       值以十六进位写出（旧版 Android／iOS 浏览器不认 oklch()），注解保留 OKLCH 原值。
       品牌色只用在：主要按钮、分页标签底线、进度条、选中态、焦点环——占画面 5% 以下。 */
    --color-accent:      #691BFF;  /* 品牌色，锁定不动。白字对比 6.56:1 */
    --color-accent-deep: #5312CC;  /* hover／按下、浅紫底上的深色文字 */
    --color-accent-ink:  #FCFBFE;  /* 品牌色底上的文字 */
    --color-accent-soft: #F0EDFF;  /* 选中底、徽章底    oklch(95.5% .03 292) */
    --color-accent-rule: #D8D1FD;  /* 选中框线          oklch(88% .06 292) */
    --color-paper:   #FAF9FD;      /* 纸底              oklch(98.4% .005 292) */
    --color-paper-2: #F3F2F8;      /* hover、次要底     oklch(96.4% .008 292) */
    --color-paper-3: #EAE9F2;      /* 停用底、灰徽章    oklch(93.8% .012 292) */
    --color-rule:    #D4D3DD;      /* 主要分隔线／框线  oklch(87% .014 292) */
    --color-rule-2:  #E3E2EA;      /* 次要分隔线        oklch(91.5% .011 292) */
    --color-muted:   #636073;      /* 次要文字          oklch(50% .03 292)  对纸底 5.8:1 */
    --color-ink-2:   #3D3A4E;      /* 标签、次级标题    oklch(36% .035 292) */
    --color-ink:     #191527;      /* 主要文字          oklch(21% .035 292) 对纸底 17:1 */
    --color-ok:   #00792F; --color-ok-soft:   #DCF7E1; --color-ok-rule:   #A9DDB2;   /* 通过、成功 */
    --color-warn: #9A5300; --color-warn-soft: #FFF0CC; --color-warn-rule: #F0CB8D;   /* 提醒、剩 10 分钟 */
    --color-err:  #C2181D; --color-err-soft:  #FFE9E6; --color-err-rule:  #FCC0BA;   /* 错误、未通过、剩 5 分钟 */
    --color-focus: #844CF8;        /* 键盘焦点环        oklch(58% .24 292) */
    --color-scrim: rgba(25, 21, 39, .45);   /* 弹窗背后的遮罩（ink 带透明）*/

    /* ── 字体：拉丁字母与数字用 Geist／Geist Mono（Google Fonts），中文走系统字体 ── */
    --font-body: "Geist", -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB",
                 "Microsoft YaHei", "Noto Sans SC", sans-serif;
    --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

    /* ── 字级（1.25 大三度）、间距（4pt）、圆角、动态 ── */
    --text-xs: .75rem;  --text-sm: .875rem; --text-md: 1.125rem; --text-lg: 1.375rem;
    --text-xl: 1.75rem; --text-2xl: 2.25rem;
    --space-2xs: .25rem; --space-xs: .5rem; --space-sm: .75rem; --space-md: 1rem;
    --space-lg: 1.5rem;  --space-xl: 2.5rem; --space-2xl: 4rem;
    --radius-sm: 6px; --radius-md: 10px;
    --control-h: 44px;
    --dur-micro: 120ms; --dur-short: 220ms; --dur-long: 420ms;
    --ease-out: cubic-bezier(.16, 1, .3, 1); --ease-in: cubic-bezier(.7, 0, .84, 0);
    --z-raised: 10; --z-sticky: 200; --z-modal: 400; --z-toast: 500;

    /* ── 旧名别名：JS 与行内样式仍用这些名字，一律指到上面的 token；新样式请直接用新名字 ── */
    --primary: var(--color-accent); --primary-dark: var(--color-accent-deep);
    --primary-50: var(--color-accent-soft); --primary-100: var(--color-accent-rule);
    --success: var(--color-ok); --danger: var(--color-err); --warning: var(--color-warn);
    --gray-50: var(--color-paper-2); --gray-100: var(--color-paper-3); --gray-200: var(--color-rule-2);
    --gray-300: var(--color-rule);  --gray-500: var(--color-muted);   --gray-600: var(--color-muted);
    --gray-700: var(--color-ink-2); --gray-900: var(--color-ink);
    --radius: var(--radius-md); --shadow: none; --shadow-lg: none;
    --ring: 0 0 0 2px var(--color-focus);
  }
  body {
    font-family: var(--font-body); background: var(--color-paper); color: var(--color-ink); line-height: 1.7;
    padding: var(--space-xl) var(--space-md) var(--space-2xl); -webkit-text-size-adjust: 100%; font-variant-numeric: tabular-nums;
  }
  :focus { outline: none; }
  :focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
  .wrap { max-width: 44rem; margin: 0 auto; }

  /* ── 页首 ── */
  header { display: flex; align-items: center; gap: var(--space-md); padding-bottom: var(--space-md); border-bottom: 1px solid var(--color-ink); }
  header img { height: 40px; width: auto; flex-shrink: 0; }
  header h1 { font-size: var(--text-xl); font-weight: 600; letter-spacing: -.02em; line-height: 1.2; overflow-wrap: anywhere; min-width: 0; }
  header .sub { font-size: var(--text-sm); color: var(--color-muted); margin-top: var(--space-2xs); }

  .card, .step { padding: var(--space-lg) 0; border-bottom: 1px solid var(--color-rule); }
  h2 { font-size: var(--text-lg); font-weight: 600; letter-spacing: -.01em; line-height: 1.3; }
  h3 { font-size: 1rem; font-weight: 600; margin-bottom: var(--space-sm); }

  /* ── 考试速览 ── */
  .facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--color-rule); border-bottom: 1px solid var(--color-rule); margin-bottom: var(--space-md); }
  .fact { padding: var(--space-sm) var(--space-md); border-left: 1px solid var(--color-rule-2); }
  .fact:first-child { border-left: 0; padding-left: 0; }
  .fact b { display: block; font-family: var(--font-mono); font-size: var(--text-xl); font-weight: 500; line-height: 1.1; letter-spacing: -.02em; }
  .fact span { display: block; font-size: var(--text-xs); color: var(--color-muted); margin-top: var(--space-2xs); }

  /* ── 步骤 ── */
  .step-head { display: flex; align-items: baseline; gap: var(--space-sm); margin-bottom: var(--space-sm); }
  .step-num { font-family: var(--font-mono); font-size: var(--text-md); font-weight: 500; color: var(--color-accent); flex-shrink: 0; }
  .step-num::after { content: "."; }
  .step-body { font-size: 1rem; color: var(--color-ink-2); }
  .step-body p { margin-bottom: var(--space-xs); }
  .step-body ul { margin: 0 0 var(--space-xs); padding-left: 1.25em; }
  .step-body li { margin-bottom: var(--space-2xs); }
  .step-body li::marker { color: var(--color-muted); }
  .step-body strong { color: var(--color-ink); font-weight: 600; }
  code { background: var(--color-accent-soft); color: var(--color-accent-deep); padding: 0 .4em; border-radius: 4px; font-family: var(--font-mono); font-size: .9em; }

  /* ── 截图 ── */
  .shot { margin-top: var(--space-md); }
  .shot img { width: 100%; height: auto; display: block; border: 1px solid var(--color-rule); border-radius: var(--radius-sm); }
  .shot figcaption { font-size: var(--text-xs); color: var(--color-muted); margin-top: var(--space-xs); }
  .shot-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-md); }

  /* ── 提示框 ── */
  .note { border: 1px solid transparent; border-radius: var(--radius-sm); padding: var(--space-sm) var(--space-md); font-size: var(--text-sm); line-height: 1.6; margin: var(--space-sm) 0; }
  .note b { display: block; margin-bottom: 2px; }
  .note-tip    { background: var(--color-accent-soft); border-color: var(--color-accent-rule); color: var(--color-accent-deep); }
  .note-warn   { background: var(--color-warn-soft);   border-color: var(--color-warn-rule);   color: var(--color-warn); }
  .note-danger { background: var(--color-err-soft);    border-color: var(--color-err-rule);    color: var(--color-err); }

  /* ── 重要提醒清单 ── */
  .alerts { list-style: none; }
  .alerts li { display: flex; gap: var(--space-sm); padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-rule-2); font-size: var(--text-sm); color: var(--color-ink-2); line-height: 1.6; }
  .alerts li:last-child { border-bottom: 0; }
  .alerts .ico { flex-shrink: 0; font-family: var(--font-mono); font-weight: 500; color: var(--color-err); min-width: 1.5ch; }
  .alerts strong { color: var(--color-ink); }

  /* ── FAQ ── */
  .faq-item { padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-rule-2); }
  .faq-item:last-child { border-bottom: 0; }
  .faq-q { font-weight: 600; font-size: 1rem; display: flex; gap: var(--space-xs); margin-bottom: var(--space-2xs); }
  .faq-q .qm { font-family: var(--font-mono); font-weight: 500; color: var(--color-accent); flex-shrink: 0; }
  .faq-a { font-size: var(--text-sm); color: var(--color-ink-2); padding-left: calc(1ch + var(--space-xs)); }

  /* ── 页尾 ── */
  .links { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
  .link-btn { display: inline-flex; align-items: center; justify-content: center; height: var(--control-h); padding: 0 var(--space-lg); border: 1px solid transparent; border-radius: var(--radius-sm); font-weight: 500; text-decoration: none; white-space: nowrap;
    transition: background-color var(--dur-micro) var(--ease-out), border-color var(--dur-micro) var(--ease-out); }
  .link-primary { background: var(--color-accent); color: var(--color-accent-ink); }
  .link-outline { border-color: var(--color-rule); color: var(--color-ink-2); }
  @media (hover: hover) {
    .link-primary:hover { background: var(--color-accent-deep); }
    .link-outline:hover { background: var(--color-paper-2); border-color: var(--color-ink-2); color: var(--color-ink); }
  }
  footer { font-size: var(--text-xs); color: var(--color-muted); margin-top: var(--space-lg); line-height: 1.6; }

  /* ── 手机 ── */
  @media (max-width: 620px) {
    body { padding: var(--space-lg) var(--space-md) var(--space-2xl); }
    header h1 { font-size: var(--text-lg); }
    .facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .fact:nth-child(odd) { border-left: 0; padding-left: 0; }
    .fact:nth-child(n+3) { border-top: 1px solid var(--color-rule-2); }
    .shot-pair { grid-template-columns: minmax(0, 1fr); }
  }

  /* ── 打印（可直接印成纸本发给学生）── */
  @media print {
    body { background: var(--color-paper); padding: 0; }
    .card, .step { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="wrap">

<header>
  <img src="${logo}" alt="DPU">
  <div><h1>英文毕业考试 · 学生操作说明</h1>
  <p class="sub">博仁大学中文国际学院 · 线上考试系统图文指南</p></div>
</header>

<div class="card">
  <h2 style="margin-bottom:14px">考试速览</h2>
  <div class="facts">
    <div class="fact"><b>50</b><span>题（随机抽取）</span></div>
    <div class="fact"><b>60</b><span>分钟</span></div>
    <div class="fact"><b>100</b><span>分满分（每题 2 分）</span></div>
    <div class="fact"><b>50</b><span>分及格</span></div>
  </div>
  <div class="note note-tip" style="margin-bottom:0">
    <b>考前准备</b>
    准备好<strong>学号</strong>与<strong>姓名</strong>，确认网络稳定。手机或电脑浏览器皆可作答，<strong>无需事先注册</strong>，填完资料就能直接开始。
  </div>
</div>

${step(1, '打开考试网址，填写报名资料', `
  <p>用浏览器打开考试网址，出现「学生考试登记」画面，依序填写：</p>
  <ul>
    <li><strong>学号</strong> —— 成绩以学号为准，请务必确认填写正确。</li>
    <li><strong>姓名</strong> —— 填写本人姓名。</li>
    <li><strong>科系</strong> —— 从下拉选单中选择自己的科系。</li>
    <li><strong>考场密码</strong> —— <em>只有</em>监考老师设置密码时才会出现这一栏，请向监考老师索取；<strong>没有出现就代表不需要密码</strong>。</li>
    <li><strong>进场码</strong> —— <em>只有</em>老师开启时才会出现。请输入<strong>教室屏幕上</strong>显示的 4 位数字；进场码<strong>每 30 秒更换</strong>，请输入「现在」屏幕上的那一组。</li>
  </ul>
  <p>全部填好后，按下紫色的「<strong>开始考试</strong>」按钮。画面左侧（手机上在最上方）固定显示校名、考试规格与「考试说明」「题库练习」入口，考试中也看得到。</p>
  <div class="note note-warn">
    <b>注意</b>
    按下「开始考试」的那一刻，60 分钟倒计时立即开始。请确认自己已准备好再按。
    若老师使用考试名册，<strong>学号与姓名必须与名册一致</strong>才能进入。
  </div>`,
  shot('01-登记填写', '① 填写学号、姓名、科系（本例另有考场密码与进场码栏）'))}

${step(2, '如果看到「考试未开放」', `
  <p>考试由监考老师统一开放。若你打开页面时看到红色提示、按钮变成灰色的「考试未开放」，表示老师尚未开放考试。</p>
  <p>请<strong>等候监考老师宣布</strong>，待老师开放后<strong>刷新页面</strong>（重新整理）即可正常进入。</p>`,
  shot('02-考试未开放', '② 考试尚未开放时的画面，按钮为灰色不可点击'))}

${step(3, '开始作答', `
  <p>进入考试后，画面上有四个重点：</p>
  <ul>
    <li><strong>左上进度条与题号</strong> —— 显示「第 ○ 题，共 50 题」，紫色进度条同步前进。</li>
    <li><strong>右上倒计时</strong> —— 显示剩余时间。</li>
    <li><strong>题目</strong> —— 英文句子中的 <code>_____</code> 就是要填入的空格。</li>
    <li><strong>四个选项 A / B / C / D</strong> —— 点击任一选项即选中，选中的选项会变成<strong>紫色高亮</strong>。</li>
  </ul>
  <p>选错了没关系，<strong>直接点另一个选项就能改</strong>，交卷前都可以修改。</p>
  <p>画面上淡淡的斜字是<strong>你的学号与姓名浮水印</strong>，用来辨识考卷，不影响作答。</p>`,
  shot('03-第一题作答', '③ 作答画面，B 选项已选中（紫色高亮）'))}

${step(4, '切换题目', `
  <p>用题目下方的「<strong>← 上一题</strong>」与「<strong>下一题 →</strong>」按钮前后移动。</p>
  <p>可以随时回头检查或修改先前的答案；题目不必按顺序作答，跳着答也没问题。</p>`,
  shot('04-中途进度', '④ 作答到一半，进度条显示已完成的比例'))}

${step(5, '留意剩余时间', `
  <p>右上角的倒计时会随剩余时间改变颜色，提醒你把握时间：</p>
  <ul>
    <li><strong>深色</strong> —— 时间充裕。</li>
    <li><strong style="color:var(--color-warn)">橙色</strong> —— 剩余 10 分钟。</li>
    <li><strong style="color:var(--color-err)">红色</strong> —— 剩余 5 分钟，请尽快完成。</li>
  </ul>
  <p>时间一到，系统会<strong>自动交卷</strong>，已作答的题目照常计分。</p>
  <div class="note note-danger">
    <b>特别提醒：计时不会暂停</b>
    倒计时以「开始考试的时刻」为准。<strong>切换到其他 App、手机锁屏、把页面切到背景，时间都会继续走</strong>，而且<strong>会被记录为切屏</strong>（见下一步），请勿中途离开。
  </div>`,
  shot('05-计时警示', '⑤ 剩余 5 分钟，倒计时转为红色'))}

${step(6, '不要离开考试画面（超过 2 次会被收卷）', `
  <p>考试中系统会记录以下三种行为，<strong>每一种各自计次，任何一种超过 2 次（第 3 次）系统就会自动收卷</strong>，已作答的题目照常计分、没答的算错：</p>
  <ul>
    <li><strong>切屏</strong> —— 切到别的 App 或分页、回到手机桌面、<strong>锁屏</strong>。</li>
    <li><strong>失焦</strong> —— 考试画面被其他程序盖住或缩小：圈选搜索、Google Lens、翻译悬浮球、分屏或小窗；电脑上点到别的视窗超过 5 秒也算。</li>
    <li><strong>网页翻译</strong> —— 使用浏览器的翻译功能。题目会被<strong>自动还原成英文</strong>，翻了也看不到中文，而且会记一次。</li>
  </ul>
  <p>每记一次，画面上方会跳出红色提示「已记录切屏 1 / 2 次」；到第 2 次会提醒「再一次就会被收卷」。所有记录监考老师都看得到。</p>
  <div class="note note-tip">
    <b>手机没电、网页不小心关掉怎么办？</b>
    重新打开考试网址，用<strong>同一个学号</strong>登记，就会回到<strong>原本那份考卷</strong>，已作答的内容会保留（最后十几秒内的作答可能要补选），计时照原本的截止时间。换一台设备也可以，但会被记录为「换设备」，原本那台就不能再作答。
  </div>`,
  shot('10-切屏警告', '⑥ 切屏后回到考试画面，上方显示红色提示'))}

${step(7, '交卷', `
  <p>翻到<strong>最后一题（第 50 题）</strong>时，下方会出现紫色的「<strong>交卷</strong>」按钮。</p>
  <p>确认答案无误后按下即可送出，<strong>不必等时间用完</strong>。</p>`,
  shot('06-最后一题交卷', '⑦ 最后一题下方出现紫色「交卷」按钮'))}

${step(8, '若还有题目没作答', `
  <p>按下交卷时，若系统发现还有题目没作答，会以红字提醒你还剩几题未答，<strong>需要再按一次「交卷」才会真正送出</strong>。</p>
  <p>想回去补答，就用「← 上一题」翻回去；确定要直接交卷，再按一次即可。</p>
  <div class="note note-tip">
    <b>关于计分</b>
    答对一题得 2 分，<strong>答错或未作答都不倒扣</strong>。所以就算不确定，也建议猜一个答案，不要留空。
  </div>`,
  shot('07-未作答提醒', '⑧ 尚有题目未作答时的红字提醒'))}

${step(9, '查看成绩', `
  <p>交卷后<strong>立即显示成绩</strong>：分数、答对题数，以及你的学号、姓名、科系。</p>
  <ul>
    <li><strong style="color:var(--success)">满 50 分</strong> —— 分数以绿色显示，并写「恭喜，考试通过！」。</li>
    <li><strong style="color:var(--danger)">未满 50 分</strong> —— 分数以红色显示，并写「本次未通过」。</li>
  </ul>
  <p>成绩已由系统<strong>自动记录</strong>，不需要另外回报。按「完成」即可离开。</p>
  <div class="note note-warn">
    <b>成绩画面只显示这一次</b>
    按下「完成」离开后，页面不会再显示这次的分数。如需查询成绩，请向老师洽询（后台皆有完整记录）。
  </div>`,
  `<div class="shot-pair">
    ${shot('08-成绩通过', '⑨ 通过：82 分，绿色')}
    ${shot('09-成绩未通过', '⑨ 未通过：38 分，红色')}
  </div>`)}

<div class="card">
  <h2 style="margin-bottom:6px">六个最重要的提醒</h2>
  <ul class="alerts">
    <li>
      <span class="ico">1</span>
      <div><strong>不要离开考试画面。</strong>切屏（含锁屏）、画面被盖住或缩小（圈选搜索、悬浮窗、分屏）、使用网页翻译，<strong>任何一种超过 2 次，系统会自动收卷</strong>。</div>
    </li>
    <li>
      <span class="ico">2</span>
      <div><strong>计时不会暂停。</strong>切换 App、锁屏、关掉页面，60 分钟都持续在走，离开多久就少答多久。时间到没交卷，系统会用你最后存下的答案自动交卷。</div>
    </li>
    <li>
      <span class="ico">3</span>
      <div><strong>页面关掉了，用同一个学号重新登记即可。</strong>会回到原本那份考卷，已作答的内容会保留，计时照原本的截止时间；不会重新给 60 分钟。</div>
    </li>
    <li>
      <span class="ico">4</span>
      <div><strong>请保持网络畅通。</strong>取题、存档与交卷都需要连网，建议使用稳定的 Wi-Fi 或行动网络。</div>
    </li>
    <li>
      <span class="ico">5</span>
      <div><strong>交卷若没反应，再按一次就好。</strong>网络不顺时，系统最多等 30 秒就会提示「提交逾时，答案未送出」，此时<strong>再按一次「交卷」</strong>即可，<strong>不会重复计分</strong>。</div>
    </li>
    <li>
      <span class="ico">6</span>
      <div><strong>每个人的考卷都不一样。</strong>题目从题库随机抽取，连选项顺序都是随机的，与邻座同学对答案没有意义。</div>
    </li>
  </ul>
</div>

<div class="card">
  <h2 style="margin-bottom:10px">常见问题</h2>
  <div class="faq">
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>考试前需要先注册或申请账号吗？</div>
      <div class="faq-a">不需要。直接打开网址，填写学号、姓名、科系就能开始考试。</div>
    </div>
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>可以用手机考试吗？</div>
      <div class="faq-a">可以。手机、平板、电脑的浏览器都能使用，画面会自动调整。若用手机，请特别注意<strong>不要锁屏、不要切换到其他 App、不要开分屏或小窗</strong>，这些都会被记录。</div>
    </div>
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>题目从哪里来？会考几题？</div>
      <div class="faq-a">题库共 100 题，每次<strong>随机抽取 50 题</strong>，选项顺序也会随机打乱，因此每位同学拿到的考卷都不同。</div>
    </div>
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>几分才算通过？</div>
      <div class="faq-a">每题 2 分，满分 100 分，<strong>50 分（答对 25 题）以上</strong>即为通过。</div>
    </div>
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>不会的题目可以猜吗？</div>
      <div class="faq-a">可以。答错与未作答都<strong>不会倒扣</strong>，所以建议每题都选一个答案，不要留空。</div>
    </div>
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>这次没通过怎么办？</div>
      <div class="faq-a">请依老师安排的时间再次参加考试。系统会保留你<strong>历次考试的最高分</strong>，只要有任何一次达到 50 分即为通过。</div>
    </div>
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>考试中不小心关掉页面了，怎么办？</div>
      <div class="faq-a">重新打开考试网址，用<strong>同一个学号</strong>登记，就会回到原本那份考卷，已作答的内容会保留（最后十几秒内的作答可能要补选）。计时不会暂停，照原本的截止时间。</div>
    </div>
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>手机没电了，可以换一台继续考吗？</div>
      <div class="faq-a">可以。在另一台设备用同一个学号登记，就会接着原本的考卷作答。系统会记录「换设备」，原本那台设备之后就不能再作答。</div>
    </div>
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>被系统收卷了，成绩还算吗？</div>
      <div class="faq-a">算。收卷时<strong>已作答的题目照常计分</strong>，没作答的算错；成绩画面会说明收卷原因。如有疑问请向监考老师反映。</div>
    </div>
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>考前可以练习吗？</div>
      <div class="faq-a">可以。点击下方的「题库练习」，里面收录了全部 100 题，附中文翻译与用法说明，还能做随机练习。<strong>练习成绩不会记录，也与正式考试无关。</strong></div>
    </div>
  </div>
</div>

<div class="card">
  <h3>现在就开始</h3>
  <div class="links">
    <a class="link-btn link-primary" href="https://changchuanchi.github.io/cicenglishexitexam/index.html">前往考试系统</a>
    <a class="link-btn link-outline" href="testbank.html" target="_blank" rel="noopener">题库练习（100 题）</a>
  </div>
</div>

<footer>
  博仁大学中文国际学院　英文毕业考试系统<br>
  本说明的截图为示范画面，实际题目由系统随机抽取
</footer>

</div>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log('已产出 →', OUT);
console.log('档案大小：', (fs.statSync(OUT).size / 1024 / 1024).toFixed(2), 'MB');
