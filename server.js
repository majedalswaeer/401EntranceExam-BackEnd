const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const server = express();
require('dotenv').config();
server.use(cors());
server.use(express.json());
const PORT = 3001;
const mongolink=process.env.MONGO_LINK;
mongoose.connect(mongolink, { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = new mongoose.Schema({
    id:Number,
    title: String,
    imageUrl: String,
    email:String,
});

const ItemsModel = mongoose.model('examItems', itemsSchema);



//___________________________________________________________________________________________SERVERS

server.post('/postFunc/:itemID/:email',postFuncHandler);
server.get('/getFav/:email',getFuncHandler);
server.delete('/deleteFunc/:itemID/:email',deleteFuncHandler);
server.put('/updateFunc/:email/:itemID',updateFuncHandler);

server.listen(PORT, () => { console.log(`Lisitiing to ${PORT}`) })
server.get('/test', (req, res) => { res.send('Test Recieved') })




//___________________________________________________________________________________________FUNCTIONS


async function postFuncHandler(req,res){

    await ItemsModel.create(req.body)
    let owner=req.params.email
    let id=req.params.itemID

    ItemsModel.find({email:owner},function(err,itemsData){
        if (err){
            res.send('error posting the data')
        } else {
            res.send(itemsData)
        }
    })


}

async function getFuncHandler(req,res){

    console.log(req.params)

    let emailPar=req.params.email

    ItemsModel.find({email:emailPar},function(err,favData){
        if(err){
            res.send('error loading ur fav data')
        } else {
            res.send(favData)
        }
    })

}

async function deleteFuncHandler(req,res){
    console.log('dde',req.params)
    let itemID=req.params.itemID
    let owner=req.params.email

    await ItemsModel.remove({_id:itemID},function(err,deleteData){
        if(err){
            res.send('error deleting the data')
        } else {
            ItemsModel.find({email:owner},function(err,favDataafterDelete){
                if(err){
                    res.send('error loading ur fav data')
                } else {
                    res.send(favDataafterDelete)
                }
            })

        }
    })

}

async function updateFuncHandler(req,res){

    
    let owner =req.params.email
    let itemID=req.params.itemID
    console.log('paramssssssssssss',req.params)


    let {title,imageUrl}=req.body

    await ItemsModel.find({_id:itemID},async function(err,favDataafterupdate){
        console.log('old dataaa',favDataafterupdate)
        favDataafterupdate[0].title=title;
        favDataafterupdate[0].imageUrl=imageUrl;
        await favDataafterupdate[0].save();
        console.log('ewewew',favDataafterupdate[0])
    })
    ItemsModel.find({email:owner},async function(err,favData){
        if(err){
            res.send('error loading ur fav data')
        } else {
            await res.send(favData)
        }
    })



}