

const form=document.querySelector('form');
const body=document.querySelector('body');
const main=document.querySelector('main');
const nav=document.querySelector('nav');
const table=document.querySelector('#expense-list');
const board=document.querySelector('#leaderboard')
const premiumBtn=document.querySelector("#rzp-btn1");

const token=localStorage.getItem("token");
window.addEventListener('DOMContentLoaded',()=>{
	axios.get("http://localhost:3000/expense/getExpenses",{headers:{'Authorization':token}}).then((result) => {
		console.log(result);
		for(let i=0;i<result.data.expenses.length;i++){
			display(result.data.expenses[i]);
		}
		if(result.data.ispremium==true){
			premiumBtn.innerHTML="YOU ARE A PREMIUM USER";
			premiumBtn.style.color="gold";
			premiumBtn.style.fontSize="larger";
			const proFeature1=document.createElement('button');
			proFeature1.append(document.createTextNode("Leaderboard"));
			nav.append(proFeature1);
			proFeature1.addEventListener('click',leaderBoard);
			const proFeature2=document.createElement('button');
			proFeature2.append(document.createTextNode("Daily"));
			nav.append(proFeature2);
			proFeature2.addEventListener('click',daily);
			const proFeature3=document.createElement('button');
			proFeature3.append(document.createTextNode("Monthly"));
			nav.append(proFeature3);
			proFeature3.addEventListener('click',monthlyExp);
			const proFeature4=document.createElement('button');
			proFeature4.append(document.createTextNode("Yearly"));
			nav.append(proFeature4);
			proFeature4.addEventListener('click',yearlyExp);
			const proFeature5=document.createElement('button');
			proFeature5.append(document.createTextNode("Download"));
			nav.append(proFeature5);
			proFeature5.addEventListener('click',download);
		}
		else{
			premiumBtn.addEventListener('click',buypremium);
			
		}
	}).catch((err) => {
		console.log(err);
	});
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
	axios.post("http://localhost:3000/expense/addExpense",expObject,authHeader).then((result) => {
		alert("please refresh the page");
		console.log(result.data);
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
		axios.delete("http://localhost:3000/expense/deleteExpense/"+id,authHeader).then((result) => {
			alert("please refresh the page");
			console.log(result.data.message);
		}).catch((err) => {
			console.log(err);
		});
	}
}

async function buypremium(e){
	const response=await axios.get('http://localhost:3000/purchase/premiummembership',{headers:{"Authorization":token}});
	console.log(response);
	var options={
		"key":response.data.key_id,
		"order_id":response.data.order.id,
		"handler":async function(result){
			await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
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
			axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
				status:'failed',
				order_id:options.order_id,
				payment_id:result.error.metadata.payment_id},{
					headers:{"Authorization":token}	
			})
			alert(" Transaction Failed");
		});

}
function leaderBoard(){
	axios.get('http://localhost:3000/premium/leaderboard',{headers:{"Authorization":token}}).then((result) => {
		result.data.forEach((obj) => {
			showLeaderboard(obj);
		});
	}).catch((err) => {
		console.log(err);
	});
}
function showLeaderboard(obj){
	const li=document.createElement('li');
	li.append(document.createTextNode(`Name:${obj.name} Total Expense:${obj.total_cost}`));
	board.appendChild(li);
}
function daily(){

}
function monthlyExp(){

}
function yearlyExp(){

}
function download(){
		axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
		.then((response) => {
			if(response.status === 201){
				var a = document.createElement("a");
				a.href = response.data.fileUrl;
				a.download = 'myexpense.csv';
				a.click();
			} else {
				throw new Error(response.data.message)
			}
	
		})
		.catch((err) => {
			showError(err)
		});
	}
