from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

def create_connection():
    try:
        database_url = 'postgres://kwkduxwxgqawim:251a81fb1d17b679565b576b48b8f520f46e5e85ba269d5d4e29e8df247d4ba0@ec2-23-22-172-65.compute-1.amazonaws.com:5432/d2isdsq00u30bg'
        default_connection = psycopg2.connect(database_url, sslmode='require')
        default_connection.autocommit= True
        print("database connection successful")
        return default_connection
        # default_connection = psycopg2.connect(
        #     user="postgres",
        #     password="education",
        #     host="localhost",
        #     port="5432",
        #     database="volunteer_management"
        # )
        # default_connection.autocommit= True
        # print("database connection successful")
        # default_cursor = default_connection.cursor()
        # default_cursor.close()
        # return default_connection
    except:
        print("database connection unsuccessful")
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

def create_users_table(connection):
    cursor = connection.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                        user_id SERIAL not null,
                        email TEXT primary key,
                        password TEXT not null
                    );''')
    cursor.close()

def create_event_stats_table(connection):
    cursor = connection.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS event_stats (
                        event_id INTEGER not null,
                        user_id INTEGER not null,
                        PRIMARY KEY(event_id,user_id)
                    );''')
    cursor.close()

@app.route('/', methods=['GET'])
def index():
    return ('This is the backend server for Volunteers Management Platform', 200)

@app.route('/events', methods=['GET'])
def get_events():
    print('Getting events data for frontend')
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM events where valid_date = 1")
    events = cursor.fetchall()
    events_details = []
    for i in range(len(events)):
        data = {}
        data['index'] = events[i][0]
        data['event_name'] = events[i][1]
        data['date'] = events[i][2]
        data['time'] = events[i][3]
        data['event_description'] = events[i][4]
        events_details.append(data)
    events = jsonify(events_details)
    cursor.close()
    connection.close()
    return (events)

@app.route('/users', methods=['GET'])
def get_users():
    print('Getting users data for frontend')
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT user_id,email FROM users")
    users_data = cursor.fetchall()
    users = {}
    for index,email in users_data:
        users[index] = email
    users = jsonify(users)
    cursor.close()
    connection.close()
    return (users)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    # Checking if user already exists in the database
    connection = create_connection()
    create_users_table(connection)
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if user:
        print('User already exists')
        return jsonify({'error': 'User already exists'}), 400
    else:
        # Inserting new user into the database
        cursor.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
        print('User created successfully')
        return jsonify({'message': 'User created successfully'}), 201
    
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    connection = create_connection()
    create_users_table(connection)
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()
    if user:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Incorrect login details or user not signed up.'}), 401
    
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    event_id = data.get('eventId')
    email = data.get('email')
    connection = create_connection()
    create_event_stats_table(connection)
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT user_id FROM users WHERE email = %s",(email,))
        user_id = cursor.fetchone()[0]
        print(f'user_id: {user_id}')
        print(f'event_id: {event_id}')
    except:
        print('error in fetching user')
        return jsonify({'error': 'error registering the user. Please try again.'})
    try:
        cursor.execute("INSERT INTO event_stats VALUES (%s,%s)", (event_id, user_id))
        print('User registered for this event successfully')
        return jsonify({'message': 'User registered for this event successfully'}), 201
    except:
        print('User has already registered')
        return jsonify({'error': 'User has already registered'}), 401

@app.route('/event_stats', methods=['GET'])
def get_event_stats():
    print('Getting events stats for frontend')
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM event_stats order by event_id")
    stats_data = cursor.fetchall()
    stats = jsonify(stats_data)
    cursor.close()
    connection.close()
    return (stats)

@app.route('/volunteer-count', methods=['GET'])
def get_volunteer_count():
    try:
        connection = create_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM analysis_results")
        volunteer_count = cursor.fetchone()[0]
        cursor.close()
        connection.close()
        return jsonify({'volunteerCount': volunteer_count}), 200
    except Exception as e:
        print('Error fetching volunteer count:', e)
        return jsonify({'error': 'Error fetching volunteer count'}), 500

if __name__ == "__main__": 
    app.run(host='0.0.0.0', port=5001)