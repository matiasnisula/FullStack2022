const Notification = (props) => {
  const { notification } = props;

  const notificationStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: "20px",
    border: "solid black",
    borderRadius: "5px",
    padding: "10px"
  };

  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: "20px",
    border: "solid red",
    borderRadius: "5px",
    padding: "10px"
  };

  if (notification.message === "") return null;
  if (notification.type === "notification") {
    return (
      <div style={notificationStyle} className="notification">
        {notification.message}
      </div>
    );
  }

  return (
    <div style={errorStyle} className="error">
      {notification.message}
    </div>
  );

};

export default Notification;