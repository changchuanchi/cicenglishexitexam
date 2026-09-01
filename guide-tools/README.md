# guide.html 产生工具

`guide.html`（学生考试图文说明）里的截图**不是手动截的**，而是用 `index.html` 本身
自动重现各阶段画面后截图产生。版面一改，重跑这套流程即可重出全部截图。

## 原理

复制一份 `index.html`，把页尾的：

```js
loadDepartments();
loadExamStatus();
```

换成「模拟资料 ＋ 阶段驱动脚本」，**完全不连线 GAS**（另以
`--host-resolver-rules=MAP * 0.0.0.0` 硬性阻断外连）。因为注入的程式码是塞进
**同一个 `<script>` 区块**，所以能直接存取 `questions` / `answers` / `currentIdx` /
`currentStudent` 这些 `let` 变数（它们不在 `window` 上，从外部脚本改不到）。

## 执行顺序

| # | 指令 | 作用 | 产出 |
|---|------|------|------|
| 1 | `node shoot.js` | 重现九个阶段并截图（2 倍解析度 PNG） | `shots/` |
| 2 | `powershell -File resize.ps1` | 缩到 1200px 宽、转 JPEG q90 | `opt/` |
| 3 | `powershell -File crop.ps1` | 把两张成绩图裁切到卡片区域（并排时才看得清） | 覆写 `opt/08-*.jpg`、`opt/09-*.jpg` |
| 4 | `node build-guide.js` | 组装单档 HTML（图片 base64 内嵌） | `guide.html` |
| 5 | `node cdp2.js` | CDP 驱动 headless Chrome 验证排版 | `verify/` |

全部产出（`shots/`、`opt/`、`verify/`）都是中间档，不必进版控；
最终要上线的只有专案根目录的 `guide.html` 一个档案。

## 注意事项

- **路径**：脚本内的 `SRC` / `OUT` 为绝对路径，搬动专案要一并修改。
- **PowerShell 5.1 编码**：`crop.ps1` 刻意**不含任何中文字元**，改用 `08-*.png`
  这类 ASCII 万用字元比对档名 —— PS 5.1 会用 ANSI 读取 `.ps1`，脚本里写中文档名
  会变乱码而找不到档案（踩过这个坑）。
- **`loading="lazy"` 不要加**：内嵌 base64 图片没有网路请求可延后，加了反而害
  列印与截图时图片空白。
- 阶段清单、模拟题目、说明文字都写在脚本里，要增删阶段直接改 `shoot.js` 的
  `STAGES` 与 `build-guide.js` 的版面模板。
- **页面之间一律用相对路径**：`build-guide.js` 产出的「题库练习」按钮连到
  `testbank.html`（同一个 repo 的同层档案）。四个页面同处 `cicenglishexitexam`，
  不要在模板里写绝对网址。
- **改了 `build-guide.js` 记得重传**：这个资料夹本身也在 repo 里，只改本机不上传，
  线上那份产生器就会跟本机不一致（实际发生过）。
