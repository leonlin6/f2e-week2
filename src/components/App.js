import React from 'react';
import '../SASS/App.css'
import Main from './Main';
import Nav from './Nav';
import SearchBike from './SearchBike';
import SearchRoute from './SearchRoute';

import Route from './Route';

const App = () => {
    return (
        <div className="appContainer">
            <Route path="/">
                <Nav></Nav>
                <Main></Main>
            </Route>
            <Route path="/searchBike">
                <Nav path="/searchBike"></Nav>
                <SearchBike></SearchBike>
            </Route>
            <Route path="/searchRoute">
                <Nav path="/searchRoute"></Nav>
                <SearchRoute></SearchRoute>
            </Route>
        </div>
    );
}

export default App;
