const express=require('express');
const app=express();
const ejs=require('ejs');
const path=require('path');
const MongoClient=require('mongodb').MongoClient;
const DB_URI="mongodb://localhost:27017/todoapp";
const bodyParser=require('body-parser');
const router=express.Router();
const  ObjectId=require('mongodb').ObjectId;

MongoClient.connect(DB_URI,(err,db)=>{
  if(err)
  {
    console.log("Error connecting to database");
    return;
  }
  todos=db.collection('todos');
  console.log('Connected to:'+DB_URI);

});

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));


app.post('/todo/add',(req,res,next) =>{
  todos.insert({title:req.body.title,description:req.body.description.trim()},(err,document)=>{
    if(err)
    {
      console.log(err);
    }
    res.redirect('/');
  })

})

app.get('/',function(req,res){
  todos.find({}).toArray(function(err,docs)
{
  if(err)
  {
    console.log(err);
  }
  res.render('index',{docs:docs});
});
});



app.get('/todo/:id',function(req,res)
{
  console.log(req.params.id);
  todos.findOne({_id:ObjectId(req.params.id)},function(err,doc){

    if(err)
    {
      console.log("Error");
    }
    res.render('show',{doc:doc});
  });
});


app.get('/todo/edit/:id',function(req,res)
{
  console.log(req.params.id);
  todos.findOne({_id:ObjectId(req.params.id)},function(err,doc){

    if(err)
    {
      console.log("Error");
    }
    res.render('edit',{doc:doc});
  });
});

app.post('/todo/update/:id',(req,res,next) =>{
  todos.update({_id:ObjectId(req.params.id)},{$set:{title:req.body.title,description:req.body.description}},(err,document)=>{
    if(err)
    {
      console.log(err);
    }
    res.redirect('/');
  })
})

app.get('/todo/delete/:id',(req,res,next) =>{
  todos.remove({_id:ObjectId(req.params.id)},(err,document)=>{
    if(err)
    {
      console.log(err);
    }
    res.redirect('/');
  })
})

app.listen(3000,"localhost",(err)=>
{
  if(err){
    console.log(err);
  }else {
  console.log("This server is listening");
  }
})
