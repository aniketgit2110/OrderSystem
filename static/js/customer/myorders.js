
//Toggle between pending and dispatched sections
var pendingButton = document.getElementById("pending-button");
var pendingSection = document.getElementById("pending-products-section");
var dispatchedButton = document.getElementById("dispatched-button");
var dispatchedSection = document.getElementById("dispatched-products-section");

pendingButton.addEventListener("click", function() {
    pendingSection.classList.remove("hidden");
    dispatchedSection.classList.add("hidden");
});
dispatchedButton.addEventListener("click", function() {
    pendingSection.classList.add("hidden");
    dispatchedSection.classList.remove("hidden");
});

//Urgent Toggle for Products 
const urgentToggle = document.querySelectorAll('.urgent-switch');
urgentToggle.forEach(urgentSwitch => {
    urgentSwitch.addEventListener('change', (event) => {
        const isUrgent = event.target.checked;
        const itemId = urgentSwitch.dataset.itemId;
        fetch('/set_urgent_product/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken, 
              },
          body: JSON.stringify({'is_urgent': isUrgent, 'item_id': itemId})
          })
          .then(response => response.json())   
      });
})


//To place cancellation request for order
function requestCancellation(itemId){
    console.log('Ordered Product Id:', itemId, "Placed for cancellation.")
    var deleteButton = document.getElementById(`delete-ordered-${itemId}`);
    var revertButton = document.getElementById(`revert-deleted-${itemId}`);
    deleteButton.classList.add("hidden");
    revertButton.classList.remove("hidden");

    fetch('/request_cancellation/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken, 
        },
        body: JSON.stringify({'itemId': itemId })
    })

}

//To revert cancellation request
function revertCancellation(itemId){
    console.log('Ordered Product Id:', itemId, "Request Reverted.")
    var deleteButton = document.getElementById(`delete-ordered-${itemId}`);
    var revertButton = document.getElementById(`revert-deleted-${itemId}`);
    revertButton.classList.add("hidden");
    deleteButton.classList.remove("hidden");


    fetch('/revert_cancellation/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken, 
        },
        body: JSON.stringify({'itemId': itemId })
    })
    
    
}

