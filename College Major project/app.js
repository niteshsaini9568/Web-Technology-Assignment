const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require ("path");
const methodOverride = require("method-override");
var ejsMate = require('ejs-mate');


app.set("view engine" , "EJS");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


app.get("/", (req, res) => {
  res.render("./listing/home.ejs");
});

app.get("/listing",async(req,res)=>{
  const allListing = await Listing.find({});
  res.render("./listing/index.ejs",{allListing});
});

app.get("/listing/new",(req,res)=>{
  res.render("./listing/create.ejs");
});

app.post("/listing", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listing");
});


app.get("/listing/:id",async (req,res)=>{
  const id=req.params;
  const listing = await Listing.findById(id.id);
  res.render("./listing/show.ejs",{listing});
});

// UPDATE ROUTE
app.get("/listing/:id/edit" , async (req,res)=>{
  const id=req.params;
  const listing = await Listing.findById(id.id);
  res.render("./listing/update.ejs",{listing});
  
});

// UPDATE ROUTE
app.put("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
});

// DELETE ROUTE
app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listing");
});



// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});