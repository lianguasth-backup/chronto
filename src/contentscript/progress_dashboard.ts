var header = document.getElementsByClassName("dashboard-widget-header")[0];
var title = document.getElementsByClassName("dashboard-widget-title")[0];

function triggerDropdown(header) {
    var dropdown = header.getElementsByClassName("dropdown-toggle");
    if(dropdown && dropdown.length > 0) {
        var dd = dropdown[0] as HTMLElement;
        dd.click();
        console.log("header is: ");
        console.log(header);
        const dropdownSelections = header.getElementsByTagName("li");
        if(dropdownSelections && dropdownSelections.length > 0) {
            const viewDetails = dropdownSelections[0].firstElementChild;
            console.log(viewDetails);
            viewDetails.click();
        }
    }
}

header.addEventListener('mouseover', function() {
    triggerDropdown(header);
});

function eventFire(el, etype){
    console.log("fired")
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

// trigger dropdown generation
eventFire(title, 'mouseover');

// delay execution
setTimeout(function () {
    eventFire(header, 'mouseover');
},  500);