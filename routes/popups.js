const express = require('express');
const router = express.Router();

const Popup = require('../models/Popup');

/* 팝업스토어 전체 목록 조회 */
router.get('/', async (req, res) => {
    try {
        const popups = await Popup.find()
           .populate('goods')
            .populate('reviews');
            // .populate('map');

        res.status(200).json(popups);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

/* 팝업스토어 상세 조회 */
router.get('/search/:id', async (req, res) => {
  const popupId = req.params.id;

  try {
      const popup = await Popup.findById(popupId)
          .populate('goods')
          .populate({
            path: 'reviews',
            populate: {
              path: 'user',
              select: 'user_id'
            }
          });
          // .populate('map');

      if (!popup) {
          return res.status(404).json({ error: 'Popup not found' });
      }

      res.status(200).json(popup);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

/* 팝업스토어 인기순(리뷰 개수 많은 순)으로 정렬하여 조회 */
router.get('/sort/reviewCount', async (req, res) => {
  try {
      const popups = await Popup.find()
          .populate('reviews')
          .lean();

      // 리뷰 개수로 정렬
      popups.sort((a, b) => b.reviews.length - a.reviews.length);

      res.status(200).json(popups);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

/* 팝업스토어 최신순으로 정렬하여 조회 */
router.get('/latest', async (req, res) => {
  try {
      const popups = await Popup.find()
          .populate('goods')
          .populate('reviews')
          .sort({ createdAt: -1 });

      res.status(200).json(popups);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

/* 팝업스토어 제목 검색 + 최신순 */
router.get('/search', async (req, res) => {
  const searchCorporation = req.query.corporation;
  console.log(searchCorporation);

  try {
    const popups = await Popup.find({ corporation: { $regex: searchCorporation, $options: 'i' } })
      .populate('goods')
      .populate('reviews')
      .sort({ createdAt: -1 });

    res.status(200).json(popups);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* 팝업스토어 해시태그로 검색 + 최신순 */
router.get('/search-tag', async (req, res) => {
  const searchTag = req.query.tag; // req.query를 사용하여 URL 파라미터 가져오기
  console.log(searchTag);

  try {
    const popups = await Popup.find({ tags: { $in: [searchTag] } })
      .populate('goods')
      .populate('reviews')
      .sort({ createdAt: -1 });

    res.status(200).json(popups);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* 팝업스토어 페이징 조회 */
router.get('/paging', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
      const totalCount = await Popup.countDocuments();
      console.log(totalCount);

      const totalPages = Math.ceil(totalCount / pageSize);
      console.log(totalPages);

      const popups = await Popup.find()
          .populate('goods')
          .populate('reviews')
          .sort({ createdAt: -1 })
          .skip((page - 1) * pageSize)
          .limit(pageSize);

      res.status(200).json({
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalCount,
          popups: popups
      });
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
