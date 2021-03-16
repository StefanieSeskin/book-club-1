import express from 'express'
import conn from '../db.js'
// console.log(conn, 'conn')
const router = express.Router()
router.get('/genresuser', async (request, response) => {
  // console.log(request.user.id, 'id')
    const id = [req.user.id]
  const genre = await conn.raw(
      `
      SELECT DISTINCT ON (g.id) b.title, b.cover_pic, g.name, g.id
      FROM genres_users gu
      LEFT OUTER JOIN genres g on gu.genre_id = g.id
      LEFT OUTER JOIN books b on g.id = b.genres_id
      WHERE gu.user_id = ?
      `,
      [id]
      )
     
    response.json(genre.rows);
    console.log(rows, 'genres');

})

export default router


