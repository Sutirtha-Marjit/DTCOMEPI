var Chalk = require('chalk');
var FileSystem = require('fs');
var http = require('http');

function CopyContent(){

    this.copyContent = function(path,callback){
       console.log(Chalk.blue('Requested content copy from ')+Chalk.green.underline('"'+path+'"'));
    };



}

module.exports = CopyContent;