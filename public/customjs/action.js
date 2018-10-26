var db = firebase.firestore();
var assigned_id="";
var propertyRef="";
var arrayUserDetails = [];
var propertyDetails = [];
var assigned_property = "";
var displayDetails = "";
var itemsData = [];
var historyInspection = [];

$(document).ready(function(){
    loadDetails();
    $('#action').off('click').on('click', function(){
        window.location = '../action.html';
    });
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
                arrayUserDetails.push(doc.data());
            
                assigned_property = arrayUserDetails[0].assigned_property;
                console.log(assigned_property);
                db.collection("properties").doc(assigned_property).collection("inspections").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
               
                  historyInspection.push(doc.data());
                 });
                 details();
            });
            
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    });
}

function details()
{
        $("#subtitle").html("Action Items");
        $("#inspection thead").append('<tr><td>Action Items</td>'+
                '<td>Item Report</td><td>Conditional Image</td></tr>');
    for(var i = 0; i<historyInspection.length;i++)
    {  

        db.collection("properties").doc(assigned_property).collection("archives").doc(historyInspection[i].inspection_id).collection("action_items_history").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              
                $("#inspection tbody").append('<tr><td style="color:purple;">'+doc.data().item_name+'</td><td>'+doc.data().item_report_description+'</td><td><img width="200" height="200" src="'+doc.data().item_reported_photo+'"></td></tr>')

                
            });
            
                
        });
    }

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