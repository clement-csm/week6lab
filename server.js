let express = require('express');
let app = express(); 
let mongodb = require('mongodb');
let mongodbClient = mongodb.MongoClient;
let url = 'mongodb://localhost:27017/';
let db = null;

mongodbClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
    if(err){
        console.log('Could not connect to MongoDB.')
    } else {
        console.log('Connected to MongoDB.')
        db = client.db('week6lab');
    }
});

// setup the view engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); 

let bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}));

var filePath = __dirname + '/views/';
app.use(express.static('img'));
app.use(express.static('css'));

/* Home Page */
app.get('/', function(req, res){
    res.render('index');
});

/* Add New Task */
app.get('/newtask', function(req, res){
    res.render('newtask');
});

/* Add Task Info */
app.post('/addTaskInfo', function(req, res){
    let taskinfo = req.body;
    db.collection('taskinfo').insertOne({
        taskid: (Math.round(Math.random() * 1000).toString()),
        taskname: taskinfo.taskname,
        assignto: taskinfo.assignto,
        taskduedate: taskinfo.taskduedate,
        taskstatus: taskinfo.taskstatus,
        taskdesc: taskinfo.taskdesc
    })
    res.redirect('/listtasks')
});

/* List Tasks */
app.get('/listtasks', function(req, res){
    db.collection('taskinfo').find({}).toArray(function(err, db){
        res.render('listtasks', {tasks: db});
    })
});

/* Update Task */
app.get('/updatetask', function(req, res){
    res.render('updatetask')
})

/* Update Task Info */
app.post('/updatetaskinfo', function(req, res){
    let taskinfo = req.body;
    let filter = { taskid: taskinfo.taskid };
    let update = { $set : { taskstatus : taskinfo.taskstatus }};
    db.collection('taskinfo').updateOne(filter, update);
    res.redirect('/listtasks');
})


/* Delete Task */
app.get('/deletetask', function(req, res){
    res.render('deletetask');
})

app.post('/deletetaskinfo', function(req, res){
    let taskinfo = req.body;
    db.collection('taskinfo').deleteOne({ taskid: taskinfo.taskid });
    res.redirect('/listtasks');
})

/* Delete All Tasks */
app.post('/deletealltasks', function(req, res){
    db.collection('taskinfo').remove({'taskstatus' : 'Completed'})
    res.redirect('/listtasks');
})

app.listen(8080);