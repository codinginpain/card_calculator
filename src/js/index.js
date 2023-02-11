
let doc = document;



const addEvent = () => {
    doc.getElementById("init_btn").addEventListener("click", () => { window.location.reload() })
}

const makeHtmlPlayers = () => {
    let players = ["정기", "영수", "광호", "원식", "형성"];
    let playersHtml = "";
    Array.from(players).forEach(function (player) {
        playersHtml += `<button onclick="addPlayer('${player}')">${player}</button>`
    });
    doc.getElementById("players").innerHTML = playersHtml;
}

const init = () => {
    addEvent();
    makeHtmlPlayers();
}



init();

const playerSet = new Set();
const addPlayer = (playerName) => {
    playerSet.add(playerName);
    // makeTodayPlayers(playerSet);
    makeTodayBet(playerSet);
    makeTodayStake(playerSet);
    makeBalance(playerSet);
    calculateStake();
}

// const makeTodayPlayers = (playerSet) => {

//     let todayPlayersHtml = "";
//     for(let player of playerSet) {
//         todayPlayersHtml += `<button>${player} <span>x</span></button>`;
//     }
//     doc.getElementById("today_players").innerHTML = todayPlayersHtml;
// }

const removePlayer = (divTag) => {

    divTag.remove();
}

const makeTodayBet = (playerSet) => {
    let playerBetHtml = "";
    let index = 0;
    for (const player of playerSet) {
        playerBetHtml += `<div id='${player}'>
                            <span>${player}</span> 
                            <button onclick="addBet(${index}, 50000)"><span>50000</span></button>
                            <button onclick="addBet(${index}, 100000)"><span>100000</span></button>
                            <button onclick="addBet(${index}, 150000)"><span>150000</span></button>
                            <button onclick="addBet(${index}, 200000)"><span>200000</span></button>
                            <button onclick="removePlayer(${player})"><span>x</span></button>
                        </div>`;
        // <button onclick="removePlayer(${index}, 200000)"><span>x</span></button>
        // <button onclick="initBet(${index})"><span>초기화(기능 준비중..)</span></button>
        index++;
    }
    doc.getElementById("player_bet").innerHTML = playerBetHtml;
}


const makeTodayStake = (playerSet) => {
    let stakeHtml = "";
    let index = 0;
    for (const player of playerSet) {
        stakeHtml += `<div>
                        <span>${player}</span>
                        <span id="stake${index}" class="stake" data-player="${player}">0</span>
                        <span>원</span>
                      </div>`;
        index++;
    }
    doc.getElementById("player_stake").innerHTML = stakeHtml;

}

const makeBalance = () => {
    let balanceHtml = "";
    let index = 0;

    for (const player of playerSet) {
        balanceHtml += `<div>
                          <span>${player}</span>
                          <span><input type="text" style='width: 70px' class="balance_input" onkeyup="leftBalance()"></span>
                        </div>`;
        index++;
    }
    doc.getElementById("player_balance").innerHTML = balanceHtml;
}

const addBet = (playerIndex, addMoney) => {
    let stakeId = "stake" + playerIndex;
    // let currentStake = Number(doc.getElementById(stakeId).innerHTML);
    // let addedStake = currentStake + Number(addMoney);
    doc.getElementById(stakeId).innerHTML = addMoney;
    calculateStake();

}



const calculateStake = () => {
    let amountStake = 0;
    let stakes = doc.getElementsByClassName("stake");
    if (stakes.length != 0) {
        for (let stake of stakes) {
            amountStake += Number(stake.innerHTML);
        }
    }
    doc.getElementById("stakeSum").innerHTML = amountStake + "원";
}



