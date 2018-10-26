var db = firebase.firestore();
var itemsName = sessionStorage.getItem("itemsName");
var itemsPhoto = sessionStorage.getItem("itemsPhoto");
var itemsCondition = sessionStorage.getItem("itemsCondition");
var itemsMethod = sessionStorage.getItem("itemsMethod");
var itemStatus = sessionStorage.getItem("itemStatus");
var inspectionName = sessionStorage.getItem("InspectionName");
var itemsComments = sessionStorage.getItem("itemsComments");

$(document).ready(function(){
    loadDetails();
    $('#subInspection').off('click').on('click', function(){
        window.location = '../user.html';
    });
    $("#secondSubInspections").off('click').on('click', function(){
        window.location = '../inspection.html';
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

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        });

        inspection();
    });
}

function inspection()
{
    $("#inspectioncard").hide();
    $("#DeleteItem").hide();
    $("#AddItem").hide();
    $("#itemcard").hide();
    $("#itemdetails").show();
   
    $("#title").html('<p style="font-weight:bold;font-size: 34px;">'+itemsName+'</p>');
    $("#secondSubInspections").html(inspectionName);
    $("#thirdSubInspection").html(itemsName);
    $("#subtitleItem").html('<p style="font-weight:bold;font-size: 20px;">'+itemsName+'</p>');
    $("#photo").html("<img width='242' height='242' src='"+itemsPhoto+"'>");
    $("#rightContent").html("Condition - "+itemsCondition+"<br><br>Method - "+itemsMethod+"<br><br>");
    $("#conditiontable thead").append("<tr><td>Current Image</td><td>Current Status</td><td>Comments<td></tr>");
    if(itemStatus == 0)
    {
        $("#conditiontable tbody").append("<tr><td><img width='242' height='242' src='"+itemsPhoto+"'></td><td><span class='dot' style='background-color: #bbb;'></span></td><td>"+itemsComments+"<td></tr>");
    }
    else
    {
        $("#conditiontable tbody").append("<tr><td><img width='242' height='242' src='"+itemsPhoto+"'></td><td><span class='dot' style='background-color: #008000;'></span></td><td>"+itemsComments+"<td></tr>");
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