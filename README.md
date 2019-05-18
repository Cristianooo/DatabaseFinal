Cristiano Firmani
Justin Saborouh

To run this on your own you will need to first create a database on your localhost and run the sql file provided in the project folder. It is titled
DatabaseFinal.sql. It contains all the commands needed to get the database up and running. You do not need to make a users table as the program should
do that by itself. 

You must then change the code found in app.js that states the connection to the database. Enter your password to the root SQL account. -
```const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'JustAsk'
});
```

Once you have done this and have a NodeJS environemnt ready to go, you can refer to the package.json to see any packages you will need for the project.

**Note that for now the authentication of users does not work properly (Trouble getting passport authentication to work) so most user involved queries automatically query to the UID of 1. **

To more easily find each requirement I have laid out where each one can be found.
1. Print/display records from your database/tables.
    This is found in questions.ejs, myQuestions.ejs answeredQuestions.ejs, upvotedQuestions.ejs, and downvotedQuestions.ejs.
2. Query for data/results with various parameters/filters
    This can be found throughout the project with queries on almost every page.
3. Create a new record
    Found on the signUp.ejs page, add-question.ejs, and addResponse.ejs.
4. Delete records (soft delete function would be ideal)
    Soft delete is used when deleting questions from the myQuestions.ejs page
5. Update records 
    This can be done from the myQuestions.ejs page as well, when you need to edit your questions.
6. Make use of transactions (commit & rollback)
    This is found throughout the routes section, mainly in question.js where several queries are completed within one transaction.
7. Generate reports that can be exported (excel or csv format)
    CSVs are made at the questions.ejs page, with the server functionality on the questions.js page in routes. This can also be done on the upvotedQuestions.ejs page with the server functionality found in profile.js
8. One query must perform an aggregation/group-by clause
    The main query that does this is the query made for the answeredQuestions.ejs page, with the actual query found in profile.js under myResponsePage. 
9. One query must contain a sub-query.
    I simply implemented this in one of the views I created. You can see this in the DatabaseFinal.sql for the MyDislikedQuestions view
10. Two queries must involve joins across at least 3 tables
    The two queries that do this are the query for answeredQuestions, found in profile.js under myResponsePage, as well as the query for creating a csv in the upvtoedQuestions.ejs page (query also found in profile.js under routes)
11. Enforce referential integrality (Constraints)
    Referential integrality is found throughout the DatabaseFinal.sql in all of the create and alter statements.
12. Include Database Views, Indexes
    I have created two views, one for the Liked/Upvoted questions and one for the Disliked/Downvoted questions. Both are found in the DatabaseFinal.sql


Links used-
https://blog.hailstone.io/how-to-prevent-sql-injection-nodejs/
https://dev.to/gm456742/building-a-nodejs-web-app-using-passportjs-for-authentication-3ge2
https://stackoverflow.com/questions/17188337/nodejs-csv-data-export-system-for-users
