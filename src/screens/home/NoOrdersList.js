import React, { Component } from 'react';
import I18n from 'react-native-i18n';
import { AppView, AppText, AppImage } from '../../common';

export default class NoOrdersList extends Component {
  render() {
    return (
      <AppView flex stretch center>
        <AppImage
          source={require('../../assets/imgs/embty.png')}
          width={60}
          height={30}
          marginTop={10}
          marginBottom={5}
          resizeMode="contain"
        />
        <AppText bold size={7} marginVertical={2}>
          {I18n.t('home-empty-content-title')}
        </AppText>
      </AppView>
    );
  }
}
