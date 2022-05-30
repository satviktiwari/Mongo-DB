const express = require('express');
const { ObjectId } = require('mongodb');
const {connectToDb, getDb } = require('./db')

const app = express();
app.use(express.json())

let db;
connectToDb(() => {
    if(!null){
        app.listen(3000, () => {
            console.log('app running on port 3000')
        })
        db = getDb()
    }
})

app.get('/students', (req, res) => {
    const page = req.query.p || 0;
    const studPerPage = 3;

    let students = [];
    db.collection('student')
    .find()
    .sort({Name : 1})
    .skip(page*studPerPage)
    .limit(studPerPage)
    .forEach(student => students.push(student))
    .then(() => {
        res.status(200).json(students)
    })
    .catch(() => {
        res.status(500).json({error: 'could not fetch the documents'})
    })
})

app.get('/students/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('student')
        .findOne({_id : ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(() => {
            res.status(500).json({error: 'could not fetch the documents'})
        })
    }
    else{
        res.status(500).json({error: 'invalid id'})
    }
})

app.post('/students', (req, res) => {
    const student = req.body
    db.collection('student')
    .insertOne(student)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({error: 'could not insert the element'})
    })
})

app.delete('/students/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('student')
        .deleteOne({_id : ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'could not delete the documents'})
        })
    }
    else{
        res.status(500).json({error: 'invalid id'})
    }
})

app.patch('/students/:id', (req, res) => {
    const updates = req.body;
    if(ObjectId.isValid(req.params.id)){
        db.collection('student')
        .updateOne({_id : ObjectId(req.params.id)}, {$set: {updates}})
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'could not update the documents'})
        })
    }
    else{
        res.status(500).json({error: 'invalid id'})
    }
})