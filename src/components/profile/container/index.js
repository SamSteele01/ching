// @flow

import type { DispatchType } from 'constants/redux'

import * as ReactRedux from 'react-redux'
import * as ReactRouter from 'react-router'
import * as Reselect from 'reselect'

import selectors from 'redux/selectors'
import authActions from 'redux/actions/auth'

import * as Profile from '../index'

type OwnPropsType = ReactRouter.ContextRouter

const mapStateToProp = Reselect.createStructuredSelector({
  authError: selectors.getAuthError,
  email: selectors.users.current,
  address: selectors.wallet.address,
})

const mapDispatchToProps = (dispatch: DispatchType) => ({
  signOut: () => dispatch(authActions.signOut()),
})

export default ReactRedux.connect<Profile.PropsType, OwnPropsType, _, _, _, _>(
  mapStateToProp,
  mapDispatchToProps
)(Profile.default)
