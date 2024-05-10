const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB");

// Define your schema and model
const itemsSchema = { name: String };
const Item = mongoose.model("Item", itemsSchema);

// Create new items
const item1 = new Item({ name: "Welcome to your todolist!" });
const item2 = new Item({ name: "Hit the + button to add a new item." });
const item3 = new Item({ /* ... */ });

app.get("/", async function(req, res) {
    try {
        const foundItems = await Item.find({});
        if (foundItems.length === 0){
            Item.insertMany([item1, item2, item3])
        .then(() => console.log('Data inserted'))
        .catch((error) => console.log(error));
        res.redirect("/");
       } else{
           res.render("list", {listTitle: "Today", newListItems: foundItems});
       }
        
    } catch (err) {
        console.log(err);
    }
});

app.post("/", async function(req,res){
    const itemName = req.body.newItem;
    const item = new Item({ name: itemName });

    if(req.body.list === "Work"){
       await item.save();
       res.redirect("/work");
    } else {
        await item.save();
        res.redirect("/");
    }
});

app.get("/work", async function(req,res){
    const workItems = await Item.find({});
    res.render("list",{listTitle: "Work List", newListItems: workItems});
});

app.get("/about",function(req,res){
    res.render("about");
})

app.listen(3000,function(){
    console.log("Server started on port 3000");
});