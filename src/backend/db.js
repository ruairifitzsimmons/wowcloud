//22&Ht%Lx4BDv
//22%26Ht%25Lx4BDv

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ruairi:22%26Ht%25Lx4BDv@atlascluster.nqapa88.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('MongoDB Connected.')
})
.catch(() => {
    console.log('MongoDB Failed.')
})

const newSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
const collection = mongoose.model('collection', newSchema)
module.exports = collection