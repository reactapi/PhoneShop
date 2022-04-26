import store from 'app/store';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router>
				<App />
				<ToastContainer
					theme="colored"
					position="bottom-right"
					autoClose={4000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</Router>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

reportWebVitals();
