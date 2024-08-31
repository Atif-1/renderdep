const form=document.querySelector('form');

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
	axios.post('https://renderdep.onrender.com/user/signup',user).then((res) => {
		console.log(res);
	}).catch((err) => {
		console.log(err.response.data);
	});
}