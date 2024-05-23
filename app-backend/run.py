from app import app
from flask import jsonify

@app.route('/routes', methods=['GET'])
def list_routes():
    result = []
    for rule in app.url_map.iter_rules():
        methods = ', '.join(sorted(rule.methods))
        result.append({
            "route": str(rule),
            "methods": methods
        })

    return jsonify(result)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
