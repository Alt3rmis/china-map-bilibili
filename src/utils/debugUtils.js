// 调试工具模块 - 处理调试相关功能

import { getChart, getCurrentMap } from './state.js';

/**
 * 检测是否是开发环境
 * @returns {boolean} 是否是开发环境
 */
function isDevMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === '1') {
        return true;
    }

    const hostname = window.location.hostname;
    const localHostnames = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (localHostnames.includes(hostname)) {
        return true;
    }

    const ipPattern = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/;
    if (ipPattern.test(hostname)) {
        return true;
    }

    return false;
}

/**
 * 检查调试面板是否已关闭
 * @returns {boolean} 调试面板是否已关闭
 */
function isDebugPanelClosed() {
    return localStorage.getItem('debugPanelClosed') === 'true';
}

/**
 * 切换调试面板显示/隐藏
 */
function toggleDebugPanel() {
    const debugPanel = document.getElementById('debug-panel');
    const toggleBtn = document.getElementById('debug-toggle-btn');
    const isClosed = debugPanel.style.display === 'none';

    if (isClosed) {
        debugPanel.style.display = 'block';
        toggleBtn.style.display = 'none';
        localStorage.setItem('debugPanelClosed', 'false');
    } else {
        debugPanel.style.display = 'none';
        toggleBtn.style.display = 'block';
        localStorage.setItem('debugPanelClosed', 'true');
    }
}

/**
 * 创建重新打开调试面板的按钮
 * @returns {HTMLElement} 调试面板按钮
 */
function createDebugToggleBtn() {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'debug-toggle-btn';
    toggleBtn.textContent = '🛠️ 调试';
    toggleBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #48dbfb;
        color: #48dbfb;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        z-index: 9999;
        font-size: 12px;
        display: none;
    `;
    toggleBtn.addEventListener('click', toggleDebugPanel);
    document.body.appendChild(toggleBtn);
    return toggleBtn;
}

/**
 * 创建调试面板
 */
function createDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid #48dbfb;
        border-radius: 8px;
        padding: 15px;
        z-index: 10000;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        min-width: 280px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    `;

    debugPanel.innerHTML = `
        <div style="color: #48dbfb; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #48dbfb; padding-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
            <span>🛠️ 海南地图调试面板</span>
            <button id="debug-close-btn" style="background: transparent; border: none; color: #48dbfb; font-size: 16px; cursor: pointer; padding: 0;">✕</button>
        </div>
        <div style="margin-bottom: 8px;">
            <span style="color: #feca57;">Zoom:</span>
            <span id="debug-zoom" style="color: #fff; margin-left: 8px;">3.5</span>
        </div>
        <div style="margin-bottom: 8px;">
            <span style="color: #feca57;">Center:</span>
            <span id="debug-center" style="color: #fff; margin-left: 8px;">[109.9, 19.2]</span>
        </div>
        <div style="margin-bottom: 15px;">
            <span style="color: #feca57;">Code:</span>
            <span id="debug-code" style="color: #48dbfb; margin-left: 8px;">zoom: 3.5, center: [109.9, 19.2]</span>
        </div>
        <div style="margin-bottom: 8px;">
            <span style="color: #feca57;">位置调整:</span>
            <div style="display: flex; justify-content: center; gap: 5px; margin-top: 5px;">
                <div></div>
                <button id="debug-move-up" style="background: #48dbfb; border: none; color: #000; padding: 5px 10px; cursor: pointer; border-radius: 4px;">↑</button>
                <div></div>
            </div>
            <div style="display: flex; justify-content: center; gap: 5px; margin-top: 5px;">
                <button id="debug-move-left" style="background: #48dbfb; border: none; color: #000; padding: 5px 10px; cursor: pointer; border-radius: 4px;">←</button>
                <button id="debug-move-down" style="background: #48dbfb; border: none; color: #000; padding: 5px 10px; cursor: pointer; border-radius: 4px;">↓</button>
                <button id="debug-move-right" style="background: #48dbfb; border: none; color: #000; padding: 5px 10px; cursor: pointer; border-radius: 4px;">→</button>
            </div>
        </div>
        <div style="margin-bottom: 8px;">
            <span style="color: #feca57;">缩放:</span>
            <div style="display: flex; gap: 8px; margin-top: 5px;">
                <button id="debug-zoom-in" style="flex: 1; background: #48dbfb; border: none; color: #000; padding: 6px; cursor: pointer; border-radius: 4px;">放大 +</button>
                <button id="debug-zoom-out" style="flex: 1; background: #48dbfb; border: none; color: #000; padding: 6px; cursor: pointer; border-radius: 4px;">缩小 -</button>
            </div>
        </div>
        <button id="debug-reset" style="width: 100%; background: #ff6b6b; border: none; color: #fff; padding: 8px; cursor: pointer; border-radius: 4px;">重置</button>
        <div style="margin-top: 10px; font-size: 11px; color: #888; line-height: 1.4;">
            提示: 使用方向按钮调整位置，缩放调整大小，找到合适位置后，复制代码到 app.js 第 218-219 行
        </div>
    `;

    document.body.appendChild(debugPanel);

    document.getElementById('debug-close-btn').addEventListener('click', toggleDebugPanel);
    document.getElementById('debug-zoom-in').addEventListener('click', () => adjustZoom(0.1));
    document.getElementById('debug-zoom-out').addEventListener('click', () => adjustZoom(-0.1));
    document.getElementById('debug-reset').addEventListener('click', () => resetMap());
    document.getElementById('debug-move-up').addEventListener('click', () => moveMap(0, 0.5));
    document.getElementById('debug-move-down').addEventListener('click', () => moveMap(0, -0.5));
    document.getElementById('debug-move-left').addEventListener('click', () => moveMap(-0.5, 0));
    document.getElementById('debug-move-right').addEventListener('click', () => moveMap(0.5, 0));
}

