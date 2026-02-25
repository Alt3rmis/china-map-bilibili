// 主应用入口 - 初始化和协调各个模块

import { loadMapData, backToChina } from './services/mapService.js';
import { loadVotesFromServer, confirmVote, initVoteService } from './services/voteService.js';
import { showVoteConfirmDialog, hideVoteConfirmDialog, showRankPanel, hideRankPanel, hideCityInfo } from './services/uiService.js';
import { isDevMode, createDebugToggleBtn, createDebugPanel, isDebugPanelClosed } from './utils/debugUtils.js';
import { checkData } from './utils/dataUtils.js';
import { getChart } from './utils/state.js';

const dataMode = checkData();

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    const closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener('click', hideCityInfo);

    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', backToChina);

    const rankBtn = document.getElementById('rank-btn');
    if (rankBtn) {
        rankBtn.addEventListener('click', showRankPanel);
    }

    const rankCloseBtn = document.getElementById('rank-close-btn');
    if (rankCloseBtn) {
        rankCloseBtn.addEventListener('click', hideRankPanel);
    }

    const rankPanel = document.getElementById('rank-panel');
    if (rankPanel) {
        rankPanel.addEventListener('click', function(e) {
            if (e.target === rankPanel) {
                hideRankPanel();
            }
        });
    }

    const videoList = document.getElementById('video-list');
    if (videoList) {
        videoList.addEventListener('click', function(e) {
            const voteBtn = e.target.closest('.vote-ui-btn');
            if (voteBtn && !voteBtn.classList.contains('disabled')) {
                const cityName = voteBtn.dataset.city;
                showVoteConfirmDialog(cityName);
            }
        });
    }

    const voteConfirmCancel = document.getElementById('vote-confirm-cancel');
    const voteConfirmConfirm = document.getElementById('vote-confirm-confirm');
    const voteConfirmModal = document.getElementById('vote-confirm-modal');

    if (voteConfirmCancel) {
        voteConfirmCancel.addEventListener('click', hideVoteConfirmDialog);
    }

    if (voteConfirmConfirm) {
        voteConfirmConfirm.addEventListener('click', confirmVote);
    }

    if (voteConfirmModal) {
        voteConfirmModal.addEventListener('click', function(e) {
            if (e.target === voteConfirmModal) {
                hideVoteConfirmDialog();
            }
        });
    }
}

window.addEventListener('resize', function() {
    const chart = getChart();
    if (chart) {
        chart.resize();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initVoteService();
    loadMapData();
    setupEventListeners();
    loadVotesFromServer();

    if (isDevMode()) {
        const toggleBtn = createDebugToggleBtn();
        if (!isDebugPanelClosed()) {
            createDebugPanel();
        } else {
            toggleBtn.style.display = 'block';
        }
    }
});
