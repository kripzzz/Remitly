import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'remitly_site.db')
CONTENT_JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'content.json')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Drop existing tables
    cursor.executescript('''
        DROP TABLE IF EXISTS chapters;
        DROP TABLE IF EXISTS founders;
        DROP TABLE IF EXISTS revenue_data;
        DROP TABLE IF EXISTS milestones;
    ''')

    # Create tables
    cursor.executescript('''
        CREATE TABLE chapters (
            id INTEGER PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            order_index INTEGER NOT NULL,
            teaser_text TEXT NOT NULL,
            icon TEXT NOT NULL,
            deep_dive_html TEXT NOT NULL
        );

        CREATE TABLE founders (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            background TEXT NOT NULL,
            personal_connection TEXT NOT NULL
        );

        CREATE TABLE revenue_data (
            id INTEGER PRIMARY KEY,
            fiscal_period TEXT NOT NULL,
            revenue_usd_millions REAL NOT NULL,
            yoy_growth_pct REAL,
            source TEXT
        );

        CREATE TABLE milestones (
            id INTEGER PRIMARY KEY,
            year INTEGER NOT NULL,
            label TEXT NOT NULL,
            description TEXT NOT NULL,
            chapter_slug TEXT NOT NULL
        );
    ''')
    conn.commit()
    return conn

def seed_db(conn):
    with open(CONTENT_JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cursor = conn.cursor()

    for c in data.get('chapters', []):
        cursor.execute('''
            INSERT INTO chapters (id, slug, title, order_index, teaser_text, icon, deep_dive_html)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (c['id'], c['slug'], c['title'], c['order_index'], c['teaser_text'], c.get('icon', ''), c['deep_dive_html']))

    for f in data.get('founders', []):
        cursor.execute('''
            INSERT INTO founders (id, name, role, background, personal_connection)
            VALUES (?, ?, ?, ?, ?)
        ''', (f['id'], f['name'], f['role'], f['background'], f['personal_connection']))

    for r in data.get('revenue_data', []):
        cursor.execute('''
            INSERT INTO revenue_data (id, fiscal_period, revenue_usd_millions, yoy_growth_pct, source)
            VALUES (?, ?, ?, ?, ?)
        ''', (r['id'], r['fiscal_period'], r['revenue_usd_millions'], r.get('yoy_growth_pct'), r.get('source', '')))

    for m in data.get('milestones', []):
        cursor.execute('''
            INSERT INTO milestones (id, year, label, description, chapter_slug)
            VALUES (?, ?, ?, ?, ?)
        ''', (m['id'], m['year'], m['label'], m['description'], m['chapter_slug']))

    conn.commit()
    print("Database seeded successfully from content.json!")

if __name__ == '__main__':
    connection = init_db()
    seed_db(connection)
    connection.close()
