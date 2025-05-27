


file = open('.\\DB_constains.txt', 'r')
send = open("postgres_queries.txt", "a")



sql = ""

# Haven't fint he key word "ALERT" wich start the constraint
start = False
    
# Read the file line by line and execute each line as a SQL command
for line in file:
    # Split the line into a list of words
    line = line.split()            
    
    
    
    for word in line:
        if word == "ALTER" or word == "CREATE" or word == "SET":
            start = True
            
        # When we have fund the satrting ket work, we add start adding wokds to the sql string
        if start:
            sql += str(word) + " "
        
        # When we have fund the end of the constraint, we execute the sql command
        if ";" in word:
            sql += "\n"
            #print(sql.strip())
            # cur.execute(sql)
            
            # Reset the sql string and the start variable
            #sql = ""
            start = False
            break
        
send.write(sql.strip())
file.close()
send.close()
print("Constraints created successfully.")
        