/**
 * 更新调试面板显示
 * @param {number} zoom - 缩放级别
 * @param {Array} center - 中心点坐标
 */
function updateDebugPanel(zoom, center) {
    const zoomEl = document.getElementById('debug-zoom');
    const centerEl = document.getElementById('debug-center');
    const codeEl = document.getElementById('debug-code');

    if (zoomEl) zoomEl.textContent = zoom.toFixed(2);
    if (centerEl) centerEl.textContent = `[${center[0].toFixed(2)}, ${center[1].toFixed(2)}]`;
    if (codeEl) codeEl.textContent = `zoom: ${zoom.toFixed(2)}, center: [${center[0].toFixed(2)}, ${center[1].toFixed(2)}]`;
}

/**
 * 调整缩放
 * @param {number} delta - 缩放增量
 */
function adjustZoom(delta) {
    const chart = getChart();
    const currentMap = getCurrentMap();
    if (!chart || currentMap !== '海南') return;

    const option = chart.getOption();
    const currentZoom = option.series[0].zoom;
    const newZoom = Math.max(1, currentZoom + delta);

    chart.setOption({
        series: [{
            zoom: newZoom
        }]
    });
}

/**
 * 重置地图
 */
function resetMap() {
    const chart = getChart();
    const currentMap = getCurrentMap();
    if (!chart || currentMap !== '海南') return;

    chart.setOption({
        series: [{
            zoom: 3.5,
            center: [109.9, 19.2]
        }]
    });
}

/**
 * 移动地图
 * @param {number} deltaX - X轴移动量
 * @param {number} deltaY - Y轴移动量
 */
function moveMap(deltaX, deltaY) {
    const chart = getChart();
    const currentMap = getCurrentMap();
    if (!chart || currentMap !== '海南') return;

    const option = chart.getOption();
    const currentCenter = option.series[0].center;
    const currentZoom = option.series[0].zoom;

    const moveScale = 1 / currentZoom;
    const newCenter = [
        currentCenter[0] + deltaX * moveScale,
        currentCenter[1] + deltaY * moveScale
    ];

    chart.setOption({
        series: [{
            center: newCenter
        }]
    });
}

export {
    isDevMode,
    isDebugPanelClosed,
    toggleDebugPanel,
    createDebugToggleBtn,
    createDebugPanel,
    updateDebugPanel,
    adjustZoom,
    resetMap,
    moveMap
};
