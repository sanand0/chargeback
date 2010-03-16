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
    'ref':          { type: 'string' },
    'value':        { type: 'integer' },
    'seller':       { type: 'string' },
    'chargeseller': { type: 'string' },

    'status':       { type: 'string' },
    'dash':         { type: 'string' },
    'refund':       { type: 'string' },
    'pod':          { type: 'string' },
    'cover':        { type: 'string' },
    'reason':       { type: 'string' },
    'notes':        { type: 'string' },

    'time':         { type: 'integer' },
    'user':         { type: 'string' },
    'hist':         { type: 'array' }
};

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

    // /order/id returns JSON order data
    // requires (cygwin/bin/) grep.exe, cygiconv-2.dll, cygintl-8.dll, cygwin1.dll
    else if (url.match(/^\/order\??/)) {
        // Get the search parameter from the request
        var search = env.QUERY_STRING.split('=')[1];

        // Ensure that it's alphanumeric, and search for matches in the orders
        if (search.match(/[^A-Za-z0-9]/)) { return error; }
        var MATCH_COUNT = 10;
        var orders = exec('utils/grep.exe -h -m' + MATCH_COUNT + ' "^' + search + '," order/order*');

        // Convert result into array of arrays
        for (var result = [], i=0, order; order=orders[i]; i++) {
            result.push(order.split(','));
        }

        // Return the JSON result
        return {
            headers: { 'Content-type': 'text/javascript' },
            body: JSON.stringify(result)
        };
    }
    
    // /csv/
    else if (url.match(/^\/csv\//)) {
        var match = url.match(/^\/csv(\/.*)$/);
        var result = load(match[1]),
            out = ['Department,Card,Amount,Chargeback date,Bank,Chargeback type,Case reference,Bank reference,Debit Credit,SLA,Order ID,Order Reference,Order value,Seller ID,Charge seller,Status,DASH,Refund,Proof of Delivery,Cover letter,Reason,Notes,Last updated,User ID'];

        for (var i=0, e; e=result[i]; i++) {
            var row = [
                CSV.escape(e.dept),
                CSV.escape(e.card),
                CSV.escape(e.amt / 100.0),
                CSV.escape(CSV.date(e.on)),
                CSV.escape(e.bank),
                CSV.escape(e.type),
                CSV.escape(e.caseref),
                CSV.escape(e.bankref),
                CSV.escape(e.debit_credit),
                CSV.escape(CSV.date(e.sla)),
                CSV.escape(e.order),
                CSV.escape(e.ref),
                CSV.escape(e.value / 100.0),
                CSV.escape(e.seller),
                CSV.escape(e.chargeseller),
                CSV.escape(e.status),
                CSV.escape(e.dash),
                CSV.escape(e.refund),
                CSV.escape(e.pod),
                CSV.escape(e.cover),
                CSV.escape(e.reason),
                CSV.escape(e.notes),
                CSV.escape(CSV.date(e.time)),
                CSV.escape(e.user)
            ];
            out.push(row.join(','));
        }
        return {
            status: 200,
            headers: {'Content-Type':'text/csv', 'Content-Disposition':'filename=chargeback.csv', 'Cache-Control':'max-age=0'},
            body: out.join('\n')
        };
    }
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

keys = function(o, match, nomatch) {
    var k = [];
    for (var i in o) { 
        if (o.hasOwnProperty(i) && (match ? i.match(match) : 1) && (nomatch ? !i.match(nomatch) : 1)) { 
            k.push(i);
        }
    }
    return k;
}