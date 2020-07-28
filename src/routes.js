const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const UserController = require('./controllers/UserController');
const HashtagController = require('./controllers/HashtagController');
const GroupController = require('./controllers/GroupController');
const MessageController = require('./controllers/MessageController');

const routes = express.Router();
const upload = multer(uploadConfig);

const authMiddleware = require('./middlewares/auth');

//hashtag
routes.post('/hashtag', HashtagController.create);
routes.get('/hashtag/:hashtagId', HashtagController.indexbyId);
routes.get('/hashtag', HashtagController.index);
routes.delete('/hashtag/:hashtagId', HashtagController.delete);

//user
routes.post('/users', upload.single('picture'), UserController.create);
routes.put('/users', authMiddleware ,upload.single('picture'), UserController.update);
routes.get('/users', UserController.index);
routes.get('/users/id', UserController.indexID);
routes.delete('/users', authMiddleware , UserController.delete);
routes.post('/users/authenticate', UserController.authenticate);
routes.post('/users/forgot_password', UserController.forgot_password);
routes.post('/users/reset_password', UserController.reset_password);
routes.post('/users/update_accountStatus', UserController.update_statusAccount);

//Group
routes.post('/group', authMiddleware, upload.single('picture'), GroupController.create);
routes.get('/group', GroupController.index);
routes.get('/group/find/:groupId', GroupController.indexByGroupId);
routes.get('/group/hash', GroupController.indexByHashtagId);
routes.put('/group/update/:groupId', authMiddleware, upload.single('picture'), GroupController.update);
routes.delete('/group/delete/:groupId', GroupController.delete);

//Message
routes.post('/message', authMiddleware, MessageController.information);

module.exports = routes;