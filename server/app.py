from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

# إعداد مجلد لتخزين الفيديوهات
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max-limit

# إعداد قاعدة البيانات
def init_db():
    conn = sqlite3.connect('videos.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            original_filename TEXT NOT NULL,
            tiktok_url TEXT NOT NULL,
            upload_date DATETIME NOT NULL,
            file_size INTEGER NOT NULL,
            status TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/upload', methods=['POST'])
def upload_video():
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file'}), 400
        
        video = request.files['video']
        tiktok_url = request.form.get('tiktok_url')
        
        if not video or not tiktok_url:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # تأمين اسم الملف وحفظه
        filename = secure_filename(video.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        new_filename = f"{timestamp}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        video.save(file_path)
        
        # حفظ المعلومات في قاعدة البيانات
        conn = sqlite3.connect('videos.db')
        c = conn.cursor()
        c.execute('''
            INSERT INTO videos 
            (filename, original_filename, tiktok_url, upload_date, file_size, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            new_filename,
            filename,
            tiktok_url,
            datetime.now(),
            os.path.getsize(file_path),
            'pending'
        ))
        video_id = c.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'video_id': video_id,
            'message': 'Video uploaded successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/videos', methods=['GET'])
def get_videos():
    try:
        conn = sqlite3.connect('videos.db')
        c = conn.cursor()
        c.execute('SELECT * FROM videos ORDER BY upload_date DESC')
        videos = c.fetchall()
        conn.close()
        
        video_list = []
        for video in videos:
            video_list.append({
                'id': video[0],
                'filename': video[1],
                'original_filename': video[2],
                'tiktok_url': video[3],
                'upload_date': video[4],
                'file_size': video[5],
                'status': video[6]
            })
        
        return jsonify(video_list)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
