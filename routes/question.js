const fs = require('fs');

module.exports = {
    questionsPage:(req, res) =>{
        let query = "SELECT * FROM `Questions` WHERE Deleted = 0 ORDER BY Ranking DESC"; 

        db.query(query, (err, result, fields) => {
            if (err) {
                console.log('Query error');
                res.redirect('/');
            }
            var reportFile = Date.now();
                fs.closeSync(fs.openSync(__dirname + '/../reports/' + reportFile + '.csv', 'w'));
                var attributes = [];
                var row = [];
                for(var x = 0; x<fields.length; x++) attributes.push(fields[x].name);
                fs.appendFile(__dirname + '/../reports/' + reportFile + '.csv', attributes.join(','), function (err) {
                    if(err) console.log('Error appending fields', err);
                    fs.appendFileSync(__dirname + '/../reports/' + reportFile + '.csv', '\n');
                    for(var x = 0; x<result.length; x++) {
                        row = [];
                        for(var y = 0; y<attributes.length; y++){
                            row.push(result[x][attributes[y]]);
                        }
                        fs.appendFileSync(__dirname + '/../reports/' + reportFile + '.csv', row.join(','));
                        fs.appendFileSync(__dirname + '/../reports/' + reportFile + '.csv', '\n');
                    }
                    
                });
            res.render('questions.ejs', {
                title: "JustAsk!",   
                questions: result,
            });
        });
    },
    upvoteQues: (req, res) => {
        var docID = parseInt(req.body.id);
        let upvoteQuery = "UPDATE `Questions` SET Ranking = Ranking+1 WHERE QuestionID = '"+ docID+ "'";
        let downvoteQuery = "UPDATE `Questions` SET Ranking = Ranking-1 WHERE QuestionID = '"+ docID+ "'";
        let checkUpvoteQuery = "SELECT * FROM `LikedQuestions` WHERE UID = '"+ 4+ "' AND QuestionID = '"+ docID+ "'";

        let addUpvoteQuery = "INSERT INTO `LikedQuestions`(UID, QuestionID) VALUES('" +
        4 + "', '" + docID + "')";
        let deleteUpvoteQuery = "DELETE FROM `LikedQuestions` WHERE UID = '"+ 4+ "' AND QuestionID = '"+ docID+ "'";

        db.beginTransaction(function(err){              //Transaction with rollback in the case of errors with multiple queries
            if (err) { throw err; }
            db.query(checkUpvoteQuery, (err, result) => {           //First check if user has upvoted question
                if(err){
                    connection.rollback(function() {
                        throw err;
                      });
                    console.log('Query error');
                    res.redirect('/profile');
                }
                else if(result.length > 0){                             //If they have upvoted already, downvote the question
                    db.query(downvoteQuery, (err, result)=>{
                        if(err){
                            connection.rollback(function() {
                                throw err;
                              });
                            console.log('Query error');
                            res.redirect('/profile');
                        }
                    })
                    db.query(deleteUpvoteQuery, (err, result)=>{        //Delete the question from the 'LikedQuestions' table for this user
                        if(err){
                            connection.rollback(function() {
                                throw err;
                              });
                            console.log('Query error');
                            res.redirect('/profile');
                        }
                    })
                }
                else if(result.length ==0){                             //If they have not upvoted it already, upvote it
                    db.query(upvoteQuery, (err, result)=>{
                        if(err){
                            connection.rollback(function() {
                                throw err;
                              });
                            console.log('Query error');
                            res.redirect('/profile');
                        }
                    })
                    db.query(addUpvoteQuery, (err, result)=>{           //Then add it to the 'LikedQuestions' table for this user
                        if(err){
                            connection.rollback(function() {
                                throw err;
                              });
                            console.log('Query error');
                            res.redirect('/profile');
                        }
                    })
                }
            });
        });
        db.commit(function(err) {
            if (err) { 
              db.rollback(function() {
                throw err;
              });
            }
            console.log('Transaction Complete.');
        });
    },
    downvoteQues: (req, res) =>{
        var docID = parseInt(req.body.id);

        let downvoteQuery = "UPDATE `Questions` SET Ranking = Ranking-1 WHERE QuestionID = '"+ docID+ "'";
        let upvoteQuery = "UPDATE `Questions` SET Ranking = Ranking+1 WHERE QuestionID = '"+ docID+ "'";
        let checkDownvoteQuery = "SELECT * FROM `DislikedQuestions` WHERE UID = '"+ 4+ "' AND QuestionID = '"+ docID+ "'";

        let addDownvoteQuery = "INSERT INTO `DislikedQuestions`(UID, QuestionID) VALUES('" +
        4 + "', '" + docID + "')";
        let deleteDownvoteQuery = "DELETE FROM `DislikedQuestions` WHERE UID = '"+ 4+ "' AND QuestionID = '"+ docID+ "'";

        db.beginTransaction(function(err){              //Transaction with rollback in the case of errors with multiple queries
            if (err) { throw err; }
            db.query(checkDownvoteQuery, (err, result) => {           //First check if user has downvoted question
                if(err){
                    db.rollback(function() {
                        throw err;
                      });
                    console.log('Query error');
                    res.redirect('/profile');
                }
                else if(result.length > 0){                             //If they have downvoted already, upvote the question
                    db.query(upvoteQuery, (err, result)=>{
                        if(err){
                            db.rollback(function() {
                                throw err;
                              });
                            console.log('Query error');
                            res.redirect('/profile');
                        }
                    })
                    db.query(deleteDownvoteQuery, (err, result)=>{        //Delete the question from the 'DislikedQuestions' table for this user
                        if(err){
                            db.rollback(function() {
                                throw err;
                              });
                            console.log('Query error');
                            res.redirect('/profile');
                        }
                    })
                }
                else if(result.length ==0){                             //If they have not downvoted it already, downvote it
                    db.query(downvoteQuery, (err, result)=>{
                        if(err){
                            db.rollback(function() {
                                throw err;
                              });
                            console.log('Query error');
                            res.redirect('/profile');
                        }
                    })
                    db.query(addDownvoteQuery, (err, result)=>{           //Then add it to the 'DislikedQuestions' table for this user
                        if(err){
                            db.rollback(function() {
                                throw err;
                              });
                            console.log('Query error');
                            res.redirect('/profile');
                        }
                    })
                }
            });
            db.commit(function(err) {
                if (err) { 
                  db.rollback(function() {
                    throw err;
                  });
                }
                console.log('Transaction Complete.');

            });
        });
    }, 
    ranking: (req, res) => {
        
        let query = "SELECT * FROM `Questions` ORDER BY Ranking DESC"; 
        db.query(query, (err, result) => {
            if (err) {
                console.log('Query error');
            }
            res.send(result);
            

        });
    },
    addQuestionPage: (req, res) => {
        res.render('add-question.ejs', {
            title: "JustAsk!"
            ,message: ''
        });
    },
    addQuestion: (req, res) => {

        let message = '';
        let question = req.body.question;   
        let category = req.body.category;

        let query = "INSERT INTO `Questions` (UID, Question, Category, Ranking, Deleted) VALUES (?,?,?,?,?)";
        db.query(query,
            [
                4,
                question,
                category,
                0,
                false
            ],
             (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/questions');
        });
    },
    editQuestionPage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-question.ejs', {
                title: "Edit Question"
                ,player: result[0]
                ,message: ''
            });
        });
    },
    editQuestion: (req, res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;

        let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteQuestion: (req, res) => {
        let playerId = req.params.id;
        let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';


        db.query(deleteUserQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });

        
    },
    addResponsePage: (req, res) => {
        questionID = req.params.id;
        let query = 'SELECT * FROM `Questions` WHERE QuestionID = "' + questionID + '"'; 

        
        db.query(query, (err, result) => {
            if (err) {
                console.log('Query error');
                res.redirect('/questions');
            }
            res.render('addResponse.ejs', {
                title: "JustAsk!",   
                questions: result,
            });
        });

    },
    addResponse: (req, res) => {
        firstResponse= req.body.response1;
        secondResponse = req.body.response2;
        thirdResponse = req.body.response3;
        questionID = req.body.questionID;

        let ResponseQuery = "INSERT INTO `Responses` (ResponseData) VALUES(?)";
        let ResponseKeyQuery = "INSERT INTO `UserResponses` (QuestionID, UID, ResponseID) VALUES (?, ?, ?)";


        db.beginTransaction(function(err){              //Transaction with rollback in the case of errors with multiple queries
            if (err) { throw err; }
            db.query(ResponseQuery,
                [
                    firstResponse
                ],
                (err, result) => {  
                    if(err){
                        db.rollback(function() {
                            throw err;
                        });
                        console.log('Query error');
                        res.redirect('/questions');
                    }
                
                db.query(ResponseKeyQuery,          //Updates foreign key table if the previous response query succeeds. If not it rolls back
                    [
                        questionID,
                        4,
                        result.insertId
                    ],
                    (err, result) => {
                        
                        if(err){
                            db.rollback(function() {
                                throw err;
                              });
                            console.log('Query error');
                            res.redirect('/questions');
                        }
                });
                if(secondResponse != ''){           //If the second response box is empty, we do not want to insert the answer into the database.
                    db.query(ResponseQuery,
                        [
                            secondResponse
                        ],
                            (err, secondResult) => {       
                        if(err){
                            db.rollback(function() {
                                throw err;
                                });
                            console.log('Query error');
                            res.redirect('/questions');
                        }
                        db.query(ResponseKeyQuery, 
                            [
                                questionID,
                                4,
                                secondResult.insertId
                            ],
                            (err, result) => {
                                if(err){
                                    db.rollback(function() {
                                        throw err;
                                        });
                                    console.log('Query error');
                                    res.redirect('/questions');
                                }
                        });
                        if(thirdResponse != ''){
                            db.query(ResponseQuery,
                                [
                                    thirdResponse
                                ],
                                    (err, thirdResult) => {        
                                if(err){
                                    db.rollback(function() {
                                        throw err;
                                        });
                                    console.log('Query error');
                                    res.redirect('/questions');
                                }
                                db.query(ResponseKeyQuery, 
                                [
                                    questionID,
                                    4,
                                    thirdResult.insertId
                                ],
                                (err, result) => {
                                    if(err){
                                        db.rollback(function() {
                                            throw err;
                                            });
                                        console.log('Query error');
                                        res.redirect('/questions');
                                    }
                                });
                            });
                        }
                    });
                }
               
            });
            
            db.commit(function(err) {
                if (err) { 
                  db.rollback(function() {
                    throw err;
                  });
                }
                console.log('Transaction Complete.');
            });
        });
        res.redirect("/questions")
    }
};
