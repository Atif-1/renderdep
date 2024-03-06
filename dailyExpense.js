const form=document.querySelector('form');
const body=document.querySelector('body');
const main=document.querySelector('main');
const list=document.querySelector('ul');


window.addEventListener('DOMContentLoaded',()=>{
	const token=localStorage.getItem("token");
	console.log(token);
	axios.get("http://localhost:3000/expense/getExpenses",{headers:{'Authorization':token}}).then((result) => {
		for(let i=0;i<result.data.length;i++){
			display(result.data[i]);
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
	const token=localStorage.getItem('token');
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
	const li=document.createElement('li');
	const idInp=document.createElement('input');
	idInp.value=obj.id;
	idInp.type="hidden";
	li.appendChild(idInp);
	li.append(document.createTextNode(obj.amount));
	li.append(document.createTextNode("-"+obj.description));
	li.append(document.createTextNode("-"+obj.category));
	const delBtn=document.createElement('button');
	delBtn.append(document.createTextNode("delete expense"));
	li.append(delBtn);
	list.appendChild(li);
	delBtn.addEventListener('click',deleteExpense);
	function deleteExpense(e){
		const id=(e.target.parentElement.firstChild).value;
		const token=localStorage.getItem('token');
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