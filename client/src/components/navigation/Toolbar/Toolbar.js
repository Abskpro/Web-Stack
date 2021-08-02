import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { logoutUser } from '../../../actions/authAction.jsx'
import DrawerToggleButton from '../SideDrawer/DrawerToggleButton'
import { Container, Dropdown } from 'react-bootstrap'
import './Toolbar.css'

const Toolbar = (props) => {
	const onLogoutClick = (e) => {
		e.preventDefault()
		props.logoutUser()
	}
	const [isOpen, setIsOpen] = useState(false)
	console.log(props.auth)
	const toggle = () => setIsOpen(!isOpen)
	if (!props.auth.isAuthenticated) {
		return (
			<header>
				<Container>
					<div className='toolbar'>
						<nav className='toolbar-nav'>
							<div className='toolbar-logo'>
								<a href='/'>
									<img
										src='./images/home-icon.svg'
										alt='logo'
									/>
								</a>
							</div>

							<div className='toolbar-nav-items'>
								<ul>
									<li>
										<a href='/'>FOR RENT</a>
									</li>

									<li>
										<a href='/'>FOR OWNERS</a>
									</li>
								</ul>
							</div>
							<div className='spacer' />

							<div className='toolbar-button'>
								<DrawerToggleButton
									click={props.drawerClickHandler}
								/>
							</div>

							<a href='/login'>
								<button
									className='login-button'
									click={props.formClickHandler}
								>
									Login/Sign-Up
								</button>
							</a>
						</nav>
					</div>
				</Container>
			</header>
		)
	} else {
		return (
			<header>
				<Container>
					<div className='toolbar'>
						<nav className='toolbar-nav'>
							<div className='toolbar-logo'>
								<a href='/'>
									<img
										src='./images/home-icon.svg'
										alt='logo'
									/>
								</a>
							</div>

							<div className='toolbar-nav-items'>
								<ul>
									<li>
										<a href='/'>FOR RENT</a>
									</li>

									<li className='btn-post'>
										{' '}
										<a href='/form'> Add Post</a>
									</li>

									<li className='btn-post'>
										{' '}
										<a href='/notify'>Alert</a>{' '}
									</li>
								</ul>
							</div>
							<div className='spacer' />

							<div className='toolbar-button'>
								<DrawerToggleButton
									click={props.drawerClickHandler}
								/>
							</div>
							<div id='user-name'>
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
							</div>
						</nav>
					</div>
				</Container>
			</header>
		)
	}
}

// export default Toolbar;
Toolbar.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
})

export default connect(
	mapStateToProps,
	{ logoutUser }
)(Toolbar)
