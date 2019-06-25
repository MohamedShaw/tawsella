import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from 'react-native-i18n';
import {
  AppView,
  AppButton,
  AppScrollView,
  AppInput,
  AppText,
  AppForm,
  AppPicker,
  AppNavigation,
  AppFormLocation,
} from '../../common';
import {
  AppHeader,
  AvatarPicker,
  ImagePicker,
  AppErrorModal,
} from '../../components';
import { validationSchema } from './validation';
import { API_ENDPOINT_GATEWAY } from '../../utils/Config';
import { showError } from '../../common/utils/localNotifications';
import colors from '../../common/defaults/colors';
import { clientCheck, resetLoginError } from '../../actions/AuthActions';

class CompleteData extends Component {
  state = {
    showInvalidUserModal: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        showInvalidUserModal: true,
      });
    }
  }

  onSubmit = async (values, { setSubmitting }) => {
    const { currentUser } = this.props;

    this.props.clientCheck(values, setSubmitting);
  };

  renderLocationInput = injectFormProps => (
    <AppInput
      {...injectFormProps('location')}
      borderWidth={1}
      borderRadius={5}
      label={I18n.t('signup-location')}
    />
  );

  renderSubmitButton = (isSubmitting, handleSubmit) => (
    <AppButton
      title={I18n.t('save')}
      stretch
      height={7}
      onPress={handleSubmit}
      // linear
      processing={isSubmitting}
    />
  );

  renderForm = ({
    injectFormProps,
    isSubmitting,
    handleSubmit,
    setFieldValue,
  }) => (
    <AppScrollView flex stretch paddingBottom={10} center>
      <AppView flex center stretch paddingHorizontal={10} marginTop={20}>
        {/* <AvatarPicker
          onChange={uri => {
            setFieldValue('image', uri);
          }}
        /> */}
        <AppView stretch>
          <AppText marginVertical={4}>
            {I18n.t('choose-image-location')} :
          </AppText>
          <ImagePicker
            maxImages={1}
            errorTextMarginHorizontal
            {...injectFormProps('image')}
          />
        </AppView>

        {this.renderLocationInput(injectFormProps)}

        <AppView flexGrow />
        {this.renderSubmitButton(isSubmitting, handleSubmit)}
      </AppView>
    </AppScrollView>
  );

  render() {
    const { currentUser } = this.props;

    return (
      <AppView flex stretch>
        <AppHeader title={I18n.t('completeData-header-title')} />

        <AppForm
          schema={{
            image: '',
            location: '',
          }}
          validationSchema={validationSchema}
          render={this.renderForm}
          onSubmit={this.onSubmit}
        />
        <AppErrorModal
          visible={this.state.showInvalidUserModal}
          fromSignIn
          changeState={v => {
            this.props.onResetLoginError();
            this.setState({
              showInvalidUserModal: v,
            });
          }}
          errorMessage={[this.props.error]}
          onConfirm={() => {
            this.props.onResetLoginError();
            this.setState({
              showInvalidUserModal: false,
            });
          }}
        />
      </AppView>
    );
  }
}

const mapStateToProps = state => ({
  connected: state.network.isConnected,
  currentUser: state.auth.currentUser,
  error: state.auth.error,
});

const mapDispatchToProps = dispatch => ({
  clientCheck: bindActionCreators(clientCheck, dispatch),
  onResetLoginError: bindActionCreators(resetLoginError, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompleteData);
