Date.format = 'yyyy-mm-dd';

function inituser(field) {
    // Get all cookies
    for (var pairs = document.cookie.split(/\s*;\s*/), l=pairs.length, i=0, cookie={}; i<l; i++) {
        var pair = unescape(pairs[i]).split(/\s*=\s*/);
        cookie[pair[0]] = pair[1];
    }

    var username = cookie.username;
    // If username wasn't stored there, try and get it from ActiveX and store it
    if (!username) {
        try {
            var wsn = new ActiveXObject("WScript.Network");
            if (wsn && wsn.UserName) {
                username = wsn.UserName;
                document.cookie = 'username=' + escape(username) + '; path=/';
            }
        } catch(e) { }
    }

    // If we found the username...
    if (username) {
        $(field)
            .data('current_user', username)         // store it
            .val($(field).val() || username)        // display it if the form's just been created
            .attr('disabled', 'disabled');          // and user can't edit it any more
    }
}

function fields2data(f) {
    var now = (new Date()).getTime();
    return {
        'dept':     f.dept || '',
        'card':     f.card || '',
        'amt':      Math.round(+(f.amt || 0) * 100),
        'on':       Date.fromString(f.on).getTime() || now,
        'bank':     f.bank || '',
        'type':     f.type || '',
        'caseref':  f.caseref || '',
        'bankref':  f.bankref || '',
        'dc':       f.dc || '',
        'sla':      Date.fromString(f.sla).getTime() || now,
        
        'order':    f.order || '',
        'value':    Math.round(+(f.value || 0) * 100),
        'seller':   f.seller || '',
        
        'status':   f.status || '',
        'dash':     f.dash || '',
        'refund':   f.refund || '',
        'pod':      f.pod || '',
        'cover':    f.cover || '',
        'notes':    f.notes || '',
        'time':     f.time || now,
        'user':     f.user || '',
        'hist':     f.hist || []
    }
}

function data2fields(f) {
    return {
        'dept':     (f.dept||'')+'',
        'card':     (f.card||'')+'',
        'amt':      ((f.amt||0) / 100)+'',
        'on':       (new Date(f.on || 0)).asString(),
        'bank':     (f.bank||'')+'',
        'type':     (f.type||'')+'',
        'caseref':  (f.caseref||'')+'',
        'bankref':  (f.bankref||'')+'',
        'dc':       (f.dc||'')+'',
        'sla':      (new Date(f.sla || 0)).asString(),
        
        'order':    (f.order||'')+'',
        'value':    ((f.value || 0) / 100)+'',
        'seller':   (f.seller||'')+'',
        
        'status':   (f.status||'')+'',
        'dash':     (f.dash||'')+'',
        'refund':   (f.refund||'')+'',
        'pod':      (f.pod||'')+'',
        'cover':    (f.cover||'')+'',
        'notes':    (f.notes||'')+'',
        'time':     (f.time||'')+'',
        'user':     (f.user||'')+'',
        'hist':     f.hist
    }
}

// Common onDOMReady()
$(function() {
    $('.view_link').attr('href', 'view.html?orderby=-time');
});
