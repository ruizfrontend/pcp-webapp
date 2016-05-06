import os
import csv
from flask import Flask, request, send_from_directory
from flask import render_template
app = Flask(__name__, static_url_path='')

csv_path = './static/incendio.csv'
csv_obj = csv.DictReader(open(csv_path, 'r'))
csv_list = list(csv_obj)
csv_dict = dict([[o['IDPIF'], o] for o in csv_list])

@app.route("/")
def index():
    return render_template('index.html',
        object_list=csv_list,
    )

@app.route('/libs/<path:path>')
def send_js(path):
    return send_from_directory('libs', path)

@app.route('/<number>/')
def detail(number):
    return render_template('detail.html',
        object=csv_dict[number],
    )

app.run(host=os.getenv('IP', '0.0.0.0'), port=int(os.getenv('PORT', 8080)))

if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=8000,
        use_reloader=True,
        debug=True,
    )