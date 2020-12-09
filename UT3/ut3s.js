//dependencies
const wsserver=require('ws').Server;
const express=require('express');
const path=require('path');
//sending necessary files
const app=express();
const htmlPath=path.join(__dirname,'Client');
const httpserver=app.listen(3000,()=>{
	const port=httpserver.address().port;
	const host='192.168.136.70';
	console.log('Listening on http://'+host+':'+port+'/');
});
app.use(express.static(htmlPath));
//necesities for the websocket
const wss=new wsserver({port:3001});
let players=[,,[]];
let data=[
	[,,,,,,,,,,,0],	[,,,,,,,,,,,0],	[,,,,,,,,,,,0],
	[,,,,,,,,,,,0],	[,,,,,,,,,,,0],	[,,,,,,,,,,,0],
	[,,,,,,,,,,,0],	[,,,,,,,,,,,0],	[,,,,,,,,,,,0],null,0,
];
/*
structure of data=[
	[field1,who won it,all used up?],[same],[same],
	[same],[same],[same],
	[same],[same],[same],next field,who plays?
]
*/
wss.on('connection',(ws)=>{

	//Roledistribution
	if(players[0]===undefined){
		players[0]=ws;
		console.log('Player 1 connected.');
		setTimeout(()=>{ws.send('1')},2000);
	}else if(players[1]===undefined){
		players[1]=ws;
		console.log('Player 2 connected.');
		setTimeout(()=>{ws.send('2')},2000);
	}else{
		players[2].push(ws);
		console.log('A spectator connected');
		setTimeout(()=>{ws.send('s')},2000);
	};

	//Sending current state
	ws.send(JSON.stringify(data));
	
	//Data relaying
	ws.on('message',(message)=>{
		if(ws!==players[data[10]]){return}
		main(message);
		sned(JSON.stringify(data));
	});

	//Redistribution of roles on Disconnect
	ws.on('close',()=>{
		if(players[2].length===0){
			if(players[0]===ws){
				players[0]=undefined;
				console.log('Player 1 disconnected.');
			}else if(players[1]===ws){
				players[1]=undefined;
				console.log('Player 2 disconnected.');
			}
		}else if(ws!==players[0]&&ws!==players[1]){
			players[2].push(players[2].splice(players[2].indexOf(ws), 1));
			players[2].pop();
			console.log('A spectator disconnected.')
		}else{
			var i=Math.floor((Math.random()*players[2].length)); 
			if(players[0]===ws){
				players[0]=players[2][i];
				players[2][i].send('1');
				console.log('Player 1 was reassinged.');
			}else if(players[1]===ws){
				players[1]=players[2][i];
				players[2][i].send('2');
				console.log('Player 2 was reassinged.');
			}players[2].splice(i,i+1);
		}
	});
});

//Functions
//sending the data to clients
function sned(ms){
	for(i=0;i<2;i++){
		if(players[i]!==undefined){players[i].send(ms)}
	}for(i=0;i<players[2].length;i++){
		players[2][i].send(ms);
	}
}

//returning gamestatus to start
function reset(){
	data=[
		[,,,,,,,,,,,0],	[,,,,,,,,,,,0],	[,,,,,,,,,,,0],
		[,,,,,,,,,,,0],	[,,,,,,,,,,,0],	[,,,,,,,,,,,0],
		[,,,,,,,,,,,0],	[,,,,,,,,,,,0],	[,,,,,,,,,,,0],null,0,
	];
	sned('reset');
}

//main functions of the game
function main(id){
	Fieldlogger(id);
	Fieldcheck(id);
	wincon();
}

//Records each turn
function Fieldlogger(id){
	var a=id.slice(0,1)-1,	b=id.slice(1);
	data[9]=b--;	data[10]=++data[10]%2;
	if(data[10]===0){data[a][b]='O'}else{data[a][b]='X'};
}

//Records current status of field
function Fieldcheck(id){
	var a=id.slice(0,1)-1;
	if(data[a][9]===undefined){if(
		data[a][0]===data[a][1]&&data[a][1]===data[a][2]&&data[a][2]!==undefined||
		data[a][3]===data[a][4]&&data[a][4]===data[a][5]&&data[a][5]!==undefined||
		data[a][6]===data[a][7]&&data[a][7]===data[a][8]&&data[a][8]!==undefined||
		data[a][0]===data[a][3]&&data[a][3]===data[a][6]&&data[a][6]!==undefined||
		data[a][1]===data[a][4]&&data[a][4]===data[a][7]&&data[a][7]!==undefined||
		data[a][2]===data[a][5]&&data[a][5]===data[a][8]&&data[a][8]!==undefined||
		data[a][0]===data[a][4]&&data[a][4]===data[a][8]&&data[a][4]!==undefined||
		data[a][2]===data[a][4]&&data[a][4]===data[a][6]&&data[a][4]!==undefined){
			if(data[10]===1){data[a][9]='x'}else{data[a][9]='o'}
	}	}
	if(	data[a][0]!==undefined && data[a][1]!==undefined && data[a][2]!==undefined &&
			data[a][3]!==undefined && data[a][4]!==undefined && data[a][5]!==undefined &&
			data[a][6]!==undefined && data[a][7]!==undefined && data[a][8]!==undefined){
				data[a][10]=1;
				if(data[a][9]===undefined){if(Math.random()*2+1===1){
					data[a][9]='x';
			}else{data[a][9]='o'};
		}
	}	
}

//Win-Condition
function wincon(){
	if(data[11]===undefined){if(
		data[0][9]===data[1][9]&&data[1][9]===data[2][9]&&data[2][9]!==undefined||
		data[3][9]===data[4][9]&&data[4][9]===data[5][9]&&data[5][9]!==undefined||
		data[6][9]===data[7][9]&&data[7][9]===data[8][9]&&data[8][9]!==undefined||
		data[0][9]===data[3][9]&&data[3][9]===data[6][9]&&data[6][9]!==undefined||
		data[1][9]===data[4][9]&&data[4][9]===data[7][9]&&data[7][9]!==undefined||
		data[2][9]===data[5][9]&&data[5][9]===data[8][9]&&data[8][9]!==undefined||
		data[0][9]===data[4][9]&&data[4][9]===data[8][9]&&data[4][9]!==undefined||
		data[2][9]===data[4][9]&&data[4][9]===data[6][9]&&data[4][9]!==undefined){
			if(data[10]===1){data[10]='X'}else{data[10]='O'}
			setTimeout(function(){reset()},10000)
		}
}	}