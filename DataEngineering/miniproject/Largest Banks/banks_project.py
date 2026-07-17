#Importing required Libraries
import pandas as pd
import numpy as np
from datetime import datetime 
import requests
from bs4 import BeautifulSoup
import sqlite3
import sys
from dotenv import load_dotenv
import os

#Defining Functions
def log_process(message):
    """This function is used to logs the mentioned message to a log file"""

    now = datetime.now()
    time_format = "%Y-%m-%d-%H:%M:%S" #Format in which time is saved
    str_time = now.strftime(time_format)
    final_msg = f"{str_time} : {message}"
    with open("code_log.txt","a") as f:
        f.write(final_msg + "\n")


def extract(url,table_attribute):
    """This function extracts the required information from website and saves it into dataframs. The function returns dataframe for further processing"""
    req = requests.get(url)
    df = pd.DataFrame(columns=table_attribute)
    if req.status_code == 200:
        soup  = BeautifulSoup(req.text,'html.parser')
        tab = soup.find_all("table")[0]
        rows = tab.find_all("tr")
        cnt = 0
        for row in rows:
            col = row.find_all('td')
            if len(col) != 0:
                name=col[1].text.strip()
                mc = float(col[2].text.strip())
                data_dict = {"Name":name,"MC_USD_Billion": mc}
                df1 = pd.DataFrame(data_dict,index = [0])
                df = pd.concat([df,df1],ignore_index=True)
                cnt+=1
            if cnt ==10:
                break
    return df


def transform(df):
    """This function takes df as input and transforms the data in from USD to GBP,INR,GBP,EUR in additional columns. This function returns a dataframe with 3 additional columns (The exchange rate are provided through a csv file)"""
    rates = pd.read_csv("exchange_rate.csv")
    currency = rates["Currency"]
    for i in currency:
        df[f"MC_{i}_Billions"] = np.round(df["MC_USD_Billion"] * float(rates.loc[rates["Currency"]==i,"Rate"].iloc[0]),2)

    return df

def load_to_csv(df,file_path):
    ''' This function saves the final data frame as a CSV file in
    the provided path. Function returns nothing.'''
    df.to_csv(file_path,index=False)

def load_to_sql(df,sql_connection,table_name):
    ''' This function saves the final data frame to a database table with the provided name. Function returns nothing.'''
    df.to_sql(table_name,sql_connection, if_exists='replace',index=False)

def run_query(query,sql_connection):
    ''' This function runs the query on the database table and prints the output on the terminal. Function returns nothing.'''
    df = pd.read_sql(query,sql_connection)
    print(df)


"""Defining required entities and calling the relevant functions"""
load_dotenv()
log_process("Initialating ETL process")

url = os.getenv("LARGEST_BANK_URL") # data from https://en.wikipedia.org/wiki/List_of_largest_banks
table_attribute= ["Name","MC_USD_Billion"] #MC is market Capital

df = extract(url,table_attribute)

log_process("Data Extraction complete, Initiating Transform Process")

df = transform(df)

log_process("Data transformation complete. Initiaing Loading process")
file_path= "./Largest_banks_data.csv"
try:
    load_to_csv(df,file_path)
except:
    log_process("Error: loading csv")
    sys.exit(1)

#Program Continues here
log_process("SQL Connection initiated")
try:

    db_name = "Banks.db"
    table_name = "Largest_banks"
    sql_connection= sqlite3.connect(db_name)
except:
    log_process("Error: SQL Connection Failed")
    sys.exit(1)


#Program continues
try :
    load_to_sql(df,sql_connection,table_name)
    log_process("Data loaded to Database as a table, Executing queries")
except:
    log_process("Error: Failed to load data in database")
    sys.exit(1)

query = f'Select * From {table_name}'
run_query(query,sql_connection)
log_process("Process Complete")
sql_connection.close()
log_process("Server Connection closed")