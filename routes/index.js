const express = require('express');
const router = express.Router();
var request = require('request');
const fs = require('fs');
let Cart = require('../models/cart');
let products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

let valute = null;

request.get({
  url: "https://www.cbr-xml-daily.ru/daily_json.js",
  json: true,
  headers: {'User-Agent': 'request'}
}, (err, res, data) => {
  if (err) {
    console.log('Error:', err);
  } else if (res.statusCode !== 200) {
    console.log('Status:', res.statusCode);
  } else {
    // data is already parsed as JSON:
    valute = data.Valute;
    valute["RUB"] = {
      "Value": 1
    }
  }
});


router.get('/', function (req, res, next) {
  let productId = products && products[0].id;

  res.render('index', 
  { 
    title: 'NodeJS Shopping Cart',
    products: products
  }
  );
});

router.get('/add/:id/:currency/:count', function(req, res, next) {
  let currency = req.params.currency;
  let productId = req.params.id;
  let count = req.params.count;
  console.log(productId);
  let cart = new Cart(req.session.cart ? req.session.cart : {valute: valute});
  let product = products.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId, currency, count);
  req.session.cart = cart;
  res.redirect('/');
  //inline();
});

router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  let cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'NodeJS Shopping Cart',
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

router.get('/remove/:id', function(req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

module.exports = router;
