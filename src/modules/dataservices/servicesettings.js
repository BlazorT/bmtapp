var dateto = new Date();
var datefrom = new Date();
datefrom.setDate(dateto.getDate() - 1);
let filters;
let servicesettings = {
  method_type: 'POST',
  filters: filters,
  datefrom: datefrom,
  baseuri: 'http://192.168.18.4:8081/api/bmt/',
  Imagebaseuri: 'http://192.168.18.4:8081',
  //baseuri:'http://localhost:8093/api/bmt/',
  datefrom: dateto,
  AuthorizationKey: 'X77Ks0DVwkG3KyMZHkCDU0nF0bMZztX44dVlT3R35E0=',
  fcmToken: '',
  WhatsappID: 1,
  FacebookID: 2,
  SMSID: 3,
  TwitterID: 4,
  EmailID: 5,
};
export default servicesettings;
