#!/usr/bin/python

from flask import Flask, request, jsonify
from flask.ext.cors import cross_origin
import requests, urllib, json, datetime
from dateutil.parser import parse

app = Flask(__name__, static_url_path='')

SECRET = 'secret'
GDISTANCEMATRIX_KEY = 'distancematrix_key'

modes = [
    'transit',
    'driving',
    'bicycling',
    'walking',
]

def get_expected_time(depart, arrive):
    results = {}

    for mode in modes:
        endpoint = 'https://maps.googleapis.com/maps/api/distancematrix/json'
        options = {
            'key': GDISTANCEMATRIX_KEY,
            'origins': depart['location'],
            'destinations': arrive['location'],
            'mode': mode,
            # We have to add 1 week to the departure time because the
            # distancematrix API won't let you specify times in the past for
            # driving, walking, or bicycling directions.
            'departure_time': depart['time'] + 7*24*60*60,
            'units': 'imperial',
        }
    
        url = '{}?{}'.format(endpoint, urllib.urlencode(options))
        
        result = json.loads(urllib.urlopen(url).read())
        travel_time = result['rows'][0]['elements'][0]['duration']['value']

        results[mode] = (int(travel_time)+int(depart['time']))*1000

    results['depart'] = int(depart['time']*1000)
    results['arrive'] = int(arrive['time']*1000)
    return results

def save_depart(location, time):
    f = open('/home/pi/server/depart.json', 'r')
    data = { "location": location, "time": time }
    f.close()

    f = open('/home/pi/server/depart.json', 'w')
    f.write(json.dumps(data))
    f.close()

def get_depart():
    f = open('/home/pi/server/depart.json', 'r')
    depart = json.load(f)
    f.close()

    return depart

def write_data(results):
    f = open('/home/pi/server/data.json', 'r')
    data = json.load(f)
    f.close()

    data.append(results)

    f = open('/home/pi/server/data.json', 'w')
    data_string = json.dumps(data, sort_keys=True, indent=4, separators=(',', ': '))
    f.write(data_string)
    f.close()

@app.route('/update', methods=['POST'])
def update():
    try:
        data = request.json

        if data['key'] != SECRET: raise Exception()
        action = data['action']
        location = data['location']
        time_string = data['time']

        now = parse(time_string)
        epoch = datetime.datetime.utcfromtimestamp(0)
        time = int((now-epoch).total_seconds())

        if action == 'depart':
            save_depart(location, time)
        elif action == 'arrive':
            depart = get_depart()
            arrive = { 'location': location, 'time': time }
            results = get_expected_time(depart, arrive)
            write_data(results)
        else:
            raise Exception()

        return jsonify({'response':'logged successfully'})
    except Exception as e:
        print(e)
        return jsonify({'response':'invalid request'})

@app.route('/data', methods=['GET'])
@cross_origin()
def get_data():
    f = open('/home/pi/server/data.json', 'r')
    data = json.load(f)
    f.close()

    return jsonify({'results': data})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='8888')
