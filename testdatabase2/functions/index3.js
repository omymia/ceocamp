const functions = require("firebase-functions/v2");


console.log(functions);
functions.setGlobalOptions({cpu: "gcf_gen1"});
//
exports.ceocamp = functions.https.onRequest((request, response) => {
});
