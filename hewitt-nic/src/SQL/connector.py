import os
import pymysql

# https://dev.to/jakewitcher/using-env-files-for-environment-variables-in-python-applications-55a1
from dotenv import load_dotenv
load_dotenv()

# from dotenv import load_dotenv
# from os.path import join, dirname
# dotenv_path = join(dirname(__file__), '.env')
# load_dotenv(dotenv_path)


server = os.environ['DATAHOST']
user = os.environ['DATAUSER']
pwd = os.environ['DATAPWD']
db = os.environ['DATABASE']

mydb = pymysql.connect(host=server, user=user, password=pwd)

mydb.autocommit(True)  # Enable autocommit mode to avoid needing to call commit() after each query
cur = mydb.cursor()


