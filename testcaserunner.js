var fs = require('fs');
var net = require('net');
var fix = require('./fix.js');
var fixutil = require('./fixutils.js');
var _  = require('underscore');
_.mixin(require('underscore.string'));

var file = process.argv[2];

fs.readFile(file,encoding='UTF8', function (err, data) {
    if (err) throw err;
    var self  = this;
    
    var lines = data.split('\n');
    var commandQ = new Queue();
    
    var fixServer = null;
    var tcpClient = null;
  
    
    _.each(lines,function(str){
        var c = str.charAt(0);
        if(c==='i' || c==='e' || c==='I' || c==='E'){
            commandQ.queue(str);
        }
    });
    
    
    var str = commandQ.dequeue();
    processCommand(str);
    
    function processCommand(str){
        console.log("Processing "+str);
        var direction = str.charAt(0);
        var msg = _.trim(str.substr(1,str.length));

        if(direction=== '#'){ return ;}

        //initiate connection
        if(direction=== 'i'){
            self.fixServer = fix.createServer({},function(session){
                
                console.log("EVENT connect");
                //session.on("end", function(sender,target){ console.log("EVENT end"); });
                //session.on("logon", function(sender, target){ console.log("EVENT logon: "+ sender + ", " + target); });
                //session.on("incomingmsg", function(sender,target,msg){ console.log("EVENT incomingmsg: "+ JSON.stringify(msg)); });
                //session.on("outgoingmsg", function(sender,target,msg){ console.log("EVENT outgoingmsg: "+ JSON.stringify(msg)); });

                //start client
               self.tcpClient = net.createConnection(1234,"localhost");
               self.tcpClient.on('connect', function(){
                    console.log("connected");
                    processCommand(commandQ.dequeue());
               });
                           
            });
            self.fixServer.listen(1234, "localhost");
        }

        //expected disconnect
        if(direction=== 'e'){
            self.fixServer = null;
        }

        //msgs sent to fix engine
        if(direction === 'I'){
            var map = fixutil.convertToMap(msg);
            var fixmap = fixutil.convertRawToFIX(map);
            self.tcpClient.write(fixmap);     
        }

        //msgs expected from fix engine
        if(direction === 'E'){
            //expectedQ.queue(str);
        }
    };
});

//compare FIX messages
function compareFIX(fixActual, fixExpected){
    var errors = new Queue();
    
    var actual = fixutil.convertToMap(fixActual);
    var expected = fixutil.convertToMap(fixExpected);
    
    //remove time sensitive keys
    delete actual[9];
    delete actual[10];
    delete actual[52];
    delete expected[9];
    delete expected[10];
    delete expected[52];
    
    var isequal = _.isEqual(map,expectedmap);
    if(!isequal){
        console.log("Errors found:\n Expected msg:"+msg+"\n Actual msg  :"+self.expected);
        _.each(map, function(val, tag){
            var tagmatches = expectedmap[tag] === val;
            if(!tagmatches){
                console.log(" Tag "+tag+" expecte value "+val+" but received "+expectedmap[tag]);
                var errobj = {actualMsg:fixActual, expectedMsg:fixExpected, tag:tag, actualTagVal:val, expectedTagVal:expected[tag]};
                errors.queue(errorobj);
            }
        });
    }
    return errors;
}

//Queue data structure from wikipedia
//http://en.wikipedia.org/wiki/Queue_(data_structure)#Example_Javascript_code
function Queue(){
    this.data = [];
    this.head = 0;
    this.count = 0;
 
    this.size = function(){
        return this.count < 0 ? 0 : this.count;
    }
 
    this.queue = function(obj){
        this.data[this.count++] = obj;
    }
 
    this.dequeue = function(){
        //Amortizes the shrink frequency of the queue
        if(--this.count < this.data.length*0.9){
            this.data = this.data.slice(this.head);
            this.head = 0;
        }
        return this.data[this.head++];
    }
 
    this.peek = function(){
        return this.data[this.head];
    }
 
    this.isEmpty = function(){
        return this.count <= 0;
    }
}