const calcBtn = () => {
    console.log("calc btn clicked");
    let stakeList = doc.getElementsByClassName("stake");
    let balanceList = doc.getElementsByClassName("balance_input");
    let resultHtml = "";
    let amountStake = 0;
    let amountBalance = 0;

    let winnerMap = new Map();
    let loserMap = new Map();


    for (let i = 0; i < stakeList.length; i++) {
        console.log("stakeList", stakeList[i].dataset.player);
        amountBalance = amountBalance + Number(balanceList[i].value);
        amountStake = amountStake + Number(stakeList[i].innerHTML);
        let resultBalance = -1 * (Number(stakeList[i].innerHTML) - Number(balanceList[i].value));

        if (resultBalance > 0) {
            winnerMap.set(stakeList[i].dataset.player, resultBalance);
        } else if (resultBalance < 0) {
            loserMap.set(stakeList[i].dataset.player, (resultBalance * -1));
        }

        resultHtml += `<div>
                         <span>${stakeList[i].dataset.player}</span>
                         <span>${resultBalance}</span>
                         <span>원</span>
                       </div>`;
    }

    if (amountBalance != amountStake) {
        alert("남은 잔액 입력이 틀렸습니다, 확인 후 다시 입력해 주세요");
        return;
    }

    doc.getElementById("result").innerHTML = resultHtml;


    const sortedWinnerMap = new Map([...winnerMap.entries()].sort((a, b) => b[1] - a[1]));
    const sortedLoserMap = new Map([...loserMap.entries()].sort((a, b) => b[1] - a[1]));

    const winnerArr = Array.from(sortedWinnerMap.keys());
    const loserArr = Array.from(sortedLoserMap.keys());
    const winnerValArr = Array.from(sortedWinnerMap.values());
    const loserValArr = Array.from(sortedLoserMap.values());
    const winnerLen = winnerArr.length;
    const loserLen = loserArr.length;

    if (winnerLen == 0) {
        //이체 할 돈이 없습니다.
        return;
    }

    let resultStr = "";
    let j = 0;
    let k = 0;

    if (winnerLen >= loserLen) {
        //case1 winner의 수가 많을 때
        // console.log("case1 starts");
        for (let i = 0; i < loserLen; i++) {
            while (loserValArr[i] > 0) { //루저의 돈이 남아 있고
                if (loserValArr[i] <= winnerValArr[j]) { //루저의 돈이 위너 금액보다 적거나 같으면 다 준다
                    resultStr += `${loserArr[i]}가 ${winnerArr[j]}에게 ${loserValArr[i]}원을 이체 하세요./`;
                    winnerValArr[j] = winnerValArr[j] - loserValArr[i];
                    loserValArr[i] = 0;
                } else { // 루저의 돈이 위너보다 많으면 위너는 받을돈이 0원 된다.
                    loserValArr[i] = loserValArr[i] - (winnerValArr[j]);
                    resultStr += `${loserArr[i]}가 ${winnerArr[j]}에게 ${winnerValArr[j]}원을 이체 하세요./`;
                    winnerValArr[j] = 0
                    j++
                }
            }
        }
    } else if (winnerLen < loserLen) {
        //case2 loser의 수가 많을 때
        // console.log("case2 stats");
        for (let i = 0; i < winnerLen; i++) {
            while (winnerValArr[i] > 0) { // 위너가 받을 돈이 남아 있을 때
                if (winnerValArr[i] <= loserValArr[j]) { //위너의 돈이 루저의 돈보다 적으면 위너가 받을돈을 0원으로 만든다
                    resultStr += `${loserArr[j]}가 ${winnerArr[i]}에게 ${winnerValArr[i]}원을 이체 하세요/`;
                    loserValArr[j] = loserValArr[j] - winnerValArr[i];
                    winnerValArr[i] = 0;
                } else { //위너의 돈이 루저의 돈보다 많으면 루저의 돈을 모두 주고 0원으로 만든다
                    winnerValArr[i] = winnerValArr[i] - loserValArr[j];
                    resultStr += `${loserArr[j]}가 ${winnerArr[i]}에게 ${loserValArr[j]}원을 이체 하세요./`;
                    loserValArr[j] = 0;
                    j++;
                }
            }
        }

    }
    // else if (winnerLen === loserLen) {
    //     // console.log("case3 starts");
    //     //case3 winner와 loser의 수가 같음
    //     for (let i = 0; i < winnerLen; i++) {
    //         while (winnerValArr[i] > 0 || loserValArr[i] > 0) {
    //             if (winnerValArr[i + k] <= loserValArr[i + j]) {
    //                 resultStr += `${loserArr[i + j]}가 ${winnerArr[i + k]}에게 ${winnerValArr[i + k]}원을 이체 하세요./`;
    //                 loserValArr[i + j] = loserValArr[i + j] - winnerValArr[i + k];
    //                 winnerValArr[i] = 0
    //                 k++;
    //             } else {
    //                 resultStr += `${loserArr[i + j]}가 ${winnerArr[i + k]}에게 ${loserValArr[i + j]}원을 이체 하세요./`;
    //                 winnerValArr[i + k] = winnerValArr[i + k] - (loserValArr[i + j]);
    //                 loserValArr[i + j] = 0;
    //                 j++;
    //             }
    //         }
    //     }
    // }
    console.log("brefore result");
    console.log(resultStr);
    let resultSpan = "";
    let resultSentence = resultStr.split("/");
    resultSentence.forEach((result) => {
        resultSpan += `<div><span>${result}</span></div>`;
    });
    doc.getElementById("transfer_prediction").innerHTML = resultSpan
}

const leftBalance = () => {
    let stakeList = doc.getElementsByClassName("stake");
    let balanceList = doc.getElementsByClassName("balance_input");
    let amountStake = 0;
    let amountBalance = 0;
    for (let i = 0; i < stakeList.length; i++) {
        amountBalance = amountBalance + Number(balanceList[i].value);
        amountStake = amountStake + Number(stakeList[i].innerHTML);
    }
    let leftBalanceValue = amountStake - amountBalance;
    doc.getElementById("left_balance").innerHTML = leftBalanceValue;
}


doc.getElementById("calcBtn").addEventListener("click", calcBtn);
