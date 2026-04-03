import './Footer.css';
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer-container">
            <div className="container footer-content">
                <div className="footer-brand">
                    <div className="logo flex-center" style={{ gap: "0.5rem" }}>
                        <div className="logo-icon bg-black"></div>
                        <span>UniSearch India</span>
                    </div>
                    <p className="footer-desc">
                        Helping students find the right university across India with data-driven insights.
                    </p>
                </div>

                <div className="footer-links">
                    <h4>EXPLORE</h4>
                    <Link to="/universities">Universities</Link>
                    <Link to="/compare">Compare</Link>
                    <Link to="#">Analytics</Link>
                </div>

                <div className="footer-links">
                    <h4>RESOURCES</h4>
                    <Link to="#">About Us</Link>
                    <Link to="#">Contact</Link>
                    <Link to="#">Privacy Policy</Link>
                </div>

                <div className="footer-links">
                    <h4>CONTACT</h4>
                    <p>email@gmail.com</p>
                    <p>+91 1234567890</p>
                    <p>Visakhapatnam, India</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2026 UniSearch India. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
