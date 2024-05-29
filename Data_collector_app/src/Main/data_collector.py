import requests
from bs4 import BeautifulSoup
import psycopg2
import re
import schedule
import time

def get_html_content(url):
    response = requests.get(url)
    if response.status_code == 200:
        return BeautifulSoup(response.text, "html.parser")
    else:
        print("Failed to fetch HTML content from {url}. Status code: {response.status_code}")


def create_connection():
    try:
        #Connecting to Heroku Postgres
        database_url = 'postgres://kwkduxwxgqawim:251a81fb1d17b679565b576b48b8f520f46e5e85ba269d5d4e29e8df247d4ba0@ec2-23-22-172-65.compute-1.amazonaws.com:5432/d2isdsq00u30bg'
        default_connection = psycopg2.connect(database_url, sslmode='require')
        default_connection.autocommit= True
        print("database connection successful")
        return default_connection
    except:
        print("Database connection unsuccessful.")
        return None

def create_events_table(connection):
    cursor = connection.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS events (
                        event_id SERIAL not null,
                        event_name TEXT,
                        date TEXT,
                        time TEXT,
                        event_description TEXT,
                        valid_date INTEGER,
                        PRIMARY KEY (event_name,date,time,event_description)
                    );''')
    cursor.close()

def insert_event( events, event_name, date, time, event_description, valid_date):
    cursor = events.cursor()
    cursor.execute('''INSERT INTO events (event_name, date, time, event_description, valid_date) 
                   VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING;''',
                   (event_name, date, time, event_description, valid_date))
    cursor.close()

def collect_data():
    print("Collecting...")
    events = create_connection()
    create_events_table(events)
    
    # Scraping the events data
    eventDeptDict = {'Communications and Engagement':'D/Coms', 'Climate Initiatives':'D/CI', 'Housing and Human Services':'d/hhs', 'Open Space and Mountain Parks':'d/osmp', 'Parks and Recreation':'d/parksrec', 'Public Works':'d/pw',}
    for dept in eventDeptDict.keys():
        url = "https://countmein.bouldercolorado.gov/" + eventDeptDict[dept]
        html_content = get_html_content(url)
        event_html = html_content.find_all('tr')

        for event_list in event_html:
            event_name_element = event_list.find('a', attrs={"title": "Activity Details"})
            date_time_element = event_list.find('h5', attrs={"class": "margin-top-5"})
            description_element = event_list.find('p')

            # Checking if elements are found
            event_name = event_name_element.get_text().replace('\n', '') if event_name_element else None
            date_time = date_time_element.get_text().replace('\n', '') if date_time_element else None
            date_time = date_time_element.get_text() if date_time_element else None
            date_time_regex = r"(\d{1,2}\s[A-Za-z]+\s\d{4})\s+\|\s+(\d{2}:\d{2}\s[AP]M)"
            date, time = re.findall(date_time_regex, date_time)[0]
            description = description_element.get_text().replace('\n', '') if description_element else None
            valid_date = 1

            # Inserting data into PostgreSQL table only if all elements are found
            if all((events, event_name, date, time, description, valid_date)):
                insert_event(events, event_name, date, time, description, valid_date)

    return "Data collected and stored successfully in PostgreSQL.",200

if __name__ == "__main__":
    collect_data()
    schedule.every(4).hours.do(collect_data)

    while True:
        schedule.run_pending()
        time.sleep(1)