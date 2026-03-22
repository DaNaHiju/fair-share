import pytest
from app import create_app, db
from app.models import Group, Member

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_health(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json == {"status": "ok"}

def test_create_and_get_group(client):
    res = client.post('/api/groups', json={"name": "Trip"})
    assert res.status_code == 201
    group_id = res.json['id']
    
    res = client.get(f'/api/groups/{group_id}')
    assert res.status_code == 200
    assert res.json['name'] == "Trip"
    assert len(res.json['members']) == 0

def test_add_member_and_expense_and_balance(client):
    # Create group
    res = client.post('/api/groups', json={"name": "Dinner"})
    g_id = res.json['id']
    
    # Add members Alice and Bob
    res = client.post(f'/api/groups/{g_id}/members', json={"name": "Alice"})
    a_id = res.json['id']
    res = client.post(f'/api/groups/{g_id}/members', json={"name": "Bob"})
    b_id = res.json['id']
    
    # Alice pays $100 for Dinner
    res = client.post(f'/api/groups/{g_id}/expenses', json={
        "description": "Dinner",
        "amount": 100,
        "paid_by": a_id
    })
    assert res.status_code == 201
    
    # Check balance: Bob should owe Alice $50
    res = client.get(f'/api/groups/{g_id}/balances')
    assert res.status_code == 200
    balances = res.json
    assert len(balances) == 1
    
    bal = balances[0]
    assert bal['from_name'] == "Bob"
    assert bal['to_name'] == "Alice"
    assert bal['amount'] == 50.0
