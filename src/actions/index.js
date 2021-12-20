import {bikeSpotGet, getAuthorizationHeader, bikeAvailabilityGet} from '../APIs/APIs'
// Action Creator

export const selectCity = (city) => {
    //Return an action
    return({
        type: 'CITY_SELECTED',
        payload:city
    });
}


// Action Creator
export const getBikeSpotInfo = (city , term) => async dispatch => {
    const response = await bikeSpotGet.get(`/${city}?$filter=contains(StationName/Zh_tw ,'${term}')`, {headers:getAuthorizationHeader()});
    
    dispatch({type: 'GET_BIKE_SPOT', payload: response.data})       

}


export const getBikeAvailability = (city , UID, index) => async dispatch => {
    const response = await bikeAvailabilityGet.get(`/${city}?$filter=contains(StationUID ,'${UID}')`, {headers:getAuthorizationHeader()});
    
    dispatch({type: 'GET_BIKE_AVAILABILITY', payload: response.data, index})       

}

