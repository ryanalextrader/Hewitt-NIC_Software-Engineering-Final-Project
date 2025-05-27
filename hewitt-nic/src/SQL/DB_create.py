import os
import pymysql
import sys

# https://dev.to/jakewitcher/using-env-files-for-environment-variables-in-python-applications-55a1
from dotenv import load_dotenv
load_dotenv()


server = os.environ['DATAHOST']
user = os.environ['DATAUSER']
pwd = os.environ['DATAPWD']
db = os.environ['DATABASE']

mydb = pymysql.connect(host=server, user=user, password=pwd)

mydb.autocommit(True)  # Enable autocommit mode to avoid needing to call commit() after each query

crsr = mydb.cursor()
  
# This file assume the following structure (Developing and testin in local device):
#      * Have MySQL Workbench installed and running. Not install? Here is the link: https://dev.mysql.com/downloads/mysql/. Tutorial: https://www.youtube.com/watch?v=u96rVINbAUI.
#      * Have PyMySQL==1.1.1 and python-dotenv==1.0.1. Not install? In terminal run 'pip install -r requirments.txt'
#      * Have a .env file with the following content
#        * export DATAHOST="localhost"
#        * export DATAUSER="root"
#        * export DATAPWD="Enter your password here"
#        * export DATABASE="hewitt"
# Make sure that you are inside the source (src) folder when running this script.
# Finally, run python .\DB_create.py in the terminal.



######
# The porpuse of the following class is to create the database and tables for the project.
# Also includes all the methods needed to update the user informration.
# We are goin to fecth he information from the registraction and use that as variable tp update the database.
# 
# 
# Changes:
# If you like to add another fiel such as secondary number, you need to delete the database.
# Then you add it manually to the target table. Assum you pick the judge table. You add the line "Secondary_Number varchar(255)."
# Warning: Anything that you add, need to be a sinle word. Example: "Secondary_Number" is correct. "Secondary Number" is not correct. Secondary Number will give you an error.
# #
#######
class DB:
    
    
    # This method is used to create the database and tables.
    # Calls all the methods needed to create the tables.
    def generate_db(self):
        

        
        bool = False # if the database does not exist, it will be created all the tables
        
        try:
            crsr.execute(f"CREATE DATABASE {db}")
            crsr.execute(f"USE {db}")
        except pymysql.err.DatabaseError:
            print("Database already exists. Skipping creation.")
            crsr.execute(f"USE {db}")  # Ensure the database is selected
            bool = True
        
        if not bool:
            self.create_Feedback()
            self.create_Submission()
            self.create_Question_Score()
            self.create_Feedback_Score()
            self.create_Users()
            self.create_Judge_Assignment()
            self.create_Participants()
            self.create_Competitions()
            self.create_Rubric()
            self.create_Questions()
            self.create_Feedback_Questions()
            print("Database and tables created successfully!")
            


    # All this methods are used to create the tables in the database.
    def create_Submission(self):
        crsr.execute("""create table Projects_Submission (
        ID int not null AUTO_INCREMENT,
        Project_Title varchar(255),
        Problem_Solved varchar(255),
        Solution_Description varchar(255),
        Category varchar(255),
        Industry varchar(255),
        Notes varchar(255),
        Logbook varchar(255),
        SlideDeck varchar(255),
        Image_for_Judges varchar(255),
        Public_Image varchar(255),
        Student_Table varchar(255),
        PRIMARY KEY (ID)
    )""")

    def create_Feedback(self):
        crsr.execute("""create table Feedback (
        ID int not null AUTO_INCREMENT,
        Submission_ID int,
        Judge_ID int,
        PRIMARY KEY (ID)
    )""")

    def create_Question_Score(self):
        crsr.execute("""create table Question_Score (
        ID int not null AUTO_INCREMENT,
        Feedback_ID int,
        Question_ID int,
        Score int,
        PRIMARY KEY (ID)
    )""")

    def create_Feedback_Score(self):
        crsr.execute("""create table Feedback_Score (
        ID int not null AUTO_INCREMENT,
        Feedback_ID int,
        Feedback_Question_ID int,
        Response text, 
        PRIMARY KEY (ID)
    )""") 

    def create_Users(self):
        crsr.execute("""create table Users (
        ID int not null AUTO_INCREMENT,
        First_Name varchar(255),
        Last_Name varchar(255),
        Pronouns varchar(255),
        Role int,
        Over_18 varchar(255) default 'YES',
        PRIMARY KEY (ID)
    )""")

    def create_Judge_Assignment(self):
        crsr.execute("""create table Judge_Assignment (
        ID int not null AUTO_INCREMENT,
        Competition_ID int,
        Min_Grade int,
        Max_Grade int,
        Judge_ID int,
        PRIMARY KEY (ID)
    )""")

    def create_Participants(self):
        crsr.execute("""create table Participants (
        Name varchar(255),
        Grade int,
        Guardian_Name varchar(255),
        Guardian_Email varchar(255)
    )""")

    def create_Competitions(self):
        crsr.execute("""create table Competitions (
        ID int not null AUTO_INCREMENT,
        Name varchar(255),
        Start_Date date,
        Student_End_Date date,
        Judge_End_Date date,
        Competition_Name text,
        Rubric_ID int,
        PRIMARY KEY (ID)
    )""")

    def create_Rubric(self):
        crsr.execute("""create table Rubric (
        ID int not null AUTO_INCREMENT,
        Name varchar(255),
        PRIMARY KEY (ID)
    )""")

    def create_Questions(self):
        crsr.execute("""create table Questions (
        ID int not null AUTO_INCREMENT,
        Rubric_ID int,
        Text text,
        Max_Score int,
        PRIMARY KEY (ID)
    )""")

    def create_Feedback_Questions(self):
        crsr.execute("""create table Feedback_Questions (
        ID int not null AUTO_INCREMENT,
        Rubric_ID int,
        Text text,
        PRIMARY KEY (ID)
    )""")
    # End of the methods to create the tables.
    
    
    # Following methods are used to update the user information and upload files to the database.
    def signUp(self, name, pronouns, role, over_18):
        sql = 'insert into users (name, pronouns, role, over_18)  '
        sql += 'values (%s, %s, %s, %s); '
        
        print(sql, (name, pronouns, role, over_18))
        crsr.execute(sql, (name, pronouns, role, over_18))
        
        
        
    # End of the Methods to update the user information and upload files to the database.


x = DB()


for i in range(1):
    # Check that we have the corrected values
    # print(f'{server}, {user}, {pwd}, {db}')
    x.generate_db()
    # x.signUp("Test User", "he/him", 1, "YES")  # Example to add a test user
    # print("Test user added successfully!")
    # x.signUp(n,p,r,age)

