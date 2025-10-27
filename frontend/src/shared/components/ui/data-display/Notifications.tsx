import { FC, useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import "@styles/notifications.css";
import { NotificationType } from "@/shared/types";
import { dailyTimeFormate } from "@/utils";
import { useIntl } from "react-intl";

interface NotificationProps {
  notifications: NotificationType[];
  isLoading: boolean;
  isError: boolean;
}

type NotificationPreference = {
  enabled: boolean;
  types: {
    Patient: boolean;
    Payment: boolean;
    Visit: boolean;
  };
};

const Notifications: FC<NotificationProps> = ({
  notifications,
  isLoading,
  isError,
}) => {
  const { formatMessage: f } = useIntl();
  const previousNotifications = useRef(notifications);
  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPreference>(() => {
      const savedPrefs = localStorage.getItem("notificationPrefs");
      return savedPrefs
        ? JSON.parse(savedPrefs)
        : {
            enabled: true,
            types: {
              Patient: true,
              Payment: true,
              Visit: true,
            },
          };
    });

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "notificationPrefs",
      JSON.stringify(notificationPrefs),
    );
  }, [notificationPrefs]);

  const toggleNotifications = () => {
    setNotificationPrefs((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleNotificationType = (
    type: keyof NotificationPreference["types"],
  ) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: !prev.types[type],
      },
    }));
  };

  // Filter notifications based on preferences
  const filteredNotifications = notificationPrefs.enabled
    ? notifications.filter(
        (notification) => notificationPrefs.types[notification.type],
      )
    : [];

  useEffect(() => {
    if (previousNotifications.current !== notifications) {
      if (notifications.length > previousNotifications.current.length) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newNotifications = notifications.filter(
          (notification) =>
            !previousNotifications.current.some(
              (prev) => prev.id === notification.id,
            ) &&
            Date.now() - new Date(notification.createdAt).getTime() < 60000 && // Only notify if less than 1 minute old
            notificationPrefs.enabled && // Only if notifications are enabled
            notificationPrefs.types[notification.type], // Only if this type is enabled
        );

        // newNotifications.forEach((notification) => {
        //   if (Notification.permission === "granted") {
        //     new Notification(f({ id: "new_notification" }), {
        //       body: notification.message,
        //     });
        //   } else if (Notification.permission !== "denied") {
        //     Notification.requestPermission().then((permission) => {
        //       if (permission === "granted") {
        //         new Notification(f({ id: "new_notification" }), {
        //           body: notification.message,
        //         });
        //       }
        //     });
        //   }
        // });
      }

      previousNotifications.current = notifications;
    }
  }, [notifications, notificationPrefs, f]);

  return (
    <>
      <section className="notifications">
        <div className="notification-header">
          <h3>{f({ id: "recent_notifications" })}</h3>
          <div className="notification-controls">
            <button
              className={`${notificationPrefs.enabled ? "success" : "error"}`}
              onClick={toggleNotifications}
            >
              <FontAwesomeIcon
                icon={notificationPrefs.enabled ? faBell : faBellSlash}
              />
            </button>

            {/* {notificationPrefs.enabled && (
              <div className="notification-types">
                <label className="notification-type-item">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.types.Patient}
                    onChange={() => toggleNotificationType("Patient")}
                  />
                  <span className="notification-icon">🆕🤒</span>
                </label>
                <label className="notification-type-item">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.types.Visit}
                    onChange={() => toggleNotificationType("Visit")}
                  />
                  <span className="notification-icon">🏥</span>
                </label>
                <label className="notification-type-item">
                  <input
                    type="checkbox"
                    checked={notificationPrefs.types.Payment}
                    onChange={() => toggleNotificationType("Payment")}
                  />
                  <span className="notification-icon">💰</span>
                </label>
              </div>
            )} */}
          </div>
        </div>

        {isLoading ? (
          <p>{f({ id: "loading_notifications" })}</p>
        ) : isError ? (
          <p>{f({ id: "error_notifications" })}</p>
        ) : filteredNotifications.length > 0 ? (
          <ul>
            {filteredNotifications.map((notification) => (
              <li key={notification.id}>
                <p>{notification.message}</p>
                <span>{dailyTimeFormate(notification.createdAt)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>{f({ id: "no_notifications_to_show" })}</p>
        )}
      </section>
    </>
  );
};

export default Notifications;
