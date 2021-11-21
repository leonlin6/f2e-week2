// Action Creator

export const selectCity = (city) => {
    //Return an action
    console.log('action click:', city);
    return({
        type: 'CITY_SELECTED',
        payload:city
    });
}


