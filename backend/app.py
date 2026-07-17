import sqlite3
import os
import qrcode
import io
from flask import Flask, jsonify, send_file, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'remitly_site.db')
# Use env var for site URL or fallback to localhost
SITE_URL = os.environ.get('SITE_URL', 'http://localhost:8000')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/content', methods=['GET'])
def get_content():
    try:
        conn = get_db_connection()
        chapters = [dict(row) for row in conn.execute('SELECT * FROM chapters ORDER BY order_index').fetchall()]
        founders = [dict(row) for row in conn.execute('SELECT * FROM founders').fetchall()]
        revenue = [dict(row) for row in conn.execute('SELECT * FROM revenue_data').fetchall()]
        milestones = [dict(row) for row in conn.execute('SELECT * FROM milestones ORDER BY year').fetchall()]
        conn.close()

        return jsonify({
            "chapters": chapters,
            "founders": founders,
            "revenue_data": revenue,
            "milestones": milestones
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/founders', methods=['GET'])
def get_founders():
    conn = get_db_connection()
    founders = [dict(row) for row in conn.execute('SELECT * FROM founders').fetchall()]
    conn.close()
    return jsonify(founders)

@app.route('/api/revenue', methods=['GET'])
def get_revenue():
    conn = get_db_connection()
    revenue = [dict(row) for row in conn.execute('SELECT * FROM revenue_data').fetchall()]
    conn.close()
    return jsonify(revenue)

@app.route('/api/milestones', methods=['GET'])
def get_milestones():
    conn = get_db_connection()
    milestones = [dict(row) for row in conn.execute('SELECT * FROM milestones ORDER BY year').fetchall()]
    conn.close()
    return jsonify(milestones)

@app.route('/api/qrcode', methods=['GET'])
def get_qrcode():
    # If the frontend passes a custom URL, use it, else use SITE_URL
    target_url = request.args.get('url', SITE_URL)
    
    img = qrcode.make(target_url)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    
    return send_file(buf, mimetype="image/png")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
