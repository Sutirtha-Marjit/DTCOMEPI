module.exports = function(path){

    var ZipFolder = require('zip-folder');  
    var FileSystem = require('fs');
    var createBackUpFolder = function(targetPath,callBack){
        if (!FileSystem.existsSync(targetPath)){
            FileSystem.mkdir(targetPath,function(error){
                if(error){
                    console.log('Error');
                }else{
                    callBack();
                }
            });
        }else{
            callBack();
        }
    }
    this.takeBackUp = function(uiFolderPath,targetPath,callback){

        createBackUpFolder(targetPath,function(){
                var zipPath = targetPath+(((Math.random()/7)+'r').replace('0.','uizip-'))+'.zip';
                ZipFolder(uiFolderPath,zipPath,function(error){
                if(error){
                    console.log('failed to create zip')
                    callback({status:false});
                }else{
                    console.log('Took backup of UI folder as '+zipPath);
                    callback({status:true,data:{filename:zipPath}});
                }
            });
        })
        
        
        
    };

};