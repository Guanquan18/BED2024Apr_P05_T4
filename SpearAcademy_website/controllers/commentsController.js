const Comment = require ("../models/comments");  // importing the comment model required for comments controller 

// controller for retrieving all the message by QnaId  from the database
const getCommentsByQnAId = async (req, res) => {
    try {
      const qnaId = parseInt(req.params.qnaId); // Get QnAId from URL parameters

      const comments = await Comment.getCommentsByQnAId(qnaId);
       if(!comments) {
        return res.status(404).send("No comments found for this QnA");
      }
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving comments");
    }
  };

const getCommentById = async (req, res) => {
    const commentId = parseInt(req.params.id);
    try {
      const comment = await Comment.getCommentById(commentId);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving comment");
    }
  };


// Controller for posting comments 
const createComment = async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        const newCommentData = {
            msgDate: new Date(),
            msgText: req.body.msgText,
            messageAccount: req.body.messageAccount, // Get account ID from the request body
            messageQnA: req.body.messageQnA // Get QnA ID from the request body
        };
        
        // Ensure messageAccount and messageQnA are provided in the request body
        if (!newCommentData.messageAccount || !newCommentData.messageQnA) {
            return res.status(400).send("Missing required fields: messageAccount or messageQnA");
        }
        
        const newComment = await Comment.createComment(newCommentData);
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating comment");
    }
};

// Controller for deleting comments
const deleteComment = async (req, res) => {
  const commentId = parseInt(req.params.id);
  try {
      const success = await Comment.deleteCommentById(commentId);
      if (success) {
          res.status(200).send("Comment deleted successfully");
      } else {
          res.status(404).send("Comment not found");
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting comment");
  }
};

// Controller for updating comments
const updateComment = async (req, res) => {
  const commentId = parseInt(req.params.id);
  const updatedData = {
      msgText: req.body.msgText
  };
  try {
      const success = await Comment.updateCommentById(commentId, updatedData);
      if (success) {
          res.status(200).send("Comment updated successfully");
      } else {
          res.status(404).send("Comment not found");
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Error updating comment");
  }
};

  module.exports = {  // the controller functions are exported as an object for use in routing
    getCommentsByQnAId,
    getCommentById,
    createComment,
    deleteComment,
    updateComment
  };