/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'

import ROUTE from 'constants/route'
import FooterButton from 'components/common/footer-button'
import LinkButton from 'components/common/link-button'
import Icon from 'components/common/icon'

import style from './index.style.js'

export default class HomeScene extends React.Component {
  render() {
    return (
      <div css={style.base}>
        {this.renderTitle()}
        {this.renderArt()}
        {this.renderBecomeVendor()}
        {this.renderLogIn()}
      </div>
    )
  }

  renderTitle = () => (
    <div css={style.title}>
      <p css={style.title__text}>Start accepting payments in DAI.</p>
    </div>
  )

  renderArt = () => (
    <div css={style.art}>
      <Icon.HomeArt />
    </div>
  )

  renderBecomeVendor = () => (
    <div css={style.becomeVendor}>
      <FooterButton to={ROUTE.PATH.SIGN_UP}>Become a vendor</FooterButton>
    </div>
  )

  renderLogIn = () => (
    <div css={style.logIn}>
      <LinkButton to={ROUTE.PATH.SIGN_IN}>
        <Icon.Login />
        <span css={style.logIn__text}>Log In</span>
      </LinkButton>
    </div>
  )
}
