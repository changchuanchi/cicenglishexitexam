// 用「同一份 index.html」重现各阶段画面并截图，供学生图文说明使用。
// 不连线 GAS：把页面载入时的 loadDepartments()/loadExamStatus() 换成模拟资料 + 阶段脚本。
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = 'E:\\Claude 製作的工具\\CIC 英文毕业考试系统\\index.html';
const LOGO = 'E:\\Claude 製作的工具\\CIC 英文毕业考试系统\\dpu logo.png';
const OUT = path.join(__dirname, 'shots');
const WORK = path.join(__dirname, 'work');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

for (const d of [OUT, WORK]) fs.mkdirSync(d, { recursive: true });
fs.copyFileSync(LOGO, path.join(WORK, 'dpu logo.png'));

const original = fs.readFileSync(SRC, 'utf8');

// 真实题库内容（取自 questions.md），让截图与实际考试一致
const Q = (id, text, a, b, c, d) => ({
  questionId: id, text,
  options: [{ key: 'A', text: a }, { key: 'B', text: b }, { key: 'C', text: c }, { key: 'D', text: d }]
});
const MOCK = [
  Q(7, 'So many of these animals have been shot over the years that they are now classed as _____ species.', 'dangerous', 'endangered', 'unwanted', 'limited'),
  Q(33, 'Let me just _____ what we have agreed in the agenda so far if nobody minds me going over it all again.', 'restore', 'retake', 'recap', 'redo'),
  Q(21, "Don't give up whatever you do. I'm sure you'll _____ it in the end.", 'acquire', 'get', 'put', 'make'),
  Q(13, 'Markets and marketing concepts will change radically, driven by those companies who successfully _____ the challenge.', 'forge through', 'rise to', 'set up', 'take in'),
  Q(28, 'Before they could borrow a large sum of money to buy the house, they had to make sure they had enough money to be able to make a _____ payment.', 'down', 'through', 'low', 'base')
];
// 凑满 50 题（只有当前显示的那题会被渲染，其余仅用于题数与进度计算）
const MOCK_Q = Array.from({ length: 50 }, (_, i) => {
  const base = MOCK[i % MOCK.length];
  return { questionId: 1000 + i, text: base.text, options: base.options };
});

// 各阶段：name = 档名，code = 注入的驱动脚本，size = 视窗尺寸
const DEPTS = "['国际商务','金融会计','创意设计','旅游管理','数位传媒']";
const setQ = (idx, qid) => `
  currentStudent = { studentId: '99990004', name: '陈明学', dept: '国际商务' };
  questions = MOCK_Q; answers = {}; currentIdx = ${idx};
  ${qid !== undefined ? `answers[questions[${idx}].questionId] = '${qid}';` : ''}
  renderQuestion(); showScreen('examScreen');`;
const setTimer = (txt, cls) => `
  var t = document.getElementById('timer');
  t.textContent = '${txt}'; t.className = 'timer${cls ? ' ' + cls : ''}';`;

const STAGES = [
  {
    name: '01-登记填写', size: [900, 900],
    code: `
      document.getElementById('examPwGroup').style.display = 'block';
      document.getElementById('studentIdInput').value = '99990004';
      document.getElementById('studentNameInput').value = '陈明学';
      document.getElementById('studentDeptInput').value = '国际商务';
      document.getElementById('examPwInput').value = 'cic2026';`
  },
  {
    name: '02-考试未开放', size: [900, 820],
    code: `
      var a = document.getElementById('examStatusAlert');
      a.className = 'alert alert-error';
      a.textContent = '考试目前未开放，请等候监考老师通知。';
      a.style.display = 'block';
      var b = document.getElementById('loginBtn');
      b.disabled = true; b.textContent = '考试未开放';`
  },
  {
    name: '03-第一题作答', size: [900, 860],
    code: setQ(0, 'B') + setTimer('59:12')
  },
  {
    name: '04-中途进度', size: [900, 860],
    code: setQ(24, 'C') + setTimer('32:45')
  },
  {
    name: '05-计时警示', size: [900, 860],
    code: setQ(40, 'B') + setTimer('04:58', 'danger')
  },
  {
    name: '06-最后一题交卷', size: [900, 900],
    code: setQ(49, 'D') + setTimer('06:31', 'warning')
  },
  {
    name: '07-未作答提醒', size: [900, 920],
    code: setQ(49) + setTimer('05:47', 'danger') + `
      var w = document.getElementById('unansweredWarning');
      w.textContent = '还有 3 题未作答，确定要交卷吗？再按一次确认交卷。';
      w.style.display = 'block';`
  },
  {
    name: '08-成绩通过', size: [900, 900],
    code: `
      currentStudent = { studentId: '99990004', name: '陈明学', dept: '国际商务' };
      showResult({ score: 82, passed: true, correct: 41, total: 50 });`
  },
  {
    name: '09-成绩未通过', size: [900, 900],
    code: `
      currentStudent = { studentId: '99990004', name: '陈明学', dept: '国际商务' };
      showResult({ score: 38, passed: false, correct: 19, total: 50 });`
  }
];

const INIT_RE = /\/\/ 页面载入时读取专业清单与考试状态\s*\r?\nloadDepartments\(\);\s*\r?\nloadExamStatus\(\);/;
if (!INIT_RE.test(original)) { console.error('找不到初始化区块，index.html 结构可能已变更'); process.exit(1); }

for (const st of STAGES) {
  const boot = `
// ── 以下为「图文说明」截图用的模拟资料，不连线 GAS ──
fillDeptSelect(${DEPTS});
const MOCK_Q = ${JSON.stringify(MOCK_Q)};
${st.code}
document.title = ${JSON.stringify(st.name)};`;
  const html = original.replace(INIT_RE, boot);
  const file = path.join(WORK, st.name + '.html');
  fs.writeFileSync(file, html, 'utf8');

  const png = path.join(OUT, st.name + '.png');
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=2',
    '--host-resolver-rules=MAP * 0.0.0.0',   // 硬性阻断任何外连，确保不打到 GAS
    '--virtual-time-budget=3000',
    `--window-size=${st.size[0]},${st.size[1]}`,
    `--screenshot=${png}`,
    'file:///' + file.replace(/\\/g, '/')
  ], { stdio: 'pipe', timeout: 60000 });

  const kb = Math.round(fs.statSync(png).size / 1024);
  console.log(`OK  ${st.name}.png  ${kb} KB`);
}
console.log('全部完成 →', OUT);
