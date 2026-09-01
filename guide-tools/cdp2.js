const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, 'verify');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'file:///E:/Claude 製作的工具/CIC 英文毕业考试系统/guide.html';
const PORT = 9341;
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${path.join(__dirname, 'cdp-profile2')}`, 'about:blank'],
    { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(300);
    try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find(t => t.type === 'page'); } catch { }
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  let id = 0; const pending = new Map();
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  });
  const send = (method, params = {}) => new Promise(res => {
    const mid = ++id; pending.set(mid, res); ws.send(JSON.stringify({ id: mid, method, params }));
  });
  const evalJs = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;

  await send('Page.enable');
  await send('Page.navigate', { url: URL });
  await sleep(3500);

  const capture = async (name, width, height, expr) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    await sleep(300);
    await evalJs(expr);
    await sleep(400);
    const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 78 });
    fs.writeFileSync(path.join(OUT, name + '.jpg'), Buffer.from(data, 'base64'));
    console.log(name, 'OK');
  };

  // 对准步骤 8（成绩双图）
  await capture('x1-步骤8双图', 1100, 1450,
    "document.getElementById('step8').scrollIntoView({block:'start'}); window.scrollBy(0,-20); 1");
  // 对准步骤 7
  await capture('x2-步骤7', 1100, 1450,
    "document.getElementById('step7').scrollIntoView({block:'start'}); window.scrollBy(0,-20); 1");
  // 手机版
  await capture('x3-手机顶部', 430, 920, 'window.scrollTo(0,0); 1');
  await capture('x4-手机步骤8', 430, 920,
    "document.getElementById('step8').scrollIntoView({block:'start'}); window.scrollBy(0,-10); 1");

  await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 920, deviceScaleFactor: 1, mobile: true });
  console.log('手机版页面总高:', await evalJs('document.documentElement.scrollHeight'), 'px');
  // 检查是否有横向溢出
  console.log('横向溢出(手机):', await evalJs('document.documentElement.scrollWidth > window.innerWidth'));
  await send('Emulation.setDeviceMetricsOverride', { width: 1100, height: 1450, deviceScaleFactor: 1, mobile: false });
  console.log('横向溢出(桌面):', await evalJs('document.documentElement.scrollWidth > window.innerWidth'));
  console.log('图片总数:', await evalJs('document.images.length'),
    '  载入失败数:', await evalJs('[...document.images].filter(i=>!i.complete||i.naturalWidth===0).length'));

  ws.close(); chrome.kill();
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
