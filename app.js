let state = { money: 1000, gems: 50, lv: 1, exp: 0, isAwakened: false, currentChapter: 0 };
const storyData = [
    { text: "序章：見習い騎士の孤独な日々...", req: 0 },
    { text: "第1章：予期せぬ襲撃、覚醒の時。", req: 5 },
    { text: "第2章：裏切りの真相と、深まる謎。", req: 10 }
];

function saveGame() { localStorage.setItem('myRpgSave', JSON.stringify(state)); }

function loadGame() {
    const saved = localStorage.getItem('myRpgSave');
    if (saved) state = JSON.parse(saved);
    checkLoginBonus();
    updateUI();
}

function checkLoginBonus() {
    const lastLogin = localStorage.getItem('lastLogin');
    const today = new Date().toDateString();
    if (lastLogin !== today) {
        state.gems += 10;
        state.money += 500;
        localStorage.setItem('lastLogin', today);
        alert("ログインボーナス！石10個と500ゴールド獲得！");
    }
}

function train() {
    if (state.money >= 100) {
        state.money -= 100;
        state.exp += 25;
        if (state.exp >= 100) { state.lv++; state.exp = 0; }
        updateUI(); saveGame();
    } else alert("資金不足です");
}

function explore() {
    const gain = Math.floor(Math.random() * 200) + 100;
    state.money += gain;
    updateUI(); saveGame();
    alert(gain + "ゴールド獲得！");
}

function evolve() {
    if (state.lv >= 5 && !state.isAwakened) {
        state.isAwakened = true;
        updateUI(); saveGame();
    } else alert("進化にはLv.5以上が必要です");
}

function nextStory() {
    if (state.currentChapter + 1 < storyData.length) {
        if (state.lv >= storyData[state.currentChapter + 1].req) {
            state.currentChapter++;
            updateUI(); saveGame();
        } else alert("続きにはLv." + storyData[state.currentChapter + 1].req + "が必要です");
    }
}

function updateUI() {
    document.getElementById('gems').innerText = state.gems;
    document.getElementById('money').innerText = state.money;
    document.getElementById('char-lv').innerText = state.lv;
    document.getElementById('char-exp').innerText = state.exp;
    document.getElementById('story-text').innerText = storyData[state.currentChapter].text;
    const img = document.getElementById('char-image');
    if (state.isAwakened) {
        img.src = "https://via.placeholder.com/300x500/e74c3c/ffffff?text=Awakened";
        document.getElementById('char-name').innerText = "真の騎士";
    }
}

window.onload = loadGame;
