Class({ id: 'Chargeback', properties: chargebacks_schema});

var chargebacks_schema = {
    'dept':         { type: 'string' },
    'card':         { type: 'string' },
    'amt':          { type: 'integer' },
    'on':           { type: 'integer' },
    'bank':         { type: 'string' },
    'type':         { type: 'string' },
    'caseref':      { type: 'string' },
    'bankref':      { type: 'string' },
    'dc':           { type: 'string' },
    'sla':          { type: 'integer' },

    'order':        { type: 'string' },
    'value':        { type: 'integer' },
    'seller':       { type: 'string' },

    'status':       { type: 'string' },
    'dash':         { type: 'string' },
    'refund':       { type: 'string' },
    'pod':          { type: 'string' },
    'cover':        { type: 'string' },
    'notes':        { type: 'string' },
    
    'time':         { type: 'integer' },
    'user':         { type: 'string' },
    'hist':         { type: 'array' }
};

if (typeof app == 'function') { oldApp = app; }
app = function(env){
    var url = decodeURIComponent(env.PATH_INFO + (env.QUERY_STRING ? '?' + env.QUERY_STRING  : ''));
    // Redirect the home page to the form page
    if (url == '/') {
        return {
            status: 302,
            headers: { 'Location': '/form.html' },
            body: '<a href="/form.html">Chargeback form</a>'
        };
    }

    // else redirect to a previous handler, if it existed
    else if (typeof oldApp == 'function') {
        return oldApp(env);
    }
};
