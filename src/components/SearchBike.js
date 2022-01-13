import React, {useState, useEffect, useRef} from 'react';

import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import Dropdown from './Dropdown';
import {getBikeSpotInfo, getBikeAvailability, setCurrentPage} from '../actions';
import {connect} from 'react-redux';
import CityTranslate from './CityTranslate';

const SearchBike = (props) => {

    const [lat , setLat] = useState(25.0408578889);
    const [lon , setLon] = useState(121.567904444);
    const [searchData, setSearchData] = useState([]);
    const [mergedSearchData, setMergedSearchData] = useState([]);
    const [pageLimit, setPageLimit] = useState(0);
    const [activeResult, setActiveResult] = useState(0);
    const [position, setPosition] = useState(null);
    const [selectedCard, setSelectedCard ] = useState(
        {
            title:'',
            location:'',
            renewTime:'',
            stationStatus:'',
            availableReturn:0,
            availalbeBike:0,
            updatetime:''
    });
    
    const resultRef = useRef(null);
    let term = '';

    const LocationMarker = () => {
        useEffect(() =>{
            if(position !== null)
                map.flyTo(position, map.getZoom());
        }
        ,[position]);

        const map = useMapEvents({
        //   click() {
        //     map.locate()
        //   },
          locationfound(e) {
            // setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
          },
        })
      
        return position === null ? null : (
          <Marker position={[lat, lon]} icon={getMaker()}>
            <Popup maxWidth={348}>
                <div className='mapPopTitle'>{selectedCard.title}</div>
                <div className='mapPopLocation'>
                    <i className="map marker alternate icon"></i>
                    {selectedCard.location}
                </div>
                <div className='mapPopRenewTime'>
                    <i className="history icon"></i>
                    {selectedCard.updatetime}
                </div>
                <div className='mapPopConditionArea'>
                    {/* <div className='stationStatusClosed'>營運狀態</div>
                    <div className='bikeAvailable'>單車狀態</div> */}
                    {selectedCard.stationStatus}
                    {selectedCard.bikeAvailable}
                </div>
                <div className='mapPopAvaiArea'>
                    <div className='bikeAmount'>
                        <div className='title'>可借單車 </div>                                               
                        <div className='amount'>{selectedCard.availalbeBike}</div>
                    </div>
                    <div className='bikeStopRemain'>
                        <div className='title'>可停空位 </div>                                               
                        <div className='amount'>{selectedCard.availableReturn}</div>
                    </div>
                </div>
            </Popup>
          </Marker>
        )
      }


    // click後，bikeSpotData變動後執行
    useEffect(() => {
        // if(props.bikeSpotData.length !== 0){
        //     // transferData(props.bikeSpotData);
        //     setLat(props.bikeSpotData.data.data[1].StationPosition.PositionLat);
        //     setLon(props.bikeSpotData.data.data[1].StationPosition.PositionLon);

        // }
        transferSpotData(props.bikeSpotData);   
        if(props.bikeSpotData.length === 0)
            setPageLimit(0);
        else
            setPageLimit( Math.ceil(props.bikeSpotData.length / 4));

    }
    ,[props.bikeSpotData])


    //頁面改變的時候，才去打API要Availability，避免loadgin過重
    useEffect(() => {
        searchData.forEach((element, index) => {
            // if(Math.ceil((index+1)/4) !== currentPage) {
            //     return;
            // }
            props.getBikeAvailability(CityTranslate[props.selectedCity], element.UID, index);
            // props.getBikeAvailability('Taipei', element.UID, index);

        });
    },[searchData])

    useEffect(() => {
        try{
            if(mergedSearchData[0] === undefined){
                setMergedSearchData( 
                    [
                        {
                        ...searchData[props.bikeAvailabilityData.index],
                        bikeAvailable:props.bikeAvailabilityData.data[0].AvailableRentBikes,
                        stationStatus:props.bikeAvailabilityData.data[0].ServiceStatus,
                        availableReturnBikes:props.bikeAvailabilityData.data[0].AvailableReturnBikes,
                        updatetime:props.bikeAvailabilityData.data[0].UpdateTime
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
                        availableReturnBikes:props.bikeAvailabilityData.data[0].AvailableReturnBikes,
                        updatetime:props.bikeAvailabilityData.data[0].UpdateTime

                        }            
                    ]
                );
            }
        }catch(error){
            console.log('merge error');
        }
    },[props.bikeAvailabilityData])



    const transferSpotData = (response) => {
        const spotData = response.map((item) => {
            try{
                return{
                    title:item.StationName.Zh_tw,
                    location:item.StationAddress.Zh_tw,
                    UID:item.StationUID,
                    latitude:item.StationPosition.PositionLat,
                    longitude:item.StationPosition.PositionLon
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
         setMergedSearchData([]);            

        if(props.selectedCity === '縣市'){
            return;
        }        
        else{
            props.getBikeSpotInfo(CityTranslate[props.selectedCity], term);
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
        console.log('mergedSearchData',mergedSearchData);

        const selectedResult = mergedSearchData.find((item) => {
            return item.UID === e.target.id;
        })
        setPosition({lat:selectedResult.latitude,lng:selectedResult.longitude})
        setLat(selectedResult.latitude);
        setLon(selectedResult.longitude);

        let stationStatus = () => {
            switch(selectedResult.stationStatus){
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
            if(selectedResult.availableReturnBikes === 0){
                return <div className='noParking'>車位已滿</div>;
            }else if(selectedResult.bikeAvailable === 0){
                return <div className='nobike'>已無單車</div>;
            }else {
                return <div className='bikeAvailable'>尚有單車</div>;
            }
        }

        setSelectedCard(
            {
                title:selectedResult.title,
                location:selectedResult.location,
                updatetime:selectedResult.updatetime,
                stationStatus:selectedResult.stationStatus,
                availableReturn:selectedResult.bikeAvailable,
                availalbeBike:selectedResult.availableReturnBikes,
                stationStatus:stationStatus(),
                bikeAvailable:bikeAvailable()
            }
        );
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

            if(Math.ceil((index+1) / 4) === props.currentPage){
                return(
                    <div ref={resultRef} key={item.UID} id={item.UID} className={item.UID === activeResult ? 'searchResult active': 'searchResult'} onClick={(event) => {onResultCardClick(event)}}>
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
                <MapContainer 
                    center={[lat, lon]} 
                    zoom={13} 
                    scrollWheelZoom={true} 
                    accessToken={`pk.eyJ1IjoibGVvbmxpbjYiLCJhIjoiY2t3OWw4NXM3MWxvcTJ0cDh1aW5vanMxcyJ9.0jqwkVr2aXtuA3hfUKxUbA`}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                </MapContainer>
            </div>
            <div className='searchWrap'>
                <div className='searchArea'>
                    <div className='searchAreaHead'></div>
                    <div className="searchAreaContent">
                        <div className="searchTitle">尋找單車
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
        currentPage:state.currentPage
    };
}

export default connect(mapStateToProps, {getBikeSpotInfo, getBikeAvailability, setCurrentPage})(SearchBike);
