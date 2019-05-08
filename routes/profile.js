module.exports = {
    profilePage: (req, res) => {
        res.render('profile.ejs', {
            title: "Profile", 
            message: ''
        });

    },
    myQuestionsPage: (req, res) => {
        let questionQuery = "SELECT * FROM `Questions` WHERE UID = '"+ 4 + "'"; 

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
   
};