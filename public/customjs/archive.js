var db = firebase.firestore();
var arrayUserDetails = [];
var assigned_property = "";
var whitebox='<div class="card"><div class="card-body"><div class="row"><div class="col-sm-12"><div class="white-box"><b>';
var head='</b></div></div></div></div></div>';
/*var table = '</b><div class="table-responsive"><table class="table" id="inspection"><thead><tr><td>Submitted Inspections</td><td>Action Items Found</td><td>Submitted By</td><td></td></tr></thead>';
var end ='</tbody></table></div> </div> </div> </div> </div> </div><br><br>';*/
var display="";
var userId="";
var userdocRef = "";

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
        
        sessionStorage.removeItem("archiveName");
        sessionStorage.removeItem("archiveID");
        sessionStorage.removeItem("assigned_property");  

        userId = user.uid;

        userdocRef = db.collection("users").doc(userId);

        userdocRef.get().then(function(doc) {
            if (doc.exists) {
                $("#username").html(doc.data().email);
                arrayUserDetails.push(doc.data());

                assigned_property = arrayUserDetails[0].assigned_property;

                    db.collection("properties").doc(assigned_property).collection("archives").get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {

                            display += whitebox + '<input style="cursor:pointer; color:purple; padding: 0; border: none; background: none;" type="button" id="'+doc.id+'" onclick="inspection(this.value,this.id)" value="'+doc.data().inspection_name +'"</input>'+ head;
                            $("#archive").html(display);
                            
                        });
                    });
        }
        else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });
  });
}

function inspection(name,id)
{
    sessionStorage.setItem("archiveName",name);
    sessionStorage.setItem("archiveID",id);
    sessionStorage.setItem("assigned_property",assigned_property);
    window.location = '../archiveData.html';
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