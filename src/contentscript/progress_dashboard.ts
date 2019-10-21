var headers = document.getElementsByClassName("dashboard-widget-header");

for (var i = 0; i < headers.length; i++) {
    const header = headers[i];
    setTimeout(function() {
        generateReport(header);
    }, 10000 * i);
}

function generateReport(header) {
    const func = headerEventListenerFunc(header)
    header.addEventListener('mouseover', func);

    var title = header.getElementsByClassName("dashboard-widget-title")[0];
    // trigger dropdown generation
    eventFire(title, 'mouseover');

    // delay execution
    setTimeout(function () {
        eventFire(header, 'mouseover');
        header.removeEventListener("mouseover", func);
    },  500);
}

function headerEventListenerFunc(header) {
    return function() {
        triggerDropdown(header);
    }
}

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
