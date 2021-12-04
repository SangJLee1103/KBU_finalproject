const express = require('express');

const User = require('../models/user');
const Pet = require('../models/pet');
const PetMedicine = require('../models/petMedicine');

const { isLoggedIn, isNotLoggedIn } = require('./checklogin');
const { describe } = require('../models/pet');

const router = express.Router();


router.route('/')
    .get(isLoggedIn, async (req, res, next) => {
        const user = req.user.id;
        console.log(user);
        try {
            const pet = await Pet.findAll({
                where: {userId: user},
                attributes: ['userId', 'petName'],
                include: [ 
                    {
                        model: PetMedicine ,
                        attributes: ['medicineName', 'medicineDate']
                    }
                ]
            });
            console.log(JSON.stringify(pet));
            res.locals.isAuthenticated = isLoggedIn;
            res.locals.pet = pet
            res.render('petHealthInfo');
        } catch (err) {
            console.log(err);
            next(err);
        }
    })


module.exports = router;