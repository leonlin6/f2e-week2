
import Dropdown from './Dropdown';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import Link from './Link';
import {getBikeSpotInfo, getBikeAvailability, setCurrentPage} from '../actions';
import CityTranslate from './CityTranslate';


const Main = (props) => {
    let term = '';

    const onSearchChange = (event) => {
        term = event.target.value;
    }


    const onSearchClick = () => {

        if(props.selectedCity !== '縣市'){
            props.getBikeSpotInfo(CityTranslate[props.selectedCity], term);
            props.setCurrentPage(1);

            window.history.pushState({},'','/searchBike');
            const navEvent = new PopStateEvent('popstate');
            window.dispatchEvent(navEvent);
        }
        
    }

    return (
        <div className="MainWrap">
            <div className="grid">
                <div className="row">
                    <div className="col-md-3">
                        <div className="Logo"><img alt="mainpage logo" src={require('../images/LOGO.png').default}></img></div>
                        <p>尋找單車,</p>
                        <p>來場悠閒的放鬆之旅!</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="searchWrap">
                            <div className="inputArea">
                                <img alt="search logo" src={require('../images/SearchImage.png').default}></img>
                                <div className="divider"> </div>
                                <input className="inputKeyword" placeholder="輸入關鍵字" onChange={onSearchChange}></input>
                            </div>
                            <div className="buttonArea">
                                <div className="cityDropDown">                                
                                    <Dropdown></Dropdown>
                                </div>
                                <div onClick={onSearchClick} className="serchButton">搜尋</div>                                
                            </div>                        
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-2">
                        <img alt="bike 1" src={require('../images/MainBike-1.png').default}></img>
                    </div>
                    <div className="col-md-2">
                        <img alt="bike 2" src={require('../images/MainBike-2.png').default}></img>
                    </div>
                    <div className="col-md-2">
                        <img alt="bike 3" src={require('../images/MainBike-3.png').default}></img>
                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>
            <div className="backgroundLogo-1"><img alt="index background decoration-1" src={require('../images/BackgroundLogo-1.png').default}></img></div>
            <div className="backgroundLogo-2"><img alt="index background decoration-2" src={require('../images/BackgroundLogo-2.png').default}></img></div>
        </div>

    );
}

const mapStateToProps = (state) => {  
    return {
        bikeSpotData: state.bikeSpotData,
        bikeAvailabilityData: state.bikeAvailabilityData,
        selectedCity:state.selectedCity,
        cities:state.cities
    };
}

export default connect(mapStateToProps, {getBikeSpotInfo, getBikeAvailability, setCurrentPage})(Main);
