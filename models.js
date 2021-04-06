const mongoose = require('mongoose');

//Defining the Schema
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: String,
        Death: String,
        Movies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean 
});

const bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) { //used in callback in passport.js?
    return bcrypt.compareSync(password, this.Password);
};

//Creation of the Models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//Exporting the Models
module.exports.Movie = Movie;
module.exports.User = User;