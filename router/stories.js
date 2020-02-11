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

router.get('/list',(req,res)=>{
  //display results
  Story.find({status:'Public'})
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

router.get('/show/:id',(req,res)=>{
  Story.findOne({
    _id:req.params.id
  })
  .populate('user')
  .populate('comments.commentUser')
  .then(story =>{
    res.render('stories/show',{
      story:story
    });
  });
});

//list stories for specific user
router.get('/user/:userId',ensureAuthenticated, (req,res)=>{
  //display results
  Story.find({user: req.params.userId, status:'Public'})
  .sort({date:'asc'})
  .populate('user') //to bring values from users collection
  .then(stories =>{
    res.render('stories/list',{
      stories:stories
    });
    // console.log(stories);

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

//Post comment
router.post('/comment/:id',(req,res)=>{
  Story.findOne({
    _id:req.params.id
  })
  .then(story =>{
    const newComment={
      commentBody:req.body.commentBody,
      commentUser:req.user.id
    }
    //Add to Comment Array
    story.comments.unshift(newComment);
    story.save()
    .then(story=>{
      console.log(newComment);
      res.redirect(`/stories/show/${story.id}`);
    })
  });
}) 


module.exports=router;