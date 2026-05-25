import React, { useContext } from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { storeContext } from '../../context/StoreContext'; // Context import kiya agar dynamic banana hai

export default function Footer() {

    const contactNumber = "+91 8210138609";
    const contactEmail = "support@romato.com";

    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                
                {/* Left Section: Logo, Description & Social Links */}
                <div className="footer-content-left">
                    {/* <img src={assets.logo} alt="Tomato Logo" /> */}

                    <div className="footer-left-content">
  {/* 👇 Purani image tag hata kar ye lga do */}
  <div className="footer-logo" style={{ marginBottom: '20px', textAlign: 'left' }}>
    <span style={{
      fontFamily: '"Poppins", "Inter", "Segoe UI", sans-serif',
      fontWeight: '900',          // Ekdam heavy bold look ke liye
      fontSize: '44px',           // Screenshot ke hisab se exact size
      color: '#ff4321',           // Exact wahi original Tomato orange-red color
      letterSpacing: '-1.5px',    // Letter spacing tight rakhne ke liye
      display: 'inline-block',
      lineHeight: '1'
    }}>
      Romato<span style={{ color: '#ff4321' }}>.</span>
    </span>
  </div>

  {/* Aapka baaki ka description aur social icons niche waise hi rahenge */}
  <p>Satisfy your cravings with the best culinary delights delivered straight to your doorstep...</p>
</div>


                    
                    <p>
                        Satisfy your cravings with the best culinary delights delivered straight to your doorstep. 
                        Fresh ingredients, lightning-fast delivery, and your favorite meals, just a click away!
                    </p>
                    <div className="footer-social-icons">
                        {/* Anchor tags jodein taaki click karne par social media open ho sake */}
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <img src={assets.facebook_icon} alt="Facebook" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer">
                            <img src={assets.twitter_icon} alt="Twitter" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                            <img src={assets.linkedin_icon} alt="LinkedIn" />
                        </a>
                    </div>
                </div>

                {/* Center Section: Navigation Links */}
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about-us">About us</a></li>
                        <li><a href="#delivery">Delivery</a></li>
                        <li><a href="#privacy-policy">Privacy policy</a></li>
                    </ul>
                </div>

                {/* Right Section: Contact Info */}
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        {/* tel: aur mailto: lagane se click karte hi phone dialer ya email box open ho jata hai */}
                        <li><a href={`tel:${contactNumber}`}>{contactNumber}</a></li>
                        <li><a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
                    </ul>
                </div>

            </div>
            
            <hr/>
            
            {/* Copyright: Automatic Dynamic Year setup */}
            <p className="footer-copyright">
                Copyright {new Date().getFullYear()} © Tomato.com - All Rights Reserved.
            </p>
        </div>
    )
}

