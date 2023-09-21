//Open a DataBase  (& add Event Listeners)
//Create ObjectStores (can be created only in upgradeneeded event)
//Make Transactions (add, remove, modify data)
let db;
let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success", (e) => {
    console.log("DB success");
    db = openRequest.result; //for accessing DB
})
openRequest.addEventListener("error", (e) => {
    console.log("DB error");
})
openRequest.addEventListener("upgradeneeded", (e) => {
    console.log("DB upgraded & also for initial DB creation");
    db = openRequest.result; //for accessing DB

    db.createObjectStore("video", {keyPath: "id"});//keypath has unique id so that we can refer data 
    db.createObjectStore("image", {keyPath: "id"});//in that object
})
