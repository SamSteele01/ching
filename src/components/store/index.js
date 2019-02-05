// @flow

import type { IdType } from 'constants/firebase'

/** @jsx jsx */
import { jsx } from '@emotion/core'
import _ from 'lodash'
import * as React from 'react'
import ReactList from 'react-list'
import ReactResizeDetector from 'react-resize-detector'
import ReactReduxFirebase from 'react-redux-firebase'

import ShoppingCart from 'components/shopping-cart/container'
import Flex from 'components/common/flex'
import LinkButton from 'components/common/link-button'
import Icon from 'components/common/icon'

import STORE from './constants'
import ItemCardContainer from './container/item-card'
import AddItemButton from './add-item-button'

import style from './index.style'

type PropsType = {
  order: Object,
  store: Object,
  storeId: IdType,
  itemsOrdered: Object,
  onEditStoreName: ({ storeName: string, storeId: IdType }) => void,
}

type StateType = {
  isEditing: boolean,
  isEditingStoreName: boolean,
  listWidth: number,
}

class StoreScene extends React.Component<PropsType, StateType> {
  state = {
    isEditing: false,
    isEditingStoreName: false,
    listWidth: 0,
  }

  render = () => {
    console.log('Store props', this.props)
    console.log({
      listWidth: this.state.listWidth,
      rowsCount: this.getListRowsCount(),
      rowItemsCount: this.getListRowItemsCount(),
      isLoadedStore: ReactReduxFirebase.isLoaded(this.props.store),
      isLoadedItems: ReactReduxFirebase.isLoaded(this.props.itemsOrdered),
    })

    if (this.isLoading()) {
      console.log('Loading...')
      return <div>Loading...</div>
    }

    console.log('Rendering...')

    return (
      <Flex grow column css={style.base}>
        {this.renderEditControls()}
        {this.renderStoreName()}
        {this.renderItemsList()}
        <ShoppingCart />
      </Flex>
    )
  }

  renderEditControls = () => {
    const { isEditing } = this.state

    return (
      <Flex spaceBetween>
        {isEditing && <div css={style.editControls}>Editing</div>}
        <LinkButton
          onClick={this.handleEditToggle}
          css={[
            style.editControls,
            isEditing
              ? style.editControls__endButton
              : style.editControls__startButton,
          ]}
        >
          {isEditing ? 'Done' : 'Edit inventory'}
        </LinkButton>
      </Flex>
    )
  }

  renderStoreName = () => {
    const { isEditing, isEditingStoreName } = this.state

    return isEditingStoreName ? (
      <input
        autoFocus
        type="text"
        placeholder="Enter store name..."
        defaultValue={this.getStoreName()}
        onBlur={this.handleStoreNameInputBlur}
        css={style.storeName}
      />
    ) : (
      <div css={style.storeName}>
        {this.getStoreName()}{' '}
        {isEditing && (
          <LinkButton onClick={this.handleEditStoreName}>
            <Icon.Edit />
          </LinkButton>
        )}
      </div>
    )
  }

  renderItemsList = () => (
    <Flex grow css={style.itemsList}>
      {this.state.listWidth && (
        <ReactList
          itemRenderer={this.renderItemsRow}
          length={this.getListRowsCount()}
          type="uniform"
        />
      )}
      <ReactResizeDetector
        handleWidth
        refreshMode="debounce"
        refreshRate={500}
        onResize={this.handleResize}
      />
    </Flex>
  )

  renderItemsRow = (rowIndex: number, key: *) => {
    const { itemsOrdered } = this.props
    const { isEditing } = this.state

    return (
      <Flex spaceBetween grow key={key}>
        {_.times(this.getListRowItemsCount(), columnIndex => {
          const itemIndex = this.getItemIndex({ rowIndex, columnIndex })
          const item = itemsOrdered[itemIndex]
          const isFirstInRow = columnIndex === 0
          const isLastItem = itemIndex === this.getItemsCount() - 1

          // Render add button instead of the last card if editing
          if (isEditing && isLastItem) {
            return <AddItemButton {...{ isFirstInRow, key: itemIndex }} />
          }
          // Skip extra card slots in the last row
          if (itemIndex >= this.getItemsCount()) {
            return null
          }
          const itemId = item.id
          return (
            <ItemCardContainer
              {...{
                isFirstInRow,
                item,
                itemId,
                isEditing,
                key: itemIndex,
              }}
            />
          )
        })}
      </Flex>
    )
  }

  renderAddItemButton = () => (
    <Flex column center css={style.addItem}>
      <Icon.Plus />
      Add another
    </Flex>
  )

  ////////////////////
  // EVENT HANDLERS //
  ////////////////////

  handleResize = (listWidth: number) => {
    this.setState({ listWidth })
  }

  handleEditToggle = () => {
    this.setState((prevState: StateType) => ({
      isEditing: !prevState.isEditing,
    }))
  }

  handleEditStoreName = () => {
    this.setState({
      isEditingStoreName: true,
    })
  }

  handleStoreNameInputBlur = async (
    e: SyntheticInputEvent<HTMLButtonElement>
  ) => {
    await this.props.onEditStoreName({
      storeName: e.currentTarget.value,
      storeId: this.props.storeId,
    })
    this.setState({
      isEditingStoreName: false,
    })
  }

  /////////////
  // GETTERS //
  /////////////

  getStoreName = () => _.get(this.props, 'store.storeName')

  getListRowItemsCount = () => {
    const { listWidth } = this.state

    // n * item + (n - 1) * spaces = width
    // n * item + n * spaces - spaces = width
    // n(item + spaces) - spaces = width
    // (width + spaces) / (item + spaces) = n
    return (
      Math.floor(
        (listWidth + STORE.MIN_SPACE_BETWEEN_ITEMS) /
          (STORE.ITEM_WIDTH + STORE.MIN_SPACE_BETWEEN_ITEMS)
      ) || 1
    )
  }

  getItemsCount = (): number => {
    const { itemsOrdered } = this.props
    const { isEditing } = this.state

    // Add one to make space for the add button
    return _.size(itemsOrdered) + (isEditing && 1)
  }

  getListRowsCount = (): number => {
    return Math.ceil(this.getItemsCount() / this.getListRowItemsCount())
  }

  getItemIndex = ({
    rowIndex,
    columnIndex,
  }: {
    rowIndex: number,
    columnIndex: number,
  }): number => rowIndex * this.getListRowItemsCount() + columnIndex

  //////////////
  // CHECKERS //
  //////////////

  isLoading = (): boolean =>
    !ReactReduxFirebase.isLoaded(this.props.store) ||
    !ReactReduxFirebase.isLoaded(this.props.itemsOrdered)
}

export default StoreScene
