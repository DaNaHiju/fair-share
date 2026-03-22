from flask import Blueprint, request, jsonify
from ..models import db, Group, Member

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('', methods=['POST'])
def create_group():
    data = request.json
    if not data or not data.get('name'):
        return jsonify({"error": "Group name is required"}), 400
    
    group = Group(name=data['name'])
    db.session.add(group)
    db.session.commit()
    return jsonify({"id": group.id, "name": group.name}), 201

@groups_bp.route('', methods=['GET'])
def list_groups():
    groups = Group.query.all()
    return jsonify([{"id": g.id, "name": g.name} for g in groups])

@groups_bp.route('/<string:group_id>', methods=['GET'])
def get_group(group_id):
    group = Group.query.get_or_404(group_id)
    members = [{"id": m.id, "name": m.name} for m in group.members]
    return jsonify({"id": group.id, "name": group.name, "members": members})

@groups_bp.route('/<string:group_id>/members', methods=['POST'])
def add_member(group_id):
    group = Group.query.get_or_404(group_id)
    data = request.json
    if not data or not data.get('name'):
        return jsonify({"error": "Member name is required"}), 400
        
    member = Member(group_id=group.id, name=data['name'])
    db.session.add(member)
    db.session.commit()
    return jsonify({"id": member.id, "name": member.name, "group_id": group.id}), 201
