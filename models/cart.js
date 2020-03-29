module.exports = function Cart(cart) {
    
    this.items = cart.items || {
        "USD": {},
        "EUR": {},
        "RUB": {}
    };
    this.valute = cart.valute || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || {
        "USD": 0,
        "EUR": 0,
        "RUB": 0
    };

    this.add = function(item, id, currency, count) {
        count = parseInt(count);
        let items = this.items[currency];
        let cartItem = items[id];
        if (!cartItem) {
            cartItem = items[id] = {item: item, quantity: 0, currency: currency, packPrice: 0};
        }
        cartItem.quantity += count;
        //cartItem.price = cartItem.item.price * cartItem.quantity;
        this.totalItems = this.getTotalItems(this.items);
        this.totalPrice = this.getTotalPrice(this.items);
        cartItem.packPrice = this.getPackPrice(cartItem);
    };

    this.getPackPrice = function(item){
        if(!item.item){
            return 0;
        }
        let ret_val = item.item.price * item.quantity / this.valute[item.currency]["Value"];
        
        return ret_val.toLocaleString('en-US', {
            style: 'currency',
            currency: item.currency,
          });
        
    }

    this.getTotalPrice = function(items){
        let totalPrice = {
            "USD": 0,
            "EUR": 0,
            "RUB": 0
        };
        for (let currency of Object.keys(items)) {
            for (let id of Object.keys(items[currency])){
                    totalPrice["RUB"] += items[currency][id].quantity * items[currency][id].item.price;
            }
        }
        Object.keys(totalPrice).filter((key)=>{return key !== "RUB"}).map((key)=>{
            totalPrice[key] = totalPrice["RUB"] / this.valute[key]["Value"];
        });
        Object.keys(totalPrice).map((key)=>{
            totalPrice[key] = totalPrice[key].toLocaleString('en-US', {
                style: 'currency',
                currency: key,
              });
        });
        return totalPrice;
    }

    this.getTotalItems = function(items){
        let count = 0
        for (let currency of Object.keys(items)) {
            for (let id of Object.keys(items[currency])){
                count += items[currency][id].quantity;
            }
        }
        return count;
    }

    this.remove = function(id, currency, count) {
        let items = this.items[currency];
        if (items[id]){
            if(items[quantity] > count){
                items -= count;
            } else {
                delete items[id];
            }
        }
    };
    
    this.getItems = function() {
        let arr = [];
        for (let currency of Object.keys(this.items)) {
            for (let id of Object.keys(this.items[currency])){
                arr.push(this.items[currency][id]);
            }
        }
        return arr;
    };
};