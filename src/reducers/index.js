import { combineReducers } from "redux";

const citiesReducer = () => {
    return [
        {
            area:'北部',
            cities:['臺北市','新北市','桃園市','基隆市','新竹市','新竹縣','宜蘭縣']            
        },
        {
            area:'中部',
            cities:['苗栗縣','臺中市','彰化縣','南投縣','雲林縣']         
        },
        {
            area:'南部',
            cities:['嘉義市','嘉義縣','臺南市','高雄市','屏東縣']         
        },
        {
            area:'東部',
            cities:['花蓮縣','臺東縣']         
        },
        {
            area:'離島',
            cities:['澎湖縣','金門縣','連江縣']         
        },

    ] 
};

const selectedCityReducer = (selectedCity = '縣市', action) => {
    if(action.type === 'CITY_SELECTED'){
        return action.payload;
    }
    return selectedCity;
};


export default combineReducers({
    cities: citiesReducer,
    selectedCity: selectedCityReducer
});