import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logoutUser } from '../../../actions/authAction.jsx';
import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';
import { Container, Dropdown } from 'react-bootstrap';
import './Toolbar.css';

const Toolbar = (props) => {
	const onLogoutClick = (e) => {
		e.preventDefault();
		props.logoutUser();
	};
	const [isOpen, setIsOpen] = useState(false);
	console.log(props.auth);
	const toggle = () => setIsOpen(!isOpen);
	if (!props.auth.isAuthenticated) {
		return (
			<header>
				<Container>
					<div className='toolbar'>
						<nav className='toolbar-nav'>
							<Link to='/'>
								<div className='toolbar-logo'>
									<a href='/'>
										<img
											src='./images/main-logo.png'
											alt='logo'
										/>
									</a>
								</div>
							</Link>

							<div className='toolbar-nav-items'>
								<ul>
									<Link to='/'>
										<li>
											<a href='/'>FOR RENT</a>
										</li>
									</Link>
									<Link to='/form'>
										<li>
											<a href='/'>FOR OWNERS</a>
										</li>
									</Link>
								</ul>
							</div>
							<div className='spacer' />

							<div className='toolbar-button'>
								<DrawerToggleButton
									click={props.drawerClickHandler}
								/>
							</div>

							<Link to='/login'>
								<button
									className='login-button'
									click={props.formClickHandler}
								>
									Login/Sign-Up
								</button>
							</Link>
						</nav>
					</div>
				</Container>
			</header>
		);
	} else {
		return (
			<header>
				<Container>
					<div className='toolbar'>
						<nav className='toolbar-nav'>
							<div className='toolbar-logo'>
								<a href='/'>
									<img
										src='./images/main-logo.png'
										alt='logo'
									/>
								</a>
							</div>

							<div className='toolbar-nav-items'>
								<ul>
									<Link to='/'>
										<li>
											<a href='/'>FOR RENT</a>
										</li>
									</Link>

									<Link to='/form'>
										<li className='btn-post'>Add Post</li>
									</Link>

									<Link to='/notify'>
										<li className='btn-post'>Alert</li>
									</Link>
								</ul>
							</div>
							<div className='spacer' />

							<div className='toolbar-button'>
								<DrawerToggleButton
									click={props.drawerClickHandler}
								/>
							</div>

							<Dropdown>
								<Dropdown.Toggle
									variant='Secondary'
									id='dropdown-basic'
								>
									{props.auth.user.name}
								</Dropdown.Toggle>

								<Dropdown.Menu>
									<Dropdown.Item href='/profile'>
										Profile
									</Dropdown.Item>
									<Dropdown.Item href='/resetPassword'>
										Reset Password
									</Dropdown.Item>
									<Dropdown.Item
										href='#/action-2'
										onClick={onLogoutClick}
									>
										LogOut
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</nav>
					</div>
				</Container>
			</header>
		);
	}
};

// export default Toolbar;
Toolbar.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(
	mapStateToProps,
	{ logoutUser }
)(Toolbar);
