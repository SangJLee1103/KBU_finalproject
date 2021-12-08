const express = require('express'); //express 모듈을 불러옴

const Pet = require('../models/pet'); // models 폴더에 comment.js 파일을 불러옴

const { isLoggedIn } = require('./checklogin'); // helper.js에서 isLoggendIn 불러옴
const router = express.Router();


router.route('/enrollment')
    .get( isLoggedIn, (req, res, next) => {
        try{
            res.locals.isAuthenticated = isLoggedIn; //로그인이 되었는지 안됬는지(nav.html 로그인 유지 때매 사용)
            // res.locals.user = req.user;
            res.render('petenrollment');
        }catch(err){
            console.log(err);
            next(err);
        }
    })
    .post( async(req, res, next) => {
        const userId = req.user.id;
        //userId, petName, petKind 같은 것을 찾기 위한 변수
        const pet = await Pet.findOne({where: { userId: userId, petName: req.body.petName, petKind: req.body.petKind } }); 
        try{
            if(pet){
                next('이미 등록된 반려동물입니다.');
                return;
            }
            
            await Pet.create({
                    petKind: req.body.petKind,
                    petName: req.body.petName,
                    petAge: req.body.petAge,
                    petWeight: req.body.petWeight,
                    userId: userId,
            });

            res.redirect('/enrollment');

        }catch (err) {// 에러처리
            console.error(err);
            next(err);
        }
    });

router.route('/petinfo/:id')
    .get(isLoggedIn, async (req, res, next) => {
        console.log(req.params);
        const pet = await Pet.findOne({ where: {id: req.params.id}}); //수정하기 위한 반려동물 조회
        try{
            res.locals.pet = pet;
            res.locals.isAuthenticated = isLoggedIn;
            res.render('petInfo');
        }catch (err) {// 에러처리
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        console.log(req.body);
        try {
            const result = await Pet.update({
                petName: req.body.petName,
                petKind: req.body.petKind,
                petAge: req.body.petAge,
                petWeight: req.body.petWeight,
            }, {
                where: { id: req.params.id}
            });
            if (result) {
                console.log("수정완료");
                res.redirect('/pethealth');
            }
            else next('Not updated!')
        } catch (err) {
            console.error(err);
            next(err);
        }
    })

module.exports = router;
