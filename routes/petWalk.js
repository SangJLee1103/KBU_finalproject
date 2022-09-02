const express = require('express');

const Pet = require('../models/pet');
const PetWalk = require('../models/petWalk');
const { isLoggedIn, isNotLoggedIn } = require('./checklogin');

const router = express.Router();

//pet 산책 등록 
router.route('/:petId')
    .get(isLoggedIn, async (req, res, next) => {
        //날짜를 yyyy-mm-dd로 format
        var date = new Date(); 
        var year = date.getFullYear();
        var month = ("0" + (1 + date.getMonth())).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        var max = year + "-" + month + "-" + day;

        try {
            const pet = await Pet.findOne({where: {id: req.params.petId}});
            res.locals.max = max;
            res.locals.isAuthenticated = isLoggedIn;
            res.locals.petId = pet.id;
            res.render('petWalk');
        } catch (err) {
            console.log(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try{
            const pet = await Pet.findOne({where: {id: req.params.petId}}); //petId 조회 용도
            const petId = pet.id;
            console.log(petId);
            const walkData = await PetWalk.findOne({ where: { petId: petId, walkDate: req.body.setDate }})
            console.log(walkData);

            if(walkData){
                next('오늘 기록은 이미 등록되었습니다.');
                return;
            }

            await PetWalk.create({
                whetherToWalk: req.body.whetherToWalk,
                walkDate: req.body.setDate,
                petId: pet.id,
            });

            res.redirect('/pethealth');
        } catch (err) {
            console.log(err);
            next(err);
        }
    });


module.exports = router;