import React from 'react';
import { Container } from 'react-bootstrap';
import { FaFacebookSquare, FaTwitter, FaInstagramSquare } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
	return (
		<div id='contact'>
			<Container>
				<article>
					<h2>We are always ready to be at your service</h2>
					<span className='contact-info'>Contact: 123456789</span>
					<div className='social-info'>
						<a href='facebook.com'>
							<i>
								<FaFacebookSquare />
							</i>
						</a>
						<a href='twitter.com'>
							<i>
								<FaTwitter />
							</i>
						</a>
						<a href='instagram.com'>
							<i>
								<FaInstagramSquare />
							</i>
						</a>
					</div>

					<span />
				</article>
			</Container>
		</div>
	);
};
export default Contact;
