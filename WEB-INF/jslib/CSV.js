CSV = {
    escape: function (item) {
        if (typeof item == 'undefined') { return '""'; }
        else if (typeof item == 'string') { return '"' + item.replace(/"/g, '""') + '"'; }
        else if (typeof item == 'number') { return '"' + item + '"'; }
        else { return item; }
    },

    date: function (d) {
        if (d) {
            d = new Date(d || 0);
            return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        } else { return ''; }
    },

    time: function (d) {
        d = d / 1000;
        var s = d % 60,
            m = ((d - s)/ 60) % 60,
            h = ((d - s - 60*m) / 3600);
        return h + ':' + m + ':' + s;
    }
};
