import { checkDefined } from './utils.js';
import { LoginController } from './login.js';
//const usernameText = document.getElementById('username');
const resetButton = checkDefined(document.getElementById('reset'));
const loginController = new LoginController();
resetButton.onclick = () => {
    console.log('Reset.');
    loginController.deleteLogin();
};
