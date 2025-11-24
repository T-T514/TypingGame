let nowWord = ""; // 現在の問題
let input = ""; // 現在の入力
let inputCnt = 0; // 入力回数
let time = 0; // 制限時間
let timePlusFlag = false; // 制限時間を増やすかどうかのフラグ
let noMissCnt = 0; // ノーミスの回数
let missCnt = 0; // タイプミスの回数
let question = new Array(); // 出題問題
let meaning = new Array(); // 英単語の意味

window.addEventListener("load", () => {
    createGenreList();
});

// ジャンルリスト作成
function createGenreList() {
    let wordCnt = 0;
    let option;
    for (let genre in  QUESTION_LIST) {
        option = document.createElement("option");
        option.text  = QUESTION_LIST[genre]["name"] + " : " + QUESTION_LIST[genre]["word"].length;
        option.value = genre;
        document.getElementById("genre").add(option, null);
        wordCnt += QUESTION_LIST[genre]["word"].length;
    }
    option = document.createElement("option");
    option.text  = "全て : " + wordCnt;
    option.value = "all";
    option.selected = true;
    document.getElementById("genre").prepend(option);
}

// ゲームスタート
function gameStart() {
    readQuestion();
    selectQuestion();
    time = document.getElementById("timeLimit").value;
    document.getElementById("time").textContent = "残り時間：" + time + "秒";
    document.getElementById("question").style.display = "block";
    document.getElementById("meaning").style.display = "inline-block";
    document.getElementById("input").textContent = input;
    document.getElementById("show").textContent = nowWord;
    document.getElementById("rapidFireMeter").style.display = "block";
    document.getElementById("noMiss").textContent = noMissCnt;
    document.getElementById("explanation").style.display = "none";
    let timerId = setInterval(() => {
        if (timePlusFlag == true) {
            time++;
            timePlusFlag = false;
            document.getElementById("time").textContent = "残り時間：" + time + " + 1秒";
        } else {
            time--;
            document.getElementById("time").textContent = "残り時間：" + time + "秒";
        }
        if (time <= 10) {
            document.getElementById("time").style.color = "red";
        } else {
            document.getElementById("time").style.color = "black";
        }
        if (time <= 0) {
            clearInterval(timerId);
            gameFinish();
        }
    }, 1000);
}

// ゲーム終了
function gameFinish() {
    document.getElementById("time").style.display = "none";
    document.getElementById("question").style.display = "none";
    document.getElementById("rapidFireMeter").style.display = "none";
    document.getElementById("result").style.display = "block";
    setTimeout(() => {
        if (document.getElementById("genre").value == "all") {
            document.getElementById("selectedGenre").textContent = "全て";
        } else {
            document.getElementById("selectedGenre").textContent = QUESTION_LIST[document.getElementById("genre").value]["name"];
        }
    }, 1000);
    setTimeout(() => {
        document.getElementById("inputCnt").textContent = inputCnt + "文字";
    }, 1750);
    setTimeout(() => {
        document.getElementById("miss").textContent = missCnt + "文字";
    }, 2500);
    setTimeout(() => {
        document.getElementById("accuracyRate").textContent = Math.floor((inputCnt - missCnt) / inputCnt * 100) + "%";
        document.getElementById("reload").style.display = "inline-block";
    }, 3250);
}

// 問題の読み込み
function readQuestion() {
    let genre = document.getElementById("genre").value;
    if (genre == "all") {
        for (let key in QUESTION_LIST) {
            for (let word of QUESTION_LIST[key]["word"]) {
                let index = word.indexOf("_");
                question.push(word.slice(0, index));
                meaning.push(word.slice(index + 1));
            }
        }
    } else {
        for (let word of QUESTION_LIST[genre]["word"]) {
            let index = word.indexOf("_");
            question.push(word.slice(0, index));
            meaning.push(word.slice(index + 1));
        }
    }
}

// 問題の変更
function changeQuestion() {
    selectQuestion();
    input = "";
}

// 問題の選択
function selectQuestion() {
    let index;
    do {
        index = Math.floor(Math.random() * question.length);
    } while (input == question[index]);
    nowWord = question[index];
    document.getElementById("meaning").textContent = meaning[index];
}

// 入力された文字があっているかどうかの判定
function judgement(key) {
    // 入力した文字があっている場合
    if (nowWord[0].toLowerCase() == key.toLowerCase()) {
        input += nowWord[0];
        nowWord = nowWord.slice(1);
        if (nowWord.length == 0) {
            changeQuestion();
        }
        noMissCnt++;
        if (noMissCnt >= document.getElementById("meter").max) {
            noMissCnt = 0;
            timePlusFlag = true;
        }
    }
    // 入力した文字が間違っている場合
    else {
        missCnt++;
        noMissCnt = 0;
    }
    inputCnt++;
    document.getElementById("input").textContent = input;
    document.getElementById("show").textContent = nowWord;
    document.getElementById("noMiss").textContent = noMissCnt;
    document.getElementById("meter").value = noMissCnt;
}

// キー押下時のイベント
window.addEventListener("keydown", (e) => {
    if (nowWord != "") {
        judgement(e.key);
    } else {
        if (e.code == "Space" || e.code == "Enter") {
            gameStart();
        }
    }
});
