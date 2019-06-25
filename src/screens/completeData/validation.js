import * as yup from 'yup';
import I18n from 'react-native-i18n';

export const validationSchema = values =>
  yup.object().shape({
    location: yup.string().required(I18n.t('signup-field-required')),
    image: yup.string().required(I18n.t('signup-field-required')),
  });
