
let doc = document;



const makeHtmlPlayers = () => {
    let players = ["정기", "영수", "광호", "원식", "형성"];
    let playersHtml = "";
    Array.from(players).forEach(function(player) {
        playersHtml += `<button onclick="addPlayer('${player}')">${player}</button>`
    });
    doc.getElementById("players").innerHTML = playersHtml;
}

const init = () => {
    makeHtmlPlayers();
}

init();

const playerSet = new Set();
const addPlayer = (playerName) => {
    playerSet.add(playerName);
    makeTodayPlayers(playerSet);
    makeTodayBet(playerSet);
    makeTodayStake(playerSet);
    makeBalance(playerSet);
    calculateStake();
}

const makeTodayPlayers = (playerSet) => {

    let todayPlayersHtml = "";
    for(let player of playerSet) {
        todayPlayersHtml += `<button>${player} <span>x</span></button>`;
    }
    doc.getElementById("today_players").innerHTML = todayPlayersHtml;
}

const makeTodayBet = (playerSet) => {
    let playerBetHtml = "";
    let index = 0;
    for(const player of playerSet) {
        playerBetHtml += `<div>
                            <span>${player}</span> 
                            <button onclick="addBet(${index}, 50000)"><span>50000</span></button>
                            <button onclick="addBet(${index}, 100000)"><span>100000</span></button>
                            <button onclick="addBet(${index}, 150000)"><span>150000</span></button>
                            <button onclick="addBet(${index}, 200000)"><span>200000</span></button>
                            <button onclick="initBet(${index})"><span>초기화</span></button>
                        </div>`;
        index ++;
    }
    doc.getElementById("player_bet").innerHTML = playerBetHtml;
}


const makeTodayStake = (playerSet) => {
    let stakeHtml = "";
    let index = 0;
    for(const player of playerSet) {
        stakeHtml += `<div>
                        <span>${player}</span>
                        <span id="stake${index}" class="stake" data-player="${player}">50000</span>
                        <span>원</span>
                      </div>`;
        index ++;              
    }
    doc.getElementById("player_stake").innerHTML = stakeHtml;

}

const makeBalance = () => {
    let balanceHtml = "";
    let index = 0;

    for(const player of playerSet) {
        balanceHtml += `<div>
                          <span>${player}</span>
                          <span><input type="text" class="balance_input" onkeyup="leftBalance()"></span>
                        </div>`;
        index ++;              
    }
    doc.getElementById("player_balance").innerHTML = balanceHtml;
}

const addBet = (playerIndex, addMoney) => {
    let stakeId = "stake"+playerIndex;
    let currentStake = Number(doc.getElementById(stakeId).innerHTML);
    let addedStake = currentStake + Number(addMoney);
    doc.getElementById(stakeId).innerHTML = addedStake;
    calculateStake();
    
}



const calculateStake = () => {
    let amountStake = 0;
    let stakes = doc.getElementsByClassName("stake");
    if(stakes.length != 0) {
        for(let stake of stakes) {
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
    

    for(let i=0; i<stakeList.length; i++) {
        amountBalance = amountBalance + Number(balanceList[i].value);
        amountStake = amountStake + Number(stakeList[i].innerHTML);
        let resultBalance = -1 * (Number(stakeList[i].innerHTML) - Number(balanceList[i].value));
        
        if(resultBalance > 0) {
            winnerMap.set(stakeList[i].dataset.player, resultBalance);
        }else if(resultBalance < 0) {
            loserMap.set(stakeList[i].dataset.player, resultBalance);
        }
        
        resultHtml += `<div>
                         <span>${stakeList[i].dataset.player}</span>
                         <span>${resultBalance}</span>
                         <span>원</span>
                       </div>`;
    }

    if(amountBalance != amountStake) {
        alert("남은 잔액 입력이 틀렸습니다, 확인 후 다시 입력해 주세요");
        return;
    }
    
    doc.getElementById("result").innerHTML = resultHtml;

    let winnerArr = Array.from(winnerMap);
    let loserArr = Array.from(loserMap);
    console.log(winnerArr);
    console.log(loserArr);
    winnerArr = winnerArr.sort((a,b) => b[1] - a[1]);
    loserArr = loserArr.sort((a,b) => a[1] - b[1]);

    let sortedWinnerMap = new Map(winnerArr);
    let sortedLoserMap = new Map(loserArr);

    console.log("sortedWinnerMap", sortedWinnerMap);
    console.log("sortedLoserMap", sortedLoserMap);

    
   

}

const leftBalance = () => {
    let stakeList = doc.getElementsByClassName("stake");
    let balanceList = doc.getElementsByClassName("balance_input");
    let amountStake = 0;
    let amountBalance = 0;
    for(let i=0; i<stakeList.length; i++) {
        amountBalance = amountBalance + Number(balanceList[i].value);
        amountStake = amountStake + Number(stakeList[i].innerHTML);
    }
    let leftBalanceValue = amountStake - amountBalance;
    doc.getElementById("left_balance").innerHTML = leftBalanceValue;
}



doc.getElementById("calcBtn").addEventListener("click", calcBtn);
