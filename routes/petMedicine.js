const express = require('express');
const Pet = require('../models/pet');
const PetMedicine = require('../models/petMedicine');

const { isLoggedIn, isNotLoggedIn } = require('./checklogin');

const router = express.Router();



//회원가입
router.route('/:petId')
    .get(isLoggedIn, async(req, res, next) => {
        
        //날짜를 yyyy-mm-dd로 format
        var date = new Date(); 
        var year = date.getFullYear();
        var month = ("0" + (1 + date.getMonth())).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        var min = year + "-" + month + "-" + day;

        
        try {
            const pet = await Pet.findOne({where: {id: req.params.petId}});
            res.locals.min = min
            res.locals.isAuthenticated = isLoggedIn;
            res.locals.petId = pet.id;
            res.render('petMedicine');
        } catch (err) {
            console.log(err);
            next(err);
        }
    })
    .post( async(req, res, next) => {
        try{
            const pet = await Pet.findOne({where: {id: req.params.petId}}); //petId 조회 용도
            const petId = pet.id;
            const medicineData = await PetMedicine.findOne({ where: { petId: petId, medicineName: req.body.medicineName, medicineDate: req.body.setDate }});

            if(medicineData){
                next('이미 등록된 기록입니다.');
                return;
            }

            await PetMedicine.create({
                medicineName: req.body.medicineName,
                medicineDate: req.body.setDate,
                petId: pet.id,
            });

            res.redirect('/pethealth');
        }catch(err){
            console.log(err);
            next(err); 
        }
    });

module.exports = router;