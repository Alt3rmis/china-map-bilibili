// 地图服务模块 - 处理地图相关功能

import { getChart, setChart, getCurrentMap, setCurrentMap } from '../utils/state.js';
import { isDevMode, updateDebugPanel } from '../utils/debugUtils.js';
import { isCityKey } from '../utils/dataUtils.js';
import { showProvinceVideos, showCityInfo, hideCityInfo } from './uiService.js';

let isLoading = false;

const directControlledCities = ['北京', '天津', '上海', '重庆'];

const provinceNameMap = {
    '四川': 'sichuan',
    '北京': 'beijing',
    '天津': 'tianjin',
    '上海': 'shanghai',
    '重庆': 'chongqing',
    '河北': 'hebei',
    '山西': 'shanxi',
    '辽宁': 'liaoning',
    '吉林': 'jilin',
    '黑龙江': 'heilongjiang',
    '江苏': 'jiangsu',
    '浙江': 'zhejiang',
    '安徽': 'anhui',
    '福建': 'fujian',
    '江西': 'jiangxi',
    '山东': 'shandong',
    '河南': 'henan',
    '湖北': 'hubei',
    '湖南': 'hunan',
    '广东': 'guangdong',
    '海南': 'hainan',
    '贵州': 'guizhou',
    '云南': 'yunnan',
    '陕西': 'shaanxi',
    '甘肃': 'gansu',
    '青海': 'qinghai',
    '台湾': 'taiwan',
    '内蒙古': 'neimenggu',
    '广西': 'guangxi',
    '西藏': 'xizang',
    '宁夏': 'ningxia',
    '新疆': 'xinjiang',
    '香港': 'xianggang',
    '澳门': 'aomen'
};

/**
 * 加载地图数据
 */
async function loadMapData() {
    try {
        showLoading('正在加载中国地图...');
        const response = await fetch('https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json');
        const chinaJson = await response.json();

        echarts.registerMap('china', chinaJson);
        initMap();
    } catch (error) {
        console.error('加载地图数据失败:', error);
        // eslint-disable-next-line no-alert
        alert('加载地图数据失败，请检查网络连接');
    } finally {
        hideLoading();
    }
}

/**
 * 初始化地图
 * @param {string} mapName - 地图名称
 */
function initMap(mapName = 'china') {
    const chartDom = document.getElementById('china-map');
    let chart = getChart();

    if (!chart) {
        chart = echarts.init(chartDom);
        setChart(chart);
    }

    const citiesWithData = getCitiesWithDataForMap(mapName);

    const option = {
        title: {
            text: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                if (params.name && citiesWithData.includes(params.name)) {
                    let displayName = params.name;
                    displayName = displayName.replace(/市$/, '');
                    displayName = displayName.replace(/区|地区$/, '');
                    return `<span style="color: #48dbfb; font-weight: bold;">${displayName}</span><br/>点击查看视频`;
                }
                return params.name || (mapName === 'china' ? '中国' : mapName);
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#48dbfb',
            textStyle: {
                color: '#fff'
            }
        },
        visualMap: {
            show: false,
            min: 0,
            max: 1,
            left: 'left',
            top: 'bottom',
            text: ['有视频', '无数据'],
            inRange: {
                color: ['#2a3b55', '#ff6b6b']
            }
        },
        series: [
            {
                name: '快递里的中国',
                type: 'map',
                map: mapName,
                roam: isDevMode() && mapName === '海南',
                zoom: mapName === 'china' ? 1.2 : mapName === '海南' ? 3.5 : 1.3,
                center: mapName === '海南' ? [109.9, 19.2] : undefined,
                emphasis: {
                    label: {
                        show: true,
                        color: '#fff'
                    },
                    itemStyle: {
                        areaColor: '#48dbfb',
                        shadowBlur: 20,
                        shadowColor: 'rgba(72, 219, 251, 0.5)'
                    }
                },
                label: {
                    show: true,
                    color: '#a0a0a0',
                    fontSize: mapName === 'china' ? 12 : 11
                },
                itemStyle: {
                    normal: {
                        areaColor: '#1e2a4a',
                        borderColor: '#2a3b55',
                        borderWidth: 1
                    },
                    emphasis: {
                        areaColor: '#48dbfb'
                    }
                },
                data: []
            }
        ]
    };

    citiesWithData.forEach((city) => {
        option.series[0].data.push({
            name: city,
            value: 1,
            itemStyle: {
                areaColor: '#ff6b6b',
                borderColor: '#feca57',
                borderWidth: 2
            }
        });
    });

    chart.clear();
    chart.setOption(option);

    if (isDevMode() && mapName === '海南') {
        chart.off('georoam');
        chart.on('georoam', () => {
            const chartOption = chart.getOption();
            const currentZoom = chartOption.series[0].zoom;
            const currentCenter = chartOption.series[0].center;
            updateDebugPanel(currentZoom, currentCenter);
        });

        const initialOption = chart.getOption();
        updateDebugPanel(initialOption.series[0].zoom, initialOption.series[0].center);
    }

    const backBtn = document.getElementById('back-btn');
    backBtn.style.display = mapName === 'china' ? 'none' : 'flex';

    chart.off('click');
    chart.on('click', (params) => {
        console.log('Map clicked:', { mapName, paramsName: params.name });

        if (isLoading) {
            return;
        }

        if (mapName === 'china') {
            if (!directControlledCities.includes(params.name)) {
                loadProvinceMap(params.name);
            } else if (params.name) {
                showCityInfo(params.name);
            }
        } else if (params.name) {
            showCityInfo(params.name);
        }
    });
}

