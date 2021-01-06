const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addPerson = functions.https.onCall((data, context) => {
    var firstName = data.firstName;
    var lastName = data.lastName;

    return admin.database().ref("/persons").push(
        {
            firstName,
            lastName,
            fullName: firstName + " " + lastName
        }
    ).then(() => {
            console.log('New person added');
            return "Ok";
        }
    ).catch(
        (error) => {
            throw new functions.https.HttpsError("unknown", error.message, error);
        }
    )
});

exports.date = functions.https.onRequest(
    (request, response) => {
        if(request.method !== 'GET'){
            return response.status(403).send('Forbidden');
        }
        const date = new Date();
        const snapshot = admin.database().ref("/dates").push(
            {
                now: date.toDateString()
            }
        );
        response.redirect(303, snapshot.ref.toString())
        // response.send(date.toDateString())
    }
);
