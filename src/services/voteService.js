// 投票服务模块 - 处理投票相关功能

import { initVoteServiceDeps, showVoteUI, hideVoteConfirmDialog } from './uiService.js';

const VOTE_COOLDOWN_MINUTES = 10;
const VOTE_STORAGE_KEY = 'voteHistory';
const VOTE_API_URL = '/api/votes';

let currentTerminalId = null;

let voteData = {};

let currentRankView = 'province';

const regionGroups = {
    '东北': ['辽宁', '吉林', '黑龙江'],
    '华北': ['北京', '天津', '河北', '山西', '内蒙古'],
    '华东': ['上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '台湾'],
    '华南': ['广东', '广西', '海南'],
    '华中': ['河南', '湖北', '湖南'],
    '西南': ['重庆', '四川', '贵州', '云南', '西藏'],
    '西北': ['陕西', '甘肃', '青海', '宁夏', '新疆']
};

const provinceCityCount = {
    '河北': 11,
    '山西': 11,
    '内蒙古': 12,
    '辽宁': 14,
    '吉林': 9,
    '黑龙江': 13,
    '江苏': 13,
    '浙江': 11,
    '安徽': 16,
    '福建': 9,
    '江西': 11,
    '山东': 16,
    '河南': 17,
    '湖北': 13,
    '湖南': 14,
    '广东': 21,
    '广西': 14,
    '海南': 19,
    '四川': 21,
    '贵州': 9,
    '云南': 16,
    '西藏': 7,
    '陕西': 10,
    '甘肃': 14,
    '青海': 8,
    '宁夏': 5,
    '新疆': 14,
    '台湾': 1
};

const directControlledCities = ['北京', '天津', '上海', '重庆'];

/**
 * 初始化投票服务
 */
function initVoteService() {
    initVoteServiceDeps(checkCanVote, voteData, generateRankListHTML);
}

/**
 * 从服务器加载投票数据
 */
async function loadVotesFromServer() {
    try {
        const response = await fetch(VOTE_API_URL);
        if (response.ok) {
            voteData = await response.json();
            console.log('✓ 投票数据已加载:', voteData);
        }
    } catch (error) {
        console.error('加载投票数据失败:', error);
        const localVotes = localStorage.getItem('localVoteData');
        if (localVotes) {
            voteData = JSON.parse(localVotes);
            console.log('✓ 使用本地缓存的投票数据');
        }
    }
}

/**
 * 检查是否可以投票
 * @returns {boolean} 是否可以投票
 */
function checkCanVote() {
    const voteHistory = localStorage.getItem(VOTE_STORAGE_KEY);
    if (voteHistory) {
        const history = JSON.parse(voteHistory);
        const lastVoteTime = history.lastVoteTime;
        const now = new Date().getTime();
        const cooldownMs = VOTE_COOLDOWN_MINUTES * 60 * 1000;
        
        if (now - lastVoteTime < cooldownMs) {
            return false;
        }
    }
    return true;
}

/**
 * 处理投票
 * @param {string} cityName - 城市名称
 */
async function handleVote(cityName) {
    if (!checkCanVote()) {
        alert('投票过于频繁，请稍后再试');
        return;
    }

    try {
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ province: cityName })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('投票成功:', result);
            
            if (!voteData[cityName]) {
                voteData[cityName] = { votes: 0, description: '' };
            }
            voteData[cityName].votes = result.votes;
            
            const voteHistory = {
                lastVoteTime: new Date().getTime()
            };
            localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(voteHistory));
            
            localStorage.setItem('localVoteData', JSON.stringify(voteData));
            
            alert('投票成功！');
        } else {
            console.error('投票失败:', response.status);
            alert('投票失败，请稍后再试');
        }
    } catch (error) {
        console.error('投票请求失败:', error);
        alert('网络错误，请稍后再试');
    }
}

/**
 * 确认投票
 */
async function confirmVote() {
    const modal = document.getElementById('vote-confirm-modal');
    const cityName = modal?.dataset.city;

    if (!cityName) return;

    await handleVote(cityName);

    hideVoteConfirmDialog();

    const infoContent = document.getElementById('info-content');
    const cityNameEl = document.getElementById('city-name');
    const videoList = document.getElementById('video-list');
    const infoEmpty = document.querySelector('.info-empty');

    if (infoContent && cityNameEl && videoList && infoEmpty) {
        showVoteUI(cityName, cityNameEl, videoList, infoEmpty, infoContent);
    }

    const rankPanel = document.getElementById('rank-panel');
    if (rankPanel && rankPanel.style.display !== 'none') {
        generateRankListHTML();
    }
}

/**
 * 计算省份已覆盖的地区数量
 * @param {string} provinceName - 省份名称
 * @returns {number} 已覆盖的地区数量
 */
