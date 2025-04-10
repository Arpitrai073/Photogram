import express from 'express';  
import{register,login,logout, getPofile, getSuggestUsers, followOrUnfollow, editProfile} from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated,getPofile)
router.route('/profile/edit').post(isAuthenticated,upload.single('profilePhoto'),editProfile);
router.route('/suggested').get(isAuthenticated,getSuggestUsers);
router.route('/followorunfollow/:id').post(isAuthenticated,followOrUnfollow);


export default router;




