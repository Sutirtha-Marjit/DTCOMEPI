var Chalk = require('chalk');
var FileSystem = require('fs');

function EpiPageTraverse(){

    var masterFileData=[];
    var masterCallBack = function(){ console.log(Chalk.red('No callback function is plugged for folder read.')); };
    var handleSingleFile = function(filename,completeLength,onlyFileName,givenFolderName){

            FileSystem.stat(filename,function(error,fileDetails){  
                fileDetails.filename = onlyFileName;              
                masterFileData.push(fileDetails);
                if(masterFileData.length === completeLength){
                    console.log(Chalk.blue("Analyzed all files in the '"+givenFolderName+"' folder"));
                    masterCallBack(masterFileData);
                }
            });
    };

    var getCompleteListOfFiles = function(givenFolderName){

        var foldername = givenFolderName
        
        FileSystem.readdir(foldername,function(err, files){
        console.log(files.length+" files available");    
        for(var c=0;c<files.length;c++){
            handleSingleFile(foldername+"/"+files[c],files.length,files[c],givenFolderName);
            
        }    
            
            
            

            
        });
        
        
    }

    this.renderList = function(givenFolderName,renderCallBack){
        console.log(Chalk.yellow("List rendering started..."));
        masterCallBack = renderCallBack;
        getCompleteListOfFiles(givenFolderName);
    }

}

module.exports = EpiPageTraverse;