const express = require('express');

const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('./checklogin');

const bcrypt = require('bcrypt');
const passport = require('passport');


const router = express.Router();

//회원가입
router.route('/join')
    .get((req, res, next) => {
        try {
            res.render('join');
        } catch (err) {
            console.log(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        const userData = req.body;
        console.log(userData);

        const user = await User.findOne({ where: { id: req.body.id } });
        if (user) {
            next('이미 등록된 사용자 아이디입니다.');
            return;
        }

        try {
            const hash = await bcrypt.hash(req.body.password, 12);
            await User.create({
                id: req.body.id,
                password: hash,
                name: req.body.name,
                address: req.body.address,
            });
            res.redirect('/');
        } catch (err) {
            console.log(err);
            next(err);
        }
    });


//로그인   
router.route('/login')
    .get( (req, res, next) => {
        try {
            res.render('login');
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post( (req, res, next) => {
        console.log(req.body);

        passport.authenticate('local', (authError, user, info) => {
            if (user) {
                req.login(user, loginError => res.redirect('/'));
                res.locals.isAuthenticated = isLoggedIn;
            }
            else res.send(`${info.message}`);
        })(req, res, next);
    });

//로그아웃
router.get('/logout', (req, res, next) => {  
    try{
        req.logout();
        req.session.destroy();
        res.redirect('/');
    }catch(err){
        console.log(err);
        next(err);
    }
})


// 마이페이지
router.route('/mypage')
    .get ((req, res, next) => {
        try {
            res.locals.isAuthenticated = isLoggedIn; //로그인이 되었는지 안됬는지
            res.locals.user = req.user;
            res.render('mypage');
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    
    .post ( async (req, res, next) => {
        console.log(req.body);
        try {
            const hash = await bcrypt.hash(req.body.password, 12);
            const result = await User.update({
                password: hash,
                name: req.body.name,
                address: req.body.address
            }, {
                where: { id: req.body.id }
            });
            if (result) res.redirect('/');
            else next('Not updated!')
        } catch (err) {
            console.error(err);
            next(err);
        }
    });


module.exports = router;