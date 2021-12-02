import { useState } from 'react';
import { Form as AntdForm, notification, Steps } from 'antd';
import { Form } from '../../common/Form/Form';
import { useTranslation } from 'react-i18next';
import { Button } from '../../common/buttons/Button/Button';
import { Dates } from 'constants/Dates';
import * as S from './StepForm.styles';
import { mergeBy } from 'utils/utils';
import { Step1 } from './Steps/Step1';
import { Step2 } from './Steps/Step2';
import { Step3 } from './Steps/Step3';
import { Step4 } from './Steps/Step4';

const { Step } = Steps;
interface FormValues {
  [key: string]: string | undefined;
}

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export const StepForm: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [form] = AntdForm.useForm();
  const [fields, setFields] = useState<FieldData[]>([
    { name: 'login', value: 'Jerri' },
    { name: 'password', value: '123456' },
    { name: 'confirmPassword', value: '123456' },
    { name: 'salutation', value: 'mr' },
    { name: 'gender', value: 'male' },
    { name: 'firstName', value: 'John' },
    { name: 'lastName', value: 'Black' },
    { name: 'birthday', value: Dates.getDate(1576789200000) },
    { name: 'phone', value: '298573124' },
    { name: 'email', value: '' },
    { name: 'address1', value: 'Slobodskay street' },
    { name: 'address2', value: 'Nevski street' },
    { name: 'zipCode', value: '435123' },
    { name: 'city', value: 'Minsk' },
    { name: 'country', value: 'Belarus' },
    { name: 'prefix', value: '+375' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const formLabels: FormValues = {
    login: t('forms.stepFormLabels.login'),
    password: t('forms.stepFormLabels.password'),
    confirmPassword: t('forms.stepFormLabels.confirmPassword'),
    salutation: t('forms.stepFormLabels.salutation'),
    gender: t('forms.stepFormLabels.gender'),
    firstName: t('forms.stepFormLabels.firstName'),
    lastName: t('forms.stepFormLabels.lastName'),
    birthday: t('forms.stepFormLabels.birthday'),
    phone: t('forms.stepFormLabels.phone'),
    email: t('forms.stepFormLabels.email'),
    address1: t('forms.stepFormLabels.address1'),
    address2: t('forms.stepFormLabels.address2'),
    zipCode: t('forms.stepFormLabels.zipCode'),
    city: t('forms.stepFormLabels.city'),
    country: t('forms.stepFormLabels.country'),
  };

  const formValues = fields
    .filter((item) => item.name !== 'prefix')
    .map((item) => ({
      name: formLabels[item.name],
      value: String(item.name === 'birthday' && item.value ? item.value.format('YYYY-MM-DD') : item.value),
    }));

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = () => {
    setIsLoading(true);
    setTimeout(() => {
      notification.open({ message: t('common.saved') });
      setIsLoading(false);
      setCurrent(0);
    }, 1500);
  };

  const steps = [
    {
      title: t('forms.stepFormLabels.country'),
    },
    {
      title: t('forms.stepFormLabels.info'),
    },
    {
      title: t('forms.stepFormLabels.location'),
    },
    {
      title: t('forms.stepFormLabels.confirmDetails'),
    },
  ];

  const formFieldsUi = [
    <Step1 key="1" />,
    <Step2 key="2" />,
    <Step3 key="3" />,
    <Step4 key="4" formValues={formValues} />,
  ];

  return (
    <Form
      name="stepForm"
      form={form}
      footer={() => <div />}
      fields={fields}
      onFieldsChange={(_, allFields) => {
        const currentFields = allFields.map((item) => ({
          name: Array.isArray(item.name) ? item.name[0] : '',
          value: item.value,
        }));
        const uniqueData = mergeBy(fields, currentFields, 'name');
        setFields(uniqueData);
      }}
    >
      <S.Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} description="" />
        ))}
      </S.Steps>
      <S.ContentWrapper>
        <S.Content>
          <div>{formFieldsUi[current]}</div>
          <div>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                {t('forms.stepFormLabels.next')}
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={onFinish} loading={isLoading}>
                {t('forms.stepFormLabels.done')}
              </Button>
            )}
            {current > 0 && (
              <S.PrevButton type="default" onClick={() => prev()}>
                {t('forms.stepFormLabels.previous')}
              </S.PrevButton>
            )}
          </div>
        </S.Content>
      </S.ContentWrapper>
    </Form>
  );
};