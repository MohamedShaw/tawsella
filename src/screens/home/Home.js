import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from 'react-native-i18n';
import { Navigation } from 'react-native-navigation';
import { Platform, Keyboard } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import Axios from 'axios';
import {
  AppView,
  AppScrollView,
  AppText,
  responsiveHeight,
  responsiveWidth,
  moderateScale,
  AppNavigation,
  AppButton,
  AppModal,
  AppInput,
  AppImage,
  AppIcon,
  AppList,
} from '../../common';
import {
  CustomBottomTabs,
  NoInternet,
  SearchHeader,
  AppHeader,
  ProviderCard,
} from '../../components';
import Test from './test';
import {
  windowHeight,
  windowWidth,
  screenHeight,
} from '../../common/utils/responsiveDimensions';
import { API_ENDPOINT_FOOD_SERVICE } from '../../utils/Config';

class Home extends Component {
  constructor(props) {
    super(props);
    this.backPressed = 0;
    Navigation.events().bindComponent(this);
  }

  state = {
    visable: false,
    animate: true,
    data: [],
  };

  async componentDidAppear() {
    this.setState({
      visable: true,
    });
  }

  render() {
    return (
      <AppView stretch flex paddingBottom={26}>
        <AppHeader hideBack title="Home" />
        <AppView paddingVertical={4} stretch />
        <AppList
          flatlist
          flex
          stretch
          marginTop={10}
          apiRequest={{
            url: `${API_ENDPOINT_FOOD_SERVICE}providers`,

            responseResolver: response => {
              console.log('********', response.data.data);

              return {
                data: response.data.data,
                pageCount: response.data.pageCount,
              };
            },

            onError: error => {
              console.log(JSON.parse(JSON.stringify(error)));
              I18n.t('ui-error-happened');
            },
          }}
          data={this.state.data}
          rowRenderer={data => <ProviderCard data={data} />}
          noResultsComponent={
            <AppView center stretch flex>
              <AppText> LIST IS Empty</AppText>
            </AppView>
          }
          refreshControl={this.props.homeList}
        />

        <CustomBottomTabs componentId={this.props.componentId} />
      </AppView>
    );
  }
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  rtl: state.lang.rtl,
  currentUser: state.auth.currentUser,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
