import * as $ from 'jquery';

var header = document.getElementsByClassName("dashboard-widget-header")[0];
header.addEventListener('mouseover', function() {
    console.log('Event triggered');
    // const dropdown = element(".cso-dropdown-cont");
    console.log(header);
    //   dropdown.dispatchEvent(clickEvent)
    var dropdown = header.getElementsByClassName("dropdown-toggle");
    // var dropdown = document.getElementsByClassName("dropdown-toggle");
    // eventFire(dropdown, "click");
    console.log("dropdown here");
    console.log(dropdown);
    if(dropdown && dropdown.length > 0) {
        var dd = dropdown[0] as HTMLElement;
        dd.click();
        console.log("click this for me");
    }
    
    // $("ul .dropdown-menu")[0].click();
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

$(".dashboard-widget-header").on('change', '.cso-dropdown-cont', function() {
    console.log("test test test")
})

$(document).on('change', '.cso-dropdown-cont', function() {
    console.log("test test 2 test")
})


var hoverEvent = new MouseEvent('mouseover', {
    'view': window,
    'bubbles': true,
    'cancelable': true
});

var clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
});

eventFire(header, 'mouseenter');
eventFire(header, 'mousemove');
eventFire(header, 'mouseover');
eventFire(header, 'mousedown');
eventFire(header, 'mouseup');
eventFire(header, 'mouseout');
eventFire(header, 'mouseleave');
    

// delay execution
setTimeout(function () {
    eventFire(header, 'mouseenter');
    eventFire(header, 'mousemove');
    eventFire(header, 'mouseover');
    eventFire(header, 'mousedown');
    eventFire(header, 'mouseup');
    eventFire(header, 'mouseout');
    eventFire(header, 'mouseleave');
    // hover twice
}, 3000);

// delay execution
setTimeout(function () {
    eventFire(header, 'mouseenter');
    eventFire(header, 'mousemove');
    eventFire(header, 'mouseover');
    eventFire(header, 'mousedown');
    eventFire(header, 'mouseup');
    eventFire(header, 'mouseout');
    eventFire(header, 'mouseleave');
    // hover twice
}, 6000);