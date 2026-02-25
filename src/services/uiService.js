// UI服务模块 - 处理用户界面相关功能

import { getVideosForProvince, getVideosForCity } from '../utils/dataUtils.js';

let checkCanVoteFn = null;
let voteDataRef = null;
let generateRankListHTMLFn = null;

/**
 * 初始化投票服务依赖（避免循环依赖）
 * @param {Function} checkCanVote - 检查是否可投票函数
 * @param {Object} voteData - 投票数据引用
 * @param {Function} generateRankListHTML - 生成排行榜HTML函数
 */
function initVoteServiceDeps(checkCanVote, voteData, generateRankListHTML) {
    checkCanVoteFn = checkCanVote;
    voteDataRef = voteData;
    generateRankListHTMLFn = generateRankListHTML;
}

/**
 * 显示省份的所有视频
 * @param {string} provinceName - 省份名称
 */
function showProvinceVideos(provinceName) {
    const infoEmpty = document.querySelector('.info-empty');
    const infoContent = document.getElementById('info-content');
    const cityNameEl = document.getElementById('city-name');
    const videoList = document.getElementById('video-list');

    const videos = getVideosForProvince(provinceName);

    if (videos.length === 0) {
        return;
    }

    cityNameEl.textContent = provinceName;

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

    infoEmpty.style.display = 'none';
    infoContent.style.display = 'block';

    infoContent.style.opacity = '0';
    infoContent.style.transform = 'translateX(20px)';

    setTimeout(() => {
        infoContent.style.transition = 'all 0.3s ease';
        infoContent.style.opacity = '1';
        infoContent.style.transform = 'translateX(0)';
    }, 10);
}

/**
 * 显示城市信息
 * @param {string} cityName - 城市名称
 */
function showCityInfo(cityName) {
    const infoEmpty = document.querySelector('.info-empty');
    const infoContent = document.getElementById('info-content');
    const cityNameEl = document.getElementById('city-name');
    const videoList = document.getElementById('video-list');

    let displayName = cityName;
    displayName = displayName.replace(/市$/, '');
    displayName = displayName.replace(/区|地区|自治区|特别行政区$/, '');

    const videos = getVideosForCity(displayName);

    console.log('showCityInfo called:', { cityName, displayName, videosLength: videos.length });

    cityNameEl.textContent = cityName;

    if (videos.length === 0) {
        console.log('No videos found, showing vote UI for:', cityName);
        showVoteUI(cityName, cityNameEl, videoList, infoEmpty, infoContent);
        return;
    }

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

    infoEmpty.style.display = 'none';
    infoContent.style.display = 'block';

    infoContent.style.opacity = '0';
    infoContent.style.transform = 'translateX(20px)';

    setTimeout(() => {
        infoContent.style.transition = 'all 0.3s ease';
        infoContent.style.opacity = '1';
        infoContent.style.transform = 'translateX(0)';
    }, 10);
}

/**
 * 隐藏城市信息
 */
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

/**
 * 显示投票界面
 * @param {string} cityName - 城市名称
 * @param {HTMLElement} cityNameEl - 城市名称元素
 * @param {HTMLElement} videoList - 视频列表元素
 * @param {HTMLElement} infoEmpty - 空信息元素
 * @param {HTMLElement} infoContent - 信息内容元素
 */
function showVoteUI(cityName, cityNameEl, videoList, infoEmpty, infoContent) {
    console.log('showVoteUI called for:', cityName);
    const canVote = checkCanVoteFn ? checkCanVoteFn() : true;
    const currentVotes = voteDataRef && voteDataRef[cityName]?.votes ? voteDataRef[cityName].votes : 0;

    console.log('Vote info:', { canVote, currentVotes, cityName });

    cityNameEl.textContent = cityName;

    videoList.innerHTML = `
        <div class="vote-ui">
            <div class="vote-ui-icon">🗳️</div>
            <div class="vote-ui-title">暂无视频</div>
            <div class="vote-ui-desc">这个地区还没有相关视频，期待UP主的后续更新吗？</div>
            <div class="vote-ui-stats">
                <span class="vote-ui-count">${currentVotes} 人期待</span>
            </div>
            <button class="vote-ui-btn ${canVote ? '' : 'disabled'}" data-city="${cityName}">
                ${canVote ? '🎯 为TA投票' : '已投票'}
            </button>
        </div>
    `;

    infoEmpty.style.display = 'none';
    infoContent.style.display = 'block';

    infoContent.style.opacity = '0';
    infoContent.style.transform = 'translateX(20px)';

    setTimeout(() => {
        infoContent.style.transition = 'all 0.3s ease';
        infoContent.style.opacity = '1';
        infoContent.style.transform = 'translateX(0)';
    }, 10);
}

/**
 * 显示投票确认对话框
 * @param {string} cityName - 城市名称
 */
function showVoteConfirmDialog(cityName) {
    const modal = document.getElementById('vote-confirm-modal');
    const cityNameEl = document.getElementById('vote-confirm-city');

    if (modal && cityNameEl) {
        cityNameEl.textContent = cityName;
        modal.dataset.city = cityName;
        modal.style.display = 'flex';
    }
}

/**
 * 隐藏投票确认对话框
 */
function hideVoteConfirmDialog() {
    const modal = document.getElementById('vote-confirm-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * 显示排行榜面板
 */
function showRankPanel() {
    const rankPanel = document.getElementById('rank-panel');
    if (rankPanel) {
        rankPanel.style.display = 'flex';
        if (generateRankListHTMLFn) {
            generateRankListHTMLFn();
        }
    }
}

/**
 * 隐藏排行榜面板
 */
function hideRankPanel() {
    const rankPanel = document.getElementById('rank-panel');
    if (rankPanel) {
        rankPanel.style.display = 'none';
    }
}

export {
    showProvinceVideos,
    showCityInfo,
    hideCityInfo,
    showVoteUI,
    showVoteConfirmDialog,
    hideVoteConfirmDialog,
    showRankPanel,
    hideRankPanel,
    initVoteServiceDeps
};
