function setATrigger () {
  ScriptApp.newTrigger("deleteMails")
  .timeBased()
  .everyDays(1)
  .create()
}

//Deletes all triggers that call the purgeMore function.
function removeDeleteMailsTriggers(){
  const triggers = ScriptApp.getProjectTriggers()
  for (let i = 0; i < triggers.length; i++) {
    let trigger = triggers[i]
    if(trigger.getHandlerFunction() === 'deleteMails'){
      ScriptApp.deleteTrigger(trigger)
    }
  }
}
function setMoreTriggers () {
 ScriptApp.newTrigger("deleteMails")
  .timeBased()
  .at(new Date((new Date()).getTime() + 1000 * 2))
  .create() 
}

function deleteMails() {
  
  removeDeleteMailsTriggers();

  const DELETE_AFTER_DAYS  = 7;

  const PAGE_SIZE = 150;

  const search = 'in:inbox -in:starred -in:important is:unread older_than:7d';   
  const threads = GmailApp.search(search, 0, PAGE_SIZE);

  if(threads.length === PAGE_SIZE || threads.length > PAGE_SIZE){
    console.log('PAGE_SIZE exceeded. Setting a trigger to call the deleteMails in 2 minutes.')
    setMoreTriggers();
  }

  Logger.log("Deleting " + threads.length + " mails");

  const cutoffDate = new Date();

  cutoffDate.setDate(cutoffDate.getDate() - DELETE_AFTER_DAYS );
  threads.forEach((thread) => {
    if(thread.getLastMessageDate().getDate() < cutoffDate.getDate()){
      Logger.log(thread.getLastMessageDate());
      thread.moveToTrash();
    }
  })
}
