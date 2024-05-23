from flask import jsonify, request, send_file
from werkzeug.utils import secure_filename
import os
from app import db, app
from app.models import File
from app.api import bp
from .utils import get_user_from_token

@bp.route('/upload', methods=['POST'])
def upload():
    """ upload a doc  """
    files = request.files.getlist('files')
    print(request.headers)
    
    auth_token = request.headers.get('Authorization')
    if not auth_token:
        return jsonify({'error': 'Missing authentication token'}), 401

    user = get_user_from_token()
    
    if user is None:
        return jsonify({'error': 'Invalid authentication token'}), 401

    if 'files' not in request.files:
        return jsonify({'error': 'No files part in the request'}), 400
    

    files = request.files.getlist('files')
    file_infos = []

    for file in files:
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        filename = str(user.id)+'_'+secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        file.seek(0)

        # Get file size after saving
        size = os.stat(filepath).st_size

        file_info = File(
            filename=filename,
            filepath=filepath,
            mimetype=file.mimetype,
            size=size,
            user_id=user.id
        )

        db.session.add(file_info)
        db.session.commit()

        file_infos.append({
            'id': file_info.id,
            'filename': file_info.filename,
            'filepath': file_info.filepath,
            'mimetype': file_info.mimetype,
            'size': file_info.size,
            'user_id': user.id
        })

    return jsonify(file_infos), 201

@bp.route('/get-all-documents', methods=['GET'])
def get_documents():
    """ return all the documents own by the user """

    auth_token = request.headers.get('Authorization')
    if not auth_token:
        return jsonify({'error': 'Missing authentication token'}), 401

    user = get_user_from_token()
    if user is None:
        return jsonify({'error': 'Invalid authentication token'}), 401

    files = File.query.filter_by(user_id=user.id).all()

    file_infos = []
    for file in files:
        file_infos.append({
            'id': file.id,
            'filename': file.filename,
            'filepath': file.filepath,
            'mimetype': file.mimetype,
            'size': file.size,
            'user_id': user.id
        })

        if file.tag != None :
            file_infos[-1]['tag'] = file.tag

    return jsonify(file_infos), 200

@bp.route('/delete-document/<int:document_id>', methods=['DELETE'])
def delete_document(document_id):
    """ delete a document owned by the user """

    auth_token = request.headers.get('Authorization')
    if not auth_token:
        return jsonify({'error': 'Missing authentication token'}), 401

    user = get_user_from_token()
    if user is None:
        return jsonify({'error': 'Invalid authentication token'}), 401

    document = File.query.get(document_id)

    # check if document exists
    if document is None:
        return jsonify({'error': 'Document not found'}), 404

    # check if document is owned by the user
    if document.user_id != user.id:
        return jsonify({'error': 'User not authorized to delete this document'}), 403

    # delete the document
    os.remove(document.filepath)
    db.session.delete(document)
    db.session.commit()

    return jsonify({'message': 'Document successfully deleted'}), 200


@bp.route('/download/<int:file_id>', methods=['GET'])
def download_file(file_id):
    file = File.query.get(file_id)
    if file is None:
        return jsonify({'error': 'File not found'}), 404

    abs_filepath = os.path.join(app.config['BASE_DIR'], file.filepath)

    try:
        response = send_file(abs_filepath, as_attachment=True)
        response.headers["Content-Disposition"] = f"attachment; filename={file.filename}"
        return response
    except FileNotFoundError:
        return jsonify({'error': 'File not found on server'}), 404

@bp.route('/stats', methods=['GET'])
def get_stats():
    """ return all the documents own by the user """

    auth_token = request.headers.get('Authorization')
    if not auth_token:
        return jsonify({'error': 'Missing authentication token'}), 401

    user = get_user_from_token()
    if user is None:
        return jsonify({'error': 'Invalid authentication token'}), 401

    files = File.query.filter_by(user_id=user.id).all()

    file_infos = {}

    total_size = 0
    total_image = 0
    total_pdf = 0
    total_others = 0
    total_doc = 0

    for file in files:
        
        total_size += int(file.size)
        total_doc += 1

        mimetype = file.mimetype.split('/')[0]

        if mimetype == "image":
            total_image +=1
        elif mimetype == "application":
            total_pdf +=1
        else: total_others +=1

    file_infos["size"] = total_size
    file_infos["image"] = total_image
    file_infos["pdf"] = total_pdf
    file_infos["other"] = total_others
    file_infos["doc"] = total_doc

    return jsonify(file_infos), 200

@bp.route('/update-tag/<int:file_id>', methods=['PUT'])
def update_file_tag(file_id):
    """ Update the tag of a specific document owned by the user """

    auth_token = request.headers.get('Authorization')
    if not auth_token:
        return jsonify({'error': 'Missing authentication token'}), 401

    user = get_user_from_token()
    if user is None:
        return jsonify({'error': 'Invalid authentication token'}), 401

    file = File.query.get(file_id)

    # Check if file exists
    if file is None:
        return jsonify({'error': 'File not found'}), 404

    # Check if file is owned by the user
    if file.user_id != user.id:
        return jsonify({'error': 'User not authorized to update this file'}), 403

    # Update the tag
    tag = request.json.get('tag', None)
    if tag is None:
        return jsonify({'error': 'No tag provided'}), 400

    file.tag = tag
    db.session.commit()

    return jsonify({'message': 'Tag successfully updated', 'tag': file.tag}), 200