/**
 * 加载省份地图
 * @param {string} provinceName - 省份名称
 */
async function loadProvinceMap(provinceName) {
    try {
        showLoading(`正在加载 ${provinceName} 地图数据...`);

        const englishName = provinceNameMap[provinceName] || provinceName;
        const response = await fetch(`https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/json/province/${englishName}.json`);
        const provinceJson = await response.json();

        echarts.registerMap(provinceName, provinceJson);
        setCurrentMap(provinceName);

        initMap(provinceName);
        showProvinceVideos(provinceName);
    } catch (error) {
        console.error('加载省份地图失败:', error);
        // eslint-disable-next-line no-alert
        alert('加载省份地图失败，请检查网络连接');
    } finally {
        hideLoading();
    }
}

/**
 * 返回全国地图
 */
function backToChina() {
    setCurrentMap('china');
    hideCityInfo();
    initMap('china');
}

/**
 * 获取有数据的城市列表（根据地图级别）
 * @param {string} mapName - 地图名称
 * @returns {Array} 城市列表
 */
function getCitiesWithDataForMap(mapName) {
    if (mapName === 'china') {
        if (window.provinceData) {
            return Object.keys(window.provinceData);
        }
        if (typeof cityData !== 'undefined') {
            return Object.keys(cityData).filter((key) => !isCityKey(key));
        }
        return [];
    }

    let provinceCities = [];

    if (window.provinceData && window.provinceData[mapName]) {
        const videos = window.provinceData[mapName].videos || [];

        videos.forEach((video) => {
            if (video.city) {
                provinceCities.push(video.city);
            }
            if (video.autoCities && Array.isArray(video.autoCities)) {
                video.autoCities.forEach((city) => {
                    if (city) {
                        provinceCities.push(city);
                    }
                });
            }
        });

        provinceCities = [...new Set(provinceCities)].filter(Boolean);
    } else {
        provinceCities = [];
    }

    const allCityNames = [];
    provinceCities.forEach((city) => {
        allCityNames.push(city);
        allCityNames.push(city + '市');
        if (!city.endsWith('州')) {
            allCityNames.push(city + '州');
        }
    });

    return allCityNames;
}

/**
 * 显示加载提示
 * @param {string} message - 加载消息
 */
function showLoading(message = '加载中...') {
    isLoading = true;
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = loadingOverlay.querySelector('.loading-text');
    loadingText.textContent = message;
    loadingOverlay.style.display = 'flex';
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
    isLoading = false;
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'none';
}

export {
    loadMapData,
    initMap,
    loadProvinceMap,
    backToChina,
    getCitiesWithDataForMap,
    showLoading,
    hideLoading
};
