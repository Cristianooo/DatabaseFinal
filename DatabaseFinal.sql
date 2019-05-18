
CREATE TABLE Questions (
    QuestionID INT AUTO_INCREMENT,
    UID INT,
    Question TEXT NOT NULL,
    Category VARCHAR(25),
    Ranking INT,
    Deleted BOOLEAN,
    PRIMARY KEY (QuestionID),
    KEY FK_UID (UID)
);


CREATE TABLE Responses(
  ResponseID INT PRIMARY KEY AUTO_INCREMENT,
  ResponseData TEXT
);


CREATE TABLE UserResponses(
  QuestionID INT,
  UID INT,
  ResponseID INT,
  KEY FK_QuestionID (QuestionID),
  KEY FK_UID (UID),
  KEY FK_ResponseID(ResponseID)
);


CREATE TABLE LikedQuestions(
  UID INT,
  QuestionID INT,
  KEY FK_Liked_UID (UID),
  KEY FK_Liked_QuestionID (QuestionID)
);

CREATE TABLE DislikedQuestions(
  UID INT,
  QuestionID INT,
  KEY FK_Disliked_UID (UID),
  KEY FK_Disliked_QuestionID (QuestionID)
);

ALTER TABLE LikedQuestions
  ADD CONSTRAINT FK_Liked_UID FOREIGN KEY (UID) REFERENCES Users (id),
  ADD CONSTRAINT FK_Liked_QuestionID FOREIGN KEY (QuestionID) REFERENCES Questions (QuestionID);
ALTER TABLE DislikedQuestions
  ADD CONSTRAINT FK_Disliked_UID FOREIGN KEY (UID) REFERENCES Users (id),
  ADD CONSTRAINT FK_Disliked_QuestionID FOREIGN KEY (QuestionID) REFERENCES Questions (QuestionID);

ALTER TABLE UserResponses
  ADD CONSTRAINT FK_QuestionID FOREIGN KEY (QuestionID) REFERENCES Questions (QuestionID),
  ADD CONSTRAINT FK_UID FOREIGN KEY (UID) REFERENCES Users (id),
  ADD CONSTRAINT FK_ResponseID FOREIGN KEY (ResponseID) REFERENCES Responses (ResponseID);

ALTER TABLE Questions
  ADD CONSTRAINT FK_Question_UID FOREIGN KEY (UID) REFERENCES Users (id);

ALTER TABLE UserResponses
  ADD CONSTRAINT FK_QuestionID FOREIGN KEY (QuestionID) REFERENCES Questions (QuestionID),
  ADD CONSTRAINT FK_UID FOREIGN KEY (UID) REFERENCES Users (id);

CREATE VIEW MyLikedQuestions AS (
  SELECT Questions.Question, Questions.Ranking, LikedQuestions.UID, Questions.Deleted
  FROM Questions
    INNER JOIN LikedQuestions
      ON Questions.QuestionID = LikedQuestions.QuestionID
);

CREATE VIEW MyDislikedQuestions AS (
  SELECT DISTINCT Questions.Question, Questions.Ranking, DislikedQuestions.UID, Questions.Deleted
  FROM Questions, DislikedQuestions
  WHERE Questions.QuestionID IN (SELECT DislikedQuestions.QuestionID FROM DislikedQuestions WHERE Questions.QuestionID = DislikedQuestions.QuestionID)
);




