// 数据工具模块 - 处理数据相关功能

/**
 * 初始化时检查数据
 * @returns {string|null} 数据模式
 */
function checkData() {
    if (typeof provinceData !== 'undefined') {
        window.provinceData = provinceData;
        console.log('✓ 使用省份数据模式');
        return 'province';
    }
    if (typeof cityData !== 'undefined') {
        window.cityData = cityData;
        console.log('✓ 使用城市数据模式');
        return 'city';
    }
    console.warn('⚠️ 未找到数据文件');
    return null;
}

/**
 * 获取数据类型（省份或城市）
 * @returns {string} 数据类型
 */
function getDataType() {
    if (typeof provinceData !== 'undefined') {
        return 'province';
    }
    return 'city';
}

/**
 * 获取当前数据对象
 * @returns {Object} 数据对象
 */
function getCurrentData() {
    if (getDataType() === 'province') {
        return provinceData;
    }
    return cityData;
}

/**
 * 判断是否是城市级别数据（不是省份数据）
 * @param {string} key - 数据键名
 * @returns {boolean} 是否是城市级别数据
 */
function isCityKey(key) {
    const provinceKeys = ['重庆', '四川', '广东', '江苏', '浙江', '上海', '北京', '湖南', '湖北'];
    return !provinceKeys.includes(key);
}

/**
 * 判断城市是否属于某个省份
 * @param {string} cityName - 城市名称
 * @param {string} provinceName - 省份名称
 * @returns {boolean} 城市是否属于该省份
 */
function isInProvince(cityName, provinceName) {
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

    return cities.some((city) => {
        const baseName = cityName.replace(/市|州|区|地区|自治区|特别行政区/g, '');
        return city === cityName || cityName.startsWith(city) || baseName === city;
    });
}

/**
 * 获取省份的所有视频
 * @param {string} provinceName - 省份名称
 * @returns {Array} 视频列表
 */
function getVideosForProvince(provinceName) {
    if (window.provinceData && window.provinceData[provinceName]) {
        return window.provinceData[provinceName].videos || [];
    }

    if (typeof cityData !== 'undefined') {
        const videos = [];

        Object.keys(cityData).forEach((key) => {
            if (isCityKey(key) && isInProvince(key, provinceName)) {
                const cityVideos = cityData[key].videos;
                cityVideos.forEach((video) => {
                    videos.push({
                        ...video,
                        city: key
                    });
                });
            }
        });

        return videos.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return [];
}

/**
 * 获取城市的所有视频
 * @param {string} cityName - 城市名称
 * @returns {Array} 视频列表
 */
function getVideosForCity(cityName) {
    const videos = [];

    if (window.provinceData) {
        Object.entries(window.provinceData).forEach(([, provinceInfo]) => {
            const provinceVideos = provinceInfo.videos || [];
            provinceVideos.forEach((video) => {
                if (video.city === cityName) {
                    videos.push(video);
                } else if (video.autoCities && Array.isArray(video.autoCities) && video.autoCities.includes(cityName)) {
                    videos.push(video);
                }
            });
        });
    }

    if (videos.length === 0 && typeof cityData !== 'undefined' && cityData) {
        Object.keys(cityData).forEach((key) => {
            const baseName = key.replace(/市|州|区|地区|自治区|特别行政区/g, '');
            if (baseName === cityName || key === cityName) {
                const cityVideos = cityData[key].videos;
                videos.push(...cityVideos);
            }
        });
    }

    return videos.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export {
    checkData,
    getDataType,
    getCurrentData,
    isCityKey,
    isInProvince,
    getVideosForProvince,
    getVideosForCity
};
