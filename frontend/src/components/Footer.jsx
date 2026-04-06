import React from "react";
import {
  Phone,
  Mail,
  GitHub,
  LinkedIn,
  YouTube,
  Twitter,
} from "@mui/icons-material";
import "../componentStyles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section1 */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>
            <Phone fontSize="small" />
            Phone : +91 9304885789
          </p>
          <p>
            <Mail fontSize="small" />
            Email : anuragkumarsingh22088@gmail.com
          </p>
        </div>

        {/* Section 2 */}
        <div className="footer-section social">
          <h3>Follow me</h3>
          <div className="social-links">
            <a href="" target="_blank">
              <GitHub className="social-icon" />
            </a>
            <a href="" target="_blank">
              <LinkedIn className="social-icon" />
            </a>
            <a href="" target="_blank">
              <YouTube className="social-icon" />
            </a>
            <a href="" target="_blank">
              <Twitter className="social-icon" />
            </a>
          </div>
        </div>

        {/* Section 3 */}
        <div className="footer-section about">
          <h3>About</h3>
          <p>
            Providing web development tutorials and courses to help you grow
            your skills.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 proBoY . All right reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
