import React from 'react';
import '../SASS/App.css'
import Main from './Main';
import Nav from './Nav';
import Map from './Map';

import Route from './Route';

const App = () => {
    return (
        <div className="appContainer">
            <Route path="/">
                <Nav></Nav>
                <Main></Main>
            </Route>
            <Route path="/searchBike">
                <Nav></Nav>
                <Map></Map>
            </Route>
            <Route path="/searchRoute">
                <Nav></Nav>
                <Main></Main>
            </Route>
        </div>
    );
}

export default App;
