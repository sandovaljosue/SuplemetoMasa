const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
//conexion a base de datos

app.use(cors())
const pool = mysql.createPool({


  
        host:'us-east.connect.psdb.cloud',
        user:'0l12mtq2dau1metigqfg',
        password:'pscale_pw_P2RWmjZWw8BEIN8J5bOvS1YjiAMtp9miXPGK6VYWyx7',
        database:'postresleandra',
	ssl:{
rejectUnauthorized:false
}




    
});

const pool1 = mysql.createPool({


  
  database: "pruebas",
  user: "g6pe4llkcu6i0b60q1or",
  host: "us-east.connect.psdb.cloud",
  password: "pscale_pw_2Kmn24HiJ4NLgISmEsRqoQVCEMmeQAA9Cz0RnZCQTnP",
ssl:{
rejectUnauthorized:false
}




});
let transporter = nodemailer.createTransport({
  service: 'gmail',
  tls: {
    rejectUnauthorized: false
},
  auth: {
      user: 'publicidad631@gmail.com', // replace with your Gmail address
      pass: 'efnkzeshehkpjdev' // replace with your Gmail password
  }
});




function query(sql, args) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      connection.query(sql, args, (err, rows) => {
        connection.release();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  });
}


function query1(sql, args) {
  return new Promise((resolve, reject) => {
    pool1.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      connection.query(sql, args, (err, rows) => {
        connection.release();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  });
}
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/img')));
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const direccionIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`La dirección IP del cliente es: ${direccionIP}`);
  
  try {
 const d={
      ip:direccionIP
      
    }
  
    let mailOptions = {
      from: 'publicidad631@gmail.com', // replace with your Gmail address
      to: 'publicidad631@gmail.com', // replace with recipient email address
      subject:"Nueva conexión"+direccionIP ,
      text:"Conexión nueva IP:"+ direccionIP
    };
    
    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
    });
    await query('INSERT INTO conexiones set ?',d)
   console.log('La dirección IP fue registrada: ' + direccionIP);
    
  } catch (error) {
    console.log('Error obtener Ip');
  }
    let alert=false
  res.render("index",{alert})
});
//requests
 app.post('/envio',async (req, res) => {
    
    console.log(req.body)
    const {nombre,numero,correo}=req.body
    const datos={
      nombre:nombre,
      numero:numero,
      correo:correo
    }

    try {
      
      
        // release the connection back to the pool
        
       const rsl=await query('INSERT INTO registros_cont set ?',datos)
          
          console.log(rsl);
          let mailOptions = {
            from: 'publicidad631@gmail.com', // replace with your Gmail address
            to: 'publicidad631@gmail.com', // replace with recipient email address
            subject:nombre ,
            text: nombre+","+numero+","+correo
          };
          
          // Send the email
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
          });
          
          
        
        


        
        
      
     } catch (error) {
        console.error(error);
        let alert=false;
        res.render("index",{alert})
      }
      let alert=true
      res.render("index",{alert})
  });


  app.post('/registrardatos',async (req, res) => {
const {nombre,apellidos,telefono,correo}=req.body;
console.log(req.body)
const datos={
  nombre:nombre,
  apellidos:apellidos,
  telefono:telefono,
  correo:correo

}

try {
  await query1('INSERT INTO registros set ?',datos)
  res.json({h:2})
} catch (error) {
  console.log(error)
  res.json({h:req.body})
}

  })

  
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});