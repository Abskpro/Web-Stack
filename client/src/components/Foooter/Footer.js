import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';

const Footer = (props) => {
	return (
		<footer>
			<Container>
				<div className='footer-content'>
					<a href='/termsandservice'>Terms of service </a>
					<a href='/contact'>Contact</a>
				</div>
			</Container>
		</footer>
	);
};
export default Footer;
