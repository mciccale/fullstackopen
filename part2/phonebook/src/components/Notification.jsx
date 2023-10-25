function Notification({ message }) {
  return message ? (
    <div className={message.type}>
      <strong>{message.content}</strong>
    </div>
  ) : null;
}

export default Notification;
