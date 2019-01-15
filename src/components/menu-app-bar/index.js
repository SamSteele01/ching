import _ from 'lodash'
import React from 'react'
import * as ReactRedux from 'react-redux'
import * as ReactReduxFirebase from 'react-redux-firebase'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { compose } from 'recompose'
import { withRouter, NavLink } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import selectors from '../../redux/selectors'

import ROUTE from '../../constants/route'
import web3Instance from '../../singletons/web3/web3'
import authActions from '../../redux/actions/auth'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import orderAction from '../../redux/actions/order'

const drawerWidth = 200

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    // marginLeft: 12,
    // marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    // width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  grow: {
    flexGrow: 1,
  },
  balance: {
    left: 100,
  },
  widthClear: {
    width: 0,
  },
})

class MenuAppBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true })
  }

  handleDrawerClose = () => {
    this.setState({ open: false })
  }

  signOutAndHandleDrawerClose = () => {
    this.handleDrawerClose()
    this.props.signOut()
  }

  getTitle = () => ROUTE.PATH_TITLE[this.props.location.pathname]

  updateBalance = async () => {
    const balance = await web3Instance.getBalance()
    this.setState({ balance: balance.toString() })
  }

  checkOrdeersStatus = () => {
    _.map(this.props.orders, order => {
      if (!order.txConfirmed && order.txHash) {
        this.props.txStatusCheckAndUpdateOrder(order)
      }
    })
  }
  componentDidMount() {
    setInterval(this.updateBalance, 1000)
    setInterval(this.checkOrdeersStatus, 1000)
  }

  render() {
    const { auth, classes } = this.props
    const { open } = this.state

    const authLinks = auth.uid ? (
      <SignedInLinks
        signOutAndHandleDrawerClose={this.signOutAndHandleDrawerClose}
      />
    ) : (
      <SignedOutLinks handleDrawerClose={this.handleDrawerClose} />
    )

    return (
      <div className={classes.root}>
        <AppBar id={3} position="static">
          <Toolbar id={201}>
            <IconButton
              id={202}
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {this.getTitle()}
            </Typography>
            <Typography
              variant="h6"
              color="inherit"
              className={classes.balance}
            >
              {this.state.balance || ''}
            </Typography>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          id={204}
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          onClose={this.handleDrawerClose}
          onOpen={this.handleDrawerOpen}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div id={45} className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <List id={205}>
            <ListItem
              button
              component={NavLink}
              to={ROUTE.PATH.INVENTORY}
              onClick={this.handleDrawerClose}
            >
              <ListItemText primary={ROUTE.PATH_TITLE[ROUTE.PATH.INVENTORY]} />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to={ROUTE.PATH.SALES_REPORT}
              onClick={this.handleDrawerClose}
            >
              <ListItemText
                primary={ROUTE.PATH_TITLE[ROUTE.PATH.SALES_REPORT]}
              />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to={ROUTE.PATH.ORDERS}
              onClick={this.handleDrawerClose}
            >
              <ListItemText primary={ROUTE.PATH_TITLE[ROUTE.PATH.ORDERS]} />
            </ListItem>
            {authLinks}
          </List>
        </SwipeableDrawer>
      </div>
    )
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  signOut: PropTypes.func,
  orders: PropTypes.arrayOf(PropTypes.object),
  txStatusCheckAndUpdateOrder: PropTypes.func,
  auth: PropTypes.object,
  location: PropTypes.object,
}

const mapStateToProps = state => ({
  auth: selectors.getAuthState(state),
  orders: selectors.getOrders(state),
  items: selectors.getItemsState(state),
})

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(authActions.signOut()),
  txStatusCheckAndUpdateOrder: order =>
    dispatch(orderAction.txStatusCheckAndUpdateOrder(order)),
})

export default compose(
  withStyles(styles, { withTheme: true }),
  withRouter,
  ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  ReactReduxFirebase.firestoreConnect(props => {
    if (!props.auth || !props.auth.uid) return []
    return [
      {
        collection: 'items',
        where: [['userId', '==', props.auth.uid]],
      },
    ]
  }),
  ReactReduxFirebase.firestoreConnect(props => {
    // TODO: Research possible performance issues for old accounts with lots of transactions
    if (!props.auth || !props.auth.uid) return []
    return [
      {
        collection: 'orders',
        where: [['userId', '==', props.auth.uid]],
      },
    ]
  })
)(MenuAppBar)
