// 初始化地图
let chart = null;
let currentMap = 'china'; // 当前地图: 'china' 或省份名
let isLoading = false; // 加载状态

// 检测是否是开发环境
function isDevMode() {
    // 检查 URL 参数 ?debug=1
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === '1') {
        return true;
    }

    // 检查本地地址
    const hostname = window.location.hostname;
    const localHostnames = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (localHostnames.includes(hostname)) {
        return true;
    }

    // 检查内网 IP
    const ipPattern = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/;
    if (ipPattern.test(hostname)) {
        return true;
    }

    return false;
}

// 检查调试面板是否已关闭
function isDebugPanelClosed() {
    return localStorage.getItem('debugPanelClosed') === 'true';
}

// 切换调试面板显示/隐藏
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

// 创建重新打开调试面板的按钮
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

document.addEventListener('DOMContentLoaded', function() {
    loadMapData();
    setupEventListeners();

    // 如果是开发环境，创建调试面板和切换按钮
    if (isDevMode()) {
        const toggleBtn = createDebugToggleBtn();
        if (!isDebugPanelClosed()) {
            createDebugPanel();
        } else {
            toggleBtn.style.display = 'block';
        }
    }
});

// 初始化时检查数据
function checkData() {
    // data.js 通过 script 标签加载，检查全局变量
    if (typeof provinceData !== 'undefined') {
        window.provinceData = provinceData;
        console.log('✓ 使用省份数据模式');
        return 'province';
    } else if (typeof cityData !== 'undefined') {
        window.cityData = cityData;
        console.log('✓ 使用城市数据模式');
        return 'city';
    } else {
        console.warn('⚠️ 未找到数据文件');
        return null;
    }
}

// 初始化数据
const dataMode = checkData();

// 加载地图数据
async function loadMapData() {
    try {
        showLoading('正在加载中国地图...');
        const response = await fetch('https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/json/china.json');
        const chinaJson = await response.json();

        // 注册地图
        echarts.registerMap('china', chinaJson);

        // 初始化地图
        initMap();
    } catch (error) {
        console.error('加载地图数据失败:', error);
        alert('加载地图数据失败，请检查网络连接');
    } finally {
        hideLoading();
    }
}

// 获取数据类型（省份或城市）
function getDataType() {
    // 如果存在 provinceData，使用省份模式
    if (typeof provinceData !== 'undefined') {
        return 'province';
    }
    return 'city';
}

// 获取当前数据对象
function getCurrentData() {
    if (getDataType() === 'province') {
        return provinceData;
    }
    return cityData;
}

// 直辖市列表（不下钻）
const directControlledCities = ['北京', '天津', '上海', '重庆'];

// 获取有数据的城市列表（根据地图级别）
function getCitiesWithDataForMap(mapName) {
    if (mapName === 'china') {
        // 全国地图：返回所有有视频的省份（使用 provinceData）
        if (window.provinceData) {
            return Object.keys(window.provinceData);
        }
        // 回退到 cityData
        return Object.keys(cityData).filter(key => !isCityKey(key));
    }

    // 省级地图：返回该省份有视频的城市
    let provinceCities = [];

    if (window.provinceData && window.provinceData[mapName]) {
        // 从 provinceData 中提取该省份的所有城市
        const videos = window.provinceData[mapName].videos || [];

        // 收集所有视频的城市（包括 autoCities 中的多个城市）
        videos.forEach(video => {
            // 收集主城市
            if (video.city) {
                provinceCities.push(video.city);
            }
            // 收集 autoCities 中的所有城市（处理多城市视频）
            if (video.autoCities && Array.isArray(video.autoCities)) {
                video.autoCities.forEach(city => {
                    if (city) {
                        provinceCities.push(city);
                    }
                });
            }
        });

        // 去重
        provinceCities = [...new Set(provinceCities)].filter(Boolean);
    } else {
        // 回退到 cityData
        provinceCities = Object.keys(cityData).filter(key => isCityKey(key) && isInProvince(key, mapName));
    }

    // 生成带后缀的城市名称别名（用于地图高亮）
    const allCityNames = [];
    provinceCities.forEach(city => {
        // 添加原始城市名
        allCityNames.push(city);

        // 添加带"市"后缀的别名
        allCityNames.push(city + '市');

        // 添加带"州"后缀的别名（仅当城市名不以"州"结尾时）
        if (!city.endsWith('州')) {
            allCityNames.push(city + '州');
        }
    });

    return allCityNames;
}

