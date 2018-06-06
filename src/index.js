import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import MasterPage from "./pages/MasterPage";

ReactDOM.render(<MasterPage />, document.getElementById('root'));
registerServiceWorker();