function getCoveredCitiesCount(provinceName) {
    if (!window.provinceData || !window.provinceData[provinceName]) {
        return 0;
    }

    const videos = window.provinceData[provinceName].videos || [];
    const coveredCities = new Set();

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
        '台湾': ['台湾']
    };

    const validCities = provinceCitiesMap[provinceName] || [];

    videos.forEach(video => {
        const citiesToAdd = [];

        if (video.city) {
            citiesToAdd.push(video.city);
        }
        if (video.autoCities && Array.isArray(video.autoCities)) {
            video.autoCities.forEach(city => {
                if (city) {
                    citiesToAdd.push(city);
                }
            });
        }

        citiesToAdd.forEach(cityName => {
            let normalizedName = cityName.replace(/市$/, '');
            if (validCities.includes(normalizedName)) {
                coveredCities.add(normalizedName);
            }
        });
    });

    return coveredCities.size;
}

/**
 * 计算所有省份的覆盖率
 * @returns {Array} 省份覆盖率列表
 */
function calculateProvinceCoverage() {
    const results = [];

    for (const province in window.provinceData) {
        if (directControlledCities.includes(province)) {
            continue;
        }

        const totalCount = provinceCityCount[province];
        if (!totalCount) {
            continue;
        }

        const coveredCount = getCoveredCitiesCount(province);
        const coverage = (coveredCount / totalCount) * 100;

        results.push({
            province: province,
            coveredCount: coveredCount,
            totalCount: totalCount,
            coverage: coverage
        });
    }

    results.sort((a, b) => b.coverage - a.coverage);

    return results;
}

/**
 * 计算地区覆盖率
 * @returns {Array} 地区覆盖率列表
 */
function calculateRegionCoverage() {
    const results = [];

    for (const regionName in regionGroups) {
        const provinces = regionGroups[regionName];
        let regionTotalCount = 0;
        let regionCoveredCount = 0;
        const provinceDetails = [];

        provinces.forEach(provinceName => {
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

        const regionCoverage = regionTotalCount > 0 ? (regionCoveredCount / regionTotalCount) * 100 : 0;

        results.push({
            region: regionName,
            coveredCount: regionCoveredCount,
            totalCount: regionTotalCount,
            coverage: regionCoverage,
            provinces: provinceDetails
        });
    }

    results.sort((a, b) => b.coverage - a.coverage);

    return results;
}

/**
 * 生成排行榜 HTML
 */
function generateRankListHTML() {
    const rankListEl = document.getElementById('rank-list');
    const rankDescEl = document.getElementById('rank-desc');

    if (!rankListEl) return;

    if (currentRankView === 'province') {
        if (rankDescEl) {
            rankDescEl.textContent = '统计各省份已制作地区数占总地区数的比例（不含直辖市）';
        }
        
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
    } else if (currentRankView === 'region') {
        if (rankDescEl) {
            rankDescEl.textContent = '统计各地区（华北、华东等）已制作地区数占总地区数的比例';
        }
        
        const results = calculateRegionCoverage();

        if (results.length === 0) {
            rankListEl.innerHTML = '<p style="text-align: center; color: #a0a0a0;">暂无数据</p>';
            return;
        }

        rankListEl.innerHTML = results.map((item, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const coveragePercent = item.coverage.toFixed(1);

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
    } else if (currentRankView === 'expected') {
        if (rankDescEl) {
            rankDescEl.textContent = '用户最期待UP主更新的地区排名（点击地图上未覆盖区域可投票）';
        }
        
        const results = calculateExpectedRank();

        if (results.length === 0) {
            rankListEl.innerHTML = '<p style="text-align: center; color: #a0a0a0;">暂无投票数据，快去点击地图上未覆盖的地区投票吧！</p>';
            return;
        }

        rankListEl.innerHTML = results.map((item, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const maxVotes = results[0].votes || 1;
            const percentage = (item.votes / maxVotes) * 100;

            return `
                <div class="rank-item ${rankClass}">
                    <div class="rank-number">${rank}</div>
                    <div class="rank-name">${item.city}</div>
                    <div class="rank-stats">
                        <span class="rank-coverage">${item.votes} 票</span>
                    </div>
                    <div class="rank-bar-bg" style="width: ${percentage}%"></div>
                </div>
            `;
        }).join('');
    }
}

/**
 * 计算最期待榜（按投票数排序）
 * @returns {Array} 最期待榜列表
 */
function calculateExpectedRank() {
    const results = [];

    for (const cityName in voteData) {
        const cityData = voteData[cityName];
        if (cityData && cityData.votes && cityData.votes > 0) {
            results.push({
                city: cityName,
                votes: cityData.votes
            });
        }
    }

    results.sort((a, b) => b.votes - a.votes);

    return results.slice(0, 20);
}

/**
 * 设置当前排行榜视图类型
 * @param {string} viewType - 视图类型: 'province', 'region', 'expected'
 */
function setRankView(viewType) {
    currentRankView = viewType;
}

export {
    loadVotesFromServer,
    checkCanVote,
    handleVote,
    confirmVote,
    generateRankListHTML,
    voteData,
    currentRankView,
    setRankView,
    initVoteService
};
