var db = firebase.firestore();
var assigned_id="";
var propertyRef="";
var arrayUserDetails = [];
var propertyDetails = [];
var assigned_property = "";
var displayDetails = "";
var inspectionData = [];

$(document).ready(function(){
    loadDetails();   
});

function loadDetails()
{
    firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        window.location = '../login.html';
        }

        var userId = user.uid;

        var userdocRef = db.collection("users").doc(userId);
        userdocRef.get().then(function(doc) {
            if (doc.exists) {
                $("#username").html(doc.data().email);

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    });
}


function logout()
{
    firebase.auth().signOut()
  .then(function() {
    window.location = '../login.html';
  })
  .catch(function(error) {
    // An error happened
  });
}