var dateto = new Date();
var datefrom = new Date();
datefrom.setDate(dateto.getDate() - 1);
let filters;
let servicesettings = {
  method_type: 'POST',
  filters: filters,
  datefrom: datefrom,
  // baseuri: 'http://192.168.18.4:8091/',
  // Imagebaseuri: 'http://192.168.18.4:8091',
  baseuri: 'http://192.168.18.163:4388/',
  Imagebaseuri: 'http://192.168.163.50:4388',
  datefrom: dateto,
  AuthorizationKey:
    'cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8',
  fcmToken: '',
  WhatsappID: 1,
  FacebookID: 2,
  SMSID: 3,
  TwitterID: 4,
  EmailID: 5,
};
export default servicesettings;
