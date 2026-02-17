/**
 * B站原始数据
 * 使用方法：
 * 1. 在 B站控制台运行 scripts/fetch-bilibili-data.js 获取数据
 * 2. 复制输出的代码粘贴到本文件中的 RAW_DATA 数组
 * 3. 运行 npm run process-data 处理数据
 *
 * 数据格式：RAW_DATA 是视频对象的数组
 */

const RAW_DATA = [
    {
        "title": "一个城市能有多散装？看泰州就知道了 快递里的中国-泰州",
        "url": "https://www.bilibili.com/video/BV1QC4y1u7JK",
        "date": "2023-12-15",
        "aid": 749855775,
        "views": 611744,
        "danmaku": 5427
    },
    {
        "title": "三万亿的重庆为什么拿转移支付？因为就是大农村 快递里的中国 重庆（2）",
        "url": "https://www.bilibili.com/video/BV1kH4y1P7mb",
        "date": "2024-04-19",
        "aid": 1053323079,
        "views": 600108,
        "danmaku": 5749
    },
    {
        "title": "三城互殴，弄没江汉市 快递里的中国-湖北（2）神奇的副地级市们 潜江 仙桃 天门",
        "url": "https://www.bilibili.com/video/BV1Tm4y1a7Wq",
        "date": "2023-05-11",
        "aid": 698606773,
        "views": 537243,
        "danmaku": 5553
    },
    {
        "title": "三大精神病院所在地，以青年为名却没有青年的城市，最牛逼的省会最惨的城 快递里的中国 吉林 四平",
        "url": "https://www.bilibili.com/video/BV17vqAYTEV1",
        "date": "2024-12-09",
        "aid": 113621849871681,
        "views": 668554,
        "danmaku": 6703
    },
    {
        "title": "不是广州的广州 番邦化外 快递里的中国 广州（3）",
        "url": "https://www.bilibili.com/video/BV1hZ421h7y5",
        "date": "2024-03-15",
        "aid": 1151812111,
        "views": 421149,
        "danmaku": 2933
    },
    {
        "title": "专家忽悠瘸沧州铁狮子？武术之乡为何被讥讽花架子？快递里的中国 河北 沧州（2）",
        "url": "https://www.bilibili.com/video/BV13THqzfEy5",
        "date": "2025-09-11",
        "aid": 115187399007147,
        "views": 1347368,
        "danmaku": 5459
    },
    {
        "title": "东北西安在哪里?号称小上海的吉林最穷城市 快递里的中国 吉林 辽源 梅河口",
        "url": "https://www.bilibili.com/video/BV1mnkNBaE8P",
        "date": "2026-01-16",
        "aid": 115902594947805,
        "views": 286203,
        "danmaku": 5150
    },
    {
        "title": "中国性都？没错，但世界工厂 快递里的中国-东莞",
        "url": "https://www.bilibili.com/video/BV1po4y177ou",
        "date": "2023-06-16",
        "aid": 399806676,
        "views": 246577,
        "danmaku": 1376
    },
    {
        "title": "为什么咸宁专门判大案子？咸宁小东莞又是什么意思？快递里的中国 湖北 咸宁",
        "url": "https://www.bilibili.com/video/BV1U4rfY9EEs",
        "date": "2024-12-18",
        "aid": 113672584172275,
        "views": 519704,
        "danmaku": 5809
    },
    {
        "title": "为什么说临沂不打假？山东佛罗里达在哪里？快递里的中国 山东 临沂（下）",
        "url": "https://www.bilibili.com/video/BV1NaU5BBECR",
        "date": "2025-11-21",
        "aid": 115586612928510,
        "views": 491694,
        "danmaku": 7790
    },
    {
        "title": "为什么说十堰是躺平缘起之城？从高处跌落倒底因为什么？快递里的中国 湖北 十堰 神农架",
        "url": "https://www.bilibili.com/video/BV1msiZYBEEM",
        "date": "2024-12-05",
        "aid": 113601817875783,
        "views": 386217,
        "danmaku": 7076
    },
    {
        "title": "为什么说是混的最惨的古都是开封？快递里的中国 河南 开封",
        "url": "https://www.bilibili.com/video/BV1ZYU8YkER7",
        "date": "2024-11-16",
        "aid": 113491256088032,
        "views": 496384,
        "danmaku": 8769
    },
    {
        "title": "为什么长春一直不火？南东莞北长春是什么情况？快递里的中国 吉林 长春",
        "url": "https://www.bilibili.com/video/BV1Jb421e7xF",
        "date": "2024-05-31",
        "aid": 1805399557,
        "views": 743405,
        "danmaku": 8634
    },
    {
        "title": "九头鸟中大穷鬼，散装黄冈没密卷 快递里的中国-湖北 黄冈",
        "url": "https://www.bilibili.com/video/BV1xz421Q7kt",
        "date": "2024-03-12",
        "aid": 1351508066,
        "views": 586057,
        "danmaku": 5280
    },
    {
        "title": "从松原看东北人性格的核心逻辑 快递里的中国 吉林 松原",
        "url": "https://www.bilibili.com/video/BV1ve41117Fh",
        "date": "2024-01-18",
        "aid": 238971149,
        "views": 243310,
        "danmaku": 2481
    },
    {
        "title": "倒霉催的从不因为好事上热搜的六朝古都 快递里的中国 河北 邯郸",
        "url": "https://www.bilibili.com/video/BV1aM4m1R7TF",
        "date": "2024-03-27",
        "aid": 1302463265,
        "views": 497479,
        "danmaku": 5232
    },
    {
        "title": "假鞋医院之都莆田，妈祖蔡京故里 快递里的中国 福建 莆田（含仙游）",
        "url": "https://www.bilibili.com/video/BV1gB7fzVE48",
        "date": "2025-05-13",
        "aid": 114498576846970,
        "views": 309103,
        "danmaku": 6946
    },
    {
        "title": "全员逆子且名不副实的逗比城市 快递里的中国 浙江 湖州",
        "url": "https://www.bilibili.com/video/BV1Kp421S7sZ",
        "date": "2024-04-26",
        "aid": 1853630171,
        "views": 487703,
        "danmaku": 5066
    },
    {
        "title": "内卷之城衡水，棋圣聂卫平故里。一代棋圣如何练成？快递里的中国 河北 衡水（上）",
        "url": "https://www.bilibili.com/video/BV1jDzFBdETU",
        "date": "2026-01-22",
        "aid": 115940024914014,
        "views": 232245,
        "danmaku": 3722
    },
    {
        "title": "内斗干出唯一黑户县区 操场埋尸大量缝纫机网评员 坤哥故里 快递里的中国—湖南 怀化",
        "url": "https://www.bilibili.com/video/BV1JMsdeGEpH",
        "date": "2024-09-27",
        "aid": 113207603634054,
        "views": 398692,
        "danmaku": 8010
    },
    {
        "title": "内蒙炮管最猛的城市 也是国内唯一地铁遗址的城市 快递里的中国 内蒙古 包头",
        "url": "https://www.bilibili.com/video/BV1t3vYBoE1Y",
        "date": "2025-12-30",
        "aid": 115807652681463,
        "views": 322663,
        "danmaku": 6195
    },
    {
        "title": "出轨依兰爱情故事， 投资不过山海关的出处，汉奸县的真相 快递里的中国 黑龙江 哈尔滨（2）",
        "url": "https://www.bilibili.com/video/BV1xE4m1d7Hy",
        "date": "2024-08-15",
        "aid": 1256426906,
        "views": 560432,
        "danmaku": 8332
    },
    {
        "title": "前一线城市，现在啥也不是。快递里的中国-安徽（4）前省会和铜都 安庆 铜陵",
        "url": "https://www.bilibili.com/video/BV1yk4y1E76U",
        "date": "2023-05-05",
        "aid": 740762378,
        "views": 224940,
        "danmaku": 2170
    },
    {
        "title": "北漂的终点？京南狮驼岭？ 快递里的中国 河北 廊坊",
        "url": "https://www.bilibili.com/video/BV1ev5kz8EWC",
        "date": "2025-04-18",
        "aid": 114357027542039,
        "views": 628935,
        "danmaku": 6094
    },
    {
        "title": "卖扒鸡，但是也卖亳州鸭煲 快递里的中国-山东重置 德州",
        "url": "https://www.bilibili.com/video/BV1194y1r7Vw",
        "date": "2023-08-10",
        "aid": 362031839,
        "views": 282959,
        "danmaku": 2325
    },
    {
        "title": "卖白酒的城市是如何逆天改命的？它跟上海又有什么渊源 快递里的中国 四川 宜宾",
        "url": "https://www.bilibili.com/video/BV1NwrTB8EF9",
        "date": "2026-01-09",
        "aid": 115864393225899,
        "views": 327816,
        "danmaku": 5537
    },
    {
        "title": "南宁只有慧泊吗？快递里的中国-广西（2）暗黑料理之都南宁",
        "url": "https://www.bilibili.com/video/BV1Bo4y1g7xQ",
        "date": "2023-05-26",
        "aid": 399019947,
        "views": 164984,
        "danmaku": 1627
    },
    {
        "title": "南方人不吃羊肉的真相是什么？ 快递里的中国-番外吃货篇",
        "url": "https://www.bilibili.com/video/BV1Te411r7fP",
        "date": "2023-12-21",
        "aid": 237546465,
        "views": 407736,
        "danmaku": 4289
    },
    {
        "title": "即将被沙漠吞噬的前都城 快递里的中国 甘肃 武威",
        "url": "https://www.bilibili.com/video/BV1jE421M7CU",
        "date": "2024-04-21",
        "aid": 1653303848,
        "views": 415550,
        "danmaku": 4578
    },
    {
        "title": "厦门并不止一座岛 福建行政级别最高的城市 快递里的中国-厦门",
        "url": "https://www.bilibili.com/video/BV1Jw411V79s",
        "date": "2023-12-21",
        "aid": 325083247,
        "views": 494775,
        "danmaku": 5452
    },
    {
        "title": "又一个没地铁的万亿散装倒霉蛋 快递里的中国 福建 泉州",
        "url": "https://www.bilibili.com/video/BV1cC411J78h",
        "date": "2024-05-02",
        "aid": 1953787575,
        "views": 457907,
        "danmaku": 7116
    },
    {
        "title": "反出内江，卖了简阳。换了地铁和机场  快递里的中国 四川 资阳",
        "url": "https://www.bilibili.com/video/BV1mNPFe5Ehf",
        "date": "2025-02-21",
        "aid": 114041230005414,
        "views": 992036,
        "danmaku": 5414
    },
    {
        "title": "发展停滞难道是不努力吗？有没有好好工作？ 快递里的中国-辽宁 大连 恶罗海城",
        "url": "https://www.bilibili.com/video/BV1Dh4y1w7Yx",
        "date": "2023-09-14",
        "aid": 618456598,
        "views": 506460,
        "danmaku": 2915
    },
    {
        "title": "另类解读最强但散装的地级市 快递里的中国-苏州省 它没有机场",
        "url": "https://www.bilibili.com/video/BV1uk4y1j7Bs",
        "date": "2023-05-18",
        "aid": 741339381,
        "views": 476092,
        "danmaku": 6169
    },
    {
        "title": "台风也不停工，遥遥领先遥遥领先的世界牛马之都 快递里的中国 广东 深圳（1）宝安、光明、龙华",
        "url": "https://www.bilibili.com/video/BV1jnnuzpENw",
        "date": "2025-09-26",
        "aid": 115268818834543,
        "views": 558579,
        "danmaku": 8336
    },
    {
        "title": "吃货的湛江 快递里的中国-广东 隐秘的角落湛江",
        "url": "https://www.bilibili.com/video/BV1Bo4y1t71w",
        "date": "2023-05-02",
        "aid": 398141677,
        "views": 140238,
        "danmaku": 1439
    },
    {
        "title": "吃辣的起源是什么？让落魄盐都告诉你 快递里的中国 四川 自贡",
        "url": "https://www.bilibili.com/video/BV1ai421Y7wp",
        "date": "2024-07-04",
        "aid": 1456117869,
        "views": 503552,
        "danmaku": 6441
    },
    {
        "title": "合肥市吸血之城？赌徒之城？还是逆袭霸都？ 快递里的中国 安徽 合肥",
        "url": "https://www.bilibili.com/video/BV1NE4m197cC",
        "date": "2024-08-01",
        "aid": 1256492355,
        "views": 542456,
        "danmaku": 7542
    },
    {
        "title": "合肥的崛起之路从三分巢湖说起 快递里的中国 合肥（1）巢湖",
        "url": "https://www.bilibili.com/video/BV1fS421R7om",
        "date": "2024-07-19",
        "aid": 1506265419,
        "views": 353112,
        "danmaku": 5469
    },
    {
        "title": "吉林省的省会不是吉林？为啥？快递里的中国 吉林 吉林",
        "url": "https://www.bilibili.com/video/BV1Jmw3etEGf",
        "date": "2025-01-16",
        "aid": 113836950622798,
        "views": 327015,
        "danmaku": 6816
    },
    {
        "title": "吊州恐龙是哪来的？号称山东小江苏，宇宙级散装的潍坊 快递里的中国 潍坊 寿光、青州、高密、诸城、昌邑",
        "url": "https://www.bilibili.com/video/BV1W2bSzKEpj",
        "date": "2025-07-25",
        "aid": 114912420435667,
        "views": 1128339,
        "danmaku": 6086
    },
    {
        "title": "吞并莱芜对济南是好事吗？济南最想吃掉的是哪里？ 快递里的中国 山东 济南（下）",
        "url": "https://www.bilibili.com/video/BV1iMkkYdE5t",
        "date": "2024-12-19",
        "aid": 113681727756760,
        "views": 417720,
        "danmaku": 6581
    },
    {
        "title": "唐山之所以彪悍的核心逻辑 快递里的中国 唐山",
        "url": "https://www.bilibili.com/video/BV1YB42167nh",
        "date": "2024-02-01",
        "aid": 1350130677,
        "views": 1098111,
        "danmaku": 13201
    },
    {
        "title": "喜当爹的酒泉和鸡贼的嘉峪关 快递里的中国 甘肃 酒泉 嘉峪关",
        "url": "https://www.bilibili.com/video/BV1me411v7vr",
        "date": "2024-01-03",
        "aid": 240732527,
        "views": 183937,
        "danmaku": 2320
    },
    {
        "title": "四大破产城市，鸡西鹤岗七台河双鸭山猛禽组合 快递里的中国 黑龙江四大矿城",
        "url": "https://www.bilibili.com/video/BV1W4URY9EVw",
        "date": "2024-11-21",
        "aid": 113522545596939,
        "views": 548151,
        "danmaku": 8705
    },
    {
        "title": "国字号都市圈  快递里的中国-辽宁 沈阳 看有没有好果汁吃",
        "url": "https://www.bilibili.com/video/BV1Bs4y1R7S4",
        "date": "2023-04-28",
        "aid": 995595405,
        "views": 189240,
        "danmaku": 2619
    },
    {
        "title": "国际第一大都市的烈日灼心 快递里的中国 辽宁 丹东",
        "url": "https://www.bilibili.com/video/BV1sPdyY5E8c",
        "date": "2025-04-10",
        "aid": 114315151545624,
        "views": 390978,
        "danmaku": 6987
    },
    {
        "title": "城市内斗天花板，县级市攻打市府 快递里的中国 湖北 黄石",
        "url": "https://www.bilibili.com/video/BV1UZ421K7q9",
        "date": "2024-07-11",
        "aid": 1156068819,
        "views": 567919,
        "danmaku": 6333
    },
    {
        "title": "复活秦始皇？山东第三城？西门庆故里？山东为什么出不了六小龙？快递里的中国 山东 聊城",
        "url": "https://www.bilibili.com/video/BV1fr9yYwEp8",
        "date": "2025-03-07",
        "aid": 114120233981206,
        "views": 1175468,
        "danmaku": 5287
    },
    {
        "title": "大逆不道的甘肃老二 快递里的中国-甘肃 庆阳 脱甘入陕",
        "url": "https://www.bilibili.com/video/BV1uv4y1J7U1",
        "date": "2023-04-26",
        "aid": 570408277,
        "views": 287022,
        "danmaku": 1811
    },
    {
        "title": "奇迹工程红旗渠引发三省内斗？七朝古都为何名不副实？快递里的中国 河南 安阳",
        "url": "https://www.bilibili.com/video/BV1yTjEzEEmR",
        "date": "2025-05-23",
        "aid": 114556407976182,
        "views": 471355,
        "danmaku": 7477
    },
    {
        "title": "奸诈之城？内斗之城！ 快递里的中国-湖北 孝感 四大名北",
        "url": "https://www.bilibili.com/video/BV1WN411b7fK",
        "date": "2023-10-13",
        "aid": 492002567,
        "views": 344670,
        "danmaku": 4090
    },
    {
        "title": "宁波错过了什么？为什么没成为浙江老大？快递里的中国 浙江 宁波 （2）",
        "url": "https://www.bilibili.com/video/BV1ahQMYLEbR",
        "date": "2025-03-13",
        "aid": 114157512825210,
        "views": 1091560,
        "danmaku": 7710
    },
    {
        "title": "安徽第三城为什么是徽京小跟班？快递里的中国 安徽 滁州",
        "url": "https://www.bilibili.com/video/BV1zCTTzQE8b",
        "date": "2025-06-06",
        "aid": 114635260891725,
        "views": 436702,
        "danmaku": 5978
    },
    {
        "title": "少林寺是哪里的？郑州国中城市如何炼成？快递里的中国 河南  郑州（1）",
        "url": "https://www.bilibili.com/video/BV1j6hJz1E1d",
        "date": "2025-08-01",
        "aid": 114952283102405,
        "views": 391576,
        "danmaku": 8298
    },
    {
        "title": "山东东莞是怎么回事？超千万人口的杨永信故里，为何只是一个三线城市？快递里的中国 山东 临沂（上）",
        "url": "https://www.bilibili.com/video/BV1ZGCQB7EKY",
        "date": "2025-11-16",
        "aid": 115557789605343,
        "views": 2724169,
        "danmaku": 7943
    },
    {
        "title": "工业之都遗址，啥也不是的沈阳 快递里的中国 沈阳 重重置版",
        "url": "https://www.bilibili.com/video/BV1uH2GYgE62",
        "date": "2024-10-10",
        "aid": 113281993808188,
        "views": 449282,
        "danmaku": 9129
    },
    {
        "title": "差点成为香港，我国唯二的岛屿地级市 快递里的中国 浙江 舟山",
        "url": "https://www.bilibili.com/video/BV1mz421d7Kk",
        "date": "2024-02-22",
        "aid": 1350790582,
        "views": 367434,
        "danmaku": 1836
    },
    {
        "title": "已经疯了的散装城市的最高境界 快递里的中国 山东 济宁",
        "url": "https://www.bilibili.com/video/BV1Tz421m7Qj",
        "date": "2024-05-09",
        "aid": 1354306891,
        "views": 2345317,
        "danmaku": 8476
    },
    {
        "title": "帝王之气和广东最穷兼而有之  快递里的中国-广东 梅州 流窜之都",
        "url": "https://www.bilibili.com/video/BV18u4y1673b",
        "date": "2023-09-27",
        "aid": 916445293,
        "views": 514847,
        "danmaku": 4886
    },
    {
        "title": "广东也有穷地，深港后花园但也是刷单盗版之都 快递里的中国 广东 河源",
        "url": "https://www.bilibili.com/video/BV13mHSe6Evu",
        "date": "2024-09-06",
        "aid": 113089357809626,
        "views": 365169,
        "danmaku": 5120
    },
    {
        "title": "建国后唯一有人称帝之城，四川二五仔川渝无间道。快递里的中国 四川 广安",
        "url": "https://www.bilibili.com/video/BV1uwCmYFEAC",
        "date": "2024-10-18",
        "aid": 113327191625895,
        "views": 2030094,
        "danmaku": 7523
    },
    {
        "title": "徐州地邪在哪里？是怎么被山东坑了的？快递里的中国 江苏 徐州（2）",
        "url": "https://www.bilibili.com/video/BV1X61KBEEPY",
        "date": "2025-10-31",
        "aid": 115467343630959,
        "views": 499445,
        "danmaku": 6883
    },
    {
        "title": "徐州淘汰，建省失败。淮海省自身又是什么状态？快递里的中国 江苏 徐州 （1）",
        "url": "https://www.bilibili.com/video/BV1Dx4HzFEvR",
        "date": "2025-10-10",
        "aid": 115350373078822,
        "views": 405740,
        "danmaku": 5933
    },
    {
        "title": "惊天阴谋遗祸江东拆分万亿大城 快递里的中国-江苏 扬州",
        "url": "https://www.bilibili.com/video/BV1Ly4y1K7En",
        "date": "2023-10-19",
        "aid": 789829535,
        "views": 565184,
        "danmaku": 6152
    },
    {
        "title": "憋屈省会无人认领 快递里的中国-江苏（2）南京，徽京",
        "url": "https://www.bilibili.com/video/BV1HT411z7s3",
        "date": "2023-03-23",
        "aid": 484066068,
        "views": 352272,
        "danmaku": 4840
    },
    {
        "title": "成都天腐之国的名号是怎么炼成的？是冤屈还是故意？快递里的中国 四川 成都",
        "url": "https://www.bilibili.com/video/BV1Etu3zKEPC",
        "date": "2025-07-11",
        "aid": 114833701740161,
        "views": 1168563,
        "danmaku": 14332
    },
    {
        "title": "成都的至暗时刻 张献忠的宝藏 快递里的中国 成都（3）",
        "url": "https://www.bilibili.com/video/BV1mBtCzWELV",
        "date": "2025-08-08",
        "aid": 114991290195464,
        "views": 323114,
        "danmaku": 5801
    },
    {
        "title": "成都鄙视链，没地铁的和没发展的 快递里的中国 成都（2）",
        "url": "https://www.bilibili.com/video/BV1iJg3zvEt5",
        "date": "2025-07-18",
        "aid": 114872759163939,
        "views": 527543,
        "danmaku": 7168
    },
    {
        "title": "战争无敌但打工的命 快递里的中国 湖南 郴州",
        "url": "https://www.bilibili.com/video/BV17N4y1J7UP",
        "date": "2024-01-25",
        "aid": 879293293,
        "views": 576067,
        "danmaku": 4665
    },
    {
        "title": "抢猪抢太子奶的城市，中南枢纽小郑州 快递里的中国 湖南 株洲",
        "url": "https://www.bilibili.com/video/BV1wG6ABVEWX",
        "date": "2026-01-29",
        "aid": 115980206348098,
        "views": 494003,
        "danmaku": 7269
    },
    {
        "title": "抢铁赚钱，地狱生存 广州的AB面 快递里的中国-广州（2）",
        "url": "https://www.bilibili.com/video/BV1Sc411i7Qb",
        "date": "2023-12-07",
        "aid": 281950051,
        "views": 208407,
        "danmaku": 1917
    },
    {
        "title": "挑脚筋之都 快递里的中国-湖南（2）邵阳行天下",
        "url": "https://www.bilibili.com/video/BV1BX4y1i7gW",
        "date": "2023-06-22",
        "aid": 357578060,
        "views": 503672,
        "danmaku": 5110
    },
    {
        "title": "敢暴打江苏的安徽城市 倒底是什么样的复杂情况？快递里的中国 安徽 宣城",
        "url": "https://www.bilibili.com/video/BV1m6Mgz5Eu4",
        "date": "2025-06-13",
        "aid": 114674720840103,
        "views": 341394,
        "danmaku": 5725
    },
    {
        "title": "景德镇炒作鸡排哥，瓷都搞网红文旅经济意欲何为？快递里的中国 江西 景德镇",
        "url": "https://www.bilibili.com/video/BV1tZxuzREqs",
        "date": "2025-10-05",
        "aid": 115322673699951,
        "views": 537167,
        "danmaku": 5634
    },
    {
        "title": "曾经的直辖市，现在只靠雨姐出名 快递里的中国 辽宁 本溪",
        "url": "https://www.bilibili.com/video/BV1iGKAzYEkK",
        "date": "2025-06-20",
        "aid": 114714617057927,
        "views": 344769,
        "danmaku": 6837
    },
    {
        "title": "曾经的连环杀人案城市，被疯狂操作的白银有色，还有什么奇葩事件？快递里的中国 甘肃 白银",
        "url": "https://www.bilibili.com/video/BV1wVFSzZEb5",
        "date": "2026-02-10",
        "aid": 116045201415909,
        "views": 194829,
        "danmaku": 4359
    },
    {
        "title": "曾经被争抢的预制菜产业之名被嫌弃。谁是真正的预制菜之都？ 快递里的中国 山东 潍坊 （下重置）",
        "url": "https://www.bilibili.com/video/BV11SWuzVEgA",
        "date": "2025-09-19",
        "aid": 115229258158596,
        "views": 483770,
        "danmaku": 5286
    },
    {
        "title": "最不适宜人类居住之地 快递里的中国 宁夏 固原 创造奇迹的山狼大苦逼",
        "url": "https://www.bilibili.com/video/BV158411B7ye",
        "date": "2023-09-08",
        "aid": 233165236,
        "views": 831246,
        "danmaku": 1852
    },
    {
        "title": "最穷的散装城市房价为什么最高？快递里的中国 浙江 丽水",
        "url": "https://www.bilibili.com/video/BV1AKtdesE7z",
        "date": "2024-09-19",
        "aid": 113166633672279,
        "views": 1381011,
        "danmaku": 7322
    },
    {
        "title": "最群嘲的也是火力最强的年度盘点 快递里的中国 2023地图炮大赏",
        "url": "https://www.bilibili.com/video/BV1hi4y1h786",
        "date": "2023-12-26",
        "aid": 537797354,
        "views": 240434,
        "danmaku": 863
    },
    {
        "title": "杀手圈闻名之城 快递里的中国-吉林重置 延边的老棒子们",
        "url": "https://www.bilibili.com/video/BV1EN411278U",
        "date": "2023-07-13",
        "aid": 488450682,
        "views": 349239,
        "danmaku": 2543
    },
    {
        "title": "村支书卖小米被举报？曾经的北方香港？现在的山东鹤岗！快递里的中国 山东 威海",
        "url": "https://www.bilibili.com/video/BV1ZJqjBPEey",
        "date": "2025-12-17",
        "aid": 115735426766094,
        "views": 387347,
        "danmaku": 6540
    },
    {
        "title": "福报之都梦想之城快递之根，快递里的中国-浙江（2）杭州、严州",
        "url": "https://www.bilibili.com/video/BV1Tb411Z7SF",
        "date": "2023-03-17",
        "aid": 226060935,
        "views": 415941,
        "danmaku": 3789
    },
    {
        "title": "杭甬互不侵犯条约，浙老二宁波增肥之路 快递里的中国 浙江 宁波（1）",
        "url": "https://www.bilibili.com/video/BV1qJ9uY8E3y",
        "date": "2025-02-28",
        "aid": 114080505534666,
        "views": 4775024,
        "danmaku": 7651
    },
    {
        "title": "武术之城？工业之城？快递里的中国 广东 佛山 被低估的广东老三",
        "url": "https://www.bilibili.com/video/BV1zJ4m1g7cz",
        "date": "2024-06-14",
        "aid": 1255561571,
        "views": 432643,
        "danmaku": 8314
    },
    {
        "title": "江苏散装的真正内核，散到极致的源头城市 快递里的中国 江苏 常州",
        "url": "https://www.bilibili.com/video/BV1XeSXYPEA8",
        "date": "2024-11-01",
        "aid": 113406195539804,
        "views": 1321654,
        "danmaku": 11661
    },
    {
        "title": "江苏第一穷，内斗发源地。项羽老家刘强东故里 快递里的中国 江苏 宿迁",
        "url": "https://www.bilibili.com/video/BV14Z5GzAELS",
        "date": "2025-05-09",
        "aid": 114476749755373,
        "views": 607250,
        "danmaku": 7252
    },
    {
        "title": "江西为什么没好事？上饶只有提灯定损和佩琪？ 快递里的中国 江西 上饶",
        "url": "https://www.bilibili.com/video/BV15CDdYUExT",
        "date": "2024-11-08",
        "aid": 113445840101242,
        "views": 810780,
        "danmaku": 8465
    },
    {
        "title": "江西老二，为何最穷？快递里的中国 江西 赣州（上）",
        "url": "https://www.bilibili.com/video/BV13RXBYNEqK",
        "date": "2025-03-21",
        "aid": 114198667336809,
        "views": 533839,
        "danmaku": 8020
    },
    {
        "title": "没惹过任何人但依然倒霉 快递里的中国-江苏 南通",
        "url": "https://www.bilibili.com/video/BV1Jm4y1j7Ke",
        "date": "2023-07-27",
        "aid": 701486386,
        "views": 295774,
        "danmaku": 3511
    },
    {
        "title": "没有麦当劳的省会，王健林要负全责 快递里的中国 宁夏 银川 石嘴山",
        "url": "https://www.bilibili.com/video/BV1cz421e7av",
        "date": "2024-05-24",
        "aid": 1354899119,
        "views": 335566,
        "danmaku": 2928
    },
    {
        "title": "河南最惨地级市，前线炮灰小弟不认 快递里的中国 河南 三门峡",
        "url": "https://www.bilibili.com/video/BV1Jw4m1R7KA",
        "date": "2024-03-14",
        "aid": 1101918056,
        "views": 646845,
        "danmaku": 2533
    },
    {
        "title": "洗澡鱼是真的存在吗？快递里的中国-特产造假真相探秘之洗澡",
        "url": "https://www.bilibili.com/video/BV1nK411Y7sq",
        "date": "2024-01-25",
        "aid": 496710687,
        "views": 385991,
        "danmaku": 757
    },
    {
        "title": "洛阳西安互掐到底为了什么？快递里的中国 河南 洛阳",
        "url": "https://www.bilibili.com/video/BV1Sw4m1e7nG",
        "date": "2024-06-21",
        "aid": 1105974279,
        "views": 753728,
        "danmaku": 11065
    },
    {
        "title": "济南是万亿大县城吗？当个省会不容易 快递里的中国 山东 济南（上）",
        "url": "https://www.bilibili.com/video/BV1PdqYYNEZ2",
        "date": "2024-12-12",
        "aid": 113641512767566,
        "views": 580684,
        "danmaku": 10384
    },
    {
        "title": "浙江弃儿 孔门对战 美食叛徒 但连环被坑 快递里的中国  浙江 衢州",
        "url": "https://www.bilibili.com/video/BV1gw411J7Kq",
        "date": "2024-01-11",
        "aid": 326223323,
        "views": 402100,
        "danmaku": 5084
    },
    {
        "title": "海上水鱼岛？高速索马里？这是一个什么样的城市？快递里的中国 广东 阳江",
        "url": "https://www.bilibili.com/video/BV1gkN6eNEvE",
        "date": "2025-02-11",
        "aid": 113985680576637,
        "views": 282043,
        "danmaku": 4742
    },
    {
        "title": "海南魔童闹海，东线海景四强 快递里的中国 海南 陵水 文昌 万宁 琼海",
        "url": "https://www.bilibili.com/video/BV1RmZ5YJEuE",
        "date": "2025-03-27",
        "aid": 114236365742067,
        "views": 285123,
        "danmaku": 3873
    },
    {
        "title": "快递里的中国-安徽（3）特产被抢且吵架没输过的皖北大佬。阜阳，淮南，亳州",
        "url": "https://www.bilibili.com/video/BV1av4y187bu",
        "date": "2023-03-10",
        "aid": 568237854,
        "views": 284500,
        "danmaku": 2839
    },
    {
        "title": "深不可测的无锡，苏南乱局的肇因 快递里的中国 江苏 无锡",
        "url": "https://www.bilibili.com/video/BV16gcneDEzg",
        "date": "2025-01-10",
        "aid": 113802876165233,
        "views": 588520,
        "danmaku": 10305
    },
    {
        "title": "深圳属于哪个省？城中村的爱情，南山的必胜客 快递里的中国 广东 深圳（3）",
        "url": "https://www.bilibili.com/video/BV1wBsEzvEiU",
        "date": "2025-10-24",
        "aid": 115428269758366,
        "views": 998765,
        "danmaku": 6722
    },
    {
        "title": "深圳最缺的是什么？到处抢地皮的深圳是怎么被忽悠瘸的 快递里的中国 广东 深圳",
        "url": "https://www.bilibili.com/video/BV1suWCzzEVx",
        "date": "2025-10-17",
        "aid": 115388423675440,
        "views": 615175,
        "danmaku": 7176
    },
    {
        "title": "湖南最年轻地级市却是抵押车天堂电诈之乡？快递里的中国 湖南 娄底",
        "url": "https://www.bilibili.com/video/BV1Kx4y1b7PY",
        "date": "2024-06-07",
        "aid": 1005599467,
        "views": 601745,
        "danmaku": 5559
    },
    {
        "title": "炸化粪池的小孩哥在哪个城市？只有爆炸这么简单吗？快递里的中国 四川 内江",
        "url": "https://www.bilibili.com/video/BV1RvNJeEETS",
        "date": "2025-02-06",
        "aid": 113955733249809,
        "views": 636526,
        "danmaku": 7161
    },
    {
        "title": "烧烤里的中国（伪）快递里的中国-山东（重置2）烧烤淄博",
        "url": "https://www.bilibili.com/video/BV1Zo4y1t78w",
        "date": "2023-04-18",
        "aid": 397678247,
        "views": 182673,
        "danmaku": 1365
    },
    {
        "title": "煤都抚顺是如何变成美食创意之都的 快递里的中国 辽宁 抚顺",
        "url": "https://www.bilibili.com/video/BV1qC411V7X5",
        "date": "2024-04-04",
        "aid": 1952733839,
        "views": 400684,
        "danmaku": 5219
    },
    {
        "title": "父慈子孝 最穷珠三角 快递里的中国-广东（2）珠海、中山、江门",
        "url": "https://www.bilibili.com/video/BV1os4y1J7Ay",
        "date": "2023-03-30",
        "aid": 951831990,
        "views": 209543,
        "danmaku": 4256
    },
    {
        "title": "甲亢中国行最大赢家 靠的是卤鹅吗？ 快递里的中国 重庆 荣昌",
        "url": "https://www.bilibili.com/video/BV1ntoPY8EH8",
        "date": "2025-04-16",
        "aid": 114345635815420,
        "views": 179198,
        "danmaku": 2381
    },
    {
        "title": "电诈王城水果之都 快递里的中国-广东 茂名",
        "url": "https://www.bilibili.com/video/BV1Lp4y1E7cE",
        "date": "2023-08-25",
        "aid": 957698595,
        "views": 400320,
        "danmaku": 2086
    },
    {
        "title": "破了万亿，但没有地铁，还土里土气 快递里的中国 山东 新晋万亿 烟台",
        "url": "https://www.bilibili.com/video/BV1hJ4m1e7Qs",
        "date": "2024-03-01",
        "aid": 1251114471,
        "views": 1504579,
        "danmaku": 9214
    },
    {
        "title": "续面网暴遭反噬，为啥郑州总招黑？快递里的中国 郑州（2）",
        "url": "https://www.bilibili.com/video/BV1vgehz2Eog",
        "date": "2025-08-22",
        "aid": 115073515393579,
        "views": 1418764,
        "danmaku": 8017
    },
    {
        "title": "网红城市哈尔滨？你误会了，这里可不是网红 快递里的中国 黑龙江 哈尔滨",
        "url": "https://www.bilibili.com/video/BV1zr421M7Qw",
        "date": "2024-08-09",
        "aid": 1406363093,
        "views": 654459,
        "danmaku": 10286
    },
    {
        "title": "发大水的肇庆居然当过古都？为什么又是大宋徽宗快乐之城？快递里的中国 广东 肇庆",
        "url": "https://www.bilibili.com/video/BV1dvKBzeEz3",
        "date": "2025-06-27",
        "aid": 114754395839740,
        "views": 306022,
        "danmaku": 5972
    },
    {
        "title": "胡建祖宗，上海兄弟，湖北同门，河南异类，快递里的中国 河南 信阳",
        "url": "https://www.bilibili.com/video/BV1dQZDYpEgM",
        "date": "2025-04-03",
        "aid": 114275624424655,
        "views": 525552,
        "danmaku": 7462
    },
    {
        "title": "能刷出大胃袋良子的地方，为什么还被冠以太监之乡？到底是个什么样的地方？快递里的中国 河北 沧州（上）",
        "url": "https://www.bilibili.com/video/BV1hghQzxEJ7",
        "date": "2025-08-29",
        "aid": 115110441916420,
        "views": 857863,
        "danmaku": 10540
    },
    {
        "title": "苏北人称呼是怎么来的，江苏最大城市为什么又称为北上海和苏北小韩国？快递里的中国 江苏 盐城",
        "url": "https://www.bilibili.com/video/BV1DV3Ez1E39",
        "date": "2025-07-04",
        "aid": 114793922959005,
        "views": 463266,
        "danmaku": 8733
    },
    {
        "title": "苏鲁之战江苏踢到铁板的海贼王之城 快递里的中国 山东 日照",
        "url": "https://www.bilibili.com/video/BV1eQ4y1W7t5",
        "date": "2023-10-27",
        "aid": 705146163,
        "views": 361590,
        "danmaku": 2933
    },
    {
        "title": "快递里的中国-辽宁（重置1）质疑世界的辽西  锦州、葫芦岛、朝阳",
        "url": "https://www.bilibili.com/video/BV1Lh411g7ik",
        "date": "2023-04-07",
        "aid": 227131256,
        "views": 247095,
        "danmaku": 2922
    },
    {
        "title": "藩镇割据苏州省 快递里的中国-江苏（4）苏州的常熟张家港太仓昆山",
        "url": "https://www.bilibili.com/video/BV17k4y1s7UT",
        "date": "2023-06-02",
        "aid": 741848090,
        "views": 319434,
        "danmaku": 2481
    },
    {
        "title": "快递里的中国-安徽（2）绷不住了的皖北穷鬼团，蚌埠，宿州，淮北",
        "url": "https://www.bilibili.com/video/BV1ZX4y1Q7uZ",
        "date": "2023-02-27",
        "aid": 352737113,
        "views": 476913,
        "danmaku": 5020
    },
    {
        "title": "被一场抢劫毁掉的一座军火王城 快递里的中国 山东烟台 莱阳 海阳",
        "url": "https://www.bilibili.com/video/BV1HB421z731",
        "date": "2024-02-08",
        "aid": 1350420133,
        "views": 389743,
        "danmaku": 1873
    },
    {
        "title": "被夺走万亿的悲惨王城-快递里的中国 绍兴",
        "url": "https://www.bilibili.com/video/BV1KV411A7Y2",
        "date": "2023-09-21",
        "aid": 406154070,
        "views": 314636,
        "danmaku": 4021
    },
    {
        "title": "被歪曲千年之城，都怪柳宗元 快递里的中国 湖南 永州",
        "url": "https://www.bilibili.com/video/BV1ZC4y1n77Q",
        "date": "2023-10-30",
        "aid": 747830231,
        "views": 269693,
        "danmaku": 2359
    },
    {
        "title": "被黑最惨的城市？中国哥谭？快递里的中国-湖南 衡阳难过",
        "url": "https://www.bilibili.com/video/BV1Ah4y1m7Yg",
        "date": "2023-08-31",
        "aid": 660406781,
        "views": 958141,
        "danmaku": 6835
    },
    {
        "title": "襄阳牛肉面吃倒辛吉飞，湖北老二被抢了，还被金庸告了。流年不利的襄阳 快递里的中国 湖北 襄阳",
        "url": "https://www.bilibili.com/video/BV1Rx2MB8EUN",
        "date": "2025-11-07",
        "aid": 115507508285484,
        "views": 461799,
        "danmaku": 7862
    },
    {
        "title": "西安居然被偷袭？神对手不如神队友！快递里的中国 西安",
        "url": "https://www.bilibili.com/video/BV1EQ6CYbEFT",
        "date": "2025-01-02",
        "aid": 113761302156500,
        "views": 398062,
        "danmaku": 8012
    },
    {
        "title": "说个名字都打起来你敢信？什么叫江苏？快递里的中国 江苏 淮安 打成一锅粥",
        "url": "https://www.bilibili.com/video/BV1Qs421T7F3",
        "date": "2024-06-27",
        "aid": 1855831184,
        "views": 517576,
        "danmaku": 8069
    },
    {
        "title": "谁才是货真价实的东北第一城？新任东北魅魔又是谁？出马仙之都在哪里？快递里的中国 辽宁 辽阳",
        "url": "https://www.bilibili.com/video/BV1G12qBgEKp",
        "date": "2025-12-04",
        "aid": 115663133741417,
        "views": 900399,
        "danmaku": 9011
    },
    {
        "title": "貌似没落在电商时代的广州，实则是隐藏BOSS  快递里的中国 广州（1） 世界商都 快递王者",
        "url": "https://www.bilibili.com/video/BV1Lc41167Gf",
        "date": "2023-11-16",
        "aid": 281077486,
        "views": 509015,
        "danmaku": 4632
    },
    {
        "title": "赣南穷鬼团，正宗前首都 快递里的中国 江西 赣州（下）",
        "url": "https://www.bilibili.com/video/BV1D8LJztEM5",
        "date": "2025-04-25",
        "aid": 114397812887729,
        "views": 443975,
        "danmaku": 7134
    },
    {
        "title": "快递里的中国-内蒙古（1）东北热河，憋屈汗国。赤峰、通辽",
        "url": "https://www.bilibili.com/video/BV1Be4y1373B",
        "date": "2023-01-06",
        "aid": 649893412,
        "views": 194513,
        "danmaku": 2287
    },
    {
        "title": "身为江苏前省会但最憋屈的苦逼城市 快递里的中国 江苏 镇江",
        "url": "https://www.bilibili.com/video/BV1QZ421i7wv",
        "date": "2024-04-11",
        "aid": 1152820205,
        "views": 812951,
        "danmaku": 8120
    },
    {
        "title": "躺平之都逆子对战 快递里的中国-浙江 被壮汉围住的嘉兴",
        "url": "https://www.bilibili.com/video/BV1414y1B7LQ",
        "date": "2023-08-04",
        "aid": 786788339,
        "views": 326549,
        "danmaku": 4442
    },
    {
        "title": "辣条其实是混血产物？快递里的中国特别版 湖南 岳阳 平江县",
        "url": "https://www.bilibili.com/video/BV1sy411B7LM",
        "date": "2024-07-14",
        "aid": 1956109725,
        "views": 346443,
        "danmaku": 1430
    },
    {
        "title": "边境重镇但上不了热搜 快递里的中国-黑龙江的牡丹江",
        "url": "https://www.bilibili.com/video/BV1L44y1F77Q",
        "date": "2023-08-19",
        "aid": 999951603,
        "views": 247619,
        "danmaku": 2120
    },
    {
        "title": "这个小城市竟然是攒劲业初代先行者？城市文旅最伟大的操盘，一个大姐引发的南登北调事件！ 快递里的中国 吉林 白城",
        "url": "https://www.bilibili.com/video/BV1cuaozxEFN",
        "date": "2025-09-08",
        "aid": 115167887103002,
        "views": 303463,
        "danmaku": 6222
    },
    {
        "title": "这城市一改名，安徽省都要跟着改 快递里的中国 池州 徽州（黄山）安徽旅游团",
        "url": "https://www.bilibili.com/video/BV1cu4y1L7Vt",
        "date": "2023-12-01",
        "aid": 919010722,
        "views": 311804,
        "danmaku": 3514
    },
    {
        "title": "连云港上演真实狂飙 江苏不团结谣言被打破 快递里的中国 江苏 连云港",
        "url": "https://www.bilibili.com/video/BV1Nn4y1o7qa",
        "date": "2024-05-22",
        "aid": 1054948840,
        "views": 464740,
        "danmaku": 2430
    },
    {
        "title": "迷你版的成渝世代仇 江八县的相爱相杀 快递里的中国 重庆（3）",
        "url": "https://www.bilibili.com/video/BV1bZ421x7Gv",
        "date": "2024-05-18",
        "aid": 1154500105,
        "views": 292743,
        "danmaku": 5424
    },
    {
        "title": "逆子横行的金华-快递里的中国-浙江 金华。中国永康亚洲横店世界义乌",
        "url": "https://www.bilibili.com/video/BV1Nk4y1J7xR",
        "date": "2023-04-21",
        "aid": 740310944,
        "views": 344709,
        "danmaku": 4605
    },
    {
        "title": "偷袭顺丰的新快递之都 快递里的中国-湖北（3）空港鄂州",
        "url": "https://www.bilibili.com/video/BV1t94y1q7Fa",
        "date": "2023-07-20",
        "aid": 361224176,
        "views": 221333,
        "danmaku": 1742
    },
    {
        "title": "重庆人不分东西？是男人的天堂？快递里的中国 重庆（4）大结局",
        "url": "https://www.bilibili.com/video/BV14f421e7LR",
        "date": "2024-08-23",
        "aid": 1206657856,
        "views": 390673,
        "danmaku": 7851
    },
    {
        "title": "阳谋高手重庆及消失了的万州 快递里的中国 重庆 （1）",
        "url": "https://www.bilibili.com/video/BV1cC41187mw",
        "date": "2024-03-21",
        "aid": 1952032609,
        "views": 893093,
        "danmaku": 9186
    },
    {
        "title": "除了网红还有什么？山东最穷彩礼最高最能喝酒，隐觅在曹县身后的菏泽 快递里的中国 山东 菏泽",
        "url": "https://www.bilibili.com/video/BV1Mf421X7Tq",
        "date": "2024-05-31",
        "aid": 1205425369,
        "views": 263088,
        "danmaku": 2723
    },
    {
        "title": "隐藏在湖北省的俄罗斯飞地？荆楚大乱斗的始作俑者！快递里的中国 湖北 荆门",
        "url": "https://www.bilibili.com/video/BV19MJPzwEnP",
        "date": "2025-05-17",
        "aid": 114522249500215,
        "views": 3040849,
        "danmaku": 7539
    },
    {
        "title": "青岛为啥总上热门？快递里的中国 山东 青岛",
        "url": "https://www.bilibili.com/video/BV11c44e3E2B",
        "date": "2024-09-12",
        "aid": 113126234134100,
        "views": 358923,
        "danmaku": 9302
    },
    {
        "title": "快递里的中国-安徽（1）徽京一脉。芜湖、马鞍山、滁州、宣城",
        "url": "https://www.bilibili.com/video/BV1ZP4y1676i",
        "date": "2023-01-20",
        "aid": 905564234,
        "views": 248589,
        "danmaku": 4282
    },
    {
        "title": "高级黑才是真的黑 快递里的中国-河南南阳",
        "url": "https://www.bilibili.com/video/BV1M34y1G7j2",
        "date": "2023-10-08",
        "aid": 831993094,
        "views": 276107,
        "danmaku": 2349
    },
    {
        "title": "高考复读圣地也是中国鹅城 快递里的中国-安徽 六安 霸都合肥唯一的好朋友",
        "url": "https://www.bilibili.com/video/BV1Yu4y1d7Yx",
        "date": "2023-06-08",
        "aid": 827074018,
        "views": 179133,
        "danmaku": 1577
    },
    {
        "title": "魔都电商都卖啥？快递里的中国告诉你-上海。万城之上，海纳百川",
        "url": "https://www.bilibili.com/video/BV1qD4y1w7jr",
        "date": "2023-02-16",
        "aid": 736925763,
        "views": 167256,
        "danmaku": 2156
    },
    {
        "title": "鹤岗凭什么有机场？从鹤岗机场，聊到我国行政体系中的特殊建制 快递里的中国 番外篇",
        "url": "https://www.bilibili.com/video/BV1Phbnz9E4F",
        "date": "2025-08-15",
        "aid": 115031890992687,
        "views": 458764,
        "danmaku": 4668
    },
    {
        "title": "黄河穿流的西域出口，四面树敌的西北重镇 快递里的中国 甘肃省会 兰州",
        "url": "https://www.bilibili.com/video/BV1umy2YYEmM",
        "date": "2024-10-25",
        "aid": 113366316095139,
        "views": 480227,
        "danmaku": 7835
    },
    {
        "title": "黑枪之王 拉面之王 神奇的青海老二 快递里的中国-海东",
        "url": "https://www.bilibili.com/video/BV1nj41177Hv",
        "date": "2023-11-23",
        "aid": 451272327,
        "views": 434669,
        "danmaku": 2266
    },
    {
        "title": "黑猴子带火关羽故里，一眼误终身也是盗墓天团 快递里的中国 山西 运城",
        "url": "https://www.bilibili.com/video/BV1yS42197aG",
        "date": "2024-08-30",
        "aid": 1506509061,
        "views": 375626,
        "danmaku": 4724
    },
    {
        "title": "黑茶传销骗子，红十字会一生之敌故里 快递里的中国 湖南 益阳",
        "url": "https://www.bilibili.com/video/BV1EdBCBEE3n",
        "date": "2025-12-27",
        "aid": 115791630507409,
        "views": 288210,
        "danmaku": 4701
    }
];
