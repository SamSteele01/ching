import _ from 'lodash'
import React from 'react'
import * as ReactRedux from 'react-redux'
import * as ReactReduxFirebase from 'react-redux-firebase'
import * as Redux from 'redux'
import PropTypes from 'prop-types'
import Card from './inventoryCard.js'
import Add from './inventoryAdd.js'
import QRDialog from './qrDialog'
import selectors from '../../redux/selectors'

import orderAction from '../../redux/actions/order'
import web3Instance from '../../singletons/web3/web3'

const SERVER_URL = 'https://74a7e268.ngrok.io'
const STATUS_UL = 'https://get.status.im/browse/'

class InventoryScene extends React.PureComponent {
  state = {}

  handleItemClick = async (item, id) => {
    let address = await web3Instance.getWalletAddress()
    const orderId = await this.props.addOrder(id, 1, item.price)

    const url = `${STATUS_UL}${SERVER_URL}/#/payment/${address}/${
      item.price
    }/${orderId}`

    this.setState({
      qrUrl: url,
    })
  }

  handleCloseDialog = () => {
    this.setState({
      qrUrl: null,
    })
  }

  render() {
    const { items } = this.props

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          flex: 1,
          flexDirection: 'row',
        }}
      >
        {_.map(items, (item, id) => (
          <Card
            key={id}
            {...item}
            onClick={() => this.handleItemClick(item, id)}
          />
        ))}
        <Add />
        <QRDialog
          url={this.state.qrUrl}
          onClose={() => this.setState({ qrUrl: null })}
        />
      </div>
    )
  }
}

InventoryScene.propTypes = {
  addOrder: PropTypes.func,
  items: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
  addOrder: (itemId, sellingQuantity, unitPrice) =>
    dispatch(orderAction.add(itemId, sellingQuantity, unitPrice)),
})

const mapStateToProps = state => ({
  auth: selectors.getAuthState(state),
  items: selectors.getItemsState(state),
  orders: selectors.getOrders(state),
  storeUsers: selectors.getStoresUsers(state),
})

export default Redux.compose(
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
)(InventoryScene)
