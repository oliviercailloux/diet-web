const usernameText = document.getElementById('username');

const resetButton = document.getElementById('reset');

const requester = new Requester();
const login = new Login();

resetButton.onclick = () => {
	console.log('Reset.');
	login.reset();
};
