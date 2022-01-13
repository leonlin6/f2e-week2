import React from 'react';
import Link from './Link';

const Nav = (props) => {
    console.log(props.path);
    return (
        <div className="NavWrap">
            <div className="Logo"><a href="/"><img alt="website logo" src={require('../images/LOGO.png').default}></img></a></div>
            <div className="NavButtonArea">
                <Link className={`${props.path === '/searchBike' ? "btn active" : "btn"}`} href={`/searchBike`} children={`尋找單車`}></Link>
                <Link className={`${props.path === '/searchRoute' ? "btn active" : "btn"}`} href={`/searchRoute`} children={`尋找車道`}></Link>
            </div>      

        </div>
    )
}

export default Nav;