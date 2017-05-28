var Chalk = require('chalk');
var FileSystem = require('fs');
var http = require('http');
var Phantom = require('node-phantom');
var pretty = require("pretty");




function CopyContent(){
    
    this.copyContent = function(path,callback){
       console.log(Chalk.blue('One request received to copy content from ')+Chalk.green.underline('"'+path+'"'));
       Phantom.create(function(error,p){
           console.log(error);
       })
      // var webPage = require('webpage');
       /*
       request(path,function(error,response,body){
           if(error){
               callback({error:error});
           }else{
               callback({error:null,data:body});
           }
       });*/

      
    };

    var getFileName = function(obj){
        var fileName = obj.filename;
        
        if(fileName.trim().length===0){
            var ran = (Math.random()+"").replace("0.","-");
            fileName = "epi/untitled"+ran+".html"
        }else{
            if(fileName.indexOf('.html')===-1){
                fileName = "epi/"+fileName+".html";
            }else{
                fileName = "epi/"+fileName;
            }            
        }

        return fileName;
    };

    var adjustToFitContent = function(content){
        return content;
    };

    this.createBeautifiedHTMLPage = function(obj,callback){
        var HTMLContent = obj.content;
        var fileName = getFileName(obj);
        if(obj.cleanup!==0){
            HTMLContent = adjustToFitContent(HTMLContent);
        }
        HTMLContent = pretty(HTMLContent,{ocd:true});
        
        console.log(Chalk.blue('File to be created is '+fileName));
        console.log(Chalk.blue('File creation starting'));
        FileSystem.writeFile(fileName,HTMLContent,'utf8',function(err){
            if(err){
                console.log(err);
                callback({filename:fileName,status:false});
            }else{
                console.log(Chalk.yellow('File creation done'));
                callback({filename:fileName,status:true});
            }
            
        });
        
        
        
        
        
    };

}

module.exports = CopyContent;