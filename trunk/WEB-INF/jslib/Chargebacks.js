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

var CSV_Separator = '|';
var CSV_Quote = /\$/g;

// Code begins here

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

    // Shutdown function
    else if (url == '/shutdown-chargeback') {
        setTimeout(function() { java.lang.System.exit(0); });
        return {
            status: 200,
            body: '<h1>Shutting down...</h1>'
        };
    }

    else if (url == '/order-upload') {
        // http://commons.apache.org/fileupload/using.html
        var factory = new org.apache.commons.fileupload.disk.DiskFileItemFactory();
        var upload = new org.apache.commons.fileupload.servlet.ServletFileUpload(factory);
        var items = upload.parseRequest(request);
        var iter = items.iterator();
        while (iter.hasNext()) {
            var item = iter.next();
            if (!item.isFormField()) { item.write(new java.io.File('order/order-' + dateformat(new Date()))); }
        }
        return { body: '<h1>Uploaded</h1><p>Go back to the <a href="/view.html?orderby=-time">view</a> or <a href="/form.html">create a new form</a></p>' };
    }

    // /order?filter-parameters returns JSON order data
    // grep requires (cygwin/bin/) grep.exe, cygiconv-2.dll, cygintl-8.dll, cygwin1.dll
    else if (url.match(/^\/order\??/)) {
        var error = { 'Content-type': 'text/javascript', body: '{}' };

        // Get the search parameter from the request
        var search = '3'; // TODO: request.get('search')

        // Ensure that it's alphanumeric, and search for matches in the orders
        if (search.match(/[^A-Za-z0-9]/)) { return error; }
        var MATCH_COUNT = 10;
        var orders = exec('utils/grep.exe -h -m' + MATCH_COUNT + ' ' + search + ' order/order*');

        // Ensure that at least one result
        if (!orders.length) { return error; }

        // Get the column headers
        var header = exec('utils/head.exe -1 order/header')[0].replace(CSV_Quote, '').split(CSV_Separator);

        // Convert result into JSON
        for (var result = [], i=0, order; order=orders[i]; i++) {
            var fields = order.replace(CSV_Quote, '').split(CSV_Separator);
            result.push(zip(header, fields));
        }

        // Return the JSON result
        return {
            headers: { 'Content-type': 'text/javascript' },
            body: JSON.stringify(result)
        };
    }
};

// zip(['a','b','c'], [1,2,3]) --> { a:1, b:2, c:3 }
zip = function(a,b) {
    var dict = {};
    for (var i=0, l=a.length; i<l; i++) { dict[a[i]] = b[i]; }
    return dict;
};

// YYYY-MM-DD-hh-mm-ss
dateformat = function(d){
 function pad(n) {return n<10 ? '0'+n : n;};
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'-'
      + pad(d.getUTCHours())+'-'
      + pad(d.getUTCMinutes())+'-'
      + pad(d.getUTCSeconds());
};

// Standard Rhino execute function
// http://vision-media.ca/resources/javascript/rhino-java-system-exec-function
exec = function (cmd) {
  var lines = [], line;
  with (JavaImporter(java.lang, java.io)) {
    var process = Runtime.getRuntime().exec(cmd);
    var stream = new DataInputStream(process.getInputStream());
    while (line = stream.readLine()) { lines.push(line); }
    stream.close();
  }
  return lines;
};