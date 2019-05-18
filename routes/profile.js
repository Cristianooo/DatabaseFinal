const fs = require('fs');

module.exports = {
    profilePage: (req, res) => {
        res.render('profile.ejs', {
            title: "Profile", 
            message: ''
        });

    },
    myQuestionsPage: (req, res) => {
        let questionQuery = "SELECT * FROM `Questions` WHERE UID = '"+ 1 + "' AND Deleted = 0"; 

        db.query(questionQuery, (err, result) => {
            if (err) {
                console.log('Query error');
                res.redirect('/profile');
            }
            res.render('myQuestions.ejs', {
                title: "JustAsk!",   
                questions: result,
            });
        });
    },
    editQuesPage: (req, res) => {
        let questionID = req.params.id;
        let editQuestionQuery = "Select * FROM `Questions` WHERE QuestionID = '" + questionID + "'";
        
        db.query(editQuestionQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
                res.redirect('/myQuestions');
            }
            res.render('edit-question.ejs', {
                title: "JustAsk!",   
                question: result[0]
            });
        });
    },
    editQues: (req, res) => {
        let questionID = req.params.id;
        let questionText = req.body.question;
        let questionCategory = req.body.category;
        let updateQuestionQuery = "UPDATE `Questions` SET `Question` = '" + questionText + "', `Category` = '" + questionCategory + "'  WHERE QuestionID =  '" + questionID + "'";

        db.query(updateQuestionQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
                res.redirect('/questions');
            }
            res.redirect('/myQuestions');
        });
    },
    deleteQues: (req, res) => {
        let questionID = req.params.id;
        let deleteUserQuery = "UPDATE `Questions` SET `Deleted` = 1 WHERE QuestionID = '" + questionID + "'";


        db.query(deleteUserQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
                res.redirect('/questions');
            }
            res.redirect('/myQuestions');
        });
    }, 
    upVotedQuestionsPage: (req, res) => {
        let upvotedQuery = "SELECT * FROM MyLikedQuestions WHERE UID = 1 and Deleted = 0";
        db.query(upvotedQuery, (err, result) => {
            if (err) {
                console.log('Query error');
                res.redirect('/profile');
            }
            
            res.render('upvotedQuestions.ejs', {
                title: "JustAsk!",   
                questions: result,
            });
        });
        let nameAndUpvoteQuery = "SELECT a.FirstName, a.LastName, c.Question FROM Users as a INNER JOIN LikedQuestions as b on a.id = b.UID INNER JOIN Questions as c on b.QuestionID = c.QuestionID WHERE a.id = 1 and c.Deleted = 0;"; 

        db.query(nameAndUpvoteQuery, (err, result, fields) => {
            if (err) {
                console.log('Query error');
                res.redirect('/');
            }
            var reportFile = "NameAndUpvotes";
                fs.closeSync(fs.openSync(__dirname + '/../public/reports/' + reportFile + '.csv', 'w'));
                var attributes = [];
                var row = [];
                for(var x = 0; x<fields.length; x++) attributes.push(fields[x].name);
                fs.appendFile(__dirname + '/../public/reports/' + reportFile + '.csv', attributes.join(','), function (err) {
                    if(err) console.log('Error appending fields', err);
                    fs.appendFileSync(__dirname + '/../public/reports/' + reportFile + '.csv', '\n');
                    for(var x = 0; x<result.length; x++) {
                        row = [];
                        for(var y = 0; y<attributes.length; y++){
                            row.push(result[x][attributes[y]]);
                        }
                        fs.appendFileSync(__dirname + '/../public/reports/' + reportFile + '.csv', row.join(','));
                        fs.appendFileSync(__dirname + '/../public/reports/' + reportFile + '.csv', '\n');
                    }
                    
                });
        });
    },
    downVotedQuestionsPage: (req, res) => {
        let downvotedQuery = "SELECT * FROM MyDislikedQuestions WHERE UID = 1 and Deleted = 0";
        db.query(downvotedQuery, (err, result) => {
            if (err) {
                console.log('Query error');
                res.redirect('/profile');
            }
            res.render('upvotedQuestions.ejs', {
                title: "JustAsk!",   
                questions: result,
            });
        });
    },
    myResponsePage: (req, res) => {
        let respondedQuery = "SELECT * FROM Questions as a INNER JOIN UserResponses as b on a.QuestionID = b.QuestionID INNER JOIN Responses as c on b.ResponseID = c.ResponseID GROUP BY a.QuestionID, b.UID, b.ResponseID HAVING a.UID = 1;"
        db.query(respondedQuery, (err, result) => {
            if (err) {
                console.log('Query error');
                res.redirect('/profile');
            }
            res.render('answeredQuestions.ejs', {
                title: "JustAsk!",   
                questions: result,
            });
        });
    }
   
};