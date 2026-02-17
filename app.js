// 初始化地图
let chart = null;
let currentMap = 'china'; // 当前地图: 'china' 或省份名
let isLoading = false; // 加载状态

document.addEventListener('DOMContentLoaded', function() {
    loadMapData();
    setupEventListeners();
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
                roam: false,
                zoom: mapName === 'china' ? 1.2 : mapName === 'hainan' ? 3.5 : 1.3,
                center: mapName === 'hainan' ? [109.9, 19.2] : undefined,
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
