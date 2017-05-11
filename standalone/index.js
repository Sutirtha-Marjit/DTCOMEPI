var FileSystem = require('fs');
var Express = require('express');
var CopyDir = require('copy-dir');
var Chalk = require('chalk');
var CopyContent = require('./admin/utils/copycontent');
var UIFolderManager = require('./admin/utils/uifoldermanager');
var EpiPageTraverse = require('./admin/utils/epipagetraversal');
var RimRaf = require('rimraf');
var app = Express();
var port = 3102;
var cpcn = new CopyContent();
var uifmgnr = new UIFolderManager(); 

app.use('/en',Express.static(__dirname +'/epi'));
app.use('/se/sv',Express.static(__dirname +'/epi'));
app.use('/admin/frontend/utilities/scripts/',Express.static(__dirname +'/admin/admin-front-end'));

app.set('view engine', 'ejs');
app.set('views','admin/views');

app.get('/copycontent',function(req,res){
    
    cpcn.copyContent(req.query.weburl,function(){
        
    });
    res.json({ok:true});
});

app.get('/',function(req,res){

    var epipagetraverse = new EpiPageTraverse();
    epipagetraverse.renderList('./epi',function(masterFileData){
        res.render('pages/index',{meta:{},data:masterFileData});        
    });
    
});

app.get('/feed/service/fresh-page/',function(req,res){
    cpcn.copyContent('http://www.lipsum.com',function(content){
           
        if(content.error===null){
            
        }

        res.json(content);
    });
    
});

app.get('/feed/service/fresh-folder/',function(req,res){
    uifmgnr.takeBackUp('./epi/','./admin/backup/',function(statusJSON){
        res.json(statusJSON);
    });
});

app.get('/feed/service/clean-backup-folder/',function(req,res){
    var output={};
    RimRaf('./admin/backup',FileSystem,function(err){
        if(!err){
            console.log(Chalk.red('backup folder deleted'));
            output.status = true;
        }else{
            output.status = false;
        }

        res.json(output);
    });
});


app.get('/feed/service/remove-ui-folder/',function(req,res){
    var output={};
    RimRaf('./epi/ui',FileSystem,function(err){
        if(!err){
            console.log(Chalk.red('UI folder deleted'));
            output.status = true;
        }else{
            output.status = false;
        }

        res.json(output);
    });
});

app.get('/feed/service/copy-folder-from-source/',function(req,res){

    CopyDir(req.query.path+'/ui','./epi/ui',function(err){

    });
    
    
    res.json({status:true,data:req.query});

});


app.listen(port,function(){
    console.log('\n'+Chalk.yellow('Application started on port ')+Chalk.green(port)+' on '+Chalk.green((new Date())));
});
