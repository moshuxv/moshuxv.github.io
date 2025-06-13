(function () {
    // 配置参数
    const SPEED = 30;   // 打字速度（毫秒）
    const INITIAL_LINES = [
        { id: 'line1', text: 'welcome to moshuxv blog' },
        { id: 'line2', text: '欢迎访问莫书旭的博客' }
    ];
    const ADDITIONAL_LINES = [
        { text: '——Who？', pause: 1000 },
        { text: "——It's me.", pause: 1000 },
        { text: 'Haha, just making a joke.', pause: 1000 }
    ];
    const WAIT_TIME = 2000; // 等待时间（毫秒）
    const LINES = [
        { id: 'line1', key: 'content' },
        { id: 'line2', key: 'translation' },
        { id: 'line3', key: 'author', prefix: '—— ' }
    ];
    const MARGIN = 25; // 外边距（像素）

    // 核心逻辑
    async function init() {
        // 预计算所有文本的最大宽度
        const { maxWidth } = await calculateMaxTextSize();

        // 获取视口宽度
        const viewportWidth = window.innerWidth;

        // 计算包含外边距的最大宽度
        const containerWidthWithMargin = maxWidth + MARGIN * 2;

        // 确保容器宽度不超过视口宽度，同时保留外边距
        const containerWidth = Math.min(containerWidthWithMargin, viewportWidth);

        // 固定容器宽度
        const container = document.getElementById('typing-container');
        if (container) {
            container.style.width = `calc(${containerWidth}px - ${MARGIN * 2}px)`;
            container.style.margin = `${MARGIN}px auto`; // 设置上下外边距为MARGIN，左右居中
            container.style.overflowX = 'auto'; // 当内容超过容器宽度时显示水平滚动条
        }

        // 先显示初始内容
        await showInitialLines();

        // 退格初始内容
        await backspaceLines();

        // 然后加载后续内容
        try {
            const data = await fetch('/assets/1.json').then(res => res.json());
            const item = data[Math.floor(Math.random() * data.length)];
            // 逐行输入内容
            for (let i = 0; i < LINES.length; i++) {
                const line = LINES[i];
                const el = document.getElementById(line.id);
                const text = line.prefix ? line.prefix + item[line.key] : item[line.key];
                await typeText(el, text);
                // 如果是 line2 显示完，处理 line3 的额外内容
                if (line.id === 'line2') {
                    await handleAdditionalLinesInLine3();
                }
            }
            // 添加闪烁光标
            addBlinkingCursor(LINES[LINES.length - 1].id);
        } catch (e) {
            showError(e);
        }
    }

    async function calculateMaxTextSize() {
        // 创建不可见的测量元素
        const measurementDiv = document.createElement('div');
        measurementDiv.style.cssText = `
            position: absolute;
            visibility: hidden;
            white-space: normal;
            font: inherit;
            letter-spacing: inherit;
            padding: 0;
            margin: 0;
            border: none;
            z-index: -1;
        `;
        document.body.appendChild(measurementDiv);

        let maxWidth = 0;

        // 测量初始内容
        for (const line of INITIAL_LINES) {
            measurementDiv.textContent = line.text;
            maxWidth = Math.max(maxWidth, measurementDiv.offsetWidth);
        }

        // 测量后续内容
        try {
            const data = await fetch('/assets/1.json').then(res => res.json());
            const item = data[Math.floor(Math.random() * data.length)];
            for (const line of LINES) {
                const text = line.prefix ? line.prefix + item[line.key] : item[line.key];
                measurementDiv.textContent = text;
                maxWidth = Math.max(maxWidth, measurementDiv.offsetWidth);
            }
        } catch (e) {
            console.error('Error measuring text:', e);
        }

        // 测量额外内容
        for (const line of ADDITIONAL_LINES) {
            measurementDiv.textContent = line.text;
            maxWidth = Math.max(maxWidth, measurementDiv.offsetWidth);
        }

        // 移除测量元素
        document.body.removeChild(measurementDiv);

        return { maxWidth };
    }

    async function showInitialLines() {
        for (const line of INITIAL_LINES) {
            const el = document.getElementById(line.id);
            await typeText(el, line.text);
            if (line.id === 'line2') {
                const cursor = addBlinkingCursor(line.id);
                await wait(2000, cursor); // 停顿 2 秒
            }
        }
    }

    async function handleAdditionalLinesInLine3() {
        const line3El = document.getElementById('line3');
        for (const line of ADDITIONAL_LINES) {
            await typeText(line3El, line.text);
            const cursor = addBlinkingCursor('line3');
            await wait(line.pause, cursor);
            await backspaceText(line3El, line.text.length);
        }
    }

    async function backspaceLines() {
        for (const line of INITIAL_LINES.reverse()) {
            const el = document.getElementById(line.id);
            await backspaceText(el, line.text.length);
        }
    }

    async function typeLines(item) {
        // 清空所有行内容
        LINES.forEach(line => {
            document.getElementById(line.id).innerHTML = '';
        });

        // 逐行输入内容
        for (const line of LINES) {
            const el = document.getElementById(line.id);
            const text = line.prefix ? line.prefix + item[line.key] : item[line.key];
            await typeText(el, text);
        }

        // 添加闪烁光标
        addBlinkingCursor(LINES[LINES.length - 1].id);
    }

    function typeText(el, text) {
        return new Promise(resolve => {
            let count = 0;
            const timer = setInterval(() => {
                // 带光标的临时内容
                el.innerHTML = text.slice(0, count) + '<span class="typing-cursor">|</span>';
                count++;
                if (count > text.length) {
                    clearInterval(timer);
                    el.textContent = text; // 最终移除光标
                    resolve();
                }
            }, SPEED);
        });
    }

    function backspaceText(el, length) {
        return new Promise(resolve => {
            let count = length;
            const timer = setInterval(() => {
                const text = el.textContent.slice(0, count - 1);
                el.innerHTML = text + '<span class="typing-cursor">|</span>';
                count--;
                if (count < 0) {
                    clearInterval(timer);
                    el.textContent = '';
                    resolve();
                }
            }, SPEED);
        });
    }

    function addBlinkingCursor(lineId) {
        const lastLine = document.getElementById(lineId);
        const cursor = document.createElement('span');
        cursor.classList.add('blinking-cursor');
        cursor.textContent = '|';
        lastLine.appendChild(cursor);

        // 闪烁动画
        let isVisible = true;
        const blinkInterval = setInterval(() => {
            isVisible = !isVisible;
            cursor.style.opacity = isVisible ? '1' : '0';
        }, 300);

        return { cursor, blinkInterval };
    }

    function wait(time, cursorObj) {
        return new Promise(resolve => {
            setTimeout(() => {
                clearInterval(cursorObj.blinkInterval);
                cursorObj.cursor.remove();
                resolve();
            }, time);
        });
    }

    function showError(e) {
        console.error('Error:', e);
        document.getElementById('line1').textContent = '数据加载失败';
    }

    // 启动
    document.addEventListener('DOMContentLoaded', init);
})();
    