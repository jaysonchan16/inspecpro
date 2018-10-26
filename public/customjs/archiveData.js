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

$(document).ready(function(){
    loadDetails();

    $("#allArchive").off('click').on('click', function(){
        window.location = '../archive.html';
    });
});
  
function loadDetails()
{
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        window.location = '../login.html';
        }
        
        sessionStorage.removeItem("ItemsID");
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
    $("#title").text(archiveName);
    
    db.collection("properties").doc(assigned_property).collection("archives").doc(archiveID).collection("inspected_history").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            var dSub = new Date(doc.data().inspection_submitted_at);
            var nSub = dSub.toDateString();
            var monthSubmitted = nSub.substring(4,7);
            var daySubmitted = nSub.substring(8,10);
            var yearSubmitted = nSub.substring(11,15);
            var dateSubmitted = daySubmitted+' '+monthSubmitted+' '+yearSubmitted;

         
                contentDisplay += '<tr><td>'+dateSubmitted+'</td><td>'+doc.data().inspection_checked_count+
                '</td><td>'+doc.data().inspection_submitted_by_name+'</td><td><input type="button" style="color:#00aec5; cursor:pointer; padding: 0; border: none; background: none;" id="'+doc.id+'" onclick="viewItems(this.id)" value="View Items">'+
                '</td></tr>';

                $("#example tbody").html(contentDisplay);
         
        });
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
