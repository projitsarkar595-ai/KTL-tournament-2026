import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

import { 
getDatabase,
ref,
push,
set,
onValue
}
from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";


const firebaseConfig = {

apiKey:"YOUR_KEY",
authDomain:"YOUR_DOMAIN",
databaseURL:"https://ktl---tournament-2026-default-rtdb.asia-southeast1.firebasedatabase.app/",
projectId:"YOUR_ID",
storageBucket:"YOUR_BUCKET",
messagingSenderId:"YOUR_MSG",
appId:"YOUR_APP"

};


const app = initializeApp(firebaseConfig);

const db = getDatabase(app);



window.addPlayer=function(){

let name=document.getElementById("name").value;
let team=document.getElementById("team").value;


set(push(ref(db,"players")),{

name:name,
team:team,
status:"active"

})
.then(()=>{
alert("Player Added");
})
.catch(e=>alert(e));

}
 // live sync
 let list = document.getElementById("list");

if(list){

onValue(ref(db,"players"),(snapshot)=>{

list.innerHTML="";

snapshot.forEach((child)=>{

let data = child.val();

list.innerHTML += `
<p>
${data.name} - ${data.team}
</p>
`;

});

});

}
let players=[];


onValue(ref(db,"players"),(snapshot)=>{

players=[];

snapshot.forEach((child)=>{

let data=child.val();

players.push(data.name);

});

});



window.startDraw=function(){

if(players.length==0){

alert("No Players");

return;

}


let count=0;


let timer=setInterval(()=>{


let random =
players[Math.floor(Math.random()*players.length)];


document.getElementById("winner").innerHTML=random;


count++;


if(count>20){

clearInterval(timer);


saveWinner(random);

}


},100);

}
window.saveWinner=function(name){

set(push(ref(db,"winners")),{

name:name,
time: new Date().toString()

})
.then(()=>{

alert("Winner Saved");

});

}
let nextPlayers=[];


onValue(ref(db,"winners"),(snapshot)=>{

nextPlayers=[];

snapshot.forEach((child)=>{

let data=child.val();

nextPlayers.push(data.name);

});


let box=document.getElementById("players");


if(box){

box.innerHTML="";


nextPlayers.forEach(p=>{

box.innerHTML += `<p>${p}</p>`;

});

}

});



window.createNextRound=function(){


set(ref(db,"round2"),{

players:nextPlayers

})
.then(()=>{

alert("Next Round Created");

});


}
window.setChampion=function(){

let name = prompt("Enter Champion Name");


set(ref(db,"champion"),{

name:name,
date:new Date().toString()

})
.then(()=>{

alert("Champion Saved");

});

}



onValue(ref(db,"champion"),(snap)=>{


let data=snap.val();


if(data){

document.getElementById("championName")
.innerHTML=data.name;

}

});
