let state = { money: 1000, gems: 50, lv: 1, exp: 0, isAwakened: false, currentChapter: 0, characters: [] };
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
        state.gems += 10; state.money += 500;
        localStorage.setItem('lastLogin', today);
        alert("ログインボーナス！石10個と500ゴールド獲得！");
    }
}

function gacha() {
    if (state.gems >= 50) {
        state.gems -= 50;
        const charNames = ["妖精の弓使い", "炎の魔術師", "鋼鉄の守護者", "闇の暗殺者"];
        const result = charNames[Math.floor(Math.random() * charNames.length)];
        
        // 重複チェック（既に持っていたらメッセージのみにする等の拡張が可能）
        if (!state.characters.includes(result)) {
            state.characters.push(result);
            alert("召喚成功！新しいキャラ「" + result + "」を手に入れた！");
        } else {
            alert("召喚結果：「" + result + "」\n（既に所持しています）");
        }
        updateUI(); saveGame();
    } else alert("石が足りません");
}

function train() {
    if (state.money >= 100) {
        state.money -= 100; state.exp += 25;
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
    
    // キャラクターリスト表示の修正
    const charListEl = document.getElementById('char-list');
    charListEl.innerText = state.characters.length > 0 ? "所持キャラ: " + state.characters.join(", ") : "所持キャラ: なし";
    
    const img = document.getElementById('char-image');
    if (state.isAwakened) {
        img.src = "https://via.placeholder.com/300x500/e74c3c/ffffff?text=Awakened";
        document.getElementById('char-name').innerText = "真の騎士";
    }
}

window.onload = loadGame;

function resetGame() {
    if (confirm("データを完全にリセットしますか？この操作は取り消せません。")) {
        localStorage.removeItem('myRpgSave');
        localStorage.removeItem('lastLogin');
        location.reload(); // ページをリロードして初期状態にする
    }
}

