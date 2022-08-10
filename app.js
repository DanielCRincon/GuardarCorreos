const express = require("express");
const bodyParser = require ("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
//esto sirve para llamar los archivos css e imagenes
// es un folder en donde estan el css y las image
app.use(bodyParser.urlencoded({extended: true }));
//este codigo es importante para capturar todo lo que el usuario escribe en pantalla


app.get("/", function(req, res) {
res.sendFile(__dirname + "/signup.html");
//estoy enviando el signup.html desde el servidor al navegador
});

app.post("/", function(req, res){

const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email;

const data = {
  members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }
  ]
};

const jsonData = JSON.stringify(data);
//paso toda mi data a un json

const url = "https://us18.api.mailchimp.com/3.0/lists/63134b8a9e";

const options = {
  method: "POST",
  auth: "DanielDevelopment:c94c0fd2fe074d72bb4b68b4c30afe09-us18"
}
const request = https.request(url, options, function(response){

  if (response.statusCode === 200){
    res.sendFile(__dirname + "/succes.html")
  } else {
    res.sendFile(__dirname + "/failure.html")
  }

  response.on("data", function(data){
    console.log(JSON.parse(data));
  })
})

request.write(jsonData);
request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/")
  //nos devulve al root, es decir al signup.html
})



app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
//process.env.PORT esto reemplaza el puerto 3000, porque ese puerto estan
//en local host pero cuando lo suba a heroku, heroku selecciona el puerto
//por lo tanto debe quedar automatico

//API Key
//c94c0fd2fe074d72bb4b68b4c30afe09-us18

//list
//63134b8a9e
