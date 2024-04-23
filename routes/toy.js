var express = require('express');
var router = express.Router();
var ToyModel = require('../models/ToyModel');
var ManufacturerModel = require('../models/ManufacturerModel');
var CountryModel =require('../models/CountryModel');
//URL: localhost:3001/toy
router.get('/', async (req, res) => {
   var toys = await ToyModel.find({}).populate('manufacturer').populate('country');
   //Path: views/toy/index.hbs
   var countrys =await ToyModel.find({}).populate('country');
   res.render('toy/index', { toys });
})

router.get('/customer', async (req, res) => {
   var toys = await ToyModel.find({}).populate('manufacturer');
   //Path: views/toy/index.hbs
   res.render('toy/list', { toys });
})
router.get('/customer', async (req, res) => {
   var toys = await ToyModel.find({}).populate('manufacturer');
   //Path: views/toy/index.hbs
   res.render('/', { toys });
   res.redirect('/');
})

router.get('/add', async (req, res) => {
   var manufacturers = await ManufacturerModel.find({});
   var countrys = await CountryModel.find({});
   res.render('toy/add', { manufacturers, countrys } );
})

router.post('/add', async (req, res) => {
   var toy = req.body;
   await ToyModel.create(toy);
   res.redirect('/toy');
})


router.get('/delete/:id', async (req, res) => {
   await ToyModel.findByIdAndDelete(req.params.id);
   res.redirect('/toy');
})

router.get('/edit/:id', async (req, res) => {
   var id = req.params.id;
   var toy = await ToyModel.findById(id);
   var manufacturers = await ManufacturerModel.find({});
   res.render('toy/edit', { toy, manufacturers });
})

router.post('/edit/:id', async (req, res) => {
   var id = req.params.id;
   var toy = req.body;
   try {
      await ToyModel.findByIdAndUpdate(id, toy);
      console.log('update succeed !');
   } catch (err) {
      console.log('update failed. Error: ' + err);
   }
   res.redirect('/toy');
})

router.get('/sort/asc', async (req, res) => {
   //SQL: SELECT * FROM Toys ORDER BY model
   var toys = await ToyModel.find().populate('manufacturer').sort({ model: 1 });
   res.render('toy/index', { toys })
})

router.get('/sort/desc', async (req, res) => {
   //SQL: SELECT * FROM Toys ORDER BY model DESC
   var Toys = await ToyModel.find().populate('manufacturer').sort({ model: -1 });
   res.render('toy/index', { Toys })
})

router.post('/search', async (req, res) => {
   var keyword = req.body.keyword;
   //SQL: SELECT * FROM Toys WHERE model LIKE '%keyword%'
   var Toys = await ToyModel.find({ model: new RegExp(keyword, "i") }).populate('manufacturer');
   res.render('toy/index', { Toys })
})

module.exports = router;