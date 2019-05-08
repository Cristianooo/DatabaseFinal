const fs = require('fs');

module.exports = {
    playersPage:(req, res) =>{
        let query = "SELECT * FROM `Questions` ORDER BY Ranking DESC"; 

        db.query(query, (err, result) => {
            if (err) {
                console.log('Query error');
                res.redirect('/');
            }
            res.render('players.ejs', {
                title: "JustAsk!",   
                questions: result,
            });
        });
    },
    upvoteQues: (req, res) => {
        var docID = parseInt(req.body.id);
        let updateQuery = "UPDATE `Questions` SET Ranking = Ranking+1 WHERE QuestionID = '"+ docID+ "'";
        db.query(updateQuery, (err, result) => {
            if(err){
                console.log('Query error');
                res.redirect('/players')
            }
        });
    },
    downvoteQues: (req, res) =>{
        var docID = parseInt(req.body.id);
        let updateQuery = "UPDATE `Questions` SET Ranking = Ranking-1 WHERE QuestionID = '"+ docID + "'"
        db.query(updateQuery, (err, result) => {
            if(err){
                console.log('Query error');
                res.redirect('/players')
            }
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
    addPlayerPage: (req, res) => {
        res.render('add-player.ejs', {
            title: "JustAsk!"
            ,message: ''
        });
    },
    addPlayer: (req, res) => {

        let message = '';
        let question = req.body.question;   
        let category = req.body.category;

        let query = "INSERT INTO `Questions` (UID, Question, Category, Ranking) VALUES ('" +
            4 + "', '" + question + "', '" + category + "', '" + 0 + "')";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/players');
        });
    },
    editPlayerPage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-player.ejs', {
                title: "Edit  Player"
                ,player: result[0]
                ,message: ''
            });
        });
    },
    editPlayer: (req, res) => {
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
    deletePlayer: (req, res) => {
        let playerId = req.params.id;
        let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';


        db.query(deleteUserQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });

        
    }
};
