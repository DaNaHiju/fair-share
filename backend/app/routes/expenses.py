from flask import Blueprint, request, jsonify
from ..models import db, Group, Member, Expense

expenses_bp = Blueprint('expenses', __name__)

@expenses_bp.route('/groups/<string:group_id>/expenses', methods=['POST'])
def add_expense(group_id):
    group = Group.query.get_or_404(group_id)
    data = request.json
    
    if not data or 'description' not in data or 'amount' not in data or 'paid_by' not in data:
        return jsonify({"error": "Missing required fields"}), 400
        
    try:
        amount = float(data['amount'])
    except ValueError:
        return jsonify({"error": "Invalid amount"}), 400

    member = Member.query.filter_by(id=data['paid_by'], group_id=group_id).first()
    if not member:
        return jsonify({"error": "Paying member not found in group"}), 404
        
    expense = Expense(
        group_id=group.id,
        description=data['description'],
        amount=amount,
        paid_by_id=member.id
    )
    db.session.add(expense)
    db.session.commit()
    
    return jsonify({
        "id": expense.id, 
        "description": expense.description, 
        "amount": expense.amount, 
        "paid_by": expense.paid_by_id
    }), 201

@expenses_bp.route('/groups/<string:group_id>/expenses', methods=['GET'])
def list_expenses(group_id):
    group = Group.query.get_or_404(group_id)
    return jsonify([{
        "id": e.id,
        "description": e.description,
        "amount": e.amount,
        "paid_by": e.paid_by_id,
        "created_at": e.created_at.isoformat()
    } for e in group.expenses])
