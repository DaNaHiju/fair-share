from collections import defaultdict

def simplify_debts(transactions):
    """
    Takes a list of (payer, payee, amount) and simplifies it to minimize transactions.
    """
    balances = defaultdict(float)
    
    for payer, payee, amount in transactions:
        balances[payer] -= amount
        balances[payee] += amount
        
    # Split into creditors and debtors
    creditors = []
    debtors = []
    
    for person, amount in balances.items():
        if amount > 1e-4:  # Float precision buffer
            creditors.append([person, amount])
        elif amount < -1e-4:
            debtors.append([person, -amount])
            
    # Sort them to try and match largest debts first
    creditors.sort(key=lambda x: x[1], reverse=True)
    debtors.sort(key=lambda x: x[1], reverse=True)
    
    simplified = []
    
    i, j = 0, 0
    while i < len(debtors) and j < len(creditors):
        debtor_id, debt = debtors[i]
        creditor_id, credit = creditors[j]
        
        amount = min(debt, credit)
        simplified.append({
            "from": debtor_id,
            "to": creditor_id,
            "amount": round(amount, 2)
        })
        
        debtors[i][1] -= amount
        creditors[j][1] -= amount
        
        if debtors[i][1] < 1e-4:
            i += 1
        if creditors[j][1] < 1e-4:
            j += 1
            
    return simplified
