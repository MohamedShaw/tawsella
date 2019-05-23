import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { AppView, AppText, AppIcon, AppNavigation } from '../common';
import colors from '../common/defaults/colors';

class CustomHeader extends Component {
  static propTypes = {
    showNotification: PropTypes.bool,
    showChat: PropTypes.bool,
    border: PropTypes.bool,
    size: PropTypes.number,
    subTitle: PropTypes.any,
  };

  static defaultProps = {
    showNotification: false,
    showChat: false,
    border: false,
    size: 10,
    subTitle: null,
  };

  renderTitle = () => (
    <AppView flex={3} stretch centerY>
      <AppView row>
        <AppText size={this.props.size} bold>
          {this.props.title}
        </AppText>
        {this.props.subTitle}
      </AppView>
    </AppView>
  );

  renderNotification = () => {
    const { unseenCountNotifications } = this.props;
    return (
      <AppView
        stretch
        transparent
        onPress={() => AppNavigation.push({ name: 'notifications' })}
        ph={6}
        flexInnerTouchable
        center
      >
        <AppIcon name="notification" type="custom" size={10} lineHeight={10} />
        {unseenCountNotifications > 0 && (
          <AppView
            borderColor="#fff"
            borderWidth={2}
            backgroundColor="#D0021B"
            circleRadius={5.5}
            style={{ position: 'absolute', bottom: 1, left: 22, zIndex: 10000 }}
            center
          >
            <AppText size={5} bold color="#FFF">
              {unseenCountNotifications > 9 ? '+9' : unseenCountNotifications}
            </AppText>
          </AppView>
        )}
      </AppView>
    );
  };

  renderChat = () => {
    const { unseenCountMessages } = this.props;

    return (
      <AppView
        stretch
        transparent
        onPress={() => AppNavigation.push({ name: 'lastMessage' })}
        ph={6}
        flexInnerTouchable
        center
      >
        <AppIcon name="chat" type="custom" size={10} lineHeight={10} />
        {unseenCountMessages > 0 && (
          <AppView
            borderColor="#fff"
            borderWidth={2}
            backgroundColor="#D0021B"
            circleRadius={5.5}
            style={{
              position: 'absolute',
              bottom: 1,
              left: 22,
              zIndex: 10000,
            }}
            center
          >
            <AppText size={5} bold color="#FFF">
              {unseenCountMessages > 9 ? '+9' : unseenCountMessages}
            </AppText>
          </AppView>
        )}
      </AppView>
    );
  };

  render() {
    const border = this.props.border
      ? { borderBottomColor: colors.inputBorderColor, borderBottomWidth: 0.5 }
      : {};
    return (
      <SafeAreaView
        style={{
          alignSelf: 'stretch',
          ...border,
        }}
      >
        <AppView
          stretch
          paddingVertical={5}
          marginHorizontal={8}
          row
          spaceBetween
        >
          {this.renderTitle()}

          <AppView flex stretch row reverse>
            {this.props.showChat && this.renderChat()}
            {this.props.showNotification && this.renderNotification()}
          </AppView>
        </AppView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  connected: state.network.isConnected,
  rtl: state.lang.rtl,
  unseenCountMessages: state.messages.unseenCount,
  unseenCountNotifications: state.notifications.unseenCount,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomHeader);
