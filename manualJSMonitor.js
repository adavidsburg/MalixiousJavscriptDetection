//Protecting the console from obfusification through rename
console_protection =  console;
console = function(){};

//Adding Monitoring to the XML HTTP request
open = window.XMLHttpRequest.prototype.open
function new_open() {
    console_protection.log("XHR CALL SENT TO: "+arguments[1])
  	return open.apply(this, arguments);
}
window.XMLHttpRequest.prototype.open = new_open


//Monitoring the Fest parameter
old_fetch = window.fetch;
function new_fetch(params){
  console_protection.log("fetch sent with the following params: "+params)
  old_fetch(params)
}



var cookie_watch;
function watchcookie(){
  if(document.cookie!=cookie_watch){
    console_protection.log('COOKIES HAVE BEEN UPDATED TO: '+cookie_watch)
    cookie_watch =  document.cookie;
  }
}

new_set_item = localStorage.setItem.__proto__;

function NewLocalStorageSet(key, value){
  console_protection.log('Local Storage has been set: '+key+' : '+value)
  new_set_item(key, value)
}
localStorage.setItem = NewLocalStorageSet;

function NewLocalStorageSet(key, value){
  console_protection.log('Local Storage has been set: '+key+' : '+value)
  new_set_item(key, value)
}
localStorage.setItem = NewLocalStorageSet;


function new_open_db(name, version, description, size, callbackFunction){
  db = openDatabase(name, version, description, size, callbackFunction);
  old_transaction = db.transaction;
  db.transaction = function(arguments){console.log("A sqlite call has been made:"+ arguments), old_transaction(arguments)}
  console_protection.log(db);
  console_protection.log(db.transaction);
  return db;
}
window.openDatabase = new_open_db;


//Checking for malicious attempts to store CC data
old_add = window.IDBObjectStore.prototype.add;
function new_indexedDB(arguments){
    console_protection.log("an indexedDB insert has been madee with the following data:"+arguments);
    old_add.apply(this, arguments);
    //return db;
}
window.IDBObjectStore.prototype.add = new_indexedDB;


//watching for new window opening to avoid pushing 3rd party data via parameters
old_window = window.open;
function new_window_open(url, target, opitions){
  console_protection.log("A new window is opened at: "+url+" via "+target+"& Options:");
}
window.open = new_window_open;


//Creats a list of form actions and then monitors for any adjustments, runs every 500ms
var formlist = [];
var matches = document.querySelectorAll("form");
console_protection.log('Forms initial actions:');
matches.forEach(function(value, key){
    console_protection.log(value.action)
    formlist.push(value.action)
})

function verify_form_values(){
  var matches = document.querySelectorAll("form");
  matches.forEach(function(value, key){
      if(value.action!=formlist[key]){
        console_protection.log("FORM ACTION HAS BEEN UPDATED:"+value.action);
        formlist[key]=value.action;
      }
  })

}
setInterval(verify_form_values, 500);

//Creats a list of iFrames and then monitors for any adjustments, runs every 500ms
var ifameList = [];
var iframes = document.querySelectorAll("iframe");
console_protection.log('Initial Iframe Locations:');
iframes.forEach(function(value, key){
    console_protection.log(value.src)
    ifameList.push(value.src)
})

function verify_iframe_location(){
  var matches = document.querySelectorAll("iframe");

  matches.forEach(function(value, key){
      if(value.src!=ifameList[key]){
        console_protection.log("An iframe src has been updated:"+value.src);
        ifameList[key]=value.src;
      }
  })

}
setInterval(verify_iframe_location, 500);

//Monitors for changes in the doc via the write. Will log in case there is a script being called
old_doc_write = document.write;
function new_doc_write(){
  console.log('Attempted To write to doc'+arguments[0]);
}
 document.write = new_doc_write;
