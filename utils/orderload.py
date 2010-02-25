import csv, codecs, ConfigParser

config = ConfigParser.ConfigParser()
config.read('orderload.ini')
opt = dict(config.items('OrderFile'))
delim       = opt.get('delimiter', '|')
quote       = opt.get('doublequote', '$')
infile      = opt['input']
outfile     = opt.get('output', 'orderload.csv')

print 'Loading %s...' % infile
print 'This could take a while...'
input  = codecs.open(infile, encoding = opt.get('encoding', 'utf_16'), errors='ignore')
data = {}
for row in input:
    id, ref = row.replace(quote, '').split(delim)[:2]
    data[id] = ref

print 'Saving %s...' % outfile
output = open(outfile, 'w')
output.write('orderid,orderref\n')
for id in sorted(data.keys()):
    output.write(id + ',' + data[id] + '\n')
