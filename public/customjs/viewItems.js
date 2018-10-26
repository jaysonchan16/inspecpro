var db = firebase.firestore();
var itemsName = [];
var display="";
var contentDisplay="";
var userId="";
var userdocRef = "";
var archiveName = sessionStorage.getItem("archiveName");
var archiveID = sessionStorage.getItem("archiveID");
var assigned_property = sessionStorage.getItem("assigned_property");
var inspectionData = [];
var itemsID = sessionStorage.getItem("ItemsID");

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
        });

        inspection();
    });
}

function inspection()
{
    $("#subtitle").html("<p style='color:purple;'><b>"+archiveName+"</b></p>");
    $("#archiveData").html(archiveName);

    db.collection("properties").doc(assigned_property).collection("archives").doc(archiveID).collection("inspected_history").doc(itemsID).get().then(function(documentSnapshot) {

        console.log(documentSnapshot.data().inspection_items_object);

        var itemObject = documentSnapshot.data().inspection_items_object;
        for(var i=0;i<itemObject.length;i++)
        {
            var dSub = new Date(itemObject[i].item_reported_at);
            var nSub = dSub.toDateString();
            var monthSubmitted = nSub.substring(4,7);
            var daySubmitted = nSub.substring(8,10);
            var yearSubmitted = nSub.substring(11,15);
            var dateSubmitted = daySubmitted+' '+monthSubmitted+' '+yearSubmitted;

            contentDisplay += '<tr><td>'+itemObject[i].item_check_question+'</td><td>'+itemObject[i].item_comments+
            '</td><td>'+itemObject[i].item_condition+'</td><td><img width="242" height="242" src="'+itemObject[i].item_condition_photo+'"></td>'+
            '<td></td>'+itemObject[i].item_description+'</td><td>'+itemObject[i].item_method+'</td><td>'+itemObject[i].item_modified_at+
            '</td><td>'+itemObject[i].item_modified_by+'</td><td>'+itemObject[i].item_name+'</td><td><img width="242" height="242" src="'+itemObject[i].item_photo+'"></td>'+
            '<td>'+dateSubmitted+'</td><td>'+itemObject[i].item_reported_by+'</td><td>'+itemObject[i].item_status+"</td></tr>";
            $("#itemsTable tbody").html(contentDisplay);
        }
    });
                
}

function viewItems(ItemsID)
{
    sessionStorage.setItem("ItemsID",ItemsID);
    window.location = '../viewItems.html';
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
        csv.push(row.join(","));        
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}
