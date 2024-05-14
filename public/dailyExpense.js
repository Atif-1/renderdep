const form=document.querySelector('form');
const body=document.querySelector('body');
const main=document.querySelector('main');
const nav=document.querySelector('nav');
const table=document.querySelector('#expense-list');
const board=document.querySelector('#leaderboard')
const premiumBtn=document.querySelector("#rzp-btn1");
const buyBtnMsg=document.querySelector('#buy-btn-msg');
const downloadBtn=document.querySelector('#download-btn');
const downloadList=document.querySelector('#download-links');
const dailyList=document.querySelector('#daily-exp');
const dailyBtn=document.querySelector('#dailyBtn');
const weeklyList=document.querySelector('#weekly-exp');
const weeklyBtn=document.querySelector('#weeklyBtn');
const monthlyList=document.querySelector('#monthly-exp');
const monthlyBtn=document.querySelector('#monthlyBtn');
const pagination=document.querySelector('#exp-pagination');
const rows=document.querySelector('#row-num');
const fromLabel=document.querySelector('#fromDate');
const toLabel=document.querySelector('#toDate');
localStorage.setItem("rows",rows.value);
var totalExpenses=[];
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
const token=localStorage.getItem("token");
window.addEventListener('DOMContentLoaded',async ()=>{
	try{
	const page=1;
	const result=await axios.get(`http://43.205.195.48:3000/expense/getExpenses/${page}`,{headers:{'Authorization':token,'rows':localStorage.getItem("rows")}})
		for(let i=0;i<result.data.expenses.length;i++){
			display(result.data.expenses[i]);
		}
		showPagination(result.data);
		const decodedTkn=parseJwt(token);
		if(decodedTkn.ispremium==true){
			premiumBtn.remove();
			buyBtnMsg.innerHTML="You Are A Premium User";
			buyBtnMsg.style.color="gold";
			buyBtnMsg.style.background="darkred";
			buyBtnMsg.style.fontSize="large";
			const proFeature1=document.createElement('button');
			proFeature1.id="leaderboard-btn";
			proFeature1.append(document.createTextNode("Leaderboard"));
			nav.append(proFeature1);
			proFeature1.addEventListener('click',leaderBoard);
			dailyBtn.disabled=false;
			weeklyBtn.disabled=false;
			monthlyBtn.disabled=false;
		}
		else{
			premiumBtn.addEventListener('click',buypremium);
			downloadBtn.disabled="true";
			
		}
		const downloads=await axios.get("http://43.205.195.48:3000/downloads/getDownloadLinks",{headers:{'Authorization':token}});
		for(let i=0;i<downloads.data.downloadLinks.length;i++){
			showDownloads(downloads.data.downloadLinks[i]);
		}
		const res=await axios.get(`http://43.205.195.48:3000/expense/getTotalExpenses`,{headers:{'Authorization':token}});
		totalExpenses=[...res.data];
		
	}catch(err){console.log(err);}
})

form.addEventListener('submit',addExpense);

function addExpense(e){
	e.preventDefault();
	const amount=document.querySelector('#amount').value;
	const description=document.querySelector('#description').value;
	const category=document.querySelector('#category').value;
	const expObject=new Object();
	expObject.amount=amount;
	expObject.description=description;
	expObject.category=category;
	const authHeader={
		headers:{
			"Authorization":token
		}
	}
	axios.post("http://43.205.195.48:3000/expense/addExpense",expObject,authHeader).then((result) => {
		alert("please refresh the page");
	}).catch((err) => {
		console.log(err);
	});
}
function display(obj){
	const tr=document.createElement('tr');
	const idInp=document.createElement('input');
	idInp.value=obj.id;
	idInp.type="hidden";
	const td1=document.createElement('td');
	td1.appendChild(idInp);
	tr.appendChild(td1);
	const td3=document.createElement('td');
	td3.append(document.createTextNode(obj.amount));
	tr.appendChild(td3);
	const td4=document.createElement('td');
	td4.append(document.createTextNode(obj.description));
	tr.appendChild(td4);
	const td5=document.createElement('td');
	td5.append(document.createTextNode(obj.category));
	tr.appendChild(td5);
	const delBtn=document.createElement('button');
	delBtn.className="delBtn";
	delBtn.append(document.createTextNode("delete expense"));
	const td6=document.createElement('td');
	td6.append(delBtn);
	tr.appendChild(td6);
	table.appendChild(tr);
	delBtn.addEventListener('click',deleteExpense);
	function deleteExpense(e){ 	
		console.log(e.target.parentElement.parentElement.firstChild.firstChild.value);
		const id=(e.target.parentElement.parentElement.firstChild.firstChild).value;
		const authHeader={
			headers:{
				"Authorization":token
			}
		}
		axios.delete("http://43.205.195.48:3000/expense/deleteExpense/"+id,authHeader).then((result) => {
			alert("please refresh the page");
			console.log(result.data.message);
		}).catch((err) => {
			console.log(err);
		});
	}
}

