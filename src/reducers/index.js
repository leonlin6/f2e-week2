import { combineReducers } from "redux";

const citiesReducer = () => {
    return [
        {
            area:'北部',
            cities:['臺北市','新北市','桃園市','新竹市']            
        },
        {
            area:'中部',
            cities:['苗栗縣','臺中市']         
        },
        {
            area:'南部',
            cities:['嘉義市','臺南市','高雄市','屏東縣']         
        },        
        {
            area:'離島',
            cities:['金門縣']         
        },

    ] 
};

const selectedCityReducer = (selectedCity = '縣市', action) => {
    if(action.type === 'CITY_SELECTED'){
        return action.payload;
    }
    return selectedCity;
};

const currentPageReducer = (currentPage = 0, action) => {
    if(action.type === 'PAGE_SET'){
        return action.payload;
    }
    return currentPage;
};

const bikeSpotInfoReducer = (data=[], action) => {
    if(action.type ===  'GET_BIKE_SPOT'){
        return action.payload;
    }

    return data;    
}

const bikeAvailabilityReducer = (dd={data:[],index:0}, action) => {
    if(action.type ===  'GET_BIKE_AVAILABILITY'){
        return {
            index:action.index,
            data:action.payload
        };
    }

    return dd;    
}

export default combineReducers({
    cities: citiesReducer,
    selectedCity: selectedCityReducer,
    bikeSpotData:bikeSpotInfoReducer,
    bikeAvailabilityData: bikeAvailabilityReducer,
    currentPage:currentPageReducer
});