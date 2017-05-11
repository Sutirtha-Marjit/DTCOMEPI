var Chalk = require('chalk');
var FileSystem = require('fs');
var http = require('http');
var request = require('request');


function CopyContent(){

    this.copyContent = function(path,callback){
       console.log(Chalk.blue('One request received to copy content from ')+Chalk.green.underline('"'+path+'"'));
       
       request(path,function(error,response,body){
           if(error){
               callback({error:error});
           }else{
               callback({error:null,data:body});
           }
       });

      
    };



}

module.exports = CopyContent;