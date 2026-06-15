// --- ゲームの状態（セーブデータ） ---
let state = { money: 1000, gems: 50, lv: 1, exp: 0, isAwakened: false, currentChapter: 0, characters: [] };

// --- データベース（物語、画像URL） ---
const storyData = [
    { text: "序章：見習い騎士の孤独な日々...", req: 0 },
    { text: "第1章：予期せぬ襲撃、覚醒の時。", req: 5 },
    { text: "第2章：裏切りの真相と、深まる謎。", req: 10 }
];

// ガチャで手に入るキャラと画像の対応（後で用意するファイル名）
const gachaList = [
    { name: "妖精の弓使い", img: "Images/chara_elf.png" },
    { name: "炎の魔術師", img: "Images/chara_witch.png" }
];

// --- システム機能（セーブ、ロード、リセット） ---
function saveGame() { localStorage.setItem('myRpgSave', JSON.stringify(state)); }
function loadGame() {
    const saved = localStorage.getItem('myRpgSave');
    if (saved) state = JSON.parse(saved);
    checkLoginBonus();
    updateUI();
}
function resetGame() {
    if (confirm("データを完全にリセットしますか？\n所持キャラも消滅します。")) {
        localStorage.removeItem('myRpgSave');
        localStorage.removeItem('lastLogin');
        location.reload();
    }
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

// --- ゲームアクション機能 ---
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

function gacha() {
    if (state.gems >= 50) {
        state.gems -= 50;
        const result = gachaList[Math.floor(Math.random() * gachaList.length)];
        
        // 重複チェック
        const isNew = !state.characters.some(c => c.name === result.name);
        if (isNew) {
            state.characters.push(result);
            alert("召喚成功！新しいキャラ「" + result.name + "」を手に入れた！");
        } else {
            alert("召喚結果：「" + result.name + "」\n（既に所持しています）");
        }
        updateUI(); saveGame();
    } else alert("石が足りません");
}

function evolve() {
    if (state.lv >= 5 && !state.isAwakened) {
        state.isAwakened = true;
        updateUI(); saveGame();
        alert("覚醒！！！真の姿へと進化した！");
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

// --- UI更新機能（ここが一番重要） ---
function updateUI() {
    // ステータステキストの更新
    document.getElementById('gems').innerText = state.gems;
    document.getElementById('money').innerText = state.money;
    document.getElementById('char-lv').innerText = state.lv;
    document.getElementById('char-exp').innerText = state.exp;
    document.getElementById('story-text').innerText = storyData[state.currentChapter].text;
    
    // 所持キャラリスト表示
    const charListEl = document.getElementById('char-list');
    const names = state.characters.map(c => c.name);
    charListEl.innerText = names.length > 0 ? "所持キャラ: " + names.join(", ") : "所持キャラ: なし";
    
    // 立ち絵と名前の出し分けロジック
    const imgEl = document.getElementById('char-image');
    const nameEl = document.getElementById('char-name');
    
    // CSSクラスを一度リセット
    imgEl.classList.remove('awakened');

    if (state.isAwakened) {
        // 覚醒時
        imgEl.src = "Images/chara_awakened.png";
        nameEl.innerText = "真の騎士";
        imgEl.classList.add('awakened'); // 豪華な演出用クラス
    } else if (state.characters.length > 0) {
        // ガチャキャラがいれば、直近にゲットしたキャラを表示
        const lastChar = state.characters[state.characters.length - 1];
        imgEl.src = lastChar.img;
        nameEl.innerText = lastChar.name;
    } else {
        // 初期状態
        imgEl.src = "Images/chara_knight.png";
        nameEl.innerText = "見習い騎士";
    }
}

// 起動時にロード
window.onload = loadGame;
