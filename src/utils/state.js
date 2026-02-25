// 全局状态管理模块 - 存储共享变量

let chart = null;
let currentMap = 'china';

/**
 * 获取图表实例
 * @returns {Object|null} ECharts 实例
 */
function getChart() {
    return chart;
}

/**
 * 设置图表实例
 * @param {Object} chartInstance - ECharts 实例
 */
function setChart(chartInstance) {
    chart = chartInstance;
}

/**
 * 获取当前地图名称
 * @returns {string} 当前地图名称
 */
function getCurrentMap() {
    return currentMap;
}

/**
 * 设置当前地图名称
 * @param {string} mapName - 地图名称
 */
function setCurrentMap(mapName) {
    currentMap = mapName;
}

export {
    getChart,
    setChart,
    getCurrentMap,
    setCurrentMap
};
