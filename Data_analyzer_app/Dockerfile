# Use an official Python runtime as a parent image
FROM python:3.11

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies from requirements.txt
RUN pip install --no-cache-dir -r Requirements.txt

# Expose the port on which your Flask app will run
EXPOSE 5002

RUN python -m unittest discover -s src/Test

# Run the Flask app
CMD ["python", "src/Main/Data_analyzer_app.py"]