// 判断是否是城市级别数据（不是省份数据）
function isCityKey(key) {
    // 省份级别的数据
    const provinceKeys = ['重庆', '四川', '广东', '江苏', '浙江', '上海', '北京', '湖南', '湖北'];
    return !provinceKeys.includes(key);
}

// 判断城市是否属于某个省份
function isInProvince(cityName, provinceName) {
    // 根据城市名称判断归属省份
    // 需要匹配带和不带后缀的城市名
    const provinceCityMap = {
        '四川': ['成都', '宜宾', '自贡', '泸州', '德阳', '绵阳', '南充', '乐山', '达州', '广安', '雅安'],
        '广东': ['广州', '深圳', '东莞', '佛山', '珠海', '惠州', '中山', '江门', '肇庆', '湛江', '茂名', '汕头', '潮州', '揭阳'],
        '江苏': ['南京', '苏州', '无锡', '常州', '南通', '扬州', '镇江', '泰州', '盐城', '淮安', '连云港', '宿迁'],
        '浙江': ['杭州', '宁波', '温州', '嘉兴', '绍兴', '金华', '台州', '湖州', '衢州', '丽水', '舟山'],
        '湖北': ['武汉', '宜昌', '襄阳', '荆州', '黄冈', '孝感', '黄石', '十堰', '鄂州', '荆门', '咸宁', '随州'],
        '湖南': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '益阳', '郴州', '永州', '怀化', '娄底', '张家界'],
        '吉林': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边']
    };

    const cities = provinceCityMap[provinceName] || [];

    // 检查城市名称是否匹配（处理带后缀和不带后缀的情况）
    return cities.some(city => {
        const baseName = cityName.replace(/市|州|区|地区|自治区|特别行政区/g, '');
        return city === cityName || cityName.startsWith(city) || baseName === city;
    });
}

