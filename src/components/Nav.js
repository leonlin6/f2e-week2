import React from 'react';

const Nav = (props) => {
    console.log(props.path);
    return (
        <div className="NavWrap">
            <div className="Logo"><a href="/"><img alt="website logo" src={require('../images/LOGO.png').default}></img></a></div>
            <div className="NavButtonArea">
                <div className={props.path === '/searchBike' ? "btn active" : "btn"}><a href="/searchBike">尋找單車</a></div>
                <div className={props.path === '/searchRoute' ? "btn active" : "btn"}><a href="/searchRoute">尋找車道</a></div>
            </div>      

        </div>
    )
}

export default Nav;