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
    $('#subInspection').off('click').on('click', function(){
        window.location = '../action.html';
    });
   
});

function loadDetails()
{
    firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        window.location = '../login.html';
        }

        sessionStorage.removeItem("InspectionDataLength");
        sessionStorage.removeItem("InspectionItemLength");
        sessionStorage.removeItem("InspectionName");
        sessionStorage.removeItem("InspectionID");
        var userId = user.uid;


        var userdocRef = db.collection("users").doc(userId);

        userdocRef.get().then(function(doc) {
            if (doc.exists) {
                $("#username").html(doc.data().email);
                arrayUserDetails.push(doc.data());
            
                assigned_property = arrayUserDetails[0].assigned_property;
                $("#inspection tbody").html("");
                $("#title").html('<p style="font-weight:bold;font-size: 34px;">INSPECTIONS</p>');

                $("#inspection thead").html("<tr><th>Inspection Name</th><th>Inspection Item Count</th><th>Status</th><th>Overdue By (days)</th><th>Due By</th><th>Last Submitted</th></tr>");

            db.collection("properties").doc(assigned_property).collection("inspections").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                   console.log(doc.id, " => ", doc.data());
                   
                   var d = new Date(doc.data().inspection_submitted_at);
                   var n = d.toDateString();
                   var month = n.substring(4,7);
                   var day = n.substring(8,10);
                   var year = n.substring(11,15);
                   var date = day+' '+month+' '+year;
                    
                   inspectionData.push(doc.data());

                    displayDetails ='<tr><td onclick="details('+inspectionData.length+','+inspectionData.inspection_items_count+');" style="cursor:pointer;color:purple;"><b>'+doc.data().inspection_name+'</b></td>'+
                                    '<td>'+doc.data().inspection_items_count+'</td>';
                        if(doc.data().inspection_status == "0")
                        {
                            displayDetails+='<td><span class="dot" style="background-color: #bbb;"></span></td>';
                        }
                        else
                        {
                            displayDetails+='<td><span class="dot" style="background-color: red;"></span></td>';
                        }
                    displayDetails +='<td>'+doc.data().inspection_days+'</td>'
                                   +'<td>'+doc.data().inspection_submitted_by+'</td>'
                                   +'<td>'+date+'<td></tr>';
                       
                $("#inspection tbody").append(displayDetails);
                });
            });

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    });
}

function details(length,itemsCount)
{
    var index=length-1;
    sessionStorage.setItem("InspectionDataLength", length);
    sessionStorage.setItem("InspectionItemLength", itemsCount);
    sessionStorage.setItem("InspectionName",inspectionData[index].inspection_name);
    sessionStorage.setItem("InspectionID",inspectionData[index].inspection_id);
    sessionStorage.setItem("AssignedProperty",assigned_property);
    sessionStorage.setItem("InspectionSubmittedAt",inspectionData[index].inspection_submitted_at);
    sessionStorage.setItem("InspectionCreatedAt",inspectionData[index].inspection_created_at);
    sessionStorage.setItem("InspectionItemsCount",inspectionData[index].inspection_items_count);
    sessionStorage.setItem("InspectionDays",inspectionData[index].inspection_days);
    sessionStorage.setItem("InspectionToBeDued",inspectionData[index].inspection_to_be_dued);
    window.location = '../inspection.html';
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