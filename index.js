const form=document.querySelector('form');

form.addEventListener('submit',userSignup);

function userSignup(){
	const name=document.querySelector('#name').value;
	const email=document.querySelector('#email').value;
	const password=document.querySelector('#password').value;
	var user=new Object();
	user.name=name;
	user.email=email;
	user.password=password;
	axios.post('http://localhost:3000/user/signup',user).then((result) => {
		console.log(result);
	}).catch((err) => {
		console.log(err);
	});
}