async function buypremium(e){
	const response=await axios.get('http://43.205.195.48:3000/purchase/premiummembership',{headers:{"Authorization":token}});
	console.log(response);
	var options={
		"key":response.data.key_id,
		"order_id":response.data.order.id,
		"handler":async function(result){
			await axios.post('http://43.205.195.48:3000/purchase/updatetransactionstatus',{
				status:'success',
				order_id:options.order_id,
				payment_id:result.razorpay_payment_id},{
					headers:{"Authorization":token}	
			})
			alert("Your are premium member");
		},
	};
	const rzp1=new Razorpay(options);
		rzp1.open();
		e.preventDefault();
		rzp1.on('payment.failed',function(result){
			axios.post('http://43.205.195.48:3000/purchase/updatetransactionstatus',{
				status:'failed',
				order_id:options.order_id,
				payment_id:result.error.metadata.payment_id},{
					headers:{"Authorization":token}	
			})
			alert(" Transaction Failed");
		});

}
function leaderBoard(){
	axios.get('http://43.205.195.48:3000/premium/leaderboard',{headers:{"Authorization":token}}).then((result) => {
		result.data.forEach((obj) => {
			showLeaderboard(obj);
		});
	}).catch((err) => {
		console.log(err);
	});
	document.getElementById('leaderboard-btn').disabled=true;
}
function showLeaderboard(obj){
	const li=document.createElement('li');
	li.append(document.createTextNode(`Name:${obj.name} Total Expense:${obj.total_cost}`));
	board.appendChild(li);
}
function download(){
		axios.get('http://43.205.195.48:3000/premium/download', { headers: {"Authorization" : token} })
		.then((response) => {
			if(response.status === 200){
				var a = document.createElement("a");
				a.href = response.data.fileUrl;
				a.download = 'myexpense.csv';
				a.click();
			} else {
				throw new Error(response.data.message)
			}
	
		})
		.catch((err) => {
			console.log(err);
		});
}
function showDownloads(obj){
	const li=document.createElement('li');
	const a=document.createElement('a');
	a.href=obj.url;
	a.append(document.createTextNode(obj.url));
	li.append(a);
	li.append(document.createTextNode(" | "+obj.createdAt));
	downloadList.appendChild(li);
}
function dailyExp(){
	let dailyExpenses=[];
	const h4=document.createElement('h4');
	h4.style.color="red";
	for(let exp of totalExpenses){
		if(new Date(exp.createdAt).getFullYear()== new Date().getFullYear()){
			if(new Date(exp.createdAt).getDate()== new Date().getDate() && new Date(exp.createdAt).getMonth()== new Date().getMonth()){
				dailyExpenses.push(exp);
			}
		}
	}
	if(dailyExpenses.length>0){
		let dailyTotal=0
		for(let exp of dailyExpenses){
			total+=exp.amount;
			const li=document.createElement('li');
			li.append(document.createTextNode(`Amount:${exp.amount} Description:${exp.description} Category:${exp.category}`));
			dailyList.appendChild(li);
		}
		h4.append(document.createTextNode(`Total  Expense-:${dailyTotal}`));
		dailyList.appendChild(h4);
	}
	else{
		h4.append(document.createTextNode('No expense'));
		dailyList.appendChild(h4);
	}
	dailyBtn.style.visibility="hidden";
}
function weeklyExp(){
	let dateOffset = (24*60*60*1000) * 6; //6 days
	let end = new Date();
	let start=new Date();

	start.setTime(end.getTime() - dateOffset);
	const weeklyExpenses=[];
	const h4=document.createElement('h4');
	h4.style.color="red";
	if(start && end){
		for(let exp of totalExpenses){
			if(new Date(exp.createdAt).getFullYear()>=new Date(start).getFullYear() && new Date(exp.createdAt).getFullYear()<=new Date(end).getFullYear()){
				if(new Date(exp.createdAt).getMonth()>=new Date(start).getMonth() && new Date(exp.createdAt).getMonth()<=new Date(end).getMonth()){
					if(new Date(exp.createdAt).getDate()>=new Date(start).getDate() && new Date(exp.createdAt).getDate()<=new Date(end).getDate()){
						weeklyExpenses.push(exp);
					}
				}
			}
		}
		if(weeklyExpenses.length>0){
			let weeekTotal=0;
			for(let exp of weeklyExpenses){
				weeekTotal+=exp.amount;
				const li=document.createElement('li');
				li.append(document.createTextNode(`Amount:${exp.amount} Description:${exp.description} Category:${exp.category}`));
				weeklyList.appendChild(li);
			}
			h4.append(document.createTextNode(` Total Expense-:${weeekTotal}`));
			weeklyList.appendChild(h4);
		}
		else{
			h4.append(document.createTextNode(`No expenses`));
			weeklyList.appendChild(h4);
		}
		weeklyBtn.style.visibility="hidden";
	}
	else{
		alert("please fill start and end date");
	}
}
function monthlyExp(){
	const monthlyExpenses=[];
	const h3=document.createElement('h3');
	h3.style.color="red";
	let monthTotal=0;
	h3.append(document.createTextNode(new Date().toLocaleString('default', { month: 'long' })));
	monthlyList.appendChild(h3);
	for(let exp of totalExpenses){
		if(new Date(exp.createdAt).getFullYear()== new Date().getFullYear()){
			if(new Date(exp.createdAt).getMonth()== new Date().getMonth()){
				monthlyExpenses.push(exp);
			}
		}
	}
	if(monthlyExpenses.length>0){
		for(let exp of monthlyExpenses){
			monthTotal+=exp.amount;
			const li=document.createElement('li');
			li.append(document.createTextNode(`Amount:${exp.amount}  Description:${exp.description}   Category:${exp.category}`));
			monthlyList.appendChild(li);
		}
		const h4=document.createElement('h4');
		h4.style.color="red";
		h4.append(document.createTextNode(`Total Expense-:${monthTotal}`));
		monthlyList.appendChild(h4);
	}
	else{
		const h4=document.createElement('h4');
		h4.style.color="red";
		h4.append(document.createTextNode(`No Expenses`));
		monthlyList.appendChild(h4);
	}
	monthlyBtn.style.visibility="hidden";
	
}
function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage}){
	pagination.innerHTML="";
	if(hasPreviousPage){
		const btn2=document.createElement('button');
		btn2.innerHTML=previousPage
		btn2.addEventListener('click',()=>getExpense(previousPage));
		pagination.appendChild(btn2);
	}
	const btn1=document.createElement('button');
		btn1.innerHTML=`<h4>${currentPage}</h4>`
		btn1.addEventListener('click',()=>getExpense(currentPage));
		pagination.appendChild(btn1);
	if(hasNextPage){
		const btn3=document.createElement('button');
		btn3.innerHTML=nextPage;
		btn3.addEventListener('click',()=>getExpense(nextPage));
		pagination.appendChild(btn3);
	}
	const btn4=document.createElement('button');
		btn4.innerHTML=`lastPage ->${lastPage}`
		btn4.addEventListener('click',()=>getExpense(lastPage));
		pagination.appendChild(btn4);
}
async function getExpense(page){
	const result=await axios.get(`http://43.205.195.48:3000/expense/getExpenses/${page}`,{headers:{'Authorization':token,'rows':localStorage.getItem("rows")}})
	for(let i=table.rows.length-1;i>0;i--){
		table.deleteRow(i);
	}

	for(let i=0;i<result.data.expenses.length;i++){
		display(result.data.expenses[i]);
	}
		showPagination(result.data);
}
function logout(){
	localStorage.removeItem("token");
	window.location.assign('./login.html');

}