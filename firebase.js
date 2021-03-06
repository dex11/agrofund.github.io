
var firebaseConfig = {
    apiKey: "AIzaSyCIK2F0MXFXlY9bQcaHtl5wYwsOwDVhH7g",
    authDomain: "agrofund-38aa3.firebaseapp.com",
    projectId: "agrofund-38aa3",
    storageBucket: "agrofund-38aa3.appspot.com",
    messagingSenderId: "457820618036",
    appId: "1:457820618036:web:f18d6828a0d18e3f9ab961"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();
var data = [];

function logIn(e){
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
        if(email === "admin@gmail.com") window.location.href="adminPanel.html"
        else window.location.href="landingpage.html";
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}

function register(e){
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;
    if(password === repassword){
        auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
            window.location.href="index.html";
        })
        .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        });  
    }else{
        alert("REENTERED PASSWORD IS INCORRECT");
    } 
}

function addNewLotInDatabase(newLot){
    db.collection("lots").add(newLot)
    .then(function() {
        alert("წარმატებით ჩამატდა ახალი ლოტი");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
        alert("ახალი ლოტის ჩამატებისას შეიქმნა პრობლემა. გთხოვთ ცადოთ ხელახლა!")
    });
}

function getData(itm){
    let first = null;
    let lastVisible = itm;
    if(lastVisible === "null"){
        first = db.collection("lots").orderBy("id").limit(4);
    }else{
        first = db.collection("lots")
                .orderBy("id")
                .startAfter(parseInt(lastVisible))
                .limit(4);
    }
    return first.get().then(function (documentSnapshots) {
    documentSnapshots.docs.map(snapShot =>{
        data.push(snapShot.data());
        data[data.length-1].serverId = snapShot.id;
    });
    let lastVisibleDoc = documentSnapshots.docs[documentSnapshots.docs.length-1];
    if(lastVisibleDoc == null || documentSnapshots.docs.length < 4){
        let nextButton = document.getElementById("next_page_button");
        nextButton.disabled = true;
    }else{
        lastVisible = lastVisibleDoc.data().id;
        window.localStorage.setItem("nextList", lastVisible);
    }
    displayLots();
    }).catch(function(error) {
        console.error("Error updating document: ", error);
        alert("ოპერაციის განხორციელებისას მოხდა შეცდომა! ცადეთ ხელახლა!");
    });
}

function updateLot(lotId, amount){
    db.collection("lots").doc(lotId).update({
        raised: amount,
    })
    .then(function() {
        console.log("Document successfully written!");
        alert("გადახდა წარმატებით შესრულდა");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
        alert("გადახდა ვერ შესრულდა! სცადეთ ხელახლა.")
    });
}

function updateObject(lotId, obj){
    db.collection("lots").doc(lotId).update(obj)
    .then(function() {
        console.log("Document successfully written!");
        alert("ოპერაცია წარმატებით შესრულდა");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
        alert("ოპერაციის შესრულებისას იყო შეცდომა")
    });
}

function getMyLots(){
    let lots = window.localStorage.getItem("myLots");
    console.log(lots);
    if(lots.length > 0){
        lots = lots.split(" ");
        let hadProblem = false;
        let dbd = db.collection("lots");
        for(let i = 1; i < lots.length; i++){
            let lotId = lots[i];
            console.log(lotId);
            dbd.doc(lotId).get().then(function(doc) {
                if (doc.exists) {
                    data.push(doc.data());
                    displayLots();
                } else {
                    hadProblem = true;
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        }
        if(hadProblem) alert("ზოგიერთი თქვენი ლოტი უკვე წაიშალა ჩვენი მონაცემთა ბაზიდან");
    }
}