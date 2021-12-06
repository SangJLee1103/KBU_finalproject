const express = require('express');

const User = require('../models/user');
const Pet = require('../models/pet');
const PetMedicine = require('../models/petMedicine');
const PetWalk = require('../models/petWalk');

const { isLoggedIn, isNotLoggedIn } = require('./checklogin');
const { describe } = require('../models/pet');


const router = express.Router();


router.route('/')
    .get(isLoggedIn, async (req, res, next) => {
        const user = req.user.id;

        try {
            const pet = await Pet.findAll({
                where: {userId: user},                                      
                attributes: ['id', 'petName'],
                include: [ 
                    {
                        model: PetMedicine,
                        attributes: ['medicineName', 'medicineDate']
                    },
                    {
                        model: PetWalk,  
                        attributes: ['whetherToWalk', 'walkDate']
                    },
                ]
            });

            const data1 = JSON.stringify(pet);
            console.log(data1);
            res.locals.isAuthenticated = isLoggedIn;
            res.locals.pet = pet;
            res.render('petHealthInfo');
        } catch (err) {
            console.log(err);
            next(err);
        }
    })


module.exports = router;