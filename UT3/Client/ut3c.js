let ws=new WebSocket("ws://192.168.136.70:3001");
let filled=['','','','','','','','',''];
let role;

//Websocket|	basic stuff and general setup
ws.onopen=()=>{
	//final preparation for a new game
	document.querySelectorAll('.n').forEach(item => {
		item.addEventListener("click",event=>{
			id=event.path[0].id;
			ws.send(id);
		});
	});
};

ws.onclose=()=>{
	console.log('Server went offline.');
};

//message recieved
ws.onmessage=(message)=>{
	message=message.data;
	if(message.slice(0,1)==='['){
		message=JSON.parse(message)
		main(message);
	}else{
		if(message==='reset'){reset()}
		//roleassingment
		if(message==='1'){document.getElementById('?').innerHTML='<img src=Cross.png>\tYou are player 1.\t<img src=Cross.png>'}
		if(message==='2'){document.getElementById('?').innerHTML='<img src=Circle.png>\tYou are player 2.\t<img src=Circle.png>'}
		if(message==='s'){
			document.getElementById('?').innerHTML='Stay a while and watch.';
			return;
		}
	}
};


//Functions
//Managing recieved message information
function main(message){
	fieldControl(message);
	lockdown('0'+message[9]);
	turn(message[10]);
}

//Handles clicked area
function fieldControl(message){
	for(i=1;i<10;i++){for(j=1;j<10;j++){
		id=i +''+ j;
		if(message[i-1][j-1]!==null){
			document.getElementById(id).classList.remove('n');
			if(message[i-1][j-1]==='X'){
				document.getElementById(id).classList.add('X');
			}else{document.getElementById(id).classList.add('O')}
	}	}
		
		if(message[i-1][10]===1){filled[i-1]='0'+ i}
		if(message[i-1][9]!==null &&
			document.getElementById('0'+i).classList.contains('x')!==true ||
			document.getElementById('0'+i).classList.contains('o')!==true){
			document.getElementById('0'+i).classList.add(message[i-1][9]);
}	}	}

//Reseting the game
function reset(){
	filled=['','','','','','','','',''];
	lockdown('reset');
	fieldWipe();
}
//resets the whole game area
function fieldWipe(){
	var id;
	for(i=1;i<10;i++){
		for(j=1;j<10;j++){
			id=i +''+ j;
			document.getElementById(id).className="n"
		}id='0'+i;
		document.getElementById(id).className="";
	}
}

//Locks all unplayable fields
function lockdown(id){
	if(id==='0null'){return}
	if(	id==='reset'||
			id===filled[0]||id===filled[1]||id===filled[2]||
			id===filled[3]||id===filled[4]||id===filled[5]||
			id===filled[6]||id===filled[7]||id===filled[8]){
				document.getElementById('01').classList.remove("l");
				document.getElementById('02').classList.remove("l");
				document.getElementById('03').classList.remove("l");
				document.getElementById('04').classList.remove("l");
				document.getElementById('05').classList.remove("l");
				document.getElementById('06').classList.remove("l");
				document.getElementById('07').classList.remove("l");
				document.getElementById('08').classList.remove("l");
				document.getElementById('09').classList.remove("l");			
	}else{
		document.getElementById('01').classList.add("l");
		document.getElementById('02').classList.add("l");
		document.getElementById('03').classList.add("l");
		document.getElementById('04').classList.add("l");
		document.getElementById('05').classList.add("l");
		document.getElementById('06').classList.add("l");
		document.getElementById('07').classList.add("l");
		document.getElementById('08').classList.add("l");
		document.getElementById('09').classList.add("l");
		if(id!==undefined){document.getElementById(id).classList.remove("l")}
	}
}

//Changes turns
function turn(turnData){
	if(turnData===0||turnData===undefined){
		document.getElementById('status').innerHTML="<img src=Cross.png>\tTurn: Player 1\t<img src=Cross.png>"
	}else if(turnData==='X'){
		document.getElementById('status').innerHTML="<img src=Cross.png>\tPlayer 1 Won\t<img src=Cross.png>";
		lockdown();
	}else if(turnData==='O'){
		document.getElementById('status').innerHTML="<img src=Circle.png>\tPlayer 2 Won\t<img src=Circle.png>";
		lockdown();
	}else{
		document.getElementById('status').innerHTML="<img src=Circle.png>\tTurn: Player 2\t<img src=Circle.png>"
	}
}