import express from 'express'
import conn from '../db.js'
// console.log(conn, 'conn')
const router = express.Router()
router.get('/bookclub/:bookId', async (request, response) => {
    const id = request.params.bookId
  const bookclub = await conn.raw(
      `
        SELECT b.title, b.copyright, b.synopsis, b.cover_pic, b.author_id, a.first_name, a.last_name 
        FROM books b
        JOIN authors a 
        ON b.author_id = a.id
        WHERE b.id = ?
      `,
      [id]
      )
     const rows = bookclub.rows
    response.json(rows);
// response.json({message:'testing routes'})
    console.log( rows,'bookclub')

})

router.post("/bookclub", async (request, response) => {
  // const id = req.user.bookId;
  const userId = request.user.id
  const { book_id } = request.body;
  await conn.raw(
    `
        INSERT INTO book_collections (book_id, user_id)
        VALUES( ?,?)
    `,
    [book_id, userId]
  );
  response.json({ message: "book collection added" });
});

router.get("/discussions/:groupId", async (request, response) => {
  const id = request.params.groupId
  // const oldSql = `
  // SELECT d.discussion, d.parent_id, d.child_id, d.group_id, u.photo, u.first_name
  // FROM discussions d
  // LEFT OUTER JOIN groups g
  // ON d.group_id = g.id
  // LEFT OUTER JOIN books b
  // ON g.book_id = b.id
  // LEFT OUTER JOIN users u
  // ON d.user_id= u.id
  // WHERE d.group_id = ?
  // ORDER BY d.parent_id, d.child_id DESC

  // `
  const sql = `SELECT u.photo, u.username, d.id, d.parent_id, d.discussion, d.group_id, TO_CHAR(d.created_at, 'MM/DD/YYYY HH:MM') as date
        FROM discussions d
        INNER JOIN users u ON u.id = d.user_id
        INNER JOIN groups g ON d.group_id = g.id
        WHERE group_id = ?`
  const discussion = await conn.raw(sql,[id])
  const rows = discussion.rows
  const discussionMap = {}
  for (let discussion of rows) {
    discussionMap[discussion.id] = discussion
  }
  for (let key in discussionMap) {
    const currentDiscussion = discussionMap[key]
    const isAReply = currentDiscussion.parent_id !== null
    if (isAReply) {
      const parentId = currentDiscussion.parent_id
      const parentDiscussion = discussionMap[parentId]
      if (parentDiscussion.replies === undefined) {
        parentDiscussion.replies = []
      }
      parentDiscussion.replies.push(currentDiscussion)
    }
  }
  const discussionList = []
  for (let key in discussionMap) {
    const currentDiscussion = discussionMap[key]
    // how do I know if is a reply
    const isAReply = currentDiscussion.parent_id !== null
    if (!isAReply) {
      discussionList.push(currentDiscussion)
    }
  }
  response.json(discussionList);
})

router.post("/discussions", async (request, response) => {
  // const id = req.user.bookId;
  const userId = request.user.id
  // console.log(Date().getHours());

  const { discussion, group_id, parent_id } = request.body;
  console.log(request.body, 'body')
    await conn.raw(
      `
      INSERT INTO discussions (discussion, user_id,  parent_id, group_id)
      VALUES(?,?,?,?);
  `,
  [discussion, userId, parent_id, group_id]
  
    )
    


  response.json({ message: "discussion added" });
});

export default router