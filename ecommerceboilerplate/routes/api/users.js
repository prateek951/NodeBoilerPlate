const router = require('express').Router();
const User = require('../../db').User;
router.get('/',(req, res) => {
    //we want to send an array of all users from our database
    User.findAll()
        .then(users => res.status(200).send(users))
            .catch(err => res.status(500).send({error : `Could not retrieve the users`}));
    });

router.post('/',(req, res) => {
    //Create a new user
    User.create({
        name : req.body.name
    }).then(user => res.status(201).send(user))
    .catch(err => res.status(500).send({message : 'Could not add the newly created user'}));
});   