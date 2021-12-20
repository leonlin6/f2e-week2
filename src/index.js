import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';

import App from './components/App';
import reducers from './reducers';
import thunk from 'redux-thunk';


const sotre = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={sotre}>
        <App></App>
    </Provider>
    ,
    document.getElementById('root')
);