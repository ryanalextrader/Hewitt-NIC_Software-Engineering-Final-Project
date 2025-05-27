import os
import pymysql

from connector import cur, db

class nic_DB:
    
    
    # To run this you need to run interminal pip install -r requirments
    # ".env whith the following:
        # export DATAHOST="localhost"
        # export DATAUSER="root"
        # export DATAPWD="YOUR-PASSWORD"
        # export DATABASE="hewitt"#
    # make sure that you are in nic-judging-and-feedback-portal\hewitt-nic\src\SQL whne running this script
    # To run use python nic_startup.py
        
    def generate_db(self):
        
        exist = False  # if the database does not exist, it will be created all the tables
        
        try:
            cur.execute(f"DROP DATABASE {db}")
        except pymysql.err.DatabaseError:
            pass
        
        cur.execute(f"CREATE DATABASE {db}")
        cur.execute(f"USE {db}")

            
        if not exist:
            
            # the following two line are to look for the specifice file we wanr
            # had troblues where even if the file was in the same directory as the script, it was not found
            # neither if puttinhg the path starting at "C:\\"
            # if the .env file appere in the changes of source control, right click on it and select "Add to .gitignore"
            # DON'T whant to commite the .env file
            script_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(script_dir, 'SQL_Creation.sql')

            file = open(file_path, 'r')
        
            sql = ""
            
            # Haven't fint he key word "ALERT" wich start the constraint
            start = False
                
            # Read the file line by line and execute each line as a SQL command
            for line in file:
                # Split the line into a list of words
                line = line.split()            
                
               
                
                for word in line:
                    if word in {"ALTER", "CREATE", "SET", "INSERT"}:
                        start = True
                        
                    # When we have fund the satrting ket work, we add start adding wokds to the sql string
                    if start:
                        sql += str(word) + " "
                    
                    # When we have fund the end of the constraint, we execute the sql command
                    if ";" in word:
                        print(sql)
                        cur.execute(sql)
                        
                        # Reset the sql string and the start variable
                        sql = ""
                        start = False
                        break
                    
                    # If we have not starter a query, we can break the loop
                    # to avoid unnecessary iterations
                    # avoid comments
                    if not start:
                        break
            
            file.close()
        
            
    # All this methods are used to create the tables in the database.       
 
    # This method is used to set the constraints of the tables.
    # For this we read form the DB_constraints.txt file, which is a text file that contains the constraints of the tables.
    # Parse the file and create the constraints in the database.
    # #  
      
x = nic_DB()
        
if True:
    x.generate_db()
