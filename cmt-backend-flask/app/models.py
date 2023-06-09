from app import db

class Queue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    create_time = db.Column(db.DateTime)
    update_time = db.Column(db.DateTime)
    name = db.Column(db.String(128))
    decision_tree_id = db.Column(db.Integer, db.ForeignKey('decision_tree.id'))
    prioritization_function = db.Column(db.JSON)


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    create_time = db.Column(db.DateTime)
    update_time = db.Column(db.DateTime)
    entity_id = db.Column(db.String(128))
    entity_type = db.Column(db.String(128))
    entity_create_time = db.Column(db.DateTime)
    entity_metadata = db.Column(db.JSON)
    user_id = db.Column(db.String(128))
    user_name = db.Column(db.String(128))
    user_email = db.Column(db.String(128))
    user_phone_number = db.Column(db.String(128))
    user_metadata = db.Column(db.JSON)
    queue_id = db.Column(db.Integer, db.ForeignKey('queue.id'))
    questions_with_answers = db.Column(db.JSON)
    score = db.Column(db.Float)


class DecisionTree(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    create_time = db.Column(db.DateTime)
    update_time = db.Column(db.DateTime)
    name = db.Column(db.String(128))
    tree = db.Column(db.JSON)
