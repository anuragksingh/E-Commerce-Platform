import {
  AccountBalance,
  LibraryAddCheck,
  LocalShipping,
} from "@mui/icons-material";
import "../CartStyles/CheckoutPath.css";

function CheckoutPath({ activePath }) {
  const path = [
    {
      label: "Shipping Details",
      icon: <LocalShipping />,
    },
    {
      label: "Confirm Order",
      icon: <LibraryAddCheck />,
    },
    {
      label: "Payment",
      icon: <AccountBalance />,
    },
  ];
  return (
    <div className="checkoutPath">
      {path.map((item, index) => (
        <div
          className="checkoutPath-step"
          key={index}
          active={activePath === index ? "true" : "false"}
          completed={activePath >= index ? "true" : "false"}
        >
          <div className="checkoutPath-icon">{item.icon}</div>
          <div className="checkoutPath-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
export default CheckoutPath;
