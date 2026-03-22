from flask import Blueprint, request, jsonify
from ..models import db, Group, Member, Expense, Settlement
from ..utils.calculator import simplify_debts

balances_bp = Blueprint('balances', __name__)

@balances_bp.route('/groups/<string:group_id>/balances', methods=['GET'])
def get_balances(group_id):
    group = Group.query.get_or_404(group_id)
    members = group.members
    
    if not members:
        return jsonify([])
        
    num_members = len(members)
    member_ids = [m.id for m in members]
    
    # Track raw transactions: (from, to, amount)
    # A transaction represents an obligation
    transactions = []
    
    for expense in group.expenses:
        split_amount = expense.amount / num_members
        for member in members:
            if member.id != expense.paid_by_id:
                # the member owes the person who paid
                transactions.append((member.id, expense.paid_by_id, split_amount))
                
    # Add settlements (paying someone back effectively reverses an obligation)
    for settlement in Settlement.query.filter_by(group_id=group.id).all():
        # A settlement from payer to payee handles debt payer -> payee
        transactions.append((settlement.payer_id, settlement.payee_id, -settlement.amount))
        
    simplified = simplify_debts(transactions)
    
    # Decorate with names for the frontend
    member_map = {m.id: m.name for m in members}
    formatted = []
    
    for s in simplified:
        if s["amount"] > 0: # Ensure no strange 0 or negative debts made it out here due to rounding
            formatted.append({
                "from_id": s["from"],
                "from_name": member_map[s["from"]],
                "to_id": s["to"],
                "to_name": member_map[s["to"]],
                "amount": s["amount"]
            })
            
    return jsonify(formatted)

@balances_bp.route('/settle', methods=['POST'])
def settle_up():
    data = request.json
    if not data or 'payer_id' not in data or 'payee_id' not in data or 'group_id' not in data or 'amount' not in data:
        return jsonify({"error": "Missing required fields"}), 400
        
    try:
        amount = float(data['amount'])
    except ValueError:
        return jsonify({"error": "Invalid amount"}), 400
        
    settlement = Settlement(
        group_id=data['group_id'],
        payer_id=data['payer_id'],
        payee_id=data['payee_id'],
        amount=amount
    )
    
    db.session.add(settlement)
    db.session.commit()
    
    return jsonify({"status": "Debt marked as settled"}), 200
