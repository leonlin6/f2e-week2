import React, {useState, useEffect, useRef} from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline,useMapEvents} from 'react-leaflet';
import {connect} from 'react-redux';
import {getBikeRoute, setCurrentPage} from '../actions';

import Wkt from 'wicket';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Dropdown from './Dropdown';
import CityTranslate from './CityTranslate';


const SearchBike = (props) => {
    const [lat , setLat] = useState(24.9980917850282);
    const [lon , setLon] = useState(121.536818143776);

    const [routeData, setRouteData] = useState([]);
    const [selectedRouteCoor, setSelectedRouteCoor] = useState([]);
    const [pageLimit, setPageLimit] = useState(0);
    const [activeResult, setActiveResult] = useState(0);
    const [position, setPosition] = useState(null);
    const [selectedCard, setSelectedCard ] = useState(
        {
            name:'',
            authorityName:'',
            city:'',
            cyclingLength:0,
            geometry:[],
            end:'',
            start:''
    });
    
    const resultRef = useRef(null);
    let term = '';
    let wkt = new Wkt.Wkt();



    // click後，bikeSpotData變動後執行
    useEffect(() => {
        try{
            transferSpotData(props.bikeRouteData);   
            if(props.bikeRouteData.data.length === 0)
                setPageLimit(0);
            else
                setPageLimit( Math.ceil(props.bikeRouteData.data.length / 4));
        }catch(error){
            console.log('error');
        }


    }
    ,[props.bikeRouteData])


    // 選擇card後，指定座標給map
    useEffect(() => {   
        try{
            let array = selectedCard.geometry[0].map((item) => {
                return [item.y,item.x]
            })

            setSelectedRouteCoor([array]);

        }catch(error){
            console.log('error');
        }   
    }
    ,[selectedCard])

    const transferSpotData = (response) => {
        let routeData;
        try{
            routeData = response.data.map((item,index) => {
                let geo = wkt.read(item.Geometry);
                return{
                    name:item.RouteName,
                    uid:'uid'+index,
                    authorityName:item.AuthorityName,
                    city:item.City,
                    cyclingLength:item.CyclingLength,
                    geometry:geo.components,
                    end:item.RoadSectionEnd,
                    start:item.RoadSectionStart
                }            
            })
        }catch(error){
            console.log('error');
            return null;
        }
        setRouteData(routeData);
    }

    const getMaker = () => {
        return L.icon(
            {
                iconUrl: require('../images/SelectMark.png').default,
                iconSize: '14px'
            }
        )
    }

    const onSearchClick = () => { 

        if(props.selectedCity === '縣市'){
            return;
        }        
        else{            
        props.getBikeRoute(CityTranslate[props.selectedCity],term);

            props.setCurrentPage(1);
        }        
    }


    const onSearchChange = (event) => {
        term = event.target.value;
    }

    const onPrevClick = () => {
        if(props.currentPage > 1)
            props.setCurrentPage(props.currentPage - 1);
    }

    const onNextClick = () => {
        if(props.currentPage < pageLimit)
            props.setCurrentPage(props.currentPage + 1);

    }

    const onResultCardClick = (e) => {
        setActiveResult(e.target.id);

        const selectedResult = routeData.find((item) => {
            return item.uid === e.target.id;
        })
        // setPosition({lat:selectedResult.latitude,lng:selectedResult.longitude})
        // setLat(selectedResult.latitude);
        // setLon(selectedResult.longitude);

        setSelectedCard({
                name:selectedResult.name,
                authorityName:selectedResult.authorityName,
                city:selectedResult.city,
                cyclingLength:selectedResult.cyclingLength,
                geometry:selectedResult.geometry,
                end:selectedResult.end,
                start:selectedResult.start
            }
        );
    }

    const SearchResultRender = () => {
        const render = routeData.map((item, index) => {
            if(Math.ceil((index+1) / 4) === props.currentPage){
                return(
                    <div ref={resultRef} id={item.uid} key={item.uid} className={item.end === activeResult ? 'searchResult active': 'searchResult'} onClick={(event) => {onResultCardClick(event)}}>
                        <div className='resultTitle'>{item.name}</div>
                        <div className="locationWrap">
                            <i className='map marker alternate icon'></i>
                            <div className='location'>{item.end}</div>                            
                        </div>
                        <div className='statusArea'>
                        </div>
                    </div>
                )
            }else{
                return null;
            }

        });
        return render;
    }


    const GEOstyle ={
        color:'red'
    }
    return (
        <div className="map" id="map">
            <div className="mapContainer">
                <MapContainer 
                    center={[lat, lon]} 
                    zoom={13} 
                    scrollWheelZoom={true} 
                    accessToken={`pk.eyJ1IjoibGVvbmxpbjYiLCJhIjoiY2t3OWw4NXM3MWxvcTJ0cDh1aW5vanMxcyJ9.0jqwkVr2aXtuA3hfUKxUbA`}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                        <Polyline pathOptions={GEOstyle} positions={selectedRouteCoor} />
                    {/* <LocationMarker /> */}
                </MapContainer>
            </div>
            <div className='searchWrap'>
                <div className='searchArea'>
                    <div className='searchAreaHead'></div>
                    <div className="searchAreaContent">
                        <div className="searchTitle">尋找車道
                            <i className="angle down icon"></i>
                        </div>
                        <div className="inputArea">
                            <img alt="search logo" src={require('../images/SearchImage.png').default}></img>
                            <div className="divider"> </div>
                            <input className="inputKeyword" placeholder="輸入關鍵字" onChange={(e) => {onSearchChange(e)}}></input>
                        </div>
                        <div className="buttonArea">
                            <div className="cityDropDown">                                
                                <Dropdown></Dropdown>
                            </div>
                            <div className="serchButton" onClick={onSearchClick}>搜尋</div>
                        </div>
                    </div>
                </div>
                <div className='searchResultArea'>
                    <SearchResultRender></SearchResultRender>
                </div>
                <div className='pageChangeArea'>
                    <div className={props.currentPage === 1 || props.currentPage === 0 ? `prevIcon off` : `prevIcon`} onClick={onPrevClick}>
                        <i className='chevron left icon'></i>
                    </div>
                    <div className='pageArea'>
                        {/* <input defaultValue={props.currentPage}></input> */}
                        {props.currentPage}
                        /{pageLimit}
                    </div>
                    <div className={props.currentPage === pageLimit ? `nextIcon off` : `nextIcon`} onClick={onNextClick}>
                        <i className='chevron right icon'></i>
                    </div>
                </div>
            </div>

        </div>
    )
}

const mapStateToProps = (state) => {  
    return {
        bikeSpotData: state.bikeSpotData,
        bikeAvailabilityData: state.bikeAvailabilityData,
        selectedCity:state.selectedCity,
        currentPage:state.currentPage,
        bikeRouteData:state.bikeRouteData
    };
}

export default connect(mapStateToProps, {getBikeRoute, setCurrentPage})(SearchBike);
