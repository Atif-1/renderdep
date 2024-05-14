const form=document.querySelector('form');
const body=document.querySelector('body');
const main=document.querySelector('main');

form.addEventListener('submit',userSignup);

function userSignup(e){
	e.preventDefault();
	const name=document.querySelector('#name').value;
	const email=document.querySelector('#email').value;
	const password=document.querySelector('#password').value;
	var user=new Object();
	user.name=name;
	user.email=email;
	user.password=password;
	console.log("in login.js");
	axios.post('http://43.205.195.48:3000/user/signup',user).then((res) => {
		const msg=document.createElement('h2');
			console.log(res.status);
			msg.append(document.createTextNode(res.data.message));
			msg.style.color="red";
			main.appendChild(msg);
			window.location.assign("./login.html")
	}).catch((err) => {
		if(err.response.status==403){
			const errMsg=document.createElement('h2');
			errMsg.append(document.createTextNode(err.response.data));
			errMsg.style.color="red";
			main.appendChild(errMsg);
		}
		else{
			console.log(err);
		}
	});
}