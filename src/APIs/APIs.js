import axios from 'axios';
import jsSHA from 'jssha';

export const getAuthorizationHeader = () => {
    let AppID = '9c833dc964c2452c8bfedc900230b889';
    let AppKey = '69Q4PBFhFAio3uYEJBOcuIi4jb4';

    let GMTString = new Date().toGMTString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"';

    return { 'Authorization': Authorization, 'X-Date': GMTString }; 
}

export const bikeSpotGet = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Bike/Station/',
    headers: getAuthorizationHeader(),
    params: {
        $top: 20,
        $format:'JSON'
    }

});


export const bikeAvailabilityGet = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/',
    headers: getAuthorizationHeader(),
    params: {
        $top: 20,
        $format:'JSON'
    }

});
