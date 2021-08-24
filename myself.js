		const usernameText = document.getElementById('username');
		
		const resetButton = document.getElementById('reset');
		console.log(`Accept element: ${this.acceptElement}.`)
		this.acceptElement.onclick = () => {
			console.log('Conditions accepted.');
			const init = getFetchInitWithAuth(this.login);
			init.method = 'PUT';
			fetch(`${this.meUrl}accept`, init).then((r) => this.statusResponse.call(this, r));
		};
