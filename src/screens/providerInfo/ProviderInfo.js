import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from 'react-native-i18n';
import { Navigation } from 'react-native-navigation';
import {
  Platform,
  Keyboard,
  Dimensions,
  View,
  StatusBar,
  BackHandler,
} from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import Axios from 'axios';
import colors from '../../common/defaults/colors';
import { convertNumbers } from '../../common/utils/numbers';

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
  AppSpinner,
  AppStarRating,
  showError,
} from '../../common';
import {
  CustomBottomTabs,
  NoInternet,
  SearchHeader,
  AppHeader,
  ProviderCard,
  ParallexHeader,
} from '../../components';
import {
  windowHeight,
  windowWidth,
  screenHeight,
} from '../../common/utils/responsiveDimensions';
import { API_ENDPOINT_FOOD_SERVICE } from '../../utils/Config';
import ImagesSwiper from './ImagesSwiper';
import styles from './styles';

const coverPlaceholder = require('../../assets/imgs/avatar.png');

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
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
    swiperImgs: [this.props.data.user.profileImage],
  };

  async componentDidAppear() {
    this.setState({
      visable: true,
    });
  }

  renderName = () => (
    <AppView row stretch spaceBetween marginTop={6} paddingHorizontal={5}>
      <AppView
        style={{
          width: Dimensions.get('window').width * 0.8,
        }}
      >
        <AppText
          color="black"
          size={7}
          bold
          paddingVertical={0}
          numberOfLines={1}
        >
          {this.props.data.user.name.en}
        </AppText>
      </AppView>

      <AppView equalSize={10}>
        {this.state.loadingFav ? (
          <AppView paddingHorizontal={3} paddingVertical={0} width={10}>
            <AppSpinner color="primary" size={8} />
          </AppView>
        ) : (
          <AppIcon
            name={this.state.isFavourite ? 'favorite' : 'favorite'}
            type={this.state.isFavourite ? 'material' : 'material'}
            color={this.state.isFavourite ? 'white' : undefined}
            backgroundColor={this.state.isFavourite ? 'primary' : undefined}
            borderRadius={5}
            padding={1}
            centerSelf
            size={this.state.isFavourite ? 8 : 10.5}
            onPress={() => {
              this.favouriteToggle(this.state.id);
            }}
          />
        )}
      </AppView>
    </AppView>
  );

  getValidTime = () => {
    const unit = I18n.t(`${this.state.cookingDurationTimeUnit}`);

    return ` ${convertNumbers(this.state.cookingDuration)} ${unit}`;
  };

  renderContent = () => (
    <AppView stretch flex>
      <AppList
        flatlist
        flex
        stretch
        marginTop={10}
        apiRequest={{
          url: `${API_ENDPOINT_FOOD_SERVICE}orders?clientId=${
            this.props.data.user.id
          }&status=FINISHED`,

          responseResolver: response => {
            console.log('********************', response.data.data);

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
      <AppView paddingVertical={50} />

      <AppText>mm</AppText>
    </AppView>
  );

  renderForm = () => (
    <View style={{ flex: 1 }}>
      <ParallexHeader
        ref={this.parallxHeader}
        offset={responsiveHeight(10)}
        statusBarColor="transparent"
        alwaysShowTitle={false}
        headerMinHeight={HEADER_HEIGHT}
        headerMaxHeight={Dimensions.get('window').height * 0.45}
        extraScrollHeight={20}
        navbarColor="white"
        title={
          <AppText bold size={5.5} color="black">
            {this.props.data.user.name.en}
          </AppText>
        }
        backgroundImage={coverPlaceholder}
        content={() =>
          this.state.swiperImgs.length > 0 && !this.state.loading ? (
            <>
              <ImagesSwiper
                onPress={this.pop}
                imgs={[this.props.data.user.profileImage]}
              />
              {this.renderName()}
            </>
          ) : (
            <AppView style={styles.swiper} />
          )
        }
        backgroundImageScale={1.2}
        renderNavBar={this.renderNavBar}
        renderContent={() => this.renderContent()}
        containerStyle={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        innerContainerStyle={{ flex: 1 }}
      />
    </View>
  );

  renderNavBar = () => (
    <AppView style={styles.navContainer} centerY>
      <AppButton
        flex
        stretch
        color="foreground"
        leftIcon={<AppIcon flip name="close" type="ant" size={12} />}
        padding={0}
        onPress={() => {
          this.pop();
        }}
        size={12}
        width={20}
        backgroundColor="transparent"
      />
    </AppView>
  );

  pop = () => {
    StatusBar.setBackgroundColor(colors.statusBar);
    StatusBar.setTranslucent(false);
    AppNavigation.pop();
  };

  render() {
    const { data } = this.props;
    return (
      <>
        {/* <ProviderCard data={data} /> */}
        {this.renderForm()}
      </>
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
