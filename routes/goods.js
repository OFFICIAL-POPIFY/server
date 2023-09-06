const express = require('express');
const router = express.Router();

const Goods = require('../models/Goods'); 

/* 굿즈 전체 목록 조회 */
router.get('/', async (req, res, next) => {
    try {
        const goods = await Goods.find()
            .populate('popup', 'corporation popup_imgs')
            .lean(); 
        res.status(200).json(goods);
    } catch (error) {
        next(error);
    }
});

/* 굿즈 전체 목록 인기순 정렬 - 메인페이지용 */
router.get('/sort/reviewCount', async (req, res, next) => {
  try {
      const goods = await Goods.find()
            .populate('popup', 'corporation popup_imgs reviews') 
            .lean();
      // 리뷰 개수 많은 순으로 정렬
      goods.sort((a, b) => b.popup.reviews.length - a.popup.reviews.length);

      res.status(200).json(goods);
  } catch (error) {
      next(error);
  }
});

module.exports = router;
