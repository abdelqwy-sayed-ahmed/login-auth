const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
require('../models/Story');
require('../models/User');
// const ClassicEditor = require( '@ckeditor/ckeditor5-build-classic' );
const Story=mongoose.model('stories');
const User=mongoose.model('users');

const {ensureAuthenticated}=require('../helpers/auth');

// require('../models/Story;
router.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('stories/add')
});



//Add Story Process Form
router.post('/',(req,res)=>{
  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  }else{
    allowComments = false;
  }
  const newStory={
    title:req.body.title,
    status:req.body.status,
    allowComments:allowComments,
    content:req.body.content,
    user:req.user.id
  }
  new Story(newStory)
    .save()
    .then(story => {
      res.redirect(`/stories/show/${story.id}`);
    });

});

router.get('/list',ensureAuthenticated,(req,res)=>{
  //display results
  Story.find({})
  .sort({date:'asc'})
  .populate('user') //to bring values from users collection
  .then(stories =>{
    res.render('stories/list',{
      stories:stories
    });
    // console.log(stories);

  });

});

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
  Story.findOne({
    _id:req.params.id
  })
  .then(story =>{
    res.render('stories/edit',{
      story:story
    });
    
  });
});

router.get('/show/:id',ensureAuthenticated,(req,res)=>{
  Story.findOne({
    _id:req.params.id
  })
  .populate('user')
  .then(story =>{
    res.render('stories/show',{
      story:story
    });
  });
});

//Edit Form process
router.put('/:id',ensureAuthenticated,(req,res)=>{
  Story.findOne({
    _id:req.params.id
  })
  .then(story =>{
    let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  }else{
    allowComments = false;
  }
  story.title=req.body.title;
  story.status=req.body.status;
  story.allowComments=allowComments;
  story.content=req.body.content;

  story.save()
  .then(story =>{
    res.redirect('/users/dashboard')
  })
    });
  });


//Delete Story
router.delete('/:id',ensureAuthenticated,(req,res)=>{
  // res.send('Done')
  Story.deleteOne({_id:req.params.id})
  .then( ()=>{
    res.redirect('/users/dashboard');
  });
});


module.exports=router;