const express=require('express');
const router=express.Router();

const userController=require('../controllers/user.controller')
router.get('/profile/:id',userController.profile);
router.post('/update/:id',userController.update);

router.post('/create',userController.createUser);
router.get('/createSession',userController.createSession);


module.exports=router;