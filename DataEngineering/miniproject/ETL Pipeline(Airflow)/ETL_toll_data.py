#sudo curl https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBM-DB0250EN-SkillsNetwork/labs/Final%20Assignment/tolldata.tgz -o /home/project/airflow/dags/finalassignment/tolldata.tgz

#Importing Libraries
from datetime import datetime,timedelta

#Importing dag object
from airflow.models import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.utils.dates import days_ago

#defining 
default_args={
    "owner":"Ravi",
    "start_date": days_ago(0),
    "email":['joshiravi2706@gmail.com'],
    "email_on_faliure":True,
    "email_on_retry":True,
    "retries":1,
    "retry_delay":timedelta(minutes=5),
}

dag = DAG(
    "ETL_toll_data",
    default_args=default_args,
    description="Apache Airflow Final Assignment",
    schedule=timedelta(days=1)
    )

unzip_data = BashOperator(
    task_id="unzip_data",
    bash_command='tar -xvf /home/project/airflow/tolldata.tgz -C /home/project/airflow/',
    dag=dag
)
extract_data_from_csv =BashOperator(
    task_id="extract_data_from_csv",
    bash_command='cut /home/project/airflow/vehicle-data.csv -d "," -f1,2,3,4 > /home/project/airflow/csv_data.csv',
    dag=dag
)
extract_data_from_tsv = BashOperator(
    task_id="extract_data_from_tsv",
    bash_command='cut /home/project/airflow/tollplaza-data.tsv -f5,6,7 > /home/project/airflow/tsv_data.csv',
    dag=dag
)
extract_data_from_fixed_width = BashOperator(
    task_id="extract_data_from_fixed_width",
    bash_command='cut -c 59- /home/project/airflow/payment-data.txt  > /home/project/airflow/payment_data.csv',
    dag=dag
)
consolidate_data = BashOperator(
    task_id="consolidate_data",
    bash_command='paste /home/project/airflow/csv_data.csv /home/project/airflow/tsv_data.csv /home/project/airflow/payment_data.csv > /home/project/airflow/extracted_data.csv',
    dag=dag
)
transform_data = BashOperator(
    task_id="transform_data",
    bash_command='cat /home/project/airflow/extracted_data.csv | tr [a-z] [A-Z] > /home/project/airflow/transformed_data.csv',
    dag=dag
)

unzip_data >> extract_data_from_csv >> extract_data_from_tsv >> extract_data_from_fixed_width >> consolidate_data >> transform_data