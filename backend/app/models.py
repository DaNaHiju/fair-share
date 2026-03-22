from . import db
from datetime import datetime
import uuid

class Group(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    members = db.relationship('Member', backref='group', cascade='all, delete-orphan')
    expenses = db.relationship('Expense', backref='group', cascade='all, delete-orphan')

class Member(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    group_id = db.Column(db.String(36), db.ForeignKey('group.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)

class Expense(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    group_id = db.Column(db.String(36), db.ForeignKey('group.id'), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    paid_by_id = db.Column(db.String(36), db.ForeignKey('member.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Settlement(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    group_id = db.Column(db.String(36), db.ForeignKey('group.id'), nullable=False)
    payer_id = db.Column(db.String(36), db.ForeignKey('member.id'), nullable=False)
    payee_id = db.Column(db.String(36), db.ForeignKey('member.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
