import { defineComponent, ref } from 'vue'
import TiptapEditor from './TiptapEditor'
import { UndoRedoFeature, TextStyleFeature, TextAlignFeature, ListFeature, CodeBlockFeature, TableFeature, MathFeature, ImageFeature, SeparatorFeature } from './index'

export default defineComponent({
  name: 'App',
  setup() {
    const content = ref(`
<h1>Tiptap 编辑器功能演示</h1>
<p>这是一个功能完整的富文本编辑器，支持多种格式和元素。</p>

<h2>标题层级</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>

<hr>

<h2>文本格式</h2>
<p>支持 <strong>粗体</strong>、<em>斜体</em>、<s>删除线</s>、<u>下划线</u> 以及 <a href="https://tiptap.dev">链接</a>。</p>
<p>可以组合使用：<strong><em>粗体加斜体</em></strong>、<u><s>下划线加删除线</s></u>。</p>

<hr>

<h2>文本对齐</h2>
<p style="text-align: left">左对齐文本（默认）</p>
<p style="text-align: center">居中对齐文本</p>
<p style="text-align: right">右对齐文本</p>
<p style="text-align: justify">两端对齐文本。当文本足够长时，会自动调整单词间距使每行两端对齐。这在排版长段落时特别有用。</p>

<hr>

<h2>列表</h2>

<h3>无序列表</h3>
<ul>
  <li>第一项</li>
  <li>第二项</li>
  <li>第三项</li>
</ul>

<h3>有序列表</h3>
<ol>
  <li>步骤一</li>
  <li>步骤二</li>
  <li>步骤三</li>
</ol>

<h3>任务列表</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked><span></span></label><div><p>已完成的任务</p></div></li>
  <li data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>待完成的任务</p></div></li>
  <li data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>另一个待办事项</p></div></li>
</ul>

<hr>

<h2>代码块</h2>
<pre><code class="language-javascript">function hello() {
  console.log('Hello, Tiptap!')
  return 42
}</code></pre>

<hr>

<h2>表格</h2>
<table>
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>城市</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>张三</td>
      <td>25</td>
      <td>北京</td>
    </tr>
    <tr>
      <td>李四</td>
      <td>30</td>
      <td>上海</td>
    </tr>
    <tr>
      <td>王五</td>
      <td>28</td>
      <td>深圳</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>图片</h2>
<p>左对齐图片：</p>
<p><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%234CAF50'/%3E%3Ctext x='50' y='55' font-size='16' text-anchor='middle' fill='white'%3E左对齐%3C/text%3E%3C/svg%3E" alt="左对齐" data-align="left"></p>
<p style="text-align: center">居中图片：</p>
<p style="text-align: center"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%232196F3'/%3E%3Ctext x='50' y='55' font-size='16' text-anchor='middle' fill='white'%3E居中%3C/text%3E%3C/svg%3E" alt="居中" data-align="center"></p>
<p style="text-align: right">右对齐图片：</p>
<p style="text-align: right"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23FF9800'/%3E%3Ctext x='50' y='55' font-size='16' text-anchor='middle' fill='white'%3E右对齐%3C/text%3E%3C/svg%3E" alt="右对齐" data-align="right"></p>

<hr>

<h2>数学公式</h2>
<p>内联公式：质能方程 <span data-type="inline-math" data-latex="E=mc^2"></span> 是物理学中的重要公式。</p>
<p>块级公式：</p>
<div data-type="block-math" data-latex="\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}"></div>
<p>另一个例子：</p>
<div data-type="block-math" data-latex="\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}"></div>

<hr>

<p style="text-align: center"><em>使用工具栏可以编辑所有元素，选中文本时会出现气泡菜单</em></p>
`)

    const features = [
      UndoRedoFeature,
      TextStyleFeature,
      SeparatorFeature,
      TextAlignFeature,
      ListFeature,
      CodeBlockFeature,
      SeparatorFeature,
      TableFeature,
      MathFeature,
      ImageFeature,
    ]

    return () => (
      <TiptapEditor
        modelValue={content.value}
        onUpdate:modelValue={(val: string) => { content.value = val }}
        features={features}
      />
    )
  },
})

