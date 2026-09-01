// 组装「学生考试操作图文说明」单一自含 HTML（图片以 base64 内嵌，方便单档上传 GitHub Pages）
const fs = require('fs');
const path = require('path');

const OPT = path.join(__dirname, 'opt');
const LOGO = 'E:\\Claude 製作的工具\\CIC 英文毕业考试系统\\dpu logo.png';
const OUT = 'E:\\Claude 製作的工具\\CIC 英文毕业考试系统\\guide.html';

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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>英文毕业考试 — 学生操作说明</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: #691BFF;
    --primary-dark: #5312CC;
    --primary-50: #F6F2FF;
    --primary-100: #EBE1FF;
    --success: #16a34a;
    --danger: #dc2626;
    --warning: #d97706;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-900: #111827;
    --radius: 16px;
    --shadow: 0 1px 2px rgba(17,24,39,.04), 0 8px 28px rgba(76,17,184,.09);
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
    background:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30,0 L60,30 L30,60 L0,30 Z' stroke='%23691BFF' stroke-width='0.8' fill='none' opacity='0.10'/%3E%3Ccircle cx='30' cy='30' r='1.2' fill='%23691BFF' opacity='0.08'/%3E%3C/svg%3E"),
      linear-gradient(135deg, #EFEAFF 0%, #F5F1FF 55%, #E9E3FF 100%);
    background-attachment: fixed;
    color: var(--gray-900);
    line-height: 1.75;
    padding: 28px 16px 60px;
    -webkit-text-size-adjust: 100%;
  }

  .wrap { max-width: 780px; margin: 0 auto; }

  /* ── 页首 ── */
  header { text-align: center; margin-bottom: 26px; }
  header img { height: 60px; margin-bottom: 12px; }
  header h1 {
    font-size: 1.55rem; font-weight: 800; color: var(--primary-dark);
    letter-spacing: -.01em; line-height: 1.35;
  }
  header .sub { font-size: .92rem; color: var(--gray-600); margin-top: 6px; }

  .card {
    background: #fff; border-radius: var(--radius); box-shadow: var(--shadow);
    border: 1px solid rgba(105,27,255,.06);
    padding: 26px 28px; margin-bottom: 20px;
  }

  h2 { font-size: 1.12rem; font-weight: 700; color: var(--gray-900); }
  h3 { font-size: 1rem; font-weight: 700; color: var(--gray-900); margin-bottom: 8px; }

  /* ── 考试速览 ── */
  .facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .fact {
    background: var(--primary-50); border: 1px solid var(--primary-100);
    border-radius: 12px; padding: 14px 10px; text-align: center;
  }
  .fact b { display: block; font-size: 1.5rem; font-weight: 800; color: var(--primary); line-height: 1.2; }
  .fact span { display: block; font-size: .78rem; color: var(--gray-600); margin-top: 2px; }

  /* ── 步骤 ── */
  .step { background: #fff; border-radius: var(--radius); box-shadow: var(--shadow);
          border: 1px solid rgba(105,27,255,.06); padding: 26px 28px; margin-bottom: 20px; }
  .step-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .step-num {
    flex-shrink: 0; width: 34px; height: 34px; border-radius: 50%;
    background: var(--primary); color: #fff;
    font-size: .95rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
  }
  .step-body { font-size: .95rem; color: var(--gray-700); }
  .step-body p { margin-bottom: 10px; }
  .step-body ul { margin: 0 0 10px; padding-left: 20px; }
  .step-body li { margin-bottom: 6px; }
  .step-body li::marker { color: var(--primary); }
  .step-body strong { color: var(--gray-900); }

  code {
    background: var(--primary-50); color: var(--primary-dark);
    padding: 1px 7px; border-radius: 5px;
    font-family: 'Consolas', 'Monaco', monospace; font-size: .88em; font-weight: 600;
  }

  /* ── 截图 ── */
  .shot { margin-top: 16px; }
  .shot img {
    width: 100%; height: auto; display: block;
    border-radius: 12px; border: 1px solid var(--gray-200);
    box-shadow: 0 4px 16px rgba(76,17,184,.10);
  }
  .shot figcaption {
    font-size: .82rem; color: var(--gray-500);
    text-align: center; margin-top: 8px;
  }
  .shot-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .shot-pair .shot { margin-top: 16px; }

  /* ── 提示框 ── */
  .note {
    border-radius: 10px; padding: 12px 16px; font-size: .9rem;
    margin: 12px 0; border-left: 4px solid;
  }
  .note b { display: block; margin-bottom: 2px; }
  .note-tip  { background: var(--primary-50); border-color: var(--primary); color: var(--primary-dark); }
  .note-warn { background: #fffbeb; border-color: var(--warning); color: #92400e; }
  .note-danger { background: #fef2f2; border-color: var(--danger); color: #991b1b; }

  /* ── 重要提醒清单 ── */
  .alerts { list-style: none; padding: 0; }
  .alerts li {
    display: flex; gap: 12px; padding: 13px 0;
    border-bottom: 1px solid var(--gray-100); font-size: .93rem; color: var(--gray-700);
  }
  .alerts li:last-child { border-bottom: none; }
  .alerts .ico {
    flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%;
    background: var(--danger); color: #fff; font-size: .85rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center; margin-top: 1px;
  }
  .alerts strong { color: var(--gray-900); }

  /* ── FAQ ── */
  .faq { border-top: 1px solid var(--gray-100); }
  .faq-item { border-bottom: 1px solid var(--gray-100); padding: 14px 0; }
  .faq-q {
    font-weight: 700; font-size: .95rem; color: var(--gray-900);
    display: flex; gap: 9px; margin-bottom: 5px;
  }
  .faq-q .qm { color: var(--primary); font-weight: 800; flex-shrink: 0; }
  .faq-a { font-size: .92rem; color: var(--gray-600); padding-left: 24px; }

  /* ── 页尾 ── */
  .links { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  .link-btn {
    flex: 1 1 220px; text-align: center; text-decoration: none;
    padding: 14px 20px; border-radius: 12px; font-weight: 700; font-size: .95rem;
    transition: all .18s;
  }
  .link-primary { background: var(--primary); color: #fff; }
  .link-primary:hover { background: var(--primary-dark); transform: translateY(-1px);
                        box-shadow: 0 6px 18px rgba(105,27,255,.30); }
  .link-outline { background: #fff; color: var(--primary-dark); border: 1.5px solid var(--primary-100); }
  .link-outline:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-1px); }

  footer { text-align: center; font-size: .8rem; color: var(--gray-500); margin-top: 26px; }

  /* ── 手机 ── */
  @media (max-width: 620px) {
    body { padding: 20px 12px 44px; }
    .card, .step { padding: 20px 18px; }
    header h1 { font-size: 1.24rem; }
    .facts { grid-template-columns: repeat(2, 1fr); }
    .shot-pair { grid-template-columns: 1fr; gap: 0; }
  }

  /* ── 打印（可直接印成纸本发给学生）── */
  @media print {
    body { background: #fff; padding: 0; }
    .card, .step { box-shadow: none; border: 1px solid #ddd; page-break-inside: avoid; }
    .link-btn { border: 1px solid #ccc; }
  }
</style>
</head>
<body>
<div class="wrap">

<header>
  <img src="${logo}" alt="DPU">
  <h1>英文毕业考试 · 学生操作说明</h1>
  <p class="sub">博仁大学中文国际学院　|　线上考试系统图文指南</p>
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
  </ul>
  <p>全部填好后，按下紫色的「<strong>开始考试</strong>」按钮。</p>
  <div class="note note-warn">
    <b>注意</b>
    按下「开始考试」的那一刻，60 分钟倒计时立即开始。请确认自己已准备好再按。
  </div>`,
  shot('01-登记填写', '① 填写学号、姓名、科系（本例另有考场密码栏）'))}

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
  <p>选错了没关系，<strong>直接点另一个选项就能改</strong>，交卷前都可以修改。</p>`,
  shot('03-第一题作答', '③ 作答画面，B 选项已选中（紫色高亮）'))}

${step(4, '切换题目', `
  <p>用题目下方的「<strong>← 上一题</strong>」与「<strong>下一题 →</strong>」按钮前后移动。</p>
  <p>可以随时回头检查或修改先前的答案；题目不必按顺序作答，跳着答也没问题。</p>`,
  shot('04-中途进度', '④ 作答到一半，进度条显示已完成的比例'))}

${step(5, '留意剩余时间', `
  <p>右上角的倒计时会随剩余时间改变颜色，提醒你把握时间：</p>
  <ul>
    <li><span style="color:var(--primary);font-weight:700">紫色</span> —— 时间充裕。</li>
    <li><span style="color:var(--warning);font-weight:700">橙色</span> —— 剩余 10 分钟。</li>
    <li><span style="color:var(--danger);font-weight:700">红色</span> —— 剩余 5 分钟，请尽快完成。</li>
  </ul>
  <p>时间一到，系统会<strong>自动交卷</strong>，已作答的题目照常计分。</p>
  <div class="note note-danger">
    <b>特别提醒：计时不会暂停</b>
    倒计时以「开始考试的时刻」为准。<strong>切换到其他 App、手机锁屏、把页面切到背景，时间都会继续走</strong>，请勿中途离开。
  </div>`,
  shot('05-计时警示', '⑤ 剩余 5 分钟，倒计时转为红色'))}

${step(6, '交卷', `
  <p>翻到<strong>最后一题（第 50 题）</strong>时，下方会出现绿色的「<strong>交卷</strong>」按钮。</p>
  <p>确认答案无误后按下即可送出，<strong>不必等时间用完</strong>。</p>`,
  shot('06-最后一题交卷', '⑥ 最后一题下方出现绿色「交卷」按钮'))}

${step(7, '若还有题目没作答', `
  <p>按下交卷时，若系统发现还有题目没作答，会以红字提醒你还剩几题未答，<strong>需要再按一次「交卷」才会真正送出</strong>。</p>
  <p>想回去补答，就用「← 上一题」翻回去；确定要直接交卷，再按一次即可。</p>
  <div class="note note-tip">
    <b>关于计分</b>
    答对一题得 2 分，<strong>答错或未作答都不倒扣</strong>。所以就算不确定，也建议猜一个答案，不要留空。
  </div>`,
  shot('07-未作答提醒', '⑦ 尚有题目未作答时的红字提醒'))}

${step(8, '查看成绩', `
  <p>交卷后<strong>立即显示成绩</strong>：分数、答对题数，以及你的学号、姓名、科系。</p>
  <ul>
    <li><strong style="color:var(--success)">满 50 分</strong> —— 显示绿色圆环与「恭喜，考试通过！」。</li>
    <li><strong style="color:var(--danger)">未满 50 分</strong> —— 显示红色圆环与「本次未通过」。</li>
  </ul>
  <p>成绩已由系统<strong>自动记录</strong>，不需要另外回报。按「完成」即可离开。</p>
  <div class="note note-warn">
    <b>成绩画面只显示这一次</b>
    按下「完成」离开后，页面不会再显示这次的分数。如需查询成绩，请向老师洽询（后台皆有完整记录）。
  </div>`,
  `<div class="shot-pair">
    ${shot('08-成绩通过', '⑧ 通过：82 分（绿色）')}
    ${shot('09-成绩未通过', '⑧ 未通过：38 分（红色）')}
  </div>`)}

<div class="card">
  <h2 style="margin-bottom:6px">⚠️ 五个最重要的提醒</h2>
  <ul class="alerts">
    <li>
      <span class="ico">1</span>
      <div><strong>计时不会暂停。</strong>切换 App、锁屏、关掉页面，60 分钟都持续在走，离开多久就少答多久。</div>
    </li>
    <li>
      <span class="ico">2</span>
      <div><strong>考试中切勿刷新或关闭页面。</strong>一旦刷新或关闭，页面会回到登记画面，<strong>已作答的内容全部消失</strong>，必须从头重新开始。</div>
    </li>
    <li>
      <span class="ico">3</span>
      <div><strong>请保持网络畅通。</strong>取题与交卷都需要连网，建议使用稳定的 Wi-Fi 或行动网络。</div>
    </li>
    <li>
      <span class="ico">4</span>
      <div><strong>交卷若没反应，再按一次就好。</strong>网络不顺时，系统最多等 30 秒就会提示「提交逾时，答案未送出」，此时<strong>再按一次「交卷」</strong>即可，<strong>不会重复计分</strong>。</div>
    </li>
    <li>
      <span class="ico">5</span>
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
      <div class="faq-a">可以。手机、平板、电脑的浏览器都能使用，画面会自动调整。若用手机，请特别注意<strong>不要锁屏或切换到其他 App</strong>。</div>
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
      <div class="faq-a">已作答的内容无法复原，需要重新登记、重新作答。请立即告知监考老师。</div>
    </div>
    <div class="faq-item">
      <div class="faq-q"><span class="qm">Q</span>考前可以练习吗？</div>
      <div class="faq-a">可以。点击下方的「题库练习」，里面收录了全部 100 题，附中文翻译与用法说明，还能做随机练习。<strong>练习成绩不会记录，也与正式考试无关。</strong></div>
    </div>
  </div>
</div>

<div class="card">
  <h3 style="text-align:center;margin-bottom:14px">现在就开始</h3>
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
