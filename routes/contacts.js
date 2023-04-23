
var express = require('express');
var router = express.Router();

const { body } = require('express-validator');
const contactsController = require('../controller/contactsController')


/* GET home page. */
router.get('/', contactsController.contacts_list);

/* GET  add Contact page  */
router.get('/add', contactsController.contacts_add_get);

/* POST create Contact. */
router.post('/add',  
body('firstName').trim().notEmpty().withMessage('First name can not be empty!'), 
body('lastName').trim().notEmpty().withMessage('Last name can not be empty!'), 
body('email').isEmail().withMessage('Email must be a valid email address!'), 
contactsController.contacts_add_post);

/* GET single contact. */
router.get('/:uuid', contactsController.contacts_single);

/* GET edit page  */
router.get('/:uuid/edit', contactsController.contacts_edit_get);

/* POST edit Contact */
router.post('/:uuid/edit', 
body('firstName').trim().notEmpty().withMessage('First name can not be empty!'), 
body('lastName').trim().notEmpty().withMessage('Last name can not be empty!'), 
body('email').isEmail().withMessage('Email must be a valid email address!'), 
contactsController.contacts_edit_post);

/* Get delete contact page */
router.get('/:uuid/delete', contactsController.contacts_delete_get);

/* POST delete Contact */
router.post('/:uuid/delete', contactsController.contacts_delete_post);

module.exports = router;
