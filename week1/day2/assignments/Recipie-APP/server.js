const express=require("express")

const fs=require("fs");
const path=require("path");

const app=express();

const DB_PATH = path.join(__dirname, 'db.json');
app.use(express.json());


function writedb(data){
    fs.writeFileSync(DB_PATH,JSON.stringify(data, null, 2))
}
function readDB() {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Add a new dish.

app.post("/dishes",(req,res)=>{
    let newData={id: Date.now().toString(),...req.body}

    const db=readDB();
    db.dishes.push(newData);
    writedb(db);
    res.status(201).json(newData);
})

//Retrieve all dishes.
//retrieving our data ,so our data is in ReadDB file so we are accesing it
app.get("/dishes",(req,res)=>{
    const db=readDB();
    res.send(db.dishes)
})

// GET /dishes/get?name=<dish_name> → Search for dishes by name
app.get("/dishes/get", (req, res) => {
  const db = readDB();
  const searchName = req.query.dish;
  console.log(searchName,"searchhhh")

  if (!searchName) {
    return res.status(400).json({ error: "Dish name is required in query string." });
  }

  const matches = [];

  for (let i = 0; i < db.dishes.length; i++) {
    if (
      db.dishes[i].dish &&
      db.dishes[i].dish.toLowerCase().includes(searchName.toLowerCase())
    ) {
      matches.push(db.dishes[i]);
    }
  }

  if (matches.length === 0) {
    return res.status(404).json({ message: "No dishes found" });
  }

  res.json(matches);
});

// Retrieve a dish by its ID.
app.get("/dishes/:id",(req,res)=>{
    const db=readDB();
    const dishId=req.params.id;
    let filteredData=db.dishes.find(item=>item.id===dishId)
    console.log(dishId,filteredData,"lala")
    res.send(filteredData)
})

app.put("/dishes/:id",(req,res)=>{
    const db=readDB();
    const dishId=req.params.id;
    const newData = req.body;

   let dishFound = false;

  for (let i = 0; i < db.dishes.length; i++) {
    if (db.dishes[i].id === dishId) {
      db.dishes[i] = {
        ...db.dishes[i],
        ...req.body,
        id: dishId
      };

      dishFound = true;
      break;
    }
  }

  if (!dishFound) {
    return res.status(404).json({ error: "Dish not found" });
  }

  writedb(db);
  res.json({ message: "Dish updated successfully", id: dishId });


})



app.delete("/dishes/:id",(req,res)=>{
    const db=readDB();
    const dishId=req.params.id;

    let dishFound=false;
    for (let i = 0; i < db.dishes.length; i++) {
    if (db.dishes[i].id === dishId) {
      // Remove the dish from array
      db.dishes.splice(i, 1);
      dishFound = true;
      break;
    }
  }

  if (!dishFound) {
    return res.status(404).json({ error: "Dish not found" });
  }
   writedb(db);
  res.json({ message: `Dish with ID ${dishId} deleted successfully.` });
});



app.use((req,res)=>{
    res.status(404).send("404 Not found error")
})

app.listen(3000,()=>{
    console.log("Server on the port 3000");
})
