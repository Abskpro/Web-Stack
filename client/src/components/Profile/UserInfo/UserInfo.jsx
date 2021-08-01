import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Form, Button } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './UserInfo.css'
import axios from 'axios'

const UserInfo = (props) => {
	const [info, setInfo] = useState({})
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [number, setNumber] = useState('')
	const [notificationLocation, setNotificationLocation] = useState('')
	const [notificationLocationType, setNotificationLocationType] = useState('')
	const [alertId, setAlertId] = useState('')

	useEffect(
		() => {
			const fetchInfo = async (props) => {
				const res = await axios.get(
					`/api/profile/info/${props.auth.user.id}`
				)

				console.log(res.data)
				setName(res.data.name)
				setEmail(res.data.email)
				setInfo(res.data)
				setNumber(res.data.number)

				const notificationRes = await axios.get(
					`/api/notify/notification/${props.auth.user.id}`
				)
				if (notificationRes.data != null) {
					setNotificationLocation(notificationRes.data.location)
					setNotificationLocationType(notificationRes.data.type)
					setAlertId(notificationRes.data._id)
				}
			}
			fetchInfo(props)
		},
		[props]
	)

	function updateInfo(e) {
		e.preventDefault()
		let newInfo = {
			email: email,
			name: name,
			number: number,
		}
		axios
			.put(`/api/profile/updateUser/${props.auth.user.id}`, newInfo)
			.then((res) =>
				toast.info(`🦄 ${res.data.message}`, {
					position: 'bottom-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				})
			)
			.catch((err) => console.log(err))
	}

	function deleteNotification(e) {
		//deletes notification based on usrs id
		axios
			.delete(`/api/notify/delete/notification/${alertId}`)
			.then((res) => {
				window.location.reload(false)
			})
	}

	return (
		<div className='user-info-container'>
			<Form>
				<Form.Group>
					<Form.Label>Username</Form.Label>
					<Form.Control
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<br />
				</Form.Group>
				<Form.Group>
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type='text'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<br />
				</Form.Group>
				<Form.Group>
					<Form.Label>Phone Number</Form.Label>
					<Form.Control
						type='text'
						value={number}
						onChange={(e) => setNumber(e.target.value)}
					/>
					<br />
				</Form.Group>
				<div className='' id='user-info-btn-container'>
					<Button
						variant='primary'
						type='submit'
						onClick={updateInfo}
					>
						UPDATE
					</Button>
				</div>
			</Form>
			{notificationLocation != '' && (
				<div id='user-info-notification'>
					<div className='notification-details'>
						<div>Your Active Alert</div>
						<div className='notifier-flex'>
							{`Location: ${notificationLocation}  Type:${notificationLocationType}`}
						</div>
					</div>
					<button
						className='delete-notifier'
						onClick={deleteNotification}
					>
						Remove
					</button>
				</div>
			)}

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
	)
}

UserInfo.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
})

export default connect(mapStateToProps)(withRouter(UserInfo))
