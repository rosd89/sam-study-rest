const router = require('express').Router();
const {
  index, show, userDuplicateChecker, create, update, patchAll, patch, destory
} = require('./user.controller.js');

/**
 * @swagger
 * tags:
 *  name: User
 *  description: User management
 */

/**
 * @swagger
 * definitions:
 *  User:
 *    type: object
 *    required:
 *      - content
 *    properties:
 *      id:
 *        type: string
 *        description: User ID
 *      name:
 *        type: string
 *        description: 할일 내용
 *      updatedAt:
 *        type: date
 *        description: 변경 일자
 *      createdAt:
 *        type: date
 *        description: 생성 일자
 *  EmptyObject:
 *    type: object
 *    required:
 *      - content
 */

/**
 * @swagger
 * parameters:
 *  page:
 *    name: page
 *    description: paging option
 *    in: query
 *    type: number
 *    required: true
 *  size:
 *    name: size
 *    description: paging option
 *    in: query
 *    type: number
 *    required: true
 *  TodoPostContent:
 *    name: content
 *    description: 할일 내용
 *    in: formData
 *    type: string
 *    required: true
 *  TodoContent:
 *    name: content
 *    description: 할일 내용
 *    in: formData
 *    type: string
 *    required: false
 *  TodoDone:
 *    name: done
 *    description: 완료 여부
 *    in: formData
 *    required: false
 *    type: boolean
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Returns User 목록
 *     tags: [User]
 *     parameters:
 *       - $ref: '#/parameters/page'
 *       - $ref: '#/parameters/size'
 *     responses:
 *       200:
 *         description: user list
 *         schema:
 *           type: object
 *           properties:
 *             page:
 *               type: number
 *             size:
 *               type: number
 *             total:
 *               type: number
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 */
router.get('/', index);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a User
 *     tags: [User]
 *     parameters:
 *       - $ref: '#/parameters/page'
 *     responses:
 *       201:
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/EmptyObject'
 */
router.get('/:id', show);

// 유저 등록하기 [o]
router.post('/', userDuplicateChecker, create);

// 유저 전체데이터 수정
router.put('/:id', update);

// 유저 삭제하기
router.delete('/:id', destory);

module.exports = router;