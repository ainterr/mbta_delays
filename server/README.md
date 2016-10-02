# Personal MBTA Delay Tracker (Server Code)
This is the server code for my personal commute tracking project (up and
running [here](http://ainterr.github.io/mbta_tracker)). Note: personal secret
key and distancematrix API key have been removed from the code - it is expected
that you would create your own if you wanted to copy this project.

## How it Works
The server is a [Flask](http://flask.pocoo.org) based REST API that exposes two
endpoints:
1. `/data` - A `GET` request to this endpoint will return stored JSON data.
2. `/update` - A `POST` request to this endpoint updates the stored JSON data
based on the following parameters:
    - `key` - A secret key embedded in the app for security reasons
    - `action` - Either `depart` or `arrive`
    - `location` - Latitude and longitude for your current location
    - `time` - The current time, in epoch seconds

## IFTTT Integration
I used [IFTTT's Maker channel](https://ifttt.com/maker) to create easy, press
and forget buttons to record my timing data.

# Installation
After generating and inserting your distancematrix API key and secret key, run:

```bash
pip install requirements.txt
python server.py
```
