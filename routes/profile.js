module.exports = {
    profilePage: (req, res) => {
        res.render('profile.ejs', {
            title: "Profile", 
            message: ''
        });

    },
    myQuestionsPage: (req, res) => {
        let questionQuery = "SELECT * FROM `Questions` WHERE UID = '"+ 4 + "' AND Deleted = 0"; 

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
        let upvotedQuery = "SELECT Questions.Question, Questions.Ranking FROM Questions INNER JOIN LikedQuestions ON Questions.QuestionID = LikedQuestions.QuestionID WHERE LikedQuestions.UID = 4 and Questions.Deleted = 0";
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
    },
    myResponsePage: (req, res) => {
        let respondedQuery = "SELECT * FROM Questions as a INNER JOIN UserResponses as b on a.QuestionID = b.QuestionID INNER JOIN Responses as c on b.ResponseID = c.ResponseID GROUP BY a.QuestionID, b.UID, b.ResponseID HAVING a.UID = 4;"
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