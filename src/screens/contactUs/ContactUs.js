import React, { Component } from 'react';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import axios from 'axios';
import {
  AppView,
  AppText,
  AppImage,
  AppPicker,
  AppIcon,
  AppInput,
  AppTextArea,
  AppScrollView,
  AppButton,
  AppForm,
  showSuccess,
  showError,
  AppModal,
} from '../../common';
import {
  AppHeader,
  InfoModal,
  AppErrorModal,
  NoInternet,
} from '../../components';
import image from '../../assets/imgs/avatar.png';
import phone from '../../assets/imgs/avatar.png';
import {
  validationSchemaWithOrder,
  validationSchemaWithoutOrder,
} from './ValidationSchema';
import { API_ENDPOINT_FOOD_SERVICE } from '../../utils/Config';

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.renderOrder = React.createRef();
  }

  state = {
    alias: 'ORDER',
    showModal: false,
    errorMessage: '',
    isInfoModalVisible: false,
    errorTxt: '',
  };

  onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    const alias = this.state.alias;
    if (values.messages.trim()) {
      if (alias === 'ORDER') {
        try {
          const response = await axios.post(
            `${API_ENDPOINT_FOOD_SERVICE}issues`,
            {
              userType: 'fsa-food-service-provider',
              text: values.messages,
              issueType: 'ORDER',
              order: values.order,
            },
          );
          setSubmitting(false);
          this.setState({ isInfoModalVisible: true });
          resetForm();
        } catch (error) {
          console.log('Errpr===>>>', error);
          const myError = error[3];
          // showError('error');
          setSubmitting(false);
          this.setState({
            showModal: true,
            errorMessage: myError.length === 0 ? error[1].message : myError[0],
          });
        }
      } else
        try {
          const response = await axios.post(
            `${API_ENDPOINT_FOOD_SERVICE}issues`,
            {
              userType: 'fsa-food-service-provider',
              text: values.messages,
              issueType: alias,
            },
          );
          setSubmitting(false);
          this.setState({ isInfoModalVisible: true, errorMessage: '' });
          resetForm();
        } catch (error) {
          console.log('ERror', error);
          setSubmitting(false);
          this.setState({
            showModal: true,
            errorMessage: error[1].message,
          });
        }
    } else {
      setSubmitting(false);
    }
  };

  changeState = () => {
    this.setState({
      showModal: false,
    });
  };

  renderForm = ({
    isSubmitting,
    handleSubmit,
    setFieldValue,
    injectFormProps,
    errors,
    resetForm,
  }) => (
    <AppView stretch marginHorizontal={8}>
      <AppText size={8} marginVertical={4}>
        {I18n.t('contact-us')}
      </AppText>
      <AppPicker
        hideSearch
        setInitialValueAfterFetch={data => data[0].value}
        color="black"
        placeholder={I18n.t('message-type')}
        title={I18n.t('message-type')}
        onChange={value => {
          setFieldValue('order', 0);
          this.setState(
            {
              alias: value,
            },
            () => {
              resetForm();
            },
          );
        }}
        data={[
          {
            label: I18n.t('order-complain'),
            value: 'ORDER',
          },
          {
            label: I18n.t('public-complain'),
            value: 'COMPLAIN',
          },
          { label: I18n.t('suggestion'), value: 'SUGGESTION' },
          { label: I18n.t('question'), value: 'QUESTION' },
        ]}
      />
      {this.state.alias === 'ORDER'
        ? this.renderOrderNumber(injectFormProps, setFieldValue)
        : null}
      <AppTextArea
        {...injectFormProps('messages')}
        placeholder={I18n.t('message-content')}
        onChange={(name, v, noValidation) => {
          setFieldValue(name, v, noValidation);
          this.setState({
            errorMessage: '',
          });
        }}
        error={errors.messages}
      />
      <AppButton
        stretch
        title={I18n.t('send-button')}
        processing={isSubmitting}
        onPress={handleSubmit}
      />
      <AppView
        stretch
        marginVertical={8}
        paddingVertical={2}
        marginHorizontal={-8}
        backgroundColor="#ECEFEF"
      >
        <AppText size={7} marginHorizontal={8}>
          {I18n.t('or-you-can')}
        </AppText>
      </AppView>
      {this.renderPhone()}
      {this.renderMail()}
    </AppView>
  );

  renderOrderNumber = (injectFormProps, setFieldValue) => (
    <AppInput
      {...injectFormProps('order')}
      number
      ref={this.renderOrder}
      label={I18n.t('order-number')}
      borderWidth={1}
      borderRadius={5}
    />
  );

  renderPhone() {
    return (
      <AppView
        stretch
        onPress={() => alert('phone')}
        spaceBetween
        row
        marginVertical={2}
        paddingVertical={2}
      >
        <AppIcon name="phone" type="font-awesome" />
        <AppText>0121000000000</AppText>
        <AppView
          backgroundColor="primary"
          width={8}
          height={5}
          borderRadius={50}
          center
        >
          <AppIcon name="phone" type="font-awesome" color="white" />
        </AppView>
      </AppView>
    );
  }

  renderMail() {
    return (
      <AppView
        stretch
        onPress={() => alert('Email')}
        spaceBetween
        row
        marginVertical={2}
        paddingVertical={2}
      >
        <AppIcon name="email" type="entypo" />
        <AppText>Ahmed@Ahmed.com</AppText>
        <AppIcon
          name="mail-with-circle"
          type="entypo"
          size={14}
          color="primary"
        />
      </AppView>
    );
  }

  renderSuccessModal() {
    return (
      <InfoModal
        isVisible={this.state.isInfoModalVisible}
        message={I18n.t('success-issues')}
        onConfirm={() => {
          this.setState({
            isInfoModalVisible: false,
          });
        }}
        changeState={v => {
          this.setState({
            isInfoModalVisible: v,
          });
        }}
      />
    );
  }

  render() {
    const { ...rest } = this.props;
    if (!this.props.isConnected) {
      return (
        <AppView flex stretch backgroundColor="#ECEFEF">
          <AppHeader title={I18n.t('contact-us-haeader')} />
          <NoInternet />
        </AppView>
      );
    }
    return (
      <AppView flex stretch>
        <AppHeader title={I18n.t('contact-us-haeader')} />
        <AppScrollView flex stretch>
          <AppView stretch centerX marginTop={0}>
            <AppImage
              center
              source={image}
              width={50}
              height={20}
              resizeMode="contain"
            />
          </AppView>
          <AppForm
            schema={
              this.state.alias == 'ORDER'
                ? {
                    order: '',
                    messages: '',
                  }
                : { messages: '' }
            }
            validationSchema={
              this.state.alias == 'ORDER'
                ? validationSchemaWithOrder
                : validationSchemaWithoutOrder
            }
            render={this.renderForm}
            onSubmit={this.onSubmit}
          />
          {this.renderSuccessModal()}

          <AppModal
            animationIn="bounceIn"
            animationOut="bounceOut"
            isVisible={this.state.showModal}
            closeable
            changeState={v => {
              this.backPressed = 0;
              this.setState({
                showModal: v,
              });
            }}
            {...rest}
          >
            <AppView
              width={70}
              backgroundColor="white"
              paddingVertical={10}
              borderRadius={5}
              center
            >
              <AppIcon
                name="warning"
                type="font-awesome"
                size={25}
                color="#4A4A4A"
              />
              <AppView stretch center paddingHorizontal={5}>
                <AppText center bold>
                  {this.state.errorMessage}
                </AppText>
              </AppView>

              <AppView center ph={4} paddingTop={7} height={10}>
                <AppButton
                  flex
                  title={I18n.t('proceed-button')}
                  touchableOpacity
                  onPress={() => this.changeState()}
                  backgroundColor="primary"
                  height={6}
                  marginHorizontal={3}
                />
              </AppView>
            </AppView>
          </AppModal>
        </AppScrollView>
      </AppView>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  isConnected: state.network.isConnected,
});

export default connect(mapStateToProps)(ContactUs);