// 初始化中国地图
function initMap(mapName = 'china') {
    const chartDom = document.getElementById('china-map');

    // 如果是首次初始化，创建 chart 实例
    if (!chart) {
        chart = echarts.init(chartDom);
    }

    // 获取有数据的城市（根据地图级别）
    const citiesWithData = getCitiesWithDataForMap(mapName);

    const option = {
        title: {
            text: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (params.name && citiesWithData.includes(params.name)) {
                    // 去掉"市"后缀显示更友好的名称（保留"州"）
                    let displayName = params.name;

                    // 去掉"市"后缀
                    displayName = displayName.replace(/市$/, '');

                    // 去掉"区"、"地区"等后缀
                    displayName = displayName.replace(/区|地区$/, '');

                    return `<span style="color: #48dbfb; font-weight: bold;">${displayName}</span><br/>点击查看视频`;
                } else {
                    return params.name || (mapName === 'china' ? '中国' : mapName);
                }
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
                roam: isDevMode() && mapName === '海南' ? true : false,
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

    // 为有视频的城市/省份设置高亮颜色
    citiesWithData.forEach(city => {
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

    // 如果是开发环境且是海南地图，添加 georoam 事件监听
    if (isDevMode() && mapName === '海南') {
        // 移除旧的监听器
        chart.off('georoam');

        // 监听拖动和缩放事件
        chart.on('georoam', function(params) {
            const option = chart.getOption();
            const currentZoom = option.series[0].zoom;
            const currentCenter = option.series[0].center;

            // 更新调试面板显示
            updateDebugPanel(currentZoom, currentCenter);
        });

        // 初始化调试面板显示
        const initialOption = chart.getOption();
        updateDebugPanel(initialOption.series[0].zoom, initialOption.series[0].center);
    }

    // 更新返回按钮显示状态
    const backBtn = document.getElementById('back-btn');
    backBtn.style.display = mapName === 'china' ? 'none' : 'flex';

    // 地图点击事件
    chart.off('click');
    chart.on('click', function(params) {
        // 如果正在加载，忽略点击
        if (isLoading) {
            return;
        }

        if (mapName === 'china') {
            // 全国地图点击
            if (!directControlledCities.includes(params.name)) {
                // 非直辖市可以下钻
                loadProvinceMap(params.name);
            } else if (params.name && citiesWithData.includes(params.name)) {
                // 直辖市或有视频的省份
                showCityInfo(params.name);
            }
        } else {
            // 省级地图点击
            if (params.name && citiesWithData.includes(params.name)) {
                showCityInfo(params.name);
            }
        }
    });
}

// 省份中文名到英文名的映射（用于 CDN）
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

// 获取省份的所有视频
function getVideosForProvince(provinceName) {
    // 使用 provinceData
    if (window.provinceData && window.provinceData[provinceName]) {
        return window.provinceData[provinceName].videos || [];
    }

    // 回退到 cityData
    const videos = [];

    // 遍历所有城市数据，找出属于该省份的城市
    Object.keys(cityData).forEach(key => {
        if (isCityKey(key) && isInProvince(key, provinceName)) {
            const cityVideos = cityData[key].videos;
            cityVideos.forEach(video => {
                videos.push({
                    ...video,
                    city: key
                });
            });
        }
    });

    // 按发布时间排序（最新的在前）
    return videos.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// 加载省份地图
async function loadProvinceMap(provinceName) {
    try {
        // 显示加载提示
        showLoading(`正在加载 ${provinceName} 地图数据...`);

        // 使用英文名加载地图数据
        const englishName = provinceNameMap[provinceName] || provinceName;
        const response = await fetch(`https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/json/province/${englishName}.json`);
        const provinceJson = await response.json();

        // 注册地图（使用中文名作为地图ID）
        echarts.registerMap(provinceName, provinceJson);
        currentMap = provinceName;

        // 初始化省份地图
        initMap(provinceName);

        // 显示该省份的所有视频
        showProvinceVideos(provinceName);
    } catch (error) {
        console.error('加载省份地图失败:', error);
        alert('加载省份地图失败，请检查网络连接');
    } finally {
        // 无论成功失败，都隐藏加载提示
        hideLoading();
    }
}

// 返回全国地图
function backToChina() {
    currentMap = 'china';
    hideCityInfo();
    initMap('china');
}

// 显示加载提示
function showLoading(message = '加载中...') {
    isLoading = true;
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = loadingOverlay.querySelector('.loading-text');
    loadingText.textContent = message;
    loadingOverlay.style.display = 'flex';
}

// 隐藏加载提示
function hideLoading() {
    isLoading = false;
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'none';
}

// 设置事件监听器
function setupEventListeners() {
    const closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener('click', hideCityInfo);

    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', backToChina);

    // 排行榜按钮事件
    const rankBtn = document.getElementById('rank-btn');
    if (rankBtn) {
        rankBtn.addEventListener('click', showRankPanel);
    }

    // 排行榜关闭按钮事件
    const rankCloseBtn = document.getElementById('rank-close-btn');
    if (rankCloseBtn) {
        rankCloseBtn.addEventListener('click', hideRankPanel);
    }

    // 点击排行榜面板背景关闭
    const rankPanel = document.getElementById('rank-panel');
    if (rankPanel) {
        rankPanel.addEventListener('click', function(e) {
            if (e.target === rankPanel) {
                hideRankPanel();
            }
        });
    }
}

// 显示省份的所有视频
function showProvinceVideos(provinceName) {
    const infoEmpty = document.querySelector('.info-empty');
    const infoContent = document.getElementById('info-content');
    const cityNameEl = document.getElementById('city-name');
    const videoList = document.getElementById('video-list');

    const videos = getVideosForProvince(provinceName);

    if (videos.length === 0) {
        return;
    }

    // 更新标题为省份名
    cityNameEl.textContent = provinceName;

    // 清空并生成视频列表
    videoList.innerHTML = '';
    videos.forEach((video, index) => {
        const videoItem = document.createElement('a');
        videoItem.className = 'video-item';
        videoItem.href = video.url;
        videoItem.target = '_blank';

        const videoTitle = document.createElement('div');
        videoTitle.className = 'video-title';
        videoTitle.innerHTML = `<strong>${index + 1}.</strong> ${video.city} - ${video.title}`;

        const videoMeta = document.createElement('div');
        videoMeta.className = 'video-meta';
        videoMeta.textContent = `发布时间: ${video.date}`;

        videoItem.appendChild(videoTitle);
        videoItem.appendChild(videoMeta);
        videoList.appendChild(videoItem);
    });

    // 显示内容
    infoEmpty.style.display = 'none';
    infoContent.style.display = 'block';

    // 添加动画效果
    infoContent.style.opacity = '0';
    infoContent.style.transform = 'translateX(20px)';

    setTimeout(() => {
        infoContent.style.transition = 'all 0.3s ease';
        infoContent.style.opacity = '1';
        infoContent.style.transform = 'translateX(0)';
    }, 10);
}

// 显示城市信息
function showCityInfo(cityName) {
    const infoEmpty = document.querySelector('.info-empty');
    const infoContent = document.getElementById('info-content');
    const cityNameEl = document.getElementById('city-name');
    const videoList = document.getElementById('video-list');

    // 处理城市名称（去掉"市"等后缀，但保留"州"）
    // 注意：很多城市名本身就包含"州"（如梅州、广州、潮州、苏州等），不应该去掉
    let displayName = cityName;

    // 去掉"市"后缀
    displayName = displayName.replace(/市$/, '');

    // 去掉"区"、"地区"、"自治区"、"特别行政区"等后缀
    displayName = displayName.replace(/区|地区|自治区|特别行政区$/, '');

    const videos = getVideosForCity(displayName);

    if (videos.length === 0) {
        return;
    }

    // 更新城市名称
    cityNameEl.textContent = cityName;

    // 清空并生成视频列表
    videoList.innerHTML = '';
    videos.forEach((video, index) => {
        const videoItem = document.createElement('a');
        videoItem.className = 'video-item';
        videoItem.href = video.url;
        videoItem.target = '_blank';

        const videoTitle = document.createElement('div');
        videoTitle.className = 'video-title';
        videoTitle.textContent = `${index + 1}. ${video.title}`;

        const videoMeta = document.createElement('div');
        videoMeta.className = 'video-meta';
        videoMeta.textContent = `发布时间: ${video.date}`;

        videoItem.appendChild(videoTitle);
        videoItem.appendChild(videoMeta);
        videoList.appendChild(videoItem);
    });

    // 显示内容
    infoEmpty.style.display = 'none';
    infoContent.style.display = 'block';

    // 添加动画效果
    infoContent.style.opacity = '0';
    infoContent.style.transform = 'translateX(20px)';

    setTimeout(() => {
        infoContent.style.transition = 'all 0.3s ease';
        infoContent.style.opacity = '1';
        infoContent.style.transform = 'translateX(0)';
    }, 10);
}

// 隐藏城市信息
function hideCityInfo() {
    const infoEmpty = document.querySelector('.info-empty');
    const infoContent = document.getElementById('info-content');

    infoContent.style.opacity = '0';
    infoContent.style.transform = 'translateX(20px)';

    setTimeout(() => {
        infoContent.style.display = 'none';
        infoEmpty.style.display = 'flex';
    }, 300);
}

// 获取城市的所有视频
function getVideosForCity(cityName) {
    const videos = [];

    // 从 provinceData 中查找该城市的视频
    if (window.provinceData) {
        Object.entries(window.provinceData).forEach(([province, provinceInfo]) => {
            const provinceVideos = provinceInfo.videos || [];
            provinceVideos.forEach(video => {
                // 检查主城市是否匹配
                if (video.city === cityName) {
                    videos.push(video);
                }
                // 检查 autoCities 中是否包含该城市（处理多城市视频）
                else if (video.autoCities && Array.isArray(video.autoCities) && video.autoCities.includes(cityName)) {
                    videos.push(video);
                }
            });
        });
    }

    // 回退到 cityData
    if (videos.length === 0 && cityData) {
        Object.keys(cityData).forEach(key => {
            const baseName = key.replace(/市|州|区|地区|自治区|特别行政区/g, '');
            if (baseName === cityName || key === cityName) {
                const cityVideos = cityData[key].videos;
                videos.push(...cityVideos);
            }
        });
    }

    // 按发布时间排序（最新的在前）
    return videos.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ====== 调试面板功能（仅在开发环境显示）======

// 创建调试面板
function createDebugPanel() {
    // 创建调试面板容器
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

    // 绑定按钮事件
    document.getElementById('debug-close-btn').addEventListener('click', toggleDebugPanel);
    document.getElementById('debug-zoom-in').addEventListener('click', () => adjustZoom(0.1));
    document.getElementById('debug-zoom-out').addEventListener('click', () => adjustZoom(-0.1));
    document.getElementById('debug-reset').addEventListener('click', () => resetMap());
    document.getElementById('debug-move-up').addEventListener('click', () => moveMap(0, 0.5));
    document.getElementById('debug-move-down').addEventListener('click', () => moveMap(0, -0.5));
    document.getElementById('debug-move-left').addEventListener('click', () => moveMap(-0.5, 0));
    document.getElementById('debug-move-right').addEventListener('click', () => moveMap(0.5, 0));
}

// 更新调试面板显示
function updateDebugPanel(zoom, center) {
    const zoomEl = document.getElementById('debug-zoom');
    const centerEl = document.getElementById('debug-center');
    const codeEl = document.getElementById('debug-code');

    if (zoomEl) zoomEl.textContent = zoom.toFixed(2);
    if (centerEl) centerEl.textContent = `[${center[0].toFixed(2)}, ${center[1].toFixed(2)}]`;
    if (codeEl) codeEl.textContent = `zoom: ${zoom.toFixed(2)}, center: [${center[0].toFixed(2)}, ${center[1].toFixed(2)}]`;
}

// 调整缩放
function adjustZoom(delta) {
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

// 重置地图
function resetMap() {
    if (!chart || currentMap !== '海南') return;

    chart.setOption({
        series: [{
            zoom: 3.5,
            center: [109.9, 19.2]
        }]
    });
}

// 移动地图
function moveMap(deltaX, deltaY) {
    if (!chart || currentMap !== '海南') return;

    const option = chart.getOption();
    const currentCenter = option.series[0].center;
    const currentZoom = option.series[0].zoom;

    // 根据缩放级别调整移动距离（缩放越大，移动距离越小）
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

// ====== 省份覆盖率排行榜功能 ======

// 省份地区总数映射表（不含直辖市）
const provinceCityCount = {
    '河北': 11, // 石家庄、唐山、秦皇岛、邯郸、邢台、保定、张家口、承德、沧州、廊坊、衡水
    '山西': 11, // 太原、大同、阳泉、长治、晋城、朔州、晋中、运城、忻州、临汾、吕梁
    '内蒙古': 12, // 呼和浩特、包头、乌海、赤峰、通辽、鄂尔多斯、呼伦贝尔、巴彦淖尔、乌兰察布、兴安盟、锡林郭勒盟、阿拉善盟
    '辽宁': 14, // 沈阳、大连、鞍山、抚顺、本溪、丹东、锦州、营口、阜新、辽阳、盘锦、铁岭、朝阳、葫芦岛
    '吉林': 9,  // 长春、吉林、四平、辽源、通化、白山、松原、白城、延边
    '黑龙江': 13, // 哈尔滨、齐齐哈尔、鸡西、鹤岗、双鸭山、大庆、伊春、佳木斯、七台河、牡丹江、黑河、绥化、大兴安岭
    '江苏': 13, // 南京、无锡、徐州、常州、苏州、南通、连云港、淮安、盐城、扬州、镇江、泰州、宿迁
    '浙江': 11, // 杭州、宁波、温州、嘉兴、湖州、绍兴、金华、衢州、舟山、台州、丽水
    '安徽': 16, // 合肥、芜湖、蚌埠、淮南、马鞍山、淮北、铜陵、安庆、黄山、滁州、阜阳、宿州、六安、亳州、池州、宣城
    '福建': 9,  // 福州、厦门、莆田、三明、泉州、漳州、南平、龙岩、宁德
    '江西': 11, // 南昌、景德镇、萍乡、九江、新余、鹰潭、赣州、吉安、宜春、抚州、上饶
    '山东': 16, // 济南、青岛、淄博、枣庄、东营、烟台、潍坊、济宁、泰安、威海、日照、临沂、德州、聊城、滨州、菏泽
    '河南': 17, // 郑州、开封、洛阳、平顶山、安阳、鹤壁、新乡、焦作、濮阳、许昌、漯河、三门峡、南阳、商丘、信阳、周口、驻马店
    '湖北': 13, // 武汉、黄石、十堰、宜昌、襄阳、鄂州、荆门、孝感、荆州、黄冈、咸宁、随州、恩施
    '湖南': 14, // 长沙、株洲、湘潭、衡阳、邵阳、岳阳、常德、张家界、益阳、郴州、永州、怀化、娄底、湘西
    '广东': 21, // 广州、韶关、深圳、珠海、汕头、佛山、江门、湛江、茂名、肇庆、惠州、梅州、汕尾、河源、阳江、清远、东莞、中山、潮州、揭阳、云浮
    '广西': 14, // 南宁、柳州、桂林、梧州、北海、防城港、钦州、贵港、玉林、百色、贺州、河池、来宾、崇左
    '海南': 19, // 海口、三亚、三沙、儋州、五指山、文昌、琼海、万宁、东方、定安、屯昌、澄迈、临高、白沙、昌江、乐东、陵水、保亭、琼中
    '四川': 21, // 成都、自贡、攀枝花、泸州、德阳、绵阳、广元、遂宁、内江、乐山、南充、眉山、宜宾、广安、达州、雅安、巴中、资阳、阿坝、甘孜、凉山
    '贵州': 9,  // 贵阳、六盘水、遵义、安顺、毕节、铜仁、黔西南、黔东南、黔南
    '云南': 16, // 昆明、曲靖、玉溪、保山、昭通、丽江、普洱、临沧、楚雄、红河、文山、西双版纳、大理、德宏、怒江、迪庆
    '西藏': 7,  // 拉萨、日喀则、昌都、林芝、山南、那曲、阿里
    '陕西': 10, // 西安、铜川、宝鸡、咸阳、渭南、延安、汉中、榆林、安康、商洛
    '甘肃': 14, // 兰州、嘉峪关、金昌、白银、天水、武威、张掖、平凉、酒泉、庆阳、定西、陇南、临夏、甘南
    '青海': 8,  // 西宁、海东、海北、黄南、海南、果洛、玉树、海西
    '宁夏': 5,  // 银川、石嘴山、吴忠、固原、中卫
    '新疆': 14, // 乌鲁木齐、克拉玛依、吐鲁番、哈密、昌吉、博尔塔拉、巴音郭楞、阿克苏、克孜勒苏、喀什、和田、伊犁、塔城、阿勒泰
};

// 计算省份已覆盖的地区数量
function getCoveredCitiesCount(provinceName) {
    if (!window.provinceData || !window.provinceData[provinceName]) {
        return 0;
    }

    const videos = window.provinceData[provinceName].videos || [];
    const coveredCities = new Set();

    // 省份城市映射表（用于验证城市是否属于该省份）
    const provinceCitiesMap = {
        '河北': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
        '山西': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
        '内蒙古': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
        '辽宁': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
        '吉林': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边'],
        '黑龙江': ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭'],
        '江苏': ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'],
        '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
        '安徽': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城'],
        '福建': ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'],
        '江西': ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
        '山东': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽'],
        '河南': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店'],
        '湖北': ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施'],
        '湖南': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西'],
        '广东': ['广州', '韶关', '深圳', '珠海', '汕头', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
        '广西': ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
        '海南': ['海口', '三亚', '三沙', '儋州', '五指山', '文昌', '琼海', '万宁', '东方', '定安', '屯昌', '澄迈', '临高', '白沙', '昌江', '乐东', '陵水', '保亭', '琼中'],
        '四川': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山'],
        '贵州': ['贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南'],
        '云南': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆'],
        '西藏': ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里'],
        '陕西': ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
        '甘肃': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '临夏', '甘南'],
        '青海': ['西宁', '海东', '海北', '黄南', '海南', '果洛', '玉树', '海西'],
        '宁夏': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
        '新疆': ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏', '喀什', '和田', '伊犁', '塔城', '阿勒泰'],
    };

    const validCities = provinceCitiesMap[provinceName] || [];

    videos.forEach(video => {
        // 收集所有城市名称
        const citiesToAdd = [];

        // 添加主城市
        if (video.city) {
            citiesToAdd.push(video.city);
        }
        // 添加 autoCities 中的所有城市（处理多城市视频）
        if (video.autoCities && Array.isArray(video.autoCities)) {
            video.autoCities.forEach(city => {
                if (city) {
                    citiesToAdd.push(city);
                }
            });
        }

        // 归一化城市名称并验证是否属于该省份
        citiesToAdd.forEach(cityName => {
            // 去掉"市"后缀（保留"州"，因为很多城市名本身就带"州"）
            let normalizedName = cityName.replace(/市$/, '');

            // 检查是否在有效城市列表中
            if (validCities.includes(normalizedName)) {
                coveredCities.add(normalizedName);
            }
        });
    });

    return coveredCities.size;
}

// 计算所有省份的覆盖率
function calculateProvinceCoverage() {
    const results = [];

    for (const province in window.provinceData) {
        // 跳过直辖市
        if (directControlledCities.includes(province)) {
            continue;
        }

        // 获取该省份的总地区数
        const totalCount = provinceCityCount[province];
        if (!totalCount) {
            continue;
        }

        // 获取已覆盖的地区数
        const coveredCount = getCoveredCitiesCount(province);

        // 计算覆盖率
        const coverage = (coveredCount / totalCount) * 100;

        results.push({
            province: province,
            coveredCount: coveredCount,
            totalCount: totalCount,
            coverage: coverage
        });
    }

    // 按覆盖率降序排序
    results.sort((a, b) => b.coverage - a.coverage);

    return results;
}

// 当前排行榜视图类型：'province' 或 'region'
let currentRankView = 'province';

// 地区分组映射
const regionGroups = {
    '东北': ['辽宁', '吉林', '黑龙江'],
    '华北': ['北京', '天津', '河北', '山西', '内蒙古'],
    '华东': ['上海', '江苏', '浙江', '安徽', '福建', '江西', '山东'],
    '华南': ['广东', '广西', '海南'],
    '华中': ['河南', '湖北', '湖南'],
    '西南': ['重庆', '四川', '贵州', '云南', '西藏'],
    '西北': ['陕西', '甘肃', '青海', '宁夏', '新疆']
};

// 计算地区覆盖率
function calculateRegionCoverage() {
    const results = [];

    for (const regionName in regionGroups) {
        const provinces = regionGroups[regionName];
        let regionTotalCount = 0;
        let regionCoveredCount = 0;
        const provinceDetails = [];

        provinces.forEach(provinceName => {
            // 跳过直辖市（在地区统计中，直辖市也算在内）
            // 获取该省份的总地区数
            const totalCount = provinceCityCount[provinceName];
            if (!totalCount) {
                return;
            }

            const coveredCount = getCoveredCitiesCount(provinceName);
            const coverage = (coveredCount / totalCount) * 100;

            regionTotalCount += totalCount;
            regionCoveredCount += coveredCount;

            provinceDetails.push({
                province: provinceName,
                coveredCount: coveredCount,
                totalCount: totalCount,
                coverage: coverage
            });
        });

        // 计算地区整体覆盖率
        const regionCoverage = regionTotalCount > 0 ? (regionCoveredCount / regionTotalCount) * 100 : 0;

        results.push({
            region: regionName,
            coveredCount: regionCoveredCount,
            totalCount: regionTotalCount,
            coverage: regionCoverage,
            provinces: provinceDetails
        });
    }

    // 按覆盖率降序排序
    results.sort((a, b) => b.coverage - a.coverage);

    return results;
}

// 生成排行榜 HTML
function generateRankListHTML() {
    const rankListEl = document.getElementById('rank-list');

    if (!rankListEl) return;

    if (currentRankView === 'province') {
        const results = calculateProvinceCoverage();

        if (results.length === 0) {
            rankListEl.innerHTML = '<p style="text-align: center; color: #a0a0a0;">暂无数据</p>';
            return;
        }

        rankListEl.innerHTML = results.map((item, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const coveragePercent = item.coverage.toFixed(1);

            return `
                <div class="rank-item ${rankClass}">
                    <div class="rank-number">${rank}</div>
                    <div class="rank-name">${item.province}</div>
                    <div class="rank-stats">
                        <span class="rank-coverage">${coveragePercent}%</span>
                        <span class="rank-detail">${item.coveredCount}/${item.totalCount} 地区</span>
                    </div>
                    <div class="rank-bar-bg" style="width: ${item.coverage}%"></div>
                </div>
            `;
        }).join('');
    } else {
        // 按地区显示
        const results = calculateRegionCoverage();

        if (results.length === 0) {
            rankListEl.innerHTML = '<p style="text-align: center; color: #a0a0a0;">暂无数据</p>';
            return;
        }

        rankListEl.innerHTML = results.map((item, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const coveragePercent = item.coverage.toFixed(1);

            // 生成省份详情
            const provinceDetailsHTML = item.provinces.map(p => `
                <div class="region-province-item">
                    <span class="region-province-name">${p.province}</span>
                    <span class="region-province-stats">${p.coverage.toFixed(1)}%</span>
                </div>
            `).join('');

            return `
                <div class="rank-item ${rankClass} region-rank-item">
                    <div class="rank-number">${rank}</div>
                    <div class="rank-content-wrapper">
                        <div class="rank-header">
                            <div class="rank-name">${item.region}</div>
                            <div class="rank-stats">
                                <span class="rank-coverage">${coveragePercent}%</span>
                                <span class="rank-detail">${item.coveredCount}/${item.totalCount} 地区</span>
                            </div>
                        </div>
                        <div class="region-provinces">${provinceDetailsHTML}</div>
                    </div>
                    <div class="rank-bar-bg" style="width: ${item.coverage}%"></div>
                </div>
            `;
        }).join('');
    }
}

// 显示排行榜面板
function showRankPanel() {
    const rankPanel = document.getElementById('rank-panel');
    if (rankPanel) {
        generateRankListHTML();
        rankPanel.style.display = 'flex';

        // 设置切换按钮事件
        const toggleBtns = document.querySelectorAll('.rank-toggle-btn');
        const rankDesc = document.getElementById('rank-desc');

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.dataset.type;

                // 更新按钮状态
                toggleBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // 更新视图类型
                currentRankView = type;

                // 更新描述
                if (type === 'province') {
                    rankDesc.textContent = '统计各省份已制作地区数占总地区数的比例（不含直辖市）';
                } else {
                    rankDesc.textContent = '统计各地区已制作地区数占总地区数的比例';
                }

                // 重新生成排行榜并重置滚动条
                generateRankListHTML();
                const rankListEl = document.getElementById('rank-list');
                if (rankListEl) {
                    rankListEl.scrollTop = 0;
                }
            });
        });
    }
}

// 隐藏排行榜面板
function hideRankPanel() {
    const rankPanel = document.getElementById('rank-panel');
    if (rankPanel) {
        rankPanel.style.display = 'none';
    }
}
