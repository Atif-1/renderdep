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
	axios.post('https://renderdep.onrender.com/user/login',user).then((res) => {
		console.log(res.data);
		if(res.data.success){
			localStorage.setItem("token",res.data.token);
			window.location.assign("./dailyExpense.	html");
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
