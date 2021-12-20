import React, {useState, useEffect} from 'react';

import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import Dropdown from './Dropdown';
import {getBikeSpotInfo, getBikeAvailability} from '../actions';
import {connect} from 'react-redux';
import CityTranslate from './CityTranslate';

const SearchBike = (props) => {

    const [lat , setLat] = useState(25.0408578889);
    const [lon , setLon] = useState(121.567904444);
    const [searchData, setSearchData] = useState([]);
    const [mergedSearchData, setMergedSearchData] = useState([]);
    // const [term, setTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(1);

    let term = '';

    // click後，bikeSpotData變動後執行
    useEffect(() => {
        // if(props.bikeSpotData.length !== 0){
        //     // transferData(props.bikeSpotData);
        //     setLat(props.bikeSpotData.data.data[1].StationPosition.PositionLat);
        //     setLon(props.bikeSpotData.data.data[1].StationPosition.PositionLon);

        // }

        transferSpotData(props.bikeSpotData);   
        if(props.bikeSpotData.length === 0)
            setPageLimit(1);
        else
            setPageLimit( Math.ceil(props.bikeSpotData.length / 4));

    }
    ,[props.bikeSpotData])



    useEffect(() => {
        searchData.forEach((element, index) => {
            props.getBikeAvailability(CityTranslate[props.selectedCity], element.UID, index);
        });
    },[searchData])



    useEffect(() => {
        console.log('mergedSearchData', mergedSearchData);
        try{
            if(mergedSearchData[0] === undefined){
                setMergedSearchData( 
                    [
                        {
                        ...searchData[props.bikeAvailabilityData.index],
                        bikeAvailable:props.bikeAvailabilityData.data[0].AvailableRentBikes,
                        stationStatus:props.bikeAvailabilityData.data[0].ServiceStatus,
                        availableReturnBikes:props.bikeAvailabilityData.data[0].AvailableReturnBikes
                        }            
                    ]
                );
            }else{
                setMergedSearchData( 
                    [...mergedSearchData , 
                        {
                        ...searchData[props.bikeAvailabilityData.index],
                        bikeAvailable:props.bikeAvailabilityData.data[0].AvailableRentBikes,
                        stationStatus:props.bikeAvailabilityData.data[0].ServiceStatus,
                        availableReturnBikes:props.bikeAvailabilityData.data[0].AvailableReturnBikes
                        }            
                    ]
                );
            }
        }catch(error){
            // console.log(error);
            console.log('merge error');
        }
    },[props.bikeAvailabilityData])



    const transferSpotData = (response) => {
        const spotData = response.map((item) => {
            try{
                return{
                    title:item.StationName.Zh_tw,
                    location:item.StationAddress.Zh_tw,
                    UID:item.StationUID
                }
            }catch(error){
                console.log('error');
                return null;
            }
        })
        setSearchData(spotData);
    }



    // var greenIcon = L.icon({
    //     iconUrl: {require('../images/SelectMark.png').default},
    
    //     iconSize:     [38, 95], // size of the icon
    //     shadowSize:   [50, 64], // size of the shadow
    //     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //     shadowAnchor: [4, 62],  // the same for the shadow
    //     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    // });

    // L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map).bindPopup("I am a green leaf.");

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
            setMergedSearchData([]);
            return;
        }        
        else{
            props.getBikeSpotInfo(CityTranslate[props.selectedCity], term);
            setMergedSearchData([]);
        }        
    }


    const onSearchChange = (event) => {
        // setTerm(event.target.value);
        term = event.target.value;
    }

    const onClickPrev = () => {
        if(currentPage > 1)
            setCurrentPage(currentPage - 1);
    }

    const onClickNext = () => {
        if(currentPage < pageLimit)
            setCurrentPage(currentPage + 1);
    }

    const SearchResultRender = () => {
        
        const render = mergedSearchData.map((item, index) => {
            let stationStatus = () => {
                switch(item.stationStatus){
                    case 0:
                        return <div className='stationStatusClosed'>停止營運</div>;
                    case 1:
                        return <div className='stationStatusRunning'>正常營運</div>;
                    case 2:
                        return <div className='stationStatusSuspension'>暫停營運</div>;
                    default:
                        return <div className='stationStatusClosed'>停止營運</div>;
                }
            }

            let bikeAvailable = () => {
                if(item.availableReturnBikes === 0){
                    return <div className='noParking'>車位已滿</div>;
                }else if(item.bikeAvailable === 0){
                    return <div className='nobike'>已無單車</div>;
                }else {
                    return <div className='bikeAvailable'>尚有單車</div>;
                }
            }

            if(Math.ceil(index / 4) === currentPage){
                return(
                    <div key={item.UID} id={item.UID} className='searchResult'>
                        <div className='resultTitle'>{item.title}</div>
                        <div className="locationWrap">
                            <i className='map marker alternate icon'></i>
                            <div className='location'>{item.location}</div>                            
                        </div>
                        <div className='statusArea'>
                            {stationStatus()}
                            {bikeAvailable()}
                        </div>
                    </div>
                )
            }else{
                return null;
            }

        });

        return render;
    }

    return (
        <div className="map" id="map">
            <div className="mapContainer">
                <MapContainer center={[lat, lon]} zoom={13} scrollWheelZoom={false} accessToken={`pk.eyJ1IjoibGVvbmxpbjYiLCJhIjoiY2t3OWw4NXM3MWxvcTJ0cDh1aW5vanMxcyJ9.0jqwkVr2aXtuA3hfUKxUbA`}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[lat, lon]} icon={getMaker()}>
                        <Popup>
                    腳踏車租借處。
                        </Popup>
                    </Marker>
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
                            <div className="serchButton" onClick={() => {onSearchClick()}}>搜尋</div>
                        </div>
                    </div>
                </div>
                <div className='searchResultArea'>
                    <SearchResultRender></SearchResultRender>
                </div>
                <div className='pageChangeArea'>
                    <div className='prevIcon' onClick={() => {onClickPrev()}}>
                        <i className='chevron left icon'></i>
                    </div>
                    <div className='pageArea'>{currentPage}/{pageLimit}</div>
                    <div className='nextIcon' onClick={() => {onClickNext()}}>
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
        selectedCity:state.selectedCity
    };
}

export default connect(mapStateToProps, {getBikeSpotInfo, getBikeAvailability})(SearchBike);
