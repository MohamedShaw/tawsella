import React, { Component } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import PropTypes from 'prop-types';

import {
  AppView,
  AppText,
  AppNavigation,
  AppButton,
  AppIcon,
  AppScrollView,
} from '../../common';
import {
  CustomBottomTabs,
  ClientCardInfo,
  ItemMore,
  LogoutModal,
  NoInternet,
} from '../../components';
import Navigation from '../../common/Navigation';

const BAR_HEIGHT_ANDROID = 56;
const BAR_HEIGHT_IOS = 49;
const barHeight = Platform.OS === 'ios' ? BAR_HEIGHT_IOS : BAR_HEIGHT_ANDROID;

class More extends Component {
  state = {
    isLogOutVisible: false,
  };

  renderOption = () => (
    <AppScrollView stretch>
      <AppView
        stretch
        marginTop={8}
        backgroundColor="white"
        borderTopColor="#ccc"
        borderTopWidth={0.5}
      >
        <ItemMore
          name="address"
          type="entypo"
          size={8}
          text={I18n.t('more-address')}
          nameLeft="ios-arrow-back"
          typeLeft="ion"
          paddingVertical={7}
          borderBottomColor="#ccc"
          borderBottomWidth={0.5}
        />
      </AppView>
      <AppView
        stretch
        marginTop={8}
        backgroundColor="white"
        borderTopColor="#ccc"
        borderTopWidth={0.5}
      >
        <ItemMore
          name="setting"
          type="ant"
          size={7}
          text={I18n.t('more-setting')}
          nameLeft="ios-arrow-back"
          typeLeft="ion"
          onPress={() => {
            AppNavigation.push('updateProfile');
          }}
          paddingVertical={7}
          borderBottomColor="#ccc"
          borderBottomWidth={0.5}
        />
        <ItemMore
          name="ios-call"
          type="ion"
          size={7}
          text={I18n.t('more-contact-us')}
          nameLeft="ios-arrow-back"
          typeLeft="ion"
          onPress={() => {
            Navigation.push({
              name: 'contactUs',
            });
          }}
          paddingVertical={7}
          borderBottomColor="#ccc"
          borderBottomWidth={0.5}
        />
        <ItemMore
          name="ios-call"
          type="ion"
          size={7}
          text={I18n.t('more-about-app')}
          nameLeft="ios-arrow-back"
          typeLeft="ion"
          onPress={() => {
            AppNavigation.push({
              name: 'aboutUs',
            });
          }}
          paddingVertical={7}
          borderBottomColor="#ccc"
          borderBottomWidth={0.5}
        />
      </AppView>
      <AppView
        stretch
        marginTop={8}
        backgroundColor="white"
        borderTopColor="#ccc"
        borderTopWidth={0.5}
      >
        <ItemMore
          name="logout"
          type="ant"
          size={7}
          text={I18n.t('more-log-out')}
          nameLeft="ios-arrow-back"
          typeLeft="ion"
          onPress={() => {
            this.setState({
              isLogOutVisible: true,
            });
          }}
          paddingVertical={7}
          borderBottomColor="#ccc"
          borderBottomWidth={0.5}
        />
      </AppView>
    </AppScrollView>
  );

  render() {
    const { currentUser, isConnected } = this.props;

    if (!currentUser) return null;
    if (!isConnected) {
      return (
        <AppView flex stretch backgroundColor="#ECEFEF">
          <NoInternet />
          <CustomBottomTabs componentId={this.props.componentId} />
        </AppView>
      );
    }
    return (
      <AppView
        style={{
          paddingBottom: barHeight,
        }}
        flex
        stretch
        backgroundColor="#ECEFEF"
      >
        <SafeAreaView
          style={{ backgroundColor: '#fff', alignSelf: 'stretch' }}
        />
        {this.renderOption()}
        <CustomBottomTabs componentId={this.props.componentId} />
        <LogoutModal
          isVisible={this.state.isLogOutVisible}
          message={I18n.t('password-changed-success')}
          changeState={v => {
            this.setState({
              isLogOutVisible: v,
            });
          }}
        />
      </AppView>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  isConnected: state.network.isConnected,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(More);
