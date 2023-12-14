import { notification } from "antd";

export const toast = (
  message = "",
  type,
  description = "",
  placement = "topRight"
) => {
  notification[type]({
    message,
    description,
    placement,
  });
};
