


let finished = false;
const investBtn = document.getElementById("investBtn");
var modal = document.getElementById("popUp");
var lot ={
            id: '',
            product: '',
            veriety: '',
            region: '',
            status: true,
            start: '',
            finish: '',
            score: '',
            goal: "",
            raised: "",
            location: "",
        };
function initializePage(){
    let firstRowEls = document.getElementsByClassName("first_row");
    let secodRowEls = document.getElementsByClassName("second_row");
    lot.id = document.URL.split("id=")[1].split("&")[0];
    secodRowEls[1].value = lot.id;
    lot.serverId = document.URL.split("serverId=")[1].split("&")[0];
    lot.goal = document.URL.split("goal=")[1].split("&")[0];
    lot.raised = document.URL.split("raised=")[1].split("&")[0];
    let progress = document.getElementById("progress");
    progress.value = parseFloat(lot.raised);
    progress.max =  parseFloat(lot.goal);
    lot.location = document.URL.split("location=")[1].split("&")[0];
    secodRowEls[2].value = lot.location;
    lot.start = document.URL.split("start=")[1].split("&")[0];
    lot.finish = document.URL.split("finish=")[1].split("&")[0];
    firstRowEls[3].innerHTML += lot.start + " >>" + lot.finish;
    lot.score = document.URL.split("score=")[1].split("&")[0];
    secodRowEls[0].value = lot.score;
    lot.veriety = decodeURI(document.URL).split("veriety=")[1].split("&")[0];
    firstRowEls[1].innerHTML += lot.veriety;
    lot.product = decodeURI(document.URL).split("product=")[1].split("&")[0];
    firstRowEls[0].innerHTML += lot.product;
    lot.region = decodeURI(document.URL).split("region=")[1].split("&")[0];
    firstRowEls[2].innerHTML += lot.region;
    investBtn.disabled = (new Date() > new Date(lot.finish));
    document.getElementById("goalCash").value = lot.goal;
    let logoPath = "";
    if(lot.product === "ხორბალი") logoPath = "./img/wheat.jpg";
    else logoPath = "./img/sunflower.jpg";
    document.getElementsByClassName("lot_img")[0].src = logoPath ;
    setCurCash();
}

function setCurCash(){
    document.getElementById("curCash").innerHTML = "მოგროვებული თანხა: " + lot.raised;
}

function invest(){
    modal.style.display = "block";
}

function change(){
    let secodRowEls = document.getElementsByClassName("second_row");
    lot.goal =document.getElementById("goalCash").value;
    lot.id =secodRowEls[1].value;
    lot.score = secodRowEls[0].value;
    lot.location = secodRowEls[2].value;
    if(lot.goal.length == 0 || lot.id.length == 0 || lot.score.length == 0 || lot.location.length == 0){
        alert("შეავსეთ ყველა ველი")
    }else{
        updateObject(lot.serverId, lot);
    }
}

function closeInvestPopUp(){
    modal.style.display = "none";
}

function onCardNumberChange(e){
    let cardNum = e.target;
    if(!isFinite(cardNum.value[cardNum.value.length - 1]) || cardNum.value.length > 18){
        alert("შეიყვანე ვალიდური ანგარიშის ნომერი");
        cardNum.value = "";
    }else if(cardNum.value.length == 4 || cardNum.value.length== 9){
        cardNum.value+=" ";
    }
}

function onCardExpChange(e){
    let cardExp = e.target;
    if(!isFinite(cardExp.value[cardExp.value.length - 1]) || cardExp.value.length > 5){
        alert("შეიყვანე ვალიდური ანგარიშის ნომერი");
        cardExp.value = "";
    }else if(cardExp.value.length == 2){
        cardExp.value+="/";
    }
}

function onPay(e){
    let amount = document.getElementById("cashAmount").value;
    amount = parseFloat(amount);
    let goal = parseFloat(lot.goal);
    let progress = document.getElementById("progress");
    if(amount + parseFloat(lot.raised) <= goal && amount > 0){
        updateLot(lot.serverId, (amount + parseFloat(lot.raised)) );
        progress.value += amount;
        document.getElementById("curCash").innerHTML = progress.value;
        modal.style.display = "none";
        if(!window.localStorage.getItem("myLots").includes(lot.serverId,0)){
            let curLots = window.localStorage.getItem("myLots") + " " + lot.serverId;
            window.localStorage.setItem("myLots",curLots);
        }
    }else{
        alert("მითითებული თანხა არ აკმაყოფილებს შესატან ფარგლებს");
    }
}

function moveToMyLots(e){
    window.location.href="./myLots.html";
}

