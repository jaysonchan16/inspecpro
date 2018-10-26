var db = firebase.firestore();
var itemsData = [];
var inspectionName = sessionStorage.getItem("InspectionName");
var inspectionID = sessionStorage.getItem("InspectionID");
var assignedProperty = sessionStorage.getItem("AssignedProperty");
var inspectionSubmittedAt = sessionStorage.getItem("InspectionSubmittedAt");
var inspectionCreatedAt = sessionStorage.getItem("InspectionCreatedAt");
var inspectionItemsCount = sessionStorage.getItem("InspectionItemsCount");
var inspectionDays = sessionStorage.getItem("InspectionDays");
var inspectionToBeDued = sessionStorage.getItem("InspectionToBeDued");

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
        var length = sessionStorage.getItem("InspectionDataLength");
        var itemsCount = sessionStorage.getItem("InspectionItemLength");
        
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
        
       details(length,itemsCount);
    });
}

function details(length,itemsCount)
{
    sessionStorage.removeItem("itemsName");
    sessionStorage.removeItem("itemsPhoto");
    sessionStorage.removeItem("itemsCondition");
    sessionStorage.removeItem("itemsMethod");
    sessionStorage.removeItem("itemStatus");

    $("#secondSubInspections").html(inspectionName);
    $("#itemcard").show();
    $("#inspectioncard").show();
   // $("#inspectiontwo tbody").html("");
    
    $("#title").html('<p style="font-weight:bold;font-size: 34px;">'+inspectionName+'</p>');
    $("#inspection thead").html("<tr><th>Inspection Items</th><th>Description</th><th>Condition</th><th>Reference Image</th></tr>");
   

    db.collection("properties").doc(assignedProperty).collection("inspections").doc(inspectionID).collection("items").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());

            itemsData.push(doc.data());
        });
        for(var k = 0 ; k<itemsData.length;k++)
        {
            displayDetails ='<tr><td onclick="inspection('+k+');" style="cursor:pointer;color:purple;"><b>'+itemsData[k].item_name+'</b></td>'+
                            '<td>'+itemsData[k].item_description+'</td>'+
                            '<td>'+itemsData[k].item_condition+'</td>'+             
                            '<td><img width="242" height="242" src="'+itemsData[k].item_photo+'"></td></tr>';
                    
            $("#inspection tbody").append(displayDetails);
            $("#DeleteItem").show();
            $("#AddItem").show();
            
            $("#item thead").html("<tr><th>Inspection Created</th><th>Items Inspected</th><th>Due In</th><th>Overdue By</th><th>Last Checked</th></tr>");

            var dSub = new Date(inspectionSubmittedAt);
            var nSub = dSub.toDateString();
            var monthSubmitted = nSub.substring(4,7);
            var daySubmitted = nSub.substring(8,10);
            var yearSubmitted = nSub.substring(11,15);
            var dateSubmitted = daySubmitted+' '+monthSubmitted+' '+yearSubmitted;
             
            var dCreate = new Date(inspectionCreatedAt);
            var nCreate = dCreate.toDateString();
            var monthCreate = nCreate.substring(4,7);
            var dayCreate = nCreate.substring(8,10);
            var yearCreate = nCreate.substring(11,15);
            var dateCreate = dayCreate+' '+monthCreate+' '+yearCreate;

            var displayItems ='<tr><td><b>'+dateCreate+'</b></td>'+
                                '<td>'+inspectionItemsCount+'</td>'+
                                '<td>'+inspectionDays+'</td>'+             
                                '<td>'+inspectionToBeDued+'</td>'+
                                '<td>'+dateSubmitted+'</td></tr>';

            $("#item tbody").html(displayItems);
        }

    });
 
}

function inspection(inspectionLength)
{
    sessionStorage.setItem("itemsName", itemsData[inspectionLength].item_name);
    sessionStorage.setItem("itemsPhoto", itemsData[inspectionLength].item_photo);
    sessionStorage.setItem("itemsCondition",itemsData[inspectionLength].item_condition);
    sessionStorage.setItem("itemsMethod",itemsData[inspectionLength].item_method);
    sessionStorage.setItem("itemStatus",itemsData[inspectionLength].item_status);
    sessionStorage.setItem("itemsComments",itemsData[inspectionLength].item_comments);
    window.location = '../item.html';
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