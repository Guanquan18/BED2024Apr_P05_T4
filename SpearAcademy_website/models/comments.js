const sql = require("mssql");  // import mssql 
const dbConfig = require("../dbConfig");  // import database configuration 

class Comment {  // defining a comment class to represent the messages in the database with properties
    constructor(id, msgDate, msgText, messageAccount, messageQnA, fullName) {
        this.id = id;
        this.msgDate = msgDate;
        this.msgText = msgText;
        this.messageAccount = messageAccount;
        this.messageQnA = messageQnA;
        this.fullName = fullName;
    }

    static async getCommentsByQnAId(qnaId) {
        try {
          const connection = await sql.connect(dbConfig);
    
          const sqlQuery = `
            SELECT Message.MsgId, Message.MsgDate, Message.MsgText, Message.Message_Account, Message.Message_QnA, Account.FullName
            FROM Message
            JOIN QnA ON QnA.QnAId = Message.Message_QnA
            JOIN Account ON Message.Message_Account = Account.AccId
            WHERE QnA.QnAId = @qnaId
          `;
    
          const request = connection.request();
          request.input("qnaId", qnaId);
          const result = await request.query(sqlQuery);
    
          connection.close();
    
          if (result.recordset.length > 0) {
            return result.recordset.map(record => new Comment(
              record.MsgId,
              record.MsgDate,
              record.MsgText,
              record.Message_Account,
              record.Message_QnA,
              record.FullName,
            ));
          } else {
            return "No comments found for this QnA"; // Message indicating no comments found
          }
        } catch (error) {
          console.error("Error retrieving comments:", error);
          throw new Error("An error occurred while retrieving comments.");
        }
      }

    static async getCommentById(id) {  // method to get a comment by ID

        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT Message.MsgId, Message.MsgDate, Message.MsgText,Message.Message_Account, Message.Message_QnA, Account.FullName
                            FROM Message
                            JOIN Account ON Message.Message_Account = Account.AccId
                            WHERE Message.MsgId = @id`; // parameterized query to get message by messageid

        const request = connection.request();
        request.input("id", sql.Int, id);
        const result = await request.query(sqlQuery);

        connection.close();

        if (result.recordset[0]) {  // if else statement so that an error handling message can be implemented if comment not found
        return new Comment(
            result.recordset[0].MsgId,
            result.recordset[0].MsgDate,
            result.recordset[0].MsgText,
            result.recordset[0].Message_Account,
            result.recordset[0].Message_QnA,
            result.recordset[0].FullName,
            );
        } else {
            return "Comment not found";  // message that displays error handling if comment not found
        }
    }

    static async createComment(newCommentData) {
        const connection = await sql.connect(dbConfig);  // establish connection to the database 

        const sqlQuery = `INSERT INTO Message (MsgDate, MsgText, Message_Account, Message.Message_QnA) 
                            VALUES (@msgDate, @msgText, @messageAccount, @messageQnA); 
                            SELECT SCOPE_IDENTITY() AS id;`;  // query to insert data into the database table
        
        const request = connection.request();

        request.input("msgDate", sql.DateTime, newCommentData.msgDate);
        request.input("msgText", sql.Text, newCommentData.msgText);
        request.input("messageAccount", sql.Int, newCommentData.messageAccount);
        request.input("messageQnA", sql.SmallInt, newCommentData.messageQnA);  // Make sure to include Message_QnA if needed
        

        const result = await request.query(sqlQuery);

        connection.close();  // close connection to the database 

        return this.getCommentById(result.recordset[0].id);
    }

    static async deleteCommentById(id) {
      try {
          const connection = await sql.connect(dbConfig);

          const sqlQuery = `DELETE FROM Message WHERE MsgId = @id;`;

          const request = connection.request();
          request.input("id", sql.Int, id);
          const result = await request.query(sqlQuery);

          connection.close();

          return result.rowsAffected[0] > 0;  // Returns true if a row was deleted, false otherwise
      } catch (error) {
          console.error("Error deleting comment:", error);
          throw new Error("An error occurred while deleting the comment.");
      }
  }

  static async updateCommentById(id, updatedData) {
    try {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Message SET MsgText = @msgText, MsgDate = @msgDate 
                          WHERE MsgId = @id;`;

        const request = connection.request();
        request.input("id", sql.Int, id);
        request.input("msgText", sql.Text, updatedData.msgText);
        request.input("msgDate", sql.DateTime, new Date());  // Update the date to current

        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected[0] > 0;  // Returns true if a row was updated, false otherwise
    } catch (error) {
        console.error("Error updating comment:", error);
        throw new Error("An error occurred while updating the comment.");
    }
  }
}

module.exports = Comment;
