// Telegram WebApp init
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Theme colors
tg.setHeaderColor('#0a0a0a');
tg.setBackgroundColor('#0a0a0a');

// Parse initData
const initData = tg.initData || '';
const initDataUnsafe = tg.initDataUnsafe || {};
const user = initDataUnsafe.user || {};

// Data from Telegram
let userData = {
    id: user.id || 0,
    username: user.username || 'worker',
    profits_count: 0,
    profits_sum: 0,
    current_streak: 0,
    max_streak: 0,
    rank: '🟢 NEW',
    role: 'ВОРКЕР',
    days_in_team: 0,
    position: '-',
    exp_current: 0,
    exp_next: 3,
    mentor_id: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupHapticFeedback();
});

function setupHapticFeedback() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            tg.HapticFeedback.impactOccurred('light');
        });
    });
}

function loadUserData() {
    // In real implementation, fetch from your API
    // For now using Telegram user data
    document.getElementById('username').textContent = '@' + userData.username;
    document.getElementById('userId').textContent = userData.id;
    document.getElementById('role').textContent = userData.role;
    document.getElementById('rankBadge').textContent = userData.rank;
    document.getElementById('profitsCount').textContent = userData.profits_count;
    document.getElementById('profitsSum').textContent = userData.profits_sum.toLocaleString();
    document.getElementById('streak').textContent = userData.current_streak;
    document.getElementById('maxStreak').textContent = userData.max_streak + ' дней';
    document.getElementById('daysInTeam').textContent = userData.days_in_team + ' дней';
    document.getElementById('topPosition').textContent = userData.position;

    // Progress bar
    const progress = Math.min(100, (userData.exp_current / userData.exp_next) * 100);
    document.getElementById('expBar').style.width = progress + '%';
    document.getElementById('expText').textContent = `${userData.exp_current} / ${userData.exp_next} профитов`;

    // Mentor
    if (userData.mentor_id) {
        document.getElementById('mentorRow').style.display = 'flex';
        document.getElementById('mentorName').textContent = 'ID ' + userData.mentor_id;
    }

    // Referral link
    const botUsername = 'shutter_island_bot'; // Change to your bot
    document.getElementById('refLink').textContent = `https://t.me/${botUsername}?start=ref${userData.id}`;

    // Load top
    loadTop();
}

function loadTop() {
    const topList = document.getElementById('topList');
    const mockTop = [
        { rank: 1, name: '@elite_worker', profits: 156, sum: 450000 },
        { rank: 2, name: '@crypto_king', profits: 134, sum: 380000 },
        { rank: 3, name: '@dark_matter', profits: 98, sum: 290000 },
        { rank: 4, name: '@ghost_pro', profits: 87, sum: 245000 },
        { rank: 5, name: '@shadow', profits: 65, sum: 180000 },
    ];

    topList.innerHTML = mockTop.map((item, index) => `
        <div class="top-item" onclick="tg.HapticFeedback.impactOccurred('light')">
            <div class="top-rank">#${item.rank}</div>
            <div class="top-info">
                <div class="top-name">${item.name}</div>
                <div class="top-stats">${item.profits} профитов</div>
            </div>
            <div class="top-profits">${item.sum.toLocaleString()} ₽</div>
        </div>
    `).join('');
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');

    tg.HapticFeedback.impactOccurred('medium');
}

function copyRef() {
    const link = document.getElementById('refLink').textContent;
    navigator.clipboard.writeText(link).then(() => {
        tg.HapticFeedback.notificationOccurred('success');
        tg.showPopup({
            title: 'Скопировано!',
            message: 'Реферальная ссылка скопирована в буфер обмена',
            buttons: [{type: 'ok'}]
        });
    });
}

function closeApp() {
    tg.HapticFeedback.impactOccurred('heavy');
    tg.close();
}