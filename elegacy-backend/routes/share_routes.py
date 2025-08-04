from flask import Blueprint, request, jsonify
import smtplib
from email.mime.text import MIMEText
from config import mongo

invite_bp = Blueprint('invite', __name__)

@invite_bp.route('/api/invite', methods=['POST'])
def send_invite():
    data = request.json
    sender_email = data.get('sender')
    recipient_email = data.get('recipient')
    document_id = data.get('documentId')
    document_title = data.get('documentTitle')

    if not recipient_email or not document_id:
        return jsonify({"message": "Recipient email and document ID are required"}), 400

    # Compose email
    subject = "You've been invited to access a document"
    body = f"""
    Hi,

    {sender_email} has invited you to view the document titled "{document_title}".
    Access it from the app.

    Regards,
    eLegacy Team
    """

    try:
        # Send email (configure your SMTP details here)
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = recipient_email

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login("youremail@gmail.com", "your-app-password")
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()

        # Store invite in MongoDB if needed
        mongo.db.invites.insert_one({
            "sender": sender_email,
            "recipient": recipient_email,
            "documentId": document_id,
            "documentTitle": document_title,
            "status": "pending"
        })

        return jsonify({"message": "Invitation sent successfully."}), 200

    except Exception as e:
        print("Email error:", str(e))
        return jsonify({"message": "Failed to send invitation"}), 500
