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
            return username;
    } else {
        $('.main').html('<div style="margin: 50px; line-height: 2; font-size:160%"><h2>You must be logged in to create chargebacks.</h2><ol>' +
            "<li>Make sure you're using Internet Explorer." +
            "<li>Under Tools - Options - Security - Custom Level, make sure 'Initialize and script ActiveX controls not marked as safe for scripting' is set to Prompt" +
            "<li>When asked 'An ActiveX control on this page... allow this interaction?', say 'Yes'" +
            '</ol></div>'
        );
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
        'debit_credit': f.debit_credit || '',
        'sla':      Date.fromString(f.sla).getTime() || (Date.fromString(f.on).getTime() || now) + 86400 * 14 * 1000,

        'order':    f.order || '',
        'ordered':  f.ordered ? Date.fromString(f.ordered).getTime() : 0,
        'ref':      f.ref || '',
        'value':    Math.round(+(f.value || 0) * 100),
        'seller':   f.seller || '',
        'chargeseller': f.chargeseller || '',
        'disputed': f.disputed || '',
        'why':      f.why || '',

        'status':   f.status || '',
        'dash':     f.dash || '',
        'refund':   f.refund || '',
        'pod':      f.pod || '',
        'cover':    f.cover || '',
        'reason':   f.reason || '',
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
        'debit_credit': (f.debit_credit||'')+'',
        'sla':      (new Date(f.sla || 0)).asString(),

        'order':    (f.order||'')+'',
        'ordered':  f.ordered ? (new Date(f.ordered)).asString() : '',
        'ref':      (f.ref||'')+'',
        'value':    ((f.value || 0) / 100)+'',
        'seller':   (f.seller||'')+'',
        'chargeseller': (f.chargeseller||'')+'',
        'disputed': (f.disputed||'')+'',
        'why':      (f.why||'')+'',

        'status':   (f.status||'')+'',
        'dash':     (f.dash||'')+'',
        'refund':   (f.refund||'')+'',
        'pod':      (f.pod||'')+'',
        'cover':    (f.cover||'')+'',
        'reason':   (f.reason||'')+'',
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
