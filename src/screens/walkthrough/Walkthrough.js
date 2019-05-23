import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import I18n from 'react-native-i18n';
import {
  AppView,
  AppText,
  AppButton,
  AppNavigation,
  AppImage,
  AppIcon,
  getColors,
} from '../../common';
import styles from './styles';
import { getStatusBarHeight } from '../../utils/iphoneHelper';

class Walkthrough extends Component {
  renderButtons = () => (
    <AppButton
      title={I18n.t('walkthrough-next')}
      height={8}
      centerSelf
      style={styles.button}
      onPress={() => {
        AppNavigation.push('signIn');
      }}
      size={6}
      backgroundColor="white"
      color={getColors().primary}
      paddingHorizontal={5}
      rightIcon={
        <AppView row center marginTop={1}>
          <AppIcon
            name="less-than"
            type="font-awesome5"
            color={getColors().primary}
            size={3.5}
          />
          <AppIcon
            name="less-than"
            type="font-awesome5"
            color={getColors().primary}
            size={3.5}
          />
        </AppView>
      }
    />
  );

  renderFirstPage = (img, text) => (
    <AppView marginHorizontal={12} flex centerX>
      <AppView width={100} marginTop={55} center>
        {/* <AppImage source={img} resizeMode="contain" equalSize={40} center /> */}
      </AppView>

      <AppView marginTop={40} center>
        <AppText center bold size={7}>
          {text}
        </AppText>
        <AppText
          center
          size={5}
          marginTop={10}
          lineHeight={9.5}
          color="#9DAAB6"
        >
          {I18n.t('walkthrough-fast-food-desc')}
        </AppText>
      </AppView>
    </AppView>
  );

  render() {
    return (
      <AppView flex stretchChildren>
        <Swiper
          loop
          horizontal
          autoplayTimeout={4}
          dotStyle={styles.dotStyles}
          activeDotStyle={styles.activeDotStyles}
          index={2}
          style={{}}
        >
          {this.renderFirstPage(I18n.t('walkthrough-fast-food-third'))}

          {this.renderFirstPage(I18n.t('walkthrough-fast-food'))}

          {this.renderFirstPage(I18n.t('walkthrough-fast-food-second'))}
        </Swiper>

        {this.renderButtons()}
      </AppView>
    );
  }
}

export default Walkthrough;
