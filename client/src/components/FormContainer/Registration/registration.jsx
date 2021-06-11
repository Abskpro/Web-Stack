import React from 'react';
import './registration.css';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { registerUser } from '../../../actions/authAction.jsx';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import validateRegisterInput from '../../../utils/Validator/validateRegister.js';

class Registration extends React.Component {
	constructor() {
		super();
		this.state = {
			name: '',
			email: '',
			password: '',
			password2: '',
			number: '',
			errors: {},
		};
	}

	componentDidMount() {
		// If logged in and user navigates to Register page, should redirect them to dashboard
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard/profile');
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps.errors.response.data.msg);
		console.log(nextProps.errors.response.status);
		if (nextProps.errors) {
			this.setState({
				errors: nextProps.errors,
			});
		}
		if (nextProps.errors.response.status == 400) {
			console.log('asdfasdf');
			toast.error(`${nextProps.errors.response.data.msg}`, {
				position: 'bottom-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
		if (nextProps.errors.response.status == 201) {
			toast.info(`${nextProps.errors.response.data.msg}`, {
				position: 'bottom-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.id]: e.target.value });
	};

	onSubmit = (e) => {
		e.preventDefault();

		const newUser = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2,
			number: this.state.number,
		};

		let { errors, isValid } = validateRegisterInput(newUser);
		if (isValid) {
			this.props.registerUser(newUser, this.props.history);
		} else {
			Object.values(errors).map((value) => {
				toast.error(`${value}`, {
					position: 'bottom-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			});
		}
	};

	render() {
		const { errors } = this.state;
		return (
			<div className='reg-contents'>
				<form onSubmit={this.onSubmit}>
					<div className='row'>
						<div className='col-25'>
							<label>Name</label>
						</div>
						<div className='col-75'>
							<input
								type='text'
								name='name'
								id='name'
								onChange={this.onChange}
								value={this.state.name}
								error={errors.name}
							/>
						</div>
					</div>
					<div className='row'>
						<div className='col-25'>
							<label>Email</label>
						</div>
						<div className='col-75'>
							<input
								type='email'
								id='email'
								name='email'
								onChange={this.onChange}
								value={this.state.email}
							/>
						</div>
					</div>
					<div className='row'>
						<div className='col-25'>
							<label>Password</label>
						</div>
						<div className='col-75'>
							<input
								type='password'
								id='password'
								name='password'
								onChange={this.onChange}
								value={this.state.password}
							/>
						</div>
					</div>

					<div className='row'>
						<div className='col-25'>
							<label>Confirm Password</label>
						</div>
						<div className='col-75'>
							<input
								type='password'
								id='password2'
								name='password2'
								onChange={this.onChange}
								value={this.state.password2}
							/>
						</div>
					</div>

					<div className='row'>
						<div className='col-25'>
							<label>Mobile Phone</label>
						</div>
						<div className='col-75'>
							<input
								type='tel'
								id='number'
								name='number'
								onChange={this.onChange}
								value={this.state.number}
							/>
						</div>
					</div>

					<div className='row'>
						<div id='reg-submit'>
							<input type='submit' value='Register' />
						</div>
					</div>
					<div id='login-redirect'>
						<span>Alredy have an account? </span> &nbsp;
						<Link to='/login'>
							<span>Login</span>
						</Link>
					</div>
				</form>
				<ToastContainer
					position='bottom-right'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</div>
		);
	}
}

Registration.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{ registerUser }
)(withRouter(Registration));
