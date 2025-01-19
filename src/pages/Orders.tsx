import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function Order(props) {
  const orderData = props.item.props.item || props.item;
  const { t, i18n } = useTranslation();
  const accessToken = localStorage.getItem("accessToken");

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const { statusName } = orderData.request || {};
    if (statusName === "UNDER_PROCESSING") {
      setSelectedOption("2"); // Default to "In Progress"
    } else if (statusName === "COMPLETED") {
      setSelectedOption("3"); // Default to "Completed"
    } else {
      setSelectedOption("1"); // Default to "Certain" (placeholder)
    }
  }, [orderData.request?.statusName]);

  const handleSelectChange = async (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue); // Update the dropdown selection locally

    const orderId = orderData.request?.id;

    // Update the order status via API
    await updateOrderStatus(orderId, selectedValue);

    // If "Completed" is selected, refresh the order list after 2 seconds
    if (selectedValue === "3") {
      setTimeout(() => {
        props.refreshOrders(); // Call parent function to refresh orders
      }, 2000);
    }
  };

  const handleClose = () => {
    setShow(false);
    setShow2(false);
  };

  const handleShowReject = () => setShow(true);
  const handleShowAccept = () => setShow2(true);

  const handleRejection = () => {
    props.removeReject();
    handleClose();
  };

  const handleAcception = () => {
    props.removeAccept();
    handleClose();
  };

  const updateOrderStatus = async (orderId, action) => {
    try {
      let url = "";
      switch (action) {
        case "2": // In Progress
          url = `${API.API_BASE_URL}freelancer/proceedOrder?orderId=${orderId}`;
          break;
        case "3": // Completed
          url = `${API.API_BASE_URL}freelancer/completeOrder?orderId=${orderId}`;
          break;
        default:
          return;
      }

      await axiosInstance.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(t("orderStatusUpdated"), {
        position: "top-center",
        autoClose: 5002,
        progress: 0,
      });
    } catch (error) {
      if (
        error.response &&
        error.response.data.messageEn.includes(
          "change status to under processing should be in the same day"
        )
      ) {
        toast.error(
          i18n.language === "ar"
            ? "لا يمكن تغيير الحالة إلى قيد المعالجة إلا في نفس يوم الحجز"
            : "Status can only be changed to 'In Progress' on the same day as the reservation.",
          {
            position: "top-center",
            autoClose: 5002,
            progress: 0,
          }
        );
      } else if (
        error.response &&
        error.response.data.messageEn.includes("the request is not authorized")
      ) {
        toast.error(
          i18n.language === "ar"
            ? "لا يمكن إكمال الطلب إلا إذا كان قيد المعالجة."
            : "The order cannot be completed unless it is 'In Progress.'",
          {
            position: "top-center",
            autoClose: 5002,
            progress: 0,
          }
        );
      } else {
        toast.error(t("orderStatusUpdated_err"), {
          position: "top-center",
          autoClose: 5002,
          progress: 0,
        });
      }
    }
  };

  const generateGoogleMapsLink = () => {
    const latitude = orderData.latitude?.replace(/\\|"/g, "");
    const longitude = orderData.longitude?.replace(/\\|"/g, "");

    if (latitude && longitude) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      toast.error(t("locationNotAvailable") + t("contactServiceProvider"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="orders-container">
      <div id="orderCard" className="order-card">
        <div className="card-btn">
          <Button onClick={props.viewDetails} id="f-btn" variant="primary">
            {t("showDetails")}
          </Button>

          {orderData.request?.statusName === "UNDER_PROCESSING" && (
            <Form.Select
              className="select"
              name="register-type"
              aria-label={t("service_name")}
              onChange={handleSelectChange}
              value={selectedOption}
            >
              <option value="1" disabled>
                {t("certain")}
              </option>
              <option value="2">{t("in_progress")}</option>
              <option value="3">{t("completed")}</option>
            </Form.Select>
          )}
          {orderData.request?.statusName !== "ACCEPTED" &&
            orderData.request?.statusName !== "UNDER_PROCESSING" && (
              <>
                <Button
                  onClick={handleShowAccept}
                  id="green-btn"
                  variant="primary"
                >
                  {t("accept")}
                </Button>
                <Button
                  id="red-btn"
                  onClick={handleShowReject}
                  variant="primary"
                >
                  {t("decline")}
                </Button>
              </>
            )}
          {orderData.request?.statusName === "ACCEPTED" && (
            <Form.Select
              className="select"
              name="register-type"
              aria-label={t("service_name")}
              onChange={handleSelectChange}
              value={selectedOption}
            >
              <option value="1" disabled>
                {t("certain")}
              </option>
              <option value="2">{t("in_progress")}</option>
              <option value="3">{t("completed")}</option>
            </Form.Select>
          )}
        </div>
        <div className="card-info">
          <div className="card-text">
            <h4 className="order-title">
              {i18n.language === "ar"
                ? orderData.itemDto?.itemNameAr || "unknown"
                : orderData.itemDto?.itemNameEn || "unknown"}
            </h4>
            <p className="order-number">
              {t("orderNumber")} : {orderData.request?.id || "unknown"}
            </p>
            <p className="order-date">
              {t("adding_service_date")}:{" "}
              {formatDate(orderData.request?.createdOn) || "unknown"}
            </p>
            <p className="order-time">
              {t("time")} : <span>{orderData.fromTime || "unknown"} </span> to{" "}
              <span>{orderData.timeTo || "unknown"}</span>
            </p>
            <p className="name">
              {t("name")} :{" "}
              {i18n.language === "ar"
                ? orderData.userNameAr || "unknown"
                : orderData.userNameEn || "unknown"}
            </p>
            <p className="order-date">
              {t("reservationDate")} :{" "}
              {formatDate(orderData?.reservationDate) || "unknown"}
            </p>
            <p className="phone">
              {t("phoneNumber")} : {orderData.userPhoneNumber || "unknown"}
            </p>
            <p className="location">
              {t("location")} :{" "}
              <a href="#" onClick={generateGoogleMapsLink}>
                <i className="fa-solid fa-location-dot"></i>{" "}
                {t("viewLocationOnMap")}
              </a>
            </p>
            <p className="total">
              {t("total")} : {orderData.totalAmount || "unknown"} {t("sar")}
            </p>
          </div>
          <div className="card-user-img">
            <img src={hair_icon} alt="User" />
          </div>
        </div>
      </div>

      {/* Modal for reject confirmation */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("confirm_operation")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("reject_order_msg")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleRejection} variant="primary">
            {t("reject")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for accept confirmation */}
      <Modal
        show={show2}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("confirm_operation")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("accept_order_msg")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleAcception} variant="primary">
            {t("accept")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
