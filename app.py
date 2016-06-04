# coding=utf-8

import os
import csv
import json
from itertools import groupby
from flask import Flask, request, send_from_directory, jsonify
from flask import render_template
app = Flask(__name__, static_url_path='')

csv_path = './static/incendio.csv'
csv_obj = csv.DictReader(open(csv_path, 'r'))
csv_list = sorted(list(csv_obj), key=lambda fire: fire['PROVINCIA']) # ordenamos previamente por provincia
csv_dict = dict([[o['IDPIF'], o] for o in csv_list])


    # agrupado de provincias
provs_dict = {}
for k, g in groupby(csv_list, key=lambda fire: fire['PROVINCIA']):
    provs_dict[k] = g


    # añadimos campo año
for fire in csv_list:
    fire['YEAR'] = fire['FECHA'].split('-')[0]

    # agrupado de años
years_dict = {}
csv_years = sorted(csv_list, key=lambda fire: fire['YEAR'])
for k, g in groupby(csv_years, key=lambda fire: fire['YEAR']):
    years_dict[k] = g

    #rutas
@app.route("/")
def index():
    return render_template('index.html',
        object_list=csv_list,
        provincias=provs_dict,
        fires_sorted=csv_years
    )

@app.route('/data.json')
def allJSON():
    return json.dumps(csv_list)
    
@app.route('/<number>.json')
def detailJSON(number):
    return jsonify(csv_dict[number])
    

@app.route('/<number>/')
def detail(number):
    return render_template('detail.html',
        object=csv_dict[number],
    )

@app.route('/libs/<path:path>')
def send_js(path):
    return send_from_directory('libs', path)

app.run(host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)))

if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=8000,
        use_reloader=True,
        debug=True,
    )