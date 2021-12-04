const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const { isLoggedIn } = require('./checklogin');


const router = express.Router();

var locationJson = {}

router.use(
    express.json()
)

router.route('/')
<<<<<<< HEAD
    .get(isLoggedIn,(req, res, next) => {
        res.locals.isAuthenticated = isLoggedIn;
=======
    .get((req, res, next) => {
        res.locals.user= req.user;
        var address = req.query.address; //html에서 주소값 불러오기 
        var result = "";
        console.log(`사용자가 입력한 주소 ${address}`); //주소값 출력 

        console.log(req.body);
        
        console.log(`사용자가 선택한 검색지 ${result}`);
        //axios를 사용하여 REST API 불러오기 
        axios({
            method: 'get',
            url: `https://dapi.kakao.com//v2/local/search/keyword.json?query=${encodeURI(address)}`,
            headers: {'Authorization': 'KakaoAK ' + process.env.REST_KEY } //보안을 위해 키를 따로 불러옴 
        })
            .then((response) => {
                const location = response.data.documents[0]; //첫번째 항목을 불러옴 
                var X = location?.x; //x값 
                var Y = location?.y; //y값 

                console.log(`x좌표 ${X} y좌표 ${Y}`); //현재 값 출력 

                locationJson = {locationX:X, locationY:Y}; //json로 변환 
            })
>>>>>>> 2389f51694f5538d406cdebdcaa0834c55e81a25
        res.locals.key = process.env.JS_KEY; //보안을 위해 키를 따로 불러옴 
        res.render('map', {key: process.env.JS_KEY}); //넌적스 출력 
    })


router.route('/xy')
    .get(isLoggedIn,(req, res, next) => {
        res.locals.isAuthenticated = isLoggedIn;
        var address = req.user.address;

        locationJson = {Address: address}; 

        console.log(`전송할 json파일 ${locationJson}`); //josn값 출력 
        res.send(locationJson); //json값 전송 
    })


module.exports = router