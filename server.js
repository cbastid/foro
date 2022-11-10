const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParse = require('body-parser')

app.use(bodyParse.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/static'))

app.set('views', __dirname + '/views')

app.set('view engine', 'ejs')


//****** DEFINE BASE DE DATOS ************/
mongoose.connect('mongodb://localhost/foroDB', {useNewUrlParser: true})

const ComentarioSchema = new mongoose.Schema({
    nombre: {type: String, require: [true, 'Nombre requerido'],},
    comentario: {type: String, require: [true, 'Comentario requerido']},

})

const PosteoSchema = new mongoose.Schema({
    nombre: {type: String, require: [true, 'Nombre requerido'],},
    comentario: {type: String, require: [true, 'Comentario requerido']},
    postcomentario: [ComentarioSchema]
})

const Foropost = mongoose.model('foropost', PosteoSchema)

//************** INGRESA  MENSAJES ****************** */

app.post('/register', function(req, res) {
    console.log(req.body)
    const { nombre, comentario} = req.body
    const foropost = new Foropost()
    foropost.nombre = nombre
    foropost.comentario = comentario
    foropost.save()
    .then(
        () => res.redirect("/register")
    )
    
    .catch (
        (error) =>{ console.log(error)
        },    
    )
})

app.post('/msgcoment/:id', function(req, res) {
    console.log(req.body)
    
    Foropost.findOneAndUpdate
        ({_id: req.params.id}, {$push: {postcomentario: req.body}})
        
    .then(
        () => res.redirect("/register")
    )
    
    .catch (
        (error) =>{ console.log(error)
        },    
    )
})


//********** CARGA EL FORO ****************************** */
app.get('/register', (req, res) => {
    
    Foropost.find({})
    
    .then(foropost => {
        res.render("register",{haymensaje: foropost, mensaje: " "})
        // lógica con otros resultados
    })
    .catch(err => res.json(err));
            
})

//*********** llama index ************* */

app.get('/index', (req, res) => {

    res.render('index')
})


//*********** ************* */

app.get('/register', (req, res) => {

    res.render('register', {mensaje: " "})
})

//****** LOCALHOST ****** */

app.listen(8000, function() {
    console.log ("listening in port 8000");
})
