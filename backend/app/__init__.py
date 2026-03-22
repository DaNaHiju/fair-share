import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///local.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        from .routes.groups import groups_bp
        from .routes.expenses import expenses_bp
        from .routes.balances import balances_bp
        
        app.register_blueprint(groups_bp, url_prefix='/api/groups')
        app.register_blueprint(expenses_bp, url_prefix='/api')
        app.register_blueprint(balances_bp, url_prefix='/api')
        
        db.create_all()
        
    @app.route('/api/health')
    def health():
        return jsonify({"status": "ok"})
        
    return app
