const express = require('express');
const app = express();

const serverIndex = require('serve-index');


app.use( express.static( __dirname + '/public' , { maxAge: 3600000 } ),
		 serverIndex( __dirname + '/public', { 'icons' : true, 'view' : 'details' } ) );
app.listen(3005,() => {
    console.log("service on!");
});
