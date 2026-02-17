/**
 * B站数据获取脚本 (Node.js 版本)
 * 运行方式: node scripts/fetch-data.js
 * 输出: data/data.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置参数
const CONFIG = {
    mid: 238365787,           // UP主ID
    seasonId: 475111,          // 合集ID
    pageSize: 30,               // 每页数量
    maxPages: 50                // 最大获取页数（防止无限循环）
};

// HTTP GET 请求
function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// 获取所有页面的数据
async function fetchAllPages() {
    const allVideos = [];
    let page = 1;

    console.log('开始获取合集数据...\n');

    while (page <= CONFIG.maxPages) {
        try {
            const url = `https://api.bilibili.com/x/polymer/web-space/seasons_archives_list` +
                `?mid=${CONFIG.mid}` +
                `&season_id=${CONFIG.seasonId}` +
                `&sort_reverse=false` +
                `&page_size=${CONFIG.pageSize}` +
                `&page_num=${page}` +
                `&web_location=333.1387`;

            const data = await httpsGet(url);

            // 检查是否成功
            if (data.code === 0 && data.data) {
                const archives = data.data.archives || [];

                // 优化：检查本次获取的视频数量
                if (archives.length < CONFIG.pageSize) {
                    console.log(`\n✓ 第 ${page} 页获取 ${archives.length} 个视频`);
                    console.log(`  → 本次获取数量少于 ${CONFIG.pageSize}，说明已查完`);

                    // 添加最后一页的所有视频后停止
                    const pageVideos = archives.map(archive => ({
                        title: archive.title,
                        bvid: archive.bvid,
                        aid: archive.aid,
                        ctime: archive.ctime,
                        pubtime: archive.pubtime,
                        view: archive.stat ? archive.stat.view || 0 : 0,
                        danmaku: archive.stat ? archive.stat.danmaku || 0 : 0,
                        city: parseCityFromTitle(archive.title)
                    }));

                    allVideos.push(...pageVideos);

                    // 检查是否还有更多数据（通过 total 字段）
                    if (data.data.page && data.data.page.total) {
                        const total = data.data.page.total || 0;
                        if (total > allVideos.length) {
                            console.log(`\n  → 还有 ${total - allVideos.length} 个视频未获取`);
                            console.log(`  → 总视频数: ${total}`);
                            page++;
                            continue;
                        }
                    }

                    console.log(`\n✓ 数据获取完成`);
                    break;
                } else {
                    console.log(`\n✓ 第 ${page} 页获取成功，共 ${archives.length} 个视频`);
                    const pageVideos = archives.map(archive => ({
                        title: archive.title,
                        bvid: archive.bvid,
                        aid: archive.aid,
                        ctime: archive.ctime,
                        pubtime: archive.pubtime,
                        view: archive.stat ? archive.stat.view || 0 : 0,
                        danmaku: archive.stat ? archive.stat.danmaku || 0 : 0,
                        city: parseCityFromTitle(archive.title)
                    }));

                    allVideos.push(...pageVideos);

                    // 检查是否还有下一页
                    if (data.data.page && data.data.page.total && data.data.page.total <= allVideos.length) {
                        break;
                    }

                    page++;
                }
            } else {
                console.error('API 返回错误:', data);
                if (data.message) {
                    console.error('错误信息:', data.message);
                }
                break;
            }
        } catch (error) {
            console.error(`获取第 ${page} 页失败:`, error.message);
            break;
        }
    }

    console.log(`\n总共获取 ${allVideos.length} 个视频`);
    return allVideos;
}

// 从标题中解析城市信息
function parseCityFromTitle(title) {
    // 尝试多种标题格式

    // 格式1: 快递里的中国 [城市名]: [描述]
    // 例如: 快递里的中国 成都：蓉城的快递江湖
    let match = title.match(/快递里的中国\s+([^：:]+)[：:](.*)/);
    if (match) {
        return match[1].trim();
    }

    // 格式2: [城市名]快递里的中国[可选文字]
    // 例如: 成都快递里的中国：蓉城的快递江湖
    match = title.match(/^([^快递]+)快递里的中国/);
    if (match) {
        return match[1].trim();
    }

    // 格式3: 包含城市名的通用匹配
    // 完整的中国城市列表（地级市+县级市）
    const commonCities = [
        // 直辖市
        '北京', '上海', '天津', '重庆',
        // 省会城市
        '广州', '深圳', '成都', '杭州', '南京', '武汉', '长沙', '西安', '郑州',
        '石家庄', '太原', '合肥', '南昌', '福州', '厦门', '南宁', '海口', '昆明', '贵阳',
        '拉萨', '兰州', '西宁', '银川', '乌鲁木齐', '呼和浩特', '长春', '沈阳', '哈尔滨', '济南',
        // 河北
        '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水',
        '辛集', '晋州', '新乐', '遵化', '迁安', '武安', '南宫', '沙河', '涿州', '定州',
        '安国', '高碑店', '泊头', '任丘', '黄骅', '河间', '霸州', '三河', '深州',
        // 山西
        '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁',
        '古交', '高平', '介休', '永济', '河津', '原平', '侯马', '霍州', '孝义', '汾阳',
        // 内蒙古
        '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布',
        '满洲里', '二连浩特', '乌兰浩特', '阿尔山', '锡林浩特', '巴彦浩特', '丰镇', '牙克石',
        // 辽宁
        '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛',
        '瓦房店', '海城', '东港', '凤城', '凌海', '北镇', '大石桥', '盖州', '灯塔', '调兵山', '开原',
        // 吉林
        '吉林', '四平', '辽源', '通化', '白山', '松原', '白城',
        '公主岭', '梅河口', '集安', '临江', '大安', '洮南', '珲春', '龙井', '和龙', '敦化',
        // 黑龙江
        '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化',
        '绥芬河', '同江', '虎林', '密山', '富锦', '漠河', '铁力', '尚志', '五常', '海伦', '肇东',
        // 江苏
        '苏州', '无锡', '常州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁',
        '江阴', '宜兴', '新沂', '邳州', '溧阳', '金坛', '常熟', '张家港', '昆山', '太仓', '启东', '如皋',
        // 浙江
        '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水',
        '建德', '临安', '余姚', '慈溪', '瑞安', '乐清', '海宁', '平湖', '桐乡', '诸暨', '嵊州',
        // 安徽
        '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城',
        '界首', '桐城', '宁国', '天长', '明光',
        // 福建
        '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德',
        '福清', '邵武', '武夷山', '建瓯', '永安', '石狮', '晋江', '南安', '龙海', '漳平',
        // 江西
        '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶',
        '瑞昌', '乐平', '瑞金', '德兴', '贵溪', '樟树', '丰城', '高安',
        // 山东
        '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽',
        '胶州', '即墨', '平度', '莱西', '滕州', '龙口', '莱阳', '莱州', '招远', '栖霞', '青州', '诸城', '寿光',
        // 河南
        '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店',
        '荥阳', '新郑', '登封', '巩义', '新密', '偃师', '舞钢', '汝州', '林州', '卫辉', '辉县', '沁阳',
        // 湖北
        '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州',
        '大冶', '丹江口', '宜都', '当阳', '枝江', '老河口', '枣阳', '宜城', '钟祥', '京山', '安陆',
        // 湖南
        '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底',
        '浏阳', '醴陵', '韶山', '耒阳', '常宁', '武冈', '汨罗', '临湘', '津市', '沅江', '资兴', '洪江',
        // 广东
        '珠海', '汕头', '佛山', '韶关', '湛江', '肇庆', '江门', '茂名', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮',
        '乐昌', '南雄', '台山', '开平', '鹤山', '恩平', '廉江', '雷州', '吴川', '化州', '信宜', '高州', '四会', '兴宁', '陆丰', '阳春', '英德', '连州', '普宁', '罗定',
        // 广西
        '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左',
        '岑溪', '东兴', '桂平', '北流', '靖西', '平果', '凭祥', '合山', '荔浦', '横州',
        // 海南
        '三亚', '三沙', '儋州', '五指山', '琼海', '文昌', '万宁', '东方',
        // 四川
        '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳',
        '都江堰', '彭州', '邛崃', '崇州', '广汉', '什邡', '绵竹', '江油', '峨眉山', '阆中', '华蓥', '万源', '简阳', '西昌',
        // 贵州
        '六盘水', '遵义', '安顺', '毕节', '铜仁',
        '清镇', '赤水', '仁怀', '凯里', '都匀', '兴义', '福泉',
        // 云南
        '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧',
        '安宁', '宣威', '腾冲', '楚雄', '大理', '景洪', '芒市', '瑞丽',
        // 西藏
        '日喀则', '昌都', '林芝', '山南', '那曲',
        // 陕西
        '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛',
        '兴平', '韩城', '华阴',
        // 甘肃
        '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南',
        '玉门', '敦煌', '合作',
        // 青海
        '海东',
        '格尔木', '德令哈',
        // 宁夏
        '石嘴山', '吴忠', '固原', '中卫',
        '灵武', '青铜峡',
        // 新疆
        '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏', '喀什', '和田', '伊犁', '塔城', '阿勒泰',
        '阜康', '库尔勒', '阿图什', '阿克苏市', '喀什市', '和田市', '伊宁', '奎屯', '塔城', '乌苏', '阿勒泰'
    ];

    // 按城市名长度降序排序，优先匹配更长的城市名
    commonCities.sort((a, b) => b.length - a.length);

    for (const city of commonCities) {
        if (title.includes(city) && title.includes('快递里的中国')) {
            return city;
        }
    }

    console.warn(`⚠️  无法解析城市: ${title}`);
    return null;
}

// 按城市分组视频
function groupVideosByCity(videos) {
    const cityGroups = {};

    videos.forEach(video => {
        if (video.city) {
            if (!cityGroups[video.city]) {
                cityGroups[video.city] = {
                    videos: []
                };
            }

            // 处理日期：使用 ctime（创建时间）或 pubtime（发布时间）
            let pubtime = video.pubtime || video.ctime;
            let date;
            if (pubtime && pubtime > 1000000000) {  // 有效的时间戳（2001年以后）
                date = new Date(pubtime * 1000).toISOString().split('T')[0];
            } else {
                console.warn(`⚠️  无效的发布时间，使用当前日期: ${video.title}`);
                date = new Date().toISOString().split('T')[0];
            }

            cityGroups[video.city].videos.push({
                title: video.title,
                url: `https://www.bilibili.com/video/${video.bvid}`,
                date: date,
                // 添加额外元数据
                aid: video.aid,
                bvid: video.bvid,
                views: video.view,
                danmaku: video.danmaku
            });
        }
    });

    return cityGroups;
}

// 生成 data.js 格式的输出
function generateDataJsOutput(cityGroups) {
    const sortedCities = Object.keys(cityGroups).sort();

    const citiesStr = sortedCities.map(city => {
        const cityVideos = cityGroups[city].videos.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        const videosStr = cityVideos.map(video => {
            // 转义双引号和反斜杠
            const title = video.title.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            return `        {
                title: "${title}",
                url: "${video.url}",
                date: "${video.date}",
                // 可选元数据（如果需要）
                aid: ${video.aid},
                views: ${video.views},
                danmaku: ${video.danmaku}
            }`;
        }).join(',\n');

        return `    "${city}": {
        videos: [
${videosStr}
        ]
    }`;
    }).join(',\n\n');

    const output = `// 城市数据配置
// 城市名称需要与 ECharts 地图数据匹配
// 数据来源：哔哩哔哩UP主 老猫鱼不吃鱼
// 最后更新时间: ${new Date().toISOString()}

const cityData = {
${citiesStr}
};
`;

    return output;
}

// 主函数
async function main() {
    console.log('='.repeat(60));
    console.log('B站数据获取工具');
    console.log('合集：快递里的中国');
    console.log('='.repeat(60));
    console.log('');

    const videos = await fetchAllPages();

    if (videos.length === 0) {
        console.error('未获取到任何视频数据');
        console.log('\n可能的原因：');
        console.log('1. API 需要登录态 - 请先在浏览器登录 B站');
        console.log('2. 网络问题 - 请检查网络连接');
        console.log('3. API 变更 - B站可能更新了 API');
        console.log('\n替代方案：');
        console.log('1. 在浏览器中打开合集页面手动查看数据');
        console.log('2. 使用浏览器开发者工具网络面板分析 API 请求');
        return;
    }

    const cityGroups = groupVideosByCity(videos);

    console.log(`\n识别到的城市 (${Object.keys(cityGroups).length} 个):`);
    Object.keys(cityGroups).sort().forEach((city, index) => {
        const videoCount = cityGroups[city].videos.length;
        console.log(`  ${index + 1}. ${city} - ${videoCount} 个视频`);
    });

    // 生成输出
    const output = generateDataJsOutput(cityGroups);

    // 写入文件
    const outputPath = path.join(__dirname, '..', 'data', 'data.js');
    fs.writeFileSync(outputPath, output, 'utf8');

    console.log('\n' + '='.repeat(60));
    console.log('✓ 数据已保存到: data/data.js');
    console.log('='.repeat(60));
}

// 运行主函数
main().catch(error => {
    console.error('发生错误:', error);
    process.exit(1);
});
