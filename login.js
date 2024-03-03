const form=document.querySelector('form');
const main=document.querySelector('main');

form.addEventListener('submit',userLogin);

function userLogin(e){
	e.preventDefault();
	const email=document.querySelector('#email').value;
	const password=document.querySelector('#password').value;
	var user=new Object();
	user.email=email;
	user.password=password;
	axios.post('http://localhost:3000/user/login',user).then((res) => {
		if(res.data.success){
			window.location.assign("http://127.0.0.1:5500/dailyExpense.html");
		}
		else{
		const Msg=document.createElement('h2');
			Msg.append(document.createTextNode(res.data.message));
			Msg.style.color="white";
			main.appendChild(Msg);
		}
	}).catch((err) => {
			const errMsg=document.createElement('h2');
			errMsg.append(document.createTextNode(err.response.data.message));
			errMsg.style.color="red";
			main.appendChild(errMsg);
	});